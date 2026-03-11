import fs from "node:fs/promises";
import path from "node:path";

const GITHUB_TOKEN = process.env.GITHUB_TOKEN || "";
const GITHUB_OWNER = process.env.GITHUB_OWNER || "";
const GITHUB_REPO = process.env.GITHUB_REPO || "";
const GITHUB_BRANCH = process.env.GITHUB_BRANCH || "main";
const CONTENT_PATH = "data/content.json";

function sanitizeContent(data) {
  if (!data || typeof data !== "object") {
    return { testimonials: [], posts: [] };
  }

  return {
    testimonials: Array.isArray(data.testimonials)
      ? data.testimonials.filter((item) => item && typeof item === "object")
      : [],
    posts: Array.isArray(data.posts)
      ? data.posts.filter((item) => item && typeof item === "object")
      : []
  };
}

function isGithubSyncEnabled() {
  return Boolean(GITHUB_TOKEN && GITHUB_OWNER && GITHUB_REPO);
}

function buildGithubContentUrl() {
  const encodedPath = CONTENT_PATH
    .split("/")
    .map((segment) => encodeURIComponent(segment))
    .join("/");
  return `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${encodedPath}`;
}

async function getRemoteContentSnapshot() {
  const response = await fetch(`${buildGithubContentUrl()}?ref=${encodeURIComponent(GITHUB_BRANCH)}`, {
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${GITHUB_TOKEN}`,
      "X-GitHub-Api-Version": "2022-11-28"
    }
  });

  if (response.status === 404) {
    return { sha: null, decodedContent: null };
  }

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(payload?.message || `Could not fetch content (${response.status})`);
  }

  const raw = typeof payload.content === "string" ? payload.content.replace(/\n/g, "") : "";
  const decodedContent = raw ? Buffer.from(raw, "base64").toString("utf-8") : null;
  return { sha: payload?.sha || null, decodedContent };
}

async function commitContentToGithub(content) {
  const snapshot = await getRemoteContentSnapshot();
  const output = `${JSON.stringify(sanitizeContent(content), null, 2)}\n`;

  if (snapshot.decodedContent === output) {
    return { committed: false };
  }

  const response = await fetch(buildGithubContentUrl(), {
    method: "PUT",
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${GITHUB_TOKEN}`,
      "X-GitHub-Api-Version": "2022-11-28",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      message: `chore(content): update content.json (${new Date().toISOString()})`,
      content: Buffer.from(output, "utf-8").toString("base64"),
      branch: GITHUB_BRANCH,
      ...(snapshot.sha ? { sha: snapshot.sha } : {})
    })
  });

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(payload?.message || `Could not commit content (${response.status})`);
  }

  return { committed: true };
}

async function readLocalContent() {
  const localPath = path.resolve(process.cwd(), CONTENT_PATH);
  const raw = await fs.readFile(localPath, "utf-8");
  return sanitizeContent(JSON.parse(raw));
}

async function writeLocalContent(content) {
  const localPath = path.resolve(process.cwd(), CONTENT_PATH);
  const output = `${JSON.stringify(sanitizeContent(content), null, 2)}\n`;
  await fs.writeFile(localPath, output, "utf-8");
}

export async function readContent() {
  if (isGithubSyncEnabled()) {
    try {
      const snapshot = await getRemoteContentSnapshot();
      if (snapshot.decodedContent) {
        return sanitizeContent(JSON.parse(snapshot.decodedContent));
      }
    } catch {
      // fallback to local file
    }
  }

  return readLocalContent();
}

export async function saveContent(content) {
  if (isGithubSyncEnabled()) {
    await commitContentToGithub(content);
    return;
  }

  await writeLocalContent(content);
}
