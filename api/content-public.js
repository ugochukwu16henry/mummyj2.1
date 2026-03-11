import { readContent } from "./content.js";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const content = await readContent();
    const testimonials = content.testimonials.filter((item) => item.approved);
    const posts = content.posts.filter((item) => item.published);
    return res.status(200).json({ testimonials, posts });
  } catch (error) {
    return res.status(500).json({ error: error.message || "Could not load stories" });
  }
}
