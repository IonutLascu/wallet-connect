import { Router } from "express";
import authRouter from "./auth.js";
import settingsRouter from "./settings.js";

const router = Router();

// mount sub-routers
router.use("/auth", authRouter);
router.use("/", settingsRouter);

export default router;