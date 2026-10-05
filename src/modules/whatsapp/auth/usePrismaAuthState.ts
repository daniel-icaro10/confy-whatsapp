import { prisma } from "@/lib/prisma";
import { AuthenticationCreds, AuthenticationState, BufferJSON, initAuthCreds, SignalDataTypeMap } from "@whiskeysockets/baileys";
import { logger } from "@/lib/logger";

// In-memory cache per session to eliminate repetitive MySQL read/write roundtrips
const sessionCaches = new Map<string, Map<string, any>>();
// Pending writes buffer per session
const pendingWritesMap = new Map<string, Map<string, any>>();
// Pending deletes buffer per session
const pendingDeletesMap = new Map<string, Set<string>>();
// Active flush timeouts per session
const flushTimeouts = new Map<string, NodeJS.Timeout>();

const FLUSH_DELAY_MS = 300; // Batch debounce window in ms

function getSessionCache(sessionId: string): Map<string, any> {
    let cache = sessionCaches.get(sessionId);
    if (!cache) {
        cache = new Map<string, any>();
        sessionCaches.set(sessionId, cache);
    }
    return cache;
}

function getPendingWrites(sessionId: string): Map<string, any> {
    let map = pendingWritesMap.get(sessionId);
    if (!map) {
        map = new Map<string, any>();
        pendingWritesMap.set(sessionId, map);
    }
    return map;
}

function getPendingDeletes(sessionId: string): Set<string> {
    let set = pendingDeletesMap.get(sessionId);
    if (!set) {
        set = new Set<string>();
        pendingDeletesMap.set(sessionId, set);
    }
    return set;
}

/**
 * Flush all buffered writes and deletes for a session to MySQL in a single transaction.
 */
export async function flushAuthState(sessionId: string): Promise<void> {
    const timer = flushTimeouts.get(sessionId);
    if (timer) {
        clearTimeout(timer);
        flushTimeouts.delete(sessionId);
    }

    const pendingWrites = getPendingWrites(sessionId);
    const pendingDeletes = getPendingDeletes(sessionId);

    if (pendingWrites.size === 0 && pendingDeletes.size === 0) {
        return;
    }

    // Take snapshot and reset buffers
    const writesSnapshot = new Map(pendingWrites);
    const deletesSnapshot = new Set(pendingDeletes);
    pendingWrites.clear();
    pendingDeletes.clear();

    try {
        const operations: any[] = [];

        // Prepare deletes
        if (deletesSnapshot.size > 0) {
            operations.push(
                prisma.authState.deleteMany({
                    where: {
                        sessionId,
                        key: { in: Array.from(deletesSnapshot) }
                    }
                })
            );
        }

        // Prepare upserts
        for (const [key, rawValue] of writesSnapshot) {
            const value = JSON.parse(JSON.stringify(rawValue, BufferJSON.replacer));
            operations.push(
                prisma.authState.upsert({
                    where: { sessionId_key: { sessionId, key } },
                    create: { sessionId, key, value },
                    update: { value }
                })
            );
        }

        if (operations.length > 0) {
            await prisma.$transaction(operations);
        }
    } catch (error) {
        logger.error("Auth", `Failed to flush auth state for session ${sessionId}:`, error);
        // Put unwritten entries back into pending buffers if failed
        for (const [k, v] of writesSnapshot) {
            if (!pendingWrites.has(k)) pendingWrites.set(k, v);
        }
        for (const k of deletesSnapshot) {
            if (!pendingDeletes.has(k)) pendingDeletes.add(k);
        }
    }
}

function scheduleFlush(sessionId: string) {
    if (flushTimeouts.has(sessionId)) return;

    const timer = setTimeout(() => {
        flushTimeouts.delete(sessionId);
        flushAuthState(sessionId).catch(err => {
            logger.error("Auth", `Background flush error for ${sessionId}:`, err);
        });
    }, FLUSH_DELAY_MS);

    flushTimeouts.set(sessionId, timer);
}

