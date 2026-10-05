import { writeFile, readFile, unlink, readdir, stat, mkdir } from "fs/promises";
import { existsSync } from "fs";
import path from "path";
import crypto from "crypto";
import { logger } from "@/lib/logger";

const MEDIA_DIR = path.join(process.cwd(), "data", "media");

interface S3Config {
    endpoint?: string;
    bucket: string;
    accessKey: string;
    secretKey: string;
    region: string;
    publicUrl?: string;
}

function getS3Config(): S3Config | null {
    const bucket = process.env.S3_BUCKET;
    const accessKey = process.env.S3_ACCESS_KEY || process.env.AWS_ACCESS_KEY_ID;
    const secretKey = process.env.S3_SECRET_KEY || process.env.AWS_SECRET_ACCESS_KEY;

    if (!bucket || !accessKey || !secretKey) {
        return null;
    }

    return {
        endpoint: process.env.S3_ENDPOINT, // e.g. https://<account>.r2.cloudflarestorage.com or minio:9000
        bucket,
        accessKey,
        secretKey,
        region: process.env.S3_REGION || "auto",
        publicUrl: process.env.S3_PUBLIC_URL // e.g. https://media.yourdomain.com
    };
}

/**
 * Signs and uploads to S3 / Cloudflare R2 / MinIO via AWS Signature V4 without extra heavy SDKs.
 */
async function uploadToS3(filename: string, buffer: Buffer, mimeType: string, config: S3Config): Promise<string> {
    const date = new Date();
    const amzDate = date.toISOString().replace(/[:-]|\.\d{3}/g, "");
    const dateStamp = amzDate.slice(0, 8);

    const host = config.endpoint
        ? new URL(config.endpoint).host
        : `${config.bucket}.s3.${config.region}.amazonaws.com`;

    const endpointUrl = config.endpoint
        ? `${config.endpoint.replace(/\/$/, "")}/${config.bucket}/${encodeURIComponent(filename)}`
        : `https://${host}/${encodeURIComponent(filename)}`;

    const payloadHash = crypto.createHash("sha256").update(buffer).digest("hex");
    const canonicalUri = config.endpoint ? `/${config.bucket}/${encodeURIComponent(filename)}` : `/${encodeURIComponent(filename)}`;

    const canonicalHeaders = `content-type:${mimeType}\nhost:${host}\nx-amz-content-sha256:${payloadHash}\nx-amz-date:${amzDate}\n`;
    const signedHeaders = "content-type;host;x-amz-content-sha256;x-amz-date";

    const canonicalRequest = ["PUT", canonicalUri, "", canonicalHeaders, signedHeaders, payloadHash].join("\n");
    const algorithm = "AWS4-HMAC-SHA256";
    const credentialScope = `${dateStamp}/${config.region}/s3/aws4_request`;
    const stringToSign = [algorithm, amzDate, credentialScope, crypto.createHash("sha256").update(canonicalRequest).digest("hex")].join("\n");

    const kDate = crypto.createHmac("sha256", "AWS4" + config.secretKey).update(dateStamp).digest();
    const kRegion = crypto.createHmac("sha256", kDate).update(config.region).digest();
    const kService = crypto.createHmac("sha256", kRegion).update("s3").digest();
    const kSigning = crypto.createHmac("sha256", kService).update("aws4_request").digest();
    const signature = crypto.createHmac("sha256", kSigning).update(stringToSign).digest("hex");

    const authorizationHeader = `${algorithm} Credential=${config.accessKey}/${credentialScope}, SignedHeaders=${signedHeaders}, Signature=${signature}`;

    const res = await fetch(endpointUrl, {
        method: "PUT",
        headers: {
            "Content-Type": mimeType,
            "x-amz-content-sha256": payloadHash,
            "x-amz-date": amzDate,
            Authorization: authorizationHeader
        },
        body: new Uint8Array(buffer)
    });

    if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(`S3 Upload failed with HTTP ${res.status}: ${text}`);
    }

    if (config.publicUrl) {
        return `${config.publicUrl.replace(/\/$/, "")}/${encodeURIComponent(filename)}`;
    }
    return endpointUrl;
}

/**
 * Universal media storage helper.
 * Automatically selects S3/R2/MinIO if configured, or stores in local data/media folder.
 */
export async function saveMedia(
    filename: string,
    buffer: Buffer,
    mimeType: string = "application/octet-stream"
): Promise<{ url: string; storage: "s3" | "local" }> {
    const s3Config = getS3Config();

    if (s3Config) {
        try {
            logger.info("Storage", `Uploading ${filename} to Cloud Storage (${s3Config.bucket})...`);
            const cloudUrl = await uploadToS3(filename, buffer, mimeType, s3Config);
            logger.success("Storage", `Uploaded ${filename} to S3/R2: ${cloudUrl}`);
            return { url: cloudUrl, storage: "s3" };
        } catch (err) {
            logger.error("Storage", "Cloud storage upload failed, falling back to local disk:", err);
        }
    }

    // Local disk storage
    await mkdir(MEDIA_DIR, { recursive: true });
    const localFilePath = path.join(MEDIA_DIR, filename);
    await writeFile(localFilePath, buffer);

    const localUrl = `/api/media/${filename}`;
    logger.debug("Storage", `Saved ${filename} to local storage at ${localFilePath}`);
    return { url: localUrl, storage: "local" };
}

/**
 * Clean up local media files older than retentionDays (defaults to MEDIA_RETENTION_DAYS or 30 days).
 * Set MEDIA_RETENTION_DAYS=0 in .env to disable auto-cleanup.
 */
export async function cleanupOldMedia(retentionDays?: number): Promise<{ deletedCount: number; freedBytes: number }> {
    const days = retentionDays ?? parseInt(process.env.MEDIA_RETENTION_DAYS || "30", 10);

    if (days <= 0) {
        logger.debug("Storage", "Media cleanup disabled (MEDIA_RETENTION_DAYS <= 0).");
        return { deletedCount: 0, freedBytes: 0 };
    }

    if (!existsSync(MEDIA_DIR)) {
        return { deletedCount: 0, freedBytes: 0 };
    }

    const cutoffTime = Date.now() - days * 24 * 60 * 60 * 1000;
    let deletedCount = 0;
    let freedBytes = 0;

    try {
        const files = await readdir(MEDIA_DIR);
        for (const file of files) {
            const filePath = path.join(MEDIA_DIR, file);
            try {
                const fileStat = await stat(filePath);
                if (fileStat.isFile() && fileStat.mtimeMs < cutoffTime) {
                    freedBytes += fileStat.size;
                    await unlink(filePath);
                    deletedCount++;
                }
            } catch {
                // Ignore single file stat/unlink errors
            }
        }

        if (deletedCount > 0) {
            const freedMB = (freedBytes / (1024 * 1024)).toFixed(2);
            logger.info("Storage", `Cleaned up ${deletedCount} local media files older than ${days} days (Freed ${freedMB} MB).`);
        }
    } catch (err) {
        logger.error("Storage", "Error during media cleanup:", err);
    }

    return { deletedCount, freedBytes };
}
