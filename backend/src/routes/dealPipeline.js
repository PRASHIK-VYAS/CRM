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