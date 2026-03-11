import { commitCatalogToGithub, readCatalog, sanitizeCatalog, verifyAuth } from "./_utils.js";

export default async function handler(req, res) {
  const user = verifyAuth(req, res);
  if (!user) {
    return;
  }

  if (req.method === "GET") {
    try {
      const catalog = await readCatalog();
      return res.status(200).json(catalog);
    } catch (error) {
      return res.status(500).json({ error: error.message || "Could not read catalog.json" });
    }
  }

  if (req.method === "PUT") {
    try {
      const nextCatalog = sanitizeCatalog(req.body || {});
      const github = await commitCatalogToGithub(nextCatalog, user.email);
      return res.status(200).json({ ok: true, syncedAt: new Date().toISOString(), github });
    } catch (error) {
      return res.status(500).json({ error: error.message || "Could not write catalog.json" });
    }
  }

  res.setHeader("Allow", "GET, PUT");
  return res.status(405).json({ error: "Method not allowed" });
}
