import { createPresignedUpload } from "../_upload-utils.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { fileName, fileType, folder } = req.body || {};

    if (!fileName) {
      return res.status(400).json({ error: "fileName is required" });
    }

    const payload = await createPresignedUpload({
      fileName,
      fileType,
      folder: folder || "testimonials"
    });

    return res.status(200).json(payload);
  } catch (error) {
    return res.status(500).json({ error: error.message || "Could not create upload URL" });
  }
}
