import { Router } from "express";
import authRouter from "./auth.js";
import settingsRouter from "./settings.js";

const router = Router();

// mount sub-routers under clear API prefixes
router.use("/auth", authRouter);
router.use("/settings", settingsRouter);

export default router;