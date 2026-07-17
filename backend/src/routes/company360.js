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