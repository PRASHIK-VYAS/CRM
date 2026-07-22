import { Router } from "express";
import {
    createMou,
    getMouList,
    getMouId,
    getMouBycompany,
    updateMou,
    changeMouStatus,
    activate,
    deactivateMou,
    softDeleteMou,
    permanentlyDeleteMou,
    getMouStatistics,
} from "../controller/mouvoult.js";

const router = router();

router.post("/", createMou);
router.get("/", getMouList);
router.get("/statistics", getMouStatistics);
router.get("/company/:companyId", getMouBycompany);
router.get("/:id", getMouById);
router.put("/:id", updateMou);
router.patch("/:id/status", changeMouStatus);
router.patch("/:id/activate", activate);
router.patch("/:id/deactivate", deactivateMou);
router.delete("/:id", softDeleteMou);
router.delete("/:id/permanently-delete", permanentlyDeleteMou);

export default router;