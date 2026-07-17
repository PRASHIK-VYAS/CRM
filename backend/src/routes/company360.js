import { Router } from "express";
import {
    createCompany,
    getCompanies,
    getCompanyById,
    getCompanyDetails,
    getCompanyStatistics,
    updateCompany,
    softDeleteCompany,
    restoreCompany,
    permanentlyDeleteCompany,
} from "../controller/company360.js";

const router = Router();

router.post("/", createCompany);
router.get("/", getCompanies);
router.get("/", getCompanyById);
router.get("/:id", getCompanyById);
router.get("/:id/details", getCompanyDetails);
router.get("/:id/statistics", getCompanyStatistics);
router.put("/:id", softDeleteCompany);
router.delete("/:id/restore", restoreCompany);
router.delete("/:id/permanently-delete", permanentlyDeleteCompany);

export default router;