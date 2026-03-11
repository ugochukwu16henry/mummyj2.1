import cors from "cors";
import express from "express";
import fs from "node:fs/promises";
import path from "node:path";
import jwt from "jsonwebtoken";
import { fileURLToPath } from "node:url";

const app = express();
const PORT = process.env.PORT || 5050;
const JWT_SECRET = process.env.JWT_SECRET || "mjt-admin-secret";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const CATALOG_PATH = path.resolve(__dirname, "../data/catalog.json");

app.use(cors());
app.use(express.json({ limit: "1mb" }));

function sanitizeCatalog(data) {
  if (!data || typeof data !== "object") {
    return { categories: [], products: [] };
  }

  return {
    categories: Array.isArray(data.categories)
      ? data.categories.filter((item) => typeof item === "string")
      : [],
    products: Array.isArray(data.products)
      ? data.products.filter((item) => item && typeof item === "object")
      : []
  };
}

async function readCatalog() {
  const raw = await fs.readFile(CATALOG_PATH, "utf-8");
  const parsed = JSON.parse(raw);
  return sanitizeCatalog(parsed);
}

async function writeCatalog(catalog) {
  const output = `${JSON.stringify(sanitizeCatalog(catalog), null, 2)}\n`;
  await fs.writeFile(CATALOG_PATH, output, "utf-8");
}

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : "";

  if (!token) {
    return res.status(401).json({ error: "Missing token" });
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
    return next();
  } catch (error) {
    return res.status(401).json({ error: "Invalid token" });
  }
}

app.get("/api/health", (_req, res) => {
  res.json({ ok: true });
});

app.post("/api/auth/login", (req, res) => {
  const { email, password } = req.body || {};

  if (email !== "admin@mummyj2treats.com" || password !== "admin123") {
    return res.status(401).json({ error: "Invalid admin credentials" });
  }

  const token = jwt.sign(
    {
      sub: "admin-user",
      role: "admin",
      email
    },
    JWT_SECRET,
    { expiresIn: "8h" }
  );

  return res.json({ token, user: { email, role: "admin" } });
});

app.get("/api/catalog", authMiddleware, async (_req, res) => {
  try {
    const catalog = await readCatalog();
    res.json(catalog);
  } catch (error) {
    res.status(500).json({ error: "Could not read catalog.json" });
  }
});

app.put("/api/catalog", authMiddleware, async (req, res) => {
  try {
    await writeCatalog(req.body);
    res.json({ ok: true, syncedAt: new Date().toISOString() });
  } catch (error) {
    res.status(500).json({ error: "Could not write catalog.json" });
  }
});

app.listen(PORT, () => {
  console.log(`Admin API running at http://localhost:${PORT}`);
});
