/**
 * Spintax and Message Variation Utilities
 * Allows rotating messages and dynamic text variations (e.g. "{Olá|Oi|Bom dia}")
 * to prevent WhatsApp spam filters from flagging identical broadcast messages.
 */

/**
 * Resolves Spintax formatted strings recursively.
 * Example: "{Olá|Oi|Bom dia}, {tudo bem|como vai}?"
 * -> "Bom dia, tudo bem?"
 */
export function resolveSpintax(text: string): string {
    if (!text) return "";

    const spintaxRegex = /\{([^{}]+)\}/;
    let result = text;

    // Recursively replace the innermost spintax blocks
    let match: RegExpExecArray | null;
    let iterations = 0;
    const maxIterations = 20; // Prevent infinite loops on malformed syntax

    while ((match = spintaxRegex.exec(result)) !== null && iterations < maxIterations) {
        iterations++;
        const options = match[1].split("|");
        const chosen = options[Math.floor(Math.random() * options.length)] || "";
        result = result.slice(0, match.index) + chosen + result.slice(match.index + match[0].length);
    }

    return result;
}

/**
 * Selects and resolves a message from a list of variations.
 * @param variations Array of message templates
 * @param index Current contact index (for round-robin distribution)
 * @param mode "random" | "round_robin"
 */
export function getMessageForContact(
    variations: string[],
    index: number,
    mode: "random" | "round_robin" = "random"
): string {
    const valid = variations.map(v => (v || "").trim()).filter(Boolean);
    if (valid.length === 0) return "";

    let template: string;
    if (mode === "round_robin") {
        template = valid[index % valid.length];
    } else {
        template = valid[Math.floor(Math.random() * valid.length)];
    }

    return resolveSpintax(template);
}

/**
 * Parses a stored broadcast message.
 * If stored as JSON array of variations, returns the array.
 * If stored as plain string, returns [string].
 */
export function parseStoredMessages(stored: string): string[] {
    if (!stored) return [];
    try {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
            return parsed.map(s => String(s));
        }
    } catch {
        // Not a JSON array, treat as single message
    }
    return [stored];
}
