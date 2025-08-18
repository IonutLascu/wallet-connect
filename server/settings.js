import { Router } from "express";
import mongoose from "mongoose";
import { requireAuth } from "./auth.js";

const router = Router();

// --- Schema/Model ---
const SettingSchema = new mongoose.Schema({
  contractAddressSale: String,
  contractAddressSaleEndDate: String,
  contractAddressSaleRate: String,
  contractAddressToken: String,
  contractAddressTokenSymbol: String,
  walletConnectProjectId: String,
  walletConnectNetworkId: String,
  walletConnectPromptTitle: String,
  walletConnectPromptDesc: String,
  walletConnectPromptUrl: String,
  walletConnectPromptIcons: String,
  walletConnectHowToBuyUrl: String,
  walletConnectNoWalletUrl: String,
}, { timestamps: true });

const Settings = mongoose.model("Settings", SettingSchema);

// --- Routes ---
// GET /api/settings
router.get("/", async (_req, res) => {
  try {
    const settings = await Settings.findOne({});
    res.json(settings || {});
  } catch (err) {
    console.error("Failed to fetch settings:", err);
    res.status(500).json({ error: "Failed to fetch settings" });
  }
});

// POST /api/settings
router.post("/", requireAuth, async (req, res) => {
  try {
    const data = req.body || {};
    let settings = await Settings.findOne({});
    if (settings) {
      Object.assign(settings, data);
      await settings.save();
    } else {
      settings = await Settings.create(data);
    }
    res.json(settings);
  } catch (err) {
    console.error("Failed to save settings:", err);
    res.status(500).json({ error: "Failed to save settings" });
  }
});

export default router;
