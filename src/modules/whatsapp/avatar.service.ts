import path from "path";
import { mkdir, readFile, stat, unlink, writeFile } from "fs/promises";
import { waManager } from "@/modules/whatsapp/manager";
import { logger } from "@/lib/logger";

/**
 * Profile picture cache.
 *
 * WhatsApp does not send picture URLs in contact sync (only an "imgUrl: changed" marker),
 * and the CDN URLs it returns expire after a few days. So pictures are fetched on demand,
 * downloaded once and cached on disk (data/avatars/{sessionId}/{jid}.jpg).
 *
 * Requests to WhatsApp are serialized per session with a small interval to avoid
 * hammering the account when a chat list with many contacts is opened.
 * A "{jid}.none" marker caches "no picture / hidden by privacy" results.
 */

const AVATAR_DIR = path.join(process.cwd(), "data", "avatars");
const TTL_MS = 24 * 60 * 60 * 1000;
const FETCH_INTERVAL_MS = 400;
const WAIT_TIMEOUT_MS = 15_000;
const MAX_PENDING_PER_SESSION = 200;

type SessionQueue = { chain: Promise<void>; pending: Map<string, Promise<void>> };

// Shared across Next.js route bundles (same pattern as waManager)
const globalForAvatars = globalThis as unknown as { avatarQueues?: Map<string, SessionQueue> };
const queues = globalForAvatars.avatarQueues ?? (globalForAvatars.avatarQueues = new Map());

const safe = (s: string) => s.replace(/[^a-zA-Z0-9@._-]/g, "_");

function filePaths(sessionId: string, jid: string) {
    const dir = path.join(AVATAR_DIR, safe(sessionId));
    const base = path.join(dir, safe(jid));
    return { dir, image: `${base}.jpg`, none: `${base}.none` };
}

async function ageMs(file: string): Promise<number | null> {
    try {
        return Date.now() - (await stat(file)).mtimeMs;
    } catch {
        return null;
    }
}

const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

async function fetchAndStore(sessionId: string, jid: string) {
    const socket = waManager.getInstance(sessionId)?.socket;
    if (!socket) return; // session offline: transient, try again on next request

    const { dir, image, none } = filePaths(sessionId, jid);
    await mkdir(dir, { recursive: true });

    let url: string | undefined;
    try {
        url = await socket.profilePictureUrl(jid, "preview");
    } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : String(e);
        // No picture, or hidden by the contact's privacy settings
        if (/401|404|not-authorized|item-not-found|not-found/i.test(msg)) {
            await writeFile(none, "");
            await unlink(image).catch(() => {});
        } else {
            logger.debug("Avatar", `Failed to get picture URL for ${jid}: ${msg}`);
        }
        return;
    }

    if (!url) {
        await writeFile(none, "");
        await unlink(image).catch(() => {});
        return;
    }

    const res = await fetch(url);
    if (!res.ok) {
        logger.debug("Avatar", `Failed to download picture for ${jid}: HTTP ${res.status}`);
        return;
    }
    await writeFile(image, Buffer.from(await res.arrayBuffer()));
    await unlink(none).catch(() => {});
}

function enqueue(sessionId: string, jid: string): Promise<void> {
    let queue = queues.get(sessionId);
    if (!queue) {
        queue = { chain: Promise.resolve(), pending: new Map() };
        queues.set(sessionId, queue);
    }

    const existing = queue.pending.get(jid);
    if (existing) return existing;
    if (queue.pending.size >= MAX_PENDING_PER_SESSION) return Promise.resolve();

    const q = queue;
    const task = q.chain
        .then(() => fetchAndStore(sessionId, jid))
        .catch((e: unknown) => logger.debug("Avatar", `Avatar fetch error for ${jid}`, e))
        .then(() => sleep(FETCH_INTERVAL_MS))
        .finally(() => q.pending.delete(jid));

    q.chain = task;
    q.pending.set(jid, task);
    return task;
}

/**
 * Returns the cached profile picture (JPEG) for a chat, fetching it from WhatsApp if needed.
 * Returns null when the contact has no picture, hides it, or it could not be fetched in time.
 */
export async function getAvatar(sessionId: string, jid: string): Promise<Buffer | null> {
    const { image, none } = filePaths(sessionId, jid);

    const imageAge = await ageMs(image);
    if (imageAge !== null) {
        // Serve what we have; refresh stale pictures in the background
        if (imageAge > TTL_MS) void enqueue(sessionId, jid);
        return readFile(image).catch(() => null);
    }

    const noneAge = await ageMs(none);
    if (noneAge !== null && noneAge <= TTL_MS) return null;

    await Promise.race([enqueue(sessionId, jid), sleep(WAIT_TIMEOUT_MS)]);
    return readFile(image).catch(() => null);
}
