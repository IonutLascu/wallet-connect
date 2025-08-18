// server.js
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import bodyParser from "body-parser";

const app = express();
app.use(cors());
app.use(bodyParser.json());

await mongoose.connect("mongodb://localhost:27017/zetex", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

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

app.get("/settings", async (req, res) => {
  const settings = await Settings.findOne({});
  res.json(settings || {});
});

app.post("/settings", async (req, res) => {
  const { password, ...data } = req.body;
  if (password !== "admin123") return res.status(403).json({ error: "Forbidden" });

  let settings = await Settings.findOne({});
  if (settings) {
    Object.assign(settings, data);
    await settings.save();
  } else {
    settings = await Settings.create(data);
  }
  res.json(settings);
});

app.listen(3000, () => console.log("Server running on http://localhost:3000"));
