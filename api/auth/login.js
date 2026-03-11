import { createLoginToken } from "../_utils.js";

export default function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { email, password } = req.body || {};
  if (email !== "admin@mummyj2treats.com" || password !== "admin123") {
    return res.status(401).json({ error: "Invalid admin credentials" });
  }

  const token = createLoginToken(email);
  return res.status(200).json({ token, user: { email, role: "admin" } });
}