export const usePrismaAuthState = async (
    sessionId: string
): Promise<{ state: AuthenticationState; saveCreds: () => Promise<void>; flush: () => Promise<void> }> => {
    const cache = getSessionCache(sessionId);
    const pendingWrites = getPendingWrites(sessionId);
    const pendingDeletes = getPendingDeletes(sessionId);

    // Helper to read single key (checks memory cache first)
    const readData = async (type: string, id: string) => {
        const key = `${type}-${id}`;

        // 1. In-memory cache hit
        if (cache.has(key)) {
            return cache.get(key);
        }

        // 2. Fallback to MySQL
        try {
            const data = await prisma.authState.findUnique({
                where: { sessionId_key: { sessionId, key } }
            });
            if (data && data.value) {
                const parsed = JSON.parse(JSON.stringify(data.value), BufferJSON.reviver);
                cache.set(key, parsed);
                return parsed;
            }
            return null;
        } catch (error) {
            logger.error("Auth", `Error reading auth state key ${key}:`, error);
            return null;
        }
    };

    // Helper to buffer write
    const writeData = (type: string, id: string, data: any) => {
        const key = `${type}-${id}`;
        cache.set(key, data);
        pendingDeletes.delete(key);
        pendingWrites.set(key, data);
        scheduleFlush(sessionId);
    };

    // Helper to buffer remove
    const removeData = (type: string, id: string) => {
        const key = `${type}-${id}`;
        cache.delete(key);
        pendingWrites.delete(key);
        pendingDeletes.add(key);
        scheduleFlush(sessionId);
    };

    // Initial load of creds
    const creds: AuthenticationCreds = (await readData('creds', 'me')) || initAuthCreds();
    cache.set('creds-me', creds);

    return {
        state: {
            creds,
            keys: {
                get: async (type, ids) => {
                    const data: { [key: string]: SignalDataTypeMap[typeof type] } = {};
                    const missingIds: string[] = [];

                    // Fast check against memory cache
                    for (const id of ids) {
                        const key = `${type}-${id}`;
                        if (cache.has(key)) {
                            let val = cache.get(key);
                            if (type === 'app-state-sync-key' && val) {
                                val = BufferJSON.reviver(null, val);
                            }
                            if (val) data[id] = val;
                        } else {
                            missingIds.push(id);
                        }
                    }

                    // Bulk fetch missing IDs in a SINGLE query instead of N queries
                    if (missingIds.length > 0) {
                        try {
                            const missingKeys = missingIds.map(id => `${type}-${id}`);
                            const rows = await prisma.authState.findMany({
                                where: {
                                    sessionId,
                                    key: { in: missingKeys }
                                }
                            });

                            for (const row of rows) {
                                const id = row.key.replace(`${type}-`, "");
                                if (row.value) {
                                    let parsed = JSON.parse(JSON.stringify(row.value), BufferJSON.reviver);
                                    cache.set(row.key, parsed);
                                    if (type === 'app-state-sync-key' && parsed) {
                                        parsed = BufferJSON.reviver(null, parsed);
                                    }
                                    data[id] = parsed;
                                }
                            }
                        } catch (err) {
                            logger.error("Auth", `Batch read error for ${type}:`, err);
                        }
                    }

                    return data;
                },
                set: async (data) => {
                    for (const category in data) {
                        const categoryData = data[category as keyof typeof data];
                        if (!categoryData) continue;

                        for (const id in categoryData) {
                            const value = categoryData[id];
                            if (value) {
                                writeData(category, id, value);
                            } else {
                                removeData(category, id);
                            }
                        }
                    }
                }
            }
        },
        saveCreds: async () => {
            // Write creds immediately to cache and schedule batch flush
            writeData('creds', 'me', creds);
            await flushAuthState(sessionId);
        },
        flush: async () => {
            await flushAuthState(sessionId);
        }
    };
};
