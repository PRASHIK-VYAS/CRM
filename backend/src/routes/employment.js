import { Router } from "express";
import{
    createEmployment,
    getEmploymentList,
    getEmploymentById,
    updateEmployment,
    deleteEmployment,
} from "../controller/employment.js" ;

const router = Router();

router.post("/" , createEmployment);
router.get("/", getEmploymentList);
router.get("/:id", getEmploymentById);
router.put("/:id", updateEmployment);
router.delete("/:id", deleteEmployment);

export default router;