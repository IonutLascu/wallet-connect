import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
app.use(cors());
app.use(express.json()); // replaces body-parser.json()

// resolve __dirname (since ES modules don't have it by default)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// MongoDB connection
const mongoUri = process.env.MONGO_URI || "mongodb://localhost:27017/zetex";

async function connectDB() {
  try {
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error("MongoDB connection error:", err.message);
    process.exit(1);
  }
}
connectDB();

// Schema
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
});

const Settings = mongoose.model("Settings", SettingSchema);

// API Routes
app.get("/settings", async (req, res) => {
  try {
    const settings = await Settings.findOne({});
    res.json(settings || {});
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch settings" });
  }
});

app.post("/settings", async (req, res) => {
  try {
    const { password, ...data } = req.body;
    if (password !== "admin123") {
      return res.status(403).json({ error: "Forbidden" });
    }

    let settings = await Settings.findOne({});
    if (settings) {
      Object.assign(settings, data);
      await settings.save();
    } else {
      settings = await Settings.create(data);
    }

    res.json(settings);
  } catch (err) {
    res.status(500).json({ error: "Failed to save settings" });
  }
});

app.use(express.static(__dirname));

app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
