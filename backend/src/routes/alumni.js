import { Router } from "express" ;
import {
    createAlumni,
    getAlumniList,
    getAlumniById,
    getAlumniCode,
    getAlumniByEmail,
    getAlumniByCompany,
    updateAlumni,
    assignCompany,
    removeCompany,
    updateScores,
    recordContact,
    addSkills,
    removeSkill,
    updateHelpPreferences,
    changeAlumniStatus,
    activateAlumni,
    deactivateAlumni,
    permanentlyDeleteAlumni,
    getAlumniStatistics,
} from "../controller/alumni.js";

const rounter = Router();

router.post("/", createAlumni);
router.get("/", getAlumniList);
router.get("/statistics", getAlumniStatistics);
router.get("/code/:alumniCode", getAlumniCode);
router.get("/email/:email", getAlumniByEmail);
router.get("/company/:companyId", getAlumniByCompany);
router.get("/:id", getAlumniById);


router.put("/:id", updateAlumni);
router.patch("/:id/company", assignCompany);
router.delete("/:id/company", removeCompany);
router.patch("/:id/scores", updateScores);
router.post("/:id/contact", recordContact);
router.post("/:id/skills", addSkills);
router.delete("/:id/skills", removeSkill);
router.patch("/:id/help-preferences", updateHelpPreferences);
router.patch("/:id/status", changeAlumniStatus);
router.patch("/:id/activate", activateAlumni);
router.patch("/:id/deactivate", deactivateAlumni);
router.delete("/:id/permanently-delete", permanentlyDeleteAlumni);

export default router;