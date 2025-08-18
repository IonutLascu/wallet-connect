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

const Settings = mongoose.models.Settings || mongoose.model("Settings", SettingSchema);

router.get("/", requireAuth, async (_req, res) => {
  try {
    const list = await Settings.find({}).lean();
    res.json(list);
  } catch (err) {
    console.error("Failed to fetch settings list:", err);
    res.status(500).json({ error: "Failed to fetch settings list" });
  }
});

router.get("/:id", requireAuth, async (req, res) => {
  try {
    const doc = await Settings.findById(req.params.id).lean();
    if (!doc) return res.status(404).json({ error: "Not found" });
    res.json(doc);
  } catch (err) {
    console.error("Failed to fetch settings by id:", err);
    res.status(500).json({ error: "Failed to fetch settings" });
  }
});

router.post("/", requireAuth, async (req, res) => {
  try {
    const created = await Settings.create(req.body || {});
    res.status(201).json(created);
  } catch (err) {
    console.error("Failed to create settings:", err);
    res.status(500).json({ error: "Failed to create settings" });
  }
});

router.put("/:id", requireAuth, async (req, res) => {
  try {
    const updated = await Settings.findByIdAndUpdate(
      req.params.id,
      { $set: req.body || {} },
      { new: true }
    );
    if (!updated) return res.status(404).json({ error: "Not found" });
    res.json(updated);
  } catch (err) {
    console.error("Failed to update settings:", err);
    res.status(500).json({ error: "Failed to update settings" });
  }
});

router.delete("/:id", requireAuth, async (req, res) => {
  try {
    const deleted = await Settings.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Not found" });
    res.json({ ok: true });
  } catch (err) {
    console.error("Failed to delete settings:", err);
    res.status(500).json({ error: "Failed to delete settings" });
  }
});

export default router;
