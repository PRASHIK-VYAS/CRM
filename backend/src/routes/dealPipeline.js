import { Router } from "express";
import {
    createDeal,
    getDeals,
    getDealByCompany,
    getDealsByOwner,
    updateDeal,
    changeDealStage,
    reassignDeal,
    archiveDeal,
    restoreDeal,
    deleteDeal,
    getUpComingFollowUps,
    getPipelineStatistics,
} from "../controller/dealPipeline.js";

const router = Router();

router.post("/", createDeal);
router.get("/", getDeals);
router.get("/statistics", getPipelineStatistics);
router.get("/upcoming-follow-ups", getUpcomingFollowUps);
router.get("/company/:companyId", getDealsByCompany);
router.get("/owner/:ownerId", getDealsByOwner);
router.get("/:id", getDealById);
router.put("/:id", updateDeal);
router.patch("/:id", updateDeal);
router.patch("/:id/stage", changeDealStage);
router.patch("/:id/reassign", reassignDeal);
router.patch("/:id/archive", archiveDeal);
router.patch("/:id/restore", restoreDeal);
router.delete("/:id", deleteDeal);

export default router;