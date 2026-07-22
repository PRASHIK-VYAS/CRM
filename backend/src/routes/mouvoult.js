import { Router } from "express";
import {
    createMou,
    getMouList,
    getMouById,
    getMouBycompany,
    updateMou,
    changeMoustatus,
    activate,
    deactivateMou,
    softDeleteMou,
    permanentlyDeleteMou,
    getMoustatistics,
} from "../controller/mouvoult.js";

const router = ROuter();

router.post("/", createMou);
router.get("/", getMouList);
router.get("/statistics", getMouStatistics);
router.get("/company/:companyId", getMouBycompany);
router.get("/:id", getMouById);
router.get("/:id", updateMou);
router.put("/:id/status", changeMouStatus);
router.patch("/:id/activate", activate);
router.patch("/:id/deactivate", deactivateMou);
router.delete("/:id", softDeleteMou);
router.delete("/:id/permanently-delete", permanentlyDeleteMou);


export default router;