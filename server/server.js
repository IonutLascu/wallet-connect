import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import routes from "./routes.js";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// ---- DB ----
const mongoUri = process.env.MONGO_URI || "mongodb://localhost:27017/zetex";
async function connectDB() {
  try {
    await mongoose.connect(mongoUri);
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error("MongoDB connection error:", err.message || err);
    // don’t exit – allow app to run in dev even if DB is not available
  }
}
connectDB();

// ---- Routes ----
app.use("/api", routes);

// ---- Server ----
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log("Server running on http://localhost:${PORT}");
});
