// auth.js
import { Router } from "express";
import jwt from "jsonwebtoken";

const router = Router();

const JWT_SECRET = process.env.JWT_SECRET;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD; // <- plain password from .env

// ---- middleware
export function requireAuth(req, res, next) {
  const auth = req.headers.authorization || "";
  const [, token] = auth.split(" ");
  if (!token) return res.status(401).json({ error: "Unauthorized" });
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    return next();
  } catch {
    return res.status(401).json({ error: "Invalid token" });
  }
}

function signJwt(payload, expiresIn = "4h") {
  return jwt.sign(payload, JWT_SECRET, { expiresIn });
}

// ---- routes
router.post("/login", async (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password required" });
  }
  if (email !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  const token = signJwt({ sub: ADMIN_EMAIL, role: "admin" });
  res.json({ token });
});

router.get("/me", requireAuth, (req, res) => {
  res.json({ email: ADMIN_EMAIL, role: "admin" });
});

export default router;
