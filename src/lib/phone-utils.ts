/**
 * Phone Number Utilities for WhatsApp
 * Special focus on Brazilian telephone numbers (DDI 55, DDD, 9th digit insertion, sanitization).
 */

export interface NormalizedPhone {
    original: string;
    digits: string;
    jid: string;
    formatted: string;
    isBrazilian: boolean;
    hasNinthDigitAdded: boolean;
    isValid: boolean;
}

/**
 * Strips all non-digit characters from an input string, except group/broadcast suffixes.
 */
export function extractDigits(input: string): string {
    if (!input) return "";
    return input.replace(/\D/g, "");
}

/**
 * Normalizes any phone number into a valid WhatsApp JID.
 * - Handles Brazilian phone numbers:
 *   - Auto-adds DDI 55 if omitted (10 or 11 digits)
 *   - Auto-inserts the 9th digit for mobile numbers (8 digits after DDD starting with 6, 7, 8, 9)
 *   - Cleans spaces, +, -, parentheses
 * - Preserves group JIDs (@g.us) and broadcast JIDs (@broadcast).
 */
export function formatToWhatsAppJid(input: string): string {
    const raw = (input || "").trim();
    if (!raw) return "";

    // Leave group and broadcast JIDs intact
    if (raw.endsWith("@g.us") || raw.endsWith("@broadcast")) {
        return raw;
    }

    // Remove existing JID suffix if present
    const withoutSuffix = raw.replace(/@s\.whatsapp\.net$/, "").replace(/@c\.us$/, "");

    // Extract digits only
    let digits = withoutSuffix.replace(/\D/g, "");
    if (!digits) return "";

    // Normalize Brazilian numbers
    digits = normalizeBrazilianDigits(digits);

    return `${digits}@s.whatsapp.net`;
}

/**
 * Normalizes digits specifically for Brazilian numbering plans:
 * - 10 digits (e.g. 31 85759690): Mobile missing 9 -> 55 31 9 85759690
 * - 10 digits (e.g. 31 32221234): Landline -> 55 31 32221234
 * - 11 digits (e.g. 31 985759690): Complete BR mobile without DDI -> 55 31 985759690
 * - 12 digits (e.g. 55 31 85759690): BR mobile with 55 but missing 9 -> 55 31 9 85759690
 * - 12 digits (e.g. 55 31 32221234): BR landline with 55 -> unchanged
 * - 13 digits (e.g. 55 31 985759690): Complete BR mobile -> unchanged
 */
export function normalizeBrazilianDigits(digits: string): string {
    // 10 digits: DDD (2) + Number (8) (e.g. 3185759690 or 3132221234)
    if (digits.length === 10) {
        const ddd = digits.slice(0, 2);
        const first = digits[2];
        const dddNum = parseInt(ddd, 10);

        if (dddNum >= 11 && dddNum <= 99) {
            // Mobile numbers in Brazil start with 6, 7, 8, 9
            if (["6", "7", "8", "9"].includes(first)) {
                return `55${ddd}9${digits.slice(2)}`;
            } else {
                // Fixed line / landline
                return `55${digits}`;
            }
        }
    }

    // 11 digits:
    // If it starts with a valid Brazilian DDD (11-99) followed by 9, add DDI 55
    if (digits.length === 11) {
        const ddd = digits.slice(0, 2);
        const first = digits[2];
        const dddNum = parseInt(ddd, 10);

        if (dddNum >= 11 && dddNum <= 99 && first === "9") {
            return `55${digits}`;
        }
    }

    // 12 digits: 55 + DDD (2) + Number (8) (e.g. 553185759690)
    if (digits.length === 12 && digits.startsWith("55")) {
        const ddd = digits.slice(2, 4);
        const first = digits[4];
        const dddNum = parseInt(ddd, 10);

        if (dddNum >= 11 && dddNum <= 99) {
            // Mobile missing 9th digit
            if (["6", "7", "8", "9"].includes(first)) {
                return `55${ddd}9${digits.slice(4)}`;
            }
        }
    }

    return digits;
}

/**
 * Returns detailed analysis and formatted representations of a phone input.
 */
export function analyzePhoneNumber(input: string): NormalizedPhone {
    const raw = (input || "").trim();

    if (raw.endsWith("@g.us")) {
        return {
            original: raw,
            digits: raw.replace("@g.us", ""),
            jid: raw,
            formatted: `Grupo: ${raw}`,
            isBrazilian: false,
            hasNinthDigitAdded: false,
            isValid: true
        };
    }

    const withoutSuffix = raw.replace(/@s\.whatsapp\.net$/, "").replace(/@c\.us$/, "");
    const initialDigits = withoutSuffix.replace(/\D/g, "");
    const normalizedDigits = normalizeBrazilianDigits(initialDigits);

    const isBrazilian = normalizedDigits.startsWith("55") && (normalizedDigits.length === 12 || normalizedDigits.length === 13);
    const hasNinthDigitAdded = initialDigits.length !== normalizedDigits.length && normalizedDigits.length === 13;
    const isValid = normalizedDigits.length >= 8 && normalizedDigits.length <= 15;

    let formatted = normalizedDigits;
    if (isBrazilian) {
        if (normalizedDigits.length === 13) {
            // +55 (31) 98575-9690
            formatted = `+55 (${normalizedDigits.slice(2, 4)}) ${normalizedDigits.slice(4, 9)}-${normalizedDigits.slice(9)}`;
        } else if (normalizedDigits.length === 12) {
            // +55 (31) 3222-1234
            formatted = `+55 (${normalizedDigits.slice(2, 4)}) ${normalizedDigits.slice(4, 8)}-${normalizedDigits.slice(8)}`;
        }
    } else if (normalizedDigits.length > 4) {
        formatted = `+${normalizedDigits}`;
    }

    return {
        original: raw,
        digits: normalizedDigits,
        jid: `${normalizedDigits}@s.whatsapp.net`,
        formatted,
        isBrazilian,
        hasNinthDigitAdded,
        isValid
    };
}

/**
 * Parses a bulk text string (comma, newline, semicolon separated) of phone numbers.
 * Cleans each line, normalizes Brazilian mobile numbers (inserting 9 and 55),
 * and removes duplicates while preserving valid JIDs.
 */
export function parseBulkRecipients(text: string): {
    jids: string[];
    analyzed: NormalizedPhone[];
    ninthDigitCount: number;
    invalidCount: number;
    total: number;
} {
    if (!text || !text.trim()) {
        return { jids: [], analyzed: [], ninthDigitCount: 0, invalidCount: 0, total: 0 };
    }

    const rawList = text.split(/[\n,;]+/).map(s => s.trim()).filter(Boolean);
    const analyzedMap = new Map<string, NormalizedPhone>();
    let ninthDigitCount = 0;
    let invalidCount = 0;

    for (const raw of rawList) {
        const item = analyzePhoneNumber(raw);
        if (!item.isValid) {
            invalidCount++;
            continue;
        }

        if (item.hasNinthDigitAdded) {
            ninthDigitCount++;
        }

        if (!analyzedMap.has(item.jid)) {
            analyzedMap.set(item.jid, item);
        }
    }

    const analyzed = Array.from(analyzedMap.values());
    const jids = analyzed.map(a => a.jid);

    return {
        jids,
        analyzed,
        ninthDigitCount,
        invalidCount,
        total: jids.length
    };
}
