import { Router } from "express";
import { getDashboard } from "../controller/analytics.js";

const router = Router();
router.get("/dashboard", getDashboard);

export default router;
