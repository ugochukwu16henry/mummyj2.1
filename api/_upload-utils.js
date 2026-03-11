import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const S3_ACCESS_KEY_ID = process.env.S3_ACCESS_KEY_ID || "";
const S3_SECRET_ACCESS_KEY = process.env.S3_SECRET_ACCESS_KEY || "";
const S3_REGION = process.env.S3_REGION || "us-east-1";
const S3_BUCKET_NAME = process.env.S3_BUCKET_NAME || "";
const S3_ENDPOINT = process.env.S3_ENDPOINT || "";
const S3_PUBLIC_BASE_URL = process.env.S3_PUBLIC_BASE_URL || "";
const S3_FORCE_PATH_STYLE = String(process.env.S3_FORCE_PATH_STYLE || "true").toLowerCase() !== "false";

function ensureS3Config() {
  if (!S3_ACCESS_KEY_ID || !S3_SECRET_ACCESS_KEY || !S3_BUCKET_NAME) {
    throw new Error("S3 is not configured. Set S3_ACCESS_KEY_ID, S3_SECRET_ACCESS_KEY, and S3_BUCKET_NAME.");
  }
}

function getS3Client() {
  ensureS3Config();
  return new S3Client({
    region: S3_REGION,
    endpoint: S3_ENDPOINT || undefined,
    forcePathStyle: S3_FORCE_PATH_STYLE,
    credentials: {
      accessKeyId: S3_ACCESS_KEY_ID,
      secretAccessKey: S3_SECRET_ACCESS_KEY
    }
  });
}

function safeFilename(fileName = "upload.bin") {
  const clean = String(fileName)
    .trim()
    .replace(/[^a-zA-Z0-9._-]/g, "-")
    .replace(/-+/g, "-");

  return clean || "upload.bin";
}

function encodeKey(key) {
  return String(key)
    .split("/")
    .map((part) => encodeURIComponent(part))
    .join("/");
}

function buildPublicFileUrl(key) {
  const encodedKey = encodeKey(key);

  if (S3_PUBLIC_BASE_URL) {
    return `${S3_PUBLIC_BASE_URL.replace(/\/$/, "")}/${encodedKey}`;
  }

  if (S3_ENDPOINT) {
    return `${S3_ENDPOINT.replace(/\/$/, "")}/${S3_BUCKET_NAME}/${encodedKey}`;
  }

  return `https://${S3_BUCKET_NAME}.s3.${S3_REGION}.amazonaws.com/${encodedKey}`;
}

export async function createPresignedUpload({ fileName, fileType, folder = "testimonials" }) {
  const client = getS3Client();
  const safeName = safeFilename(fileName);
  const key = `${String(folder).replace(/^\/+|\/+$/g, "")}/${Date.now()}-${safeName}`;

  const command = new PutObjectCommand({
    Bucket: S3_BUCKET_NAME,
    Key: key,
    ContentType: fileType || "application/octet-stream"
  });

  const uploadUrl = await getSignedUrl(client, command, { expiresIn: 60 * 15 });
  const fileUrl = buildPublicFileUrl(key);

  return { key, uploadUrl, fileUrl };
}
