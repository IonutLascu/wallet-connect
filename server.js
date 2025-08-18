import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import routes from "./routes.js";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// resolve __dirname for ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ---- DB ----
const mongoUri = process.env.MONGO_URI || "mongodb://localhost:27017/zetex";
async function connectDB() {
  try {
    await mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error("MongoDB connection error:", err.message || err);
    // don't exit - allow app to run in dev even if DB is not available
  }
}
connectDB();

// ---- simple /settings API (file-backed, falls back to env) ----
const SETTINGS_FILE = path.join(__dirname, "settings.json");

function envDefaults() {
  return {
    contractAddressSale: process.env.CONTRACT_ADDRESS_SALE || "",
    contractAddressSaleEndDate: process.env.CONTRACT_ADDRESS_SALE_END_DATE || "",
    contractAddressSaleRate: process.env.CONTRACT_ADDRESS_SALE_RATE || "",
    contractAddressToken: process.env.CONTRACT_ADDRESS_TOKEN || "",
    contractAddressTokenSymbol: process.env.CONTRACT_ADDRESS_TOKEN_SYMBOL || "",
    walletConnectProjectId: process.env.WALLETCONNECT_PROJECT_ID || "",
    walletConnectNetworkId: process.env.WALLETCONNECT_NETWORK_ID || "",
    walletConnectPromptTitle: process.env.WALLETCONNECT_PROMPT_TITLE || "",
    walletConnectPromptDesc: process.env.WALLETCONNECT_PROMPT_DESC || "",
    walletConnectPromptUrl: process.env.WALLETCONNECT_PROMPT_URL || "",
    walletConnectPromptIcons: process.env.WALLETCONNECT_PROMPT_ICONS || "",
    walletConnectHowToBuyUrl: process.env.WALLETCONNECT_HOW_TO_BUY_URL || "",
    walletConnectNoWalletUrl: process.env.WALLETCONNECT_NO_WALLET_URL || ""
  };
}

app.get("/settings", (req, res) => {
  try {
    if (fs.existsSync(SETTINGS_FILE)) {
      const raw = fs.readFileSync(SETTINGS_FILE, "utf8");
      return res.json(JSON.parse(raw));
    }
    return res.json(envDefaults());
  } catch (err) {
    console.error("GET /settings error:", err);
    return res.status(500).json({ error: "failed to read settings" });
  }
});

app.post("/settings", (req, res) => {
  try {
    const payload = { ...envDefaults(), ...req.body };
    fs.writeFileSync(SETTINGS_FILE, JSON.stringify(payload, null, 2), "utf8");
    return res.json({ ok: true, settings: payload });
  } catch (err) {
    console.error("POST /settings error:", err);
    return res.status(500).json({ error: "failed to save settings" });
  }
});

// ---- Routes (other API) ----
app.use("/", routes);

// ---- Static ----
const buildDir = path.join(__dirname, "build");
const publicDir = path.join(__dirname, "public");
if (fs.existsSync(buildDir)) {
  app.use(express.static(buildDir));
  console.log("Serving static from build/");
} else {
  app.use(express.static(publicDir));
  console.log("Serving static from public/");
}

// SPA fallback — serve index.html so client-side routes like /admin work
app.get("*", (req, res) => {
  const indexPath = fs.existsSync(path.join(buildDir, "index.html"))
    ? path.join(buildDir, "index.html")
    : path.join(publicDir, "index.html");
  res.sendFile(indexPath);
});

// ---- Start server ----
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}