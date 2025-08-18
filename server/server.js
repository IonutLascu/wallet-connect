import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import routes from "./routes.js";
import dotenv from "dotenv";

dotenv.config();

const app = express();

// allow dev + optional prod URL
const allowedOrigins = new Set([
  "http://localhost:3000",
  "http://127.0.0.1:3000",
].filter(Boolean));

const corsOptions = {
  origin(origin, cb) {
    if (!origin || allowedOrigins.has(origin)) return cb(null, true);
    return cb(new Error(`Not allowed by CORS: ${origin}`));
  },
  credentials: true,
  methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
// (optional, but helps some setups with manual preflights)
app.options("*", cors(corsOptions));

app.use(express.json());

// ---- DB ----
const mongoUri = process.env.MONGO_URI || "mongodb://localhost:27017/zetex";
mongoose.connect(mongoUri)
  .then(() => console.log("Connected to MongoDB"))
  .catch(err => console.error("MongoDB connection error:", err.message || err));

// ---- Routes ----
app.use("/api", routes);

// ---- Server ----
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
