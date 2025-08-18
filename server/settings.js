import { Router } from "express";
import mongoose from "mongoose";
import { requireAuth } from "./auth.js";

const router = Router();

// --- Schema / Model (singleton) ---
const SettingSchema = new mongoose.Schema({
  // enforce one document via a constant unique key
  key: { type: String, default: "singleton", unique: true, immutable: true },

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

const Settings = mongoose.models.Settings || mongoose.model("Settings", SettingSchema);

// --- Routes ---

// GET /api/settings  → read the singleton (auth kept; remove requireAuth if you want it public)
router.get("/", requireAuth, async (_req, res) => {
  try {
    const doc = await Settings.findOne({ key: "singleton" }).lean();
    res.json(doc || {});
  } catch (err) {
    console.error("Failed to fetch settings:", err);
    res.status(500).json({ error: "Failed to fetch settings" });
  }
});

// POST /api/settings  → upsert (always override the same config)
router.post("/", requireAuth, async (req, res) => {
  try {
    const updated = await Settings.findOneAndUpdate(
      { key: "singleton" },
      { $set: req.body, $setOnInsert: { key: "singleton" } },
      { new: true, upsert: true }
    );
    res.json(updated);
  } catch (err) {
    // handle duplicate key races gracefully
    if (err?.code === 11000) {
      try {
        const updated = await Settings.findOneAndUpdate(
          { key: "singleton" },
          { $set: req.body },
          { new: true }
        );
        return res.json(updated);
      } catch (e) {
        console.error("Retry after duplicate key failed:", e);
      }
    }
    console.error("Failed to upsert settings:", err);
    res.status(500).json({ error: "Failed to save settings" });
  }
});

export default router;
