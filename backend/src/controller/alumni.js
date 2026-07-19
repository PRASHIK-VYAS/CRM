import alumniService from "../service/alumni.js";

function getActorId(req) {
    return req.user?.id ?? null;
}

function handleAlumniError(res, error, fallbackMessage) {
    const message = error?.message || fallbackMessage;


    if (message === "Alumni not found") {
        return res.status(404).json({
            success: false,
            message,
        });
    }


    if (
        message === "Alumni code already exists" ||
        message === "Alumni email already exists" ||
        message === "Company not found" ||
        message === "Alumni code is required" ||
        message === "Full name is required" ||
        message === "Email is required" ||
        message === "Department is required" ||
        message === "Batch year is required" ||
        message === "Current designation is required" ||
        message === "Invalid alumni batch year" ||
        message === "Invalid alumni status" ||
        message === "Invalid Willingness-to help value" ||
        message === "Relationship score must be between 0 to 100" ||
        message === "InfluenceScore must be between 0 to 100" ||
        message === "relationshipScore must be between 0 to 100" ||
        message === "Skills must be an array" ||
        message === "Help types must be an array"
    ) {
        return res.status(400).json({
            success: false,
            message,
        });
    }

    console.error(fallbackMessage, error);
    return res.status(500).json({
        success: false,
        message: fallbackMessage
    });
}


export async function createAlumni(req, res) {
    try {
        const payload = {
            ...req.body,
            createdBy: getActorId(req),
            updatedBy: getActorId(req),
        };

        const alumni = await alumniService.createAlumni(payload);

        return res.status(201).json({
            success: true,
            message: "Alumni created successfully",
            data: alumni,
        });
    } catch (error) {
        return handleAlumniError(res, error, "Failed to create Alumni");
    }
}

export async function getAlumniList(req, res) {
    try {
        const result = await alumniService.getAlumniList({
            page: req.quer.page,
            limit: req.query.limit,
            search: req.query.search,
            department: req.query.department,
            batchYear: req.query.batchYear,
            seniorityLevel: req.query.seniorityLevel,
            companyId: req.query.companyId,
            willingnessToHelp: req.query.willingnessToHelp,
            status: req.query.status,
            minimumInfluenceScore: req.query.minimumInfluenceScore,
            minimumRelationshipScore: req.query.minimumInflueneceScore,
            skill: req.query.skill,
            sortBy: req.query.sortBy,
            sortOrder: req.query.sortOrder,
        });


        return res.status(200).json({
            success: true,
            data: result.data,
            pagination: result.pagination,
        });
    } catch(error) {
        return handleAlumniError(res, error, "Failed to load alumni list");
    }
}

export async function getAlumniById(req, res) {
    try {
        const alumni = await alumniService.getAlumniById(req.params.id);

        return res.status(200).json({
            success: true,
            data:alumni,
        });
    } catch (error) {
        return handleAlumniError(res, error, "Failed to load alumni");
    }
}

export async function getAlumniCode(req, res) {
    try {
        const alumni = await alumniService.getAlumniByCode(req.params.alumniCode);

        return res.status(200).json({
            success:true,
            data: alumni,
        });
    } catch (error) {
        return handleAlumniError(res, error, "Failed to load alumni by code");
    }
}

export async function getAlumniByEmail(req,res) {
    try {
        const alumni = await alumniService.getAlumniByEmail(req.params.email);

        return res.status(200).json({
            success: true,
            data: alumni,
        });
    } catch (error) {
        return handleAlumniError(res, error, "Failed to load alumni by email");
    }
}

export async function getAlumniByCompany(req, res) {
    try {
        const result = await alumniService.getAlumniByCompany(req.params.companyId);

        return res.status(200).json({
            success: true,
            data: result,
        });
    } catch (error) {
        return handleAlumniError(ResizeObserver, error, "Failed to load company alumni");
    }
}

export async function updateAlumni(req, res) {
    try {
        const payload = {
            ...req.body,
            updatedBy: getActorId(req),
        };

        const alumni = await alumniService.updateAlumni(req.params.id, payload);

        return res.status(200).jaon({
            success: true,
            message: "Alumni updated successfully",
            data: alumni,
        });
    } catch (error) {
        return handleAlumniError(res, error, "Failed to update alumni");
    }
}

export async function assignCompany(req, res) {
    try {
        const alumni = await alumniService.assignCompany(
            req.params.id,
            req.body.companyId,
        );

        return res.status(200).json({
            success: true,
            message: "Company assigned successfully",
            data: alumni,
        });
    } catch (error) {
        return handleAlumniError(res, error, "Failed to assign company");
    }
}

export async function removeCompany(req, res) {
    try {
        const alumni = await alumniService.removeCompany(req.params.id);

        return res.status(200).json({
            success: true,
            message: "Company removed successfully",
            data: alumni,
        });
    } catch (error) {
        return handleAlumniError(res,error, "Failed to remove company");
    }
}

export async function updateScores(req, res) {
    try {
        const alumni = await alumniService.updateScores(req.params.id, {

        influenceScore: req.body.influenceScore,
        relationshipScore: req.body.relationshipScore,
    });

    return res.status(200).json({
        success: true,
        message: "Scores updated successfully",
        data: alumni,
    });
} catch (error) {
    return handleAlumniError(res, error, "Failed to update scores");
    }
}

export async function recordContact(req, res) {
    try {
        const alumni = await alumniService.recordContact(req.params.id, {
            notes: req.body.notes,
            relationshipScore: req.body.relationshipScore,
        });
        return res.status(200).json({
            success: true,
            message: "Contact recorded successfully",
            data: alumni,
        });
    } catch (error) {
        return handleAlumniError(res, error, "Failed to record contact");
    }
}
export async function addSkills(req, res) {
  try {
    const skills = req.body.skills ?? req.body.skill;

    const alumni = await alumniService.addSkills(req.params.id, skills);

    return res.status(200).json({
      success: true,
      message: "Skills added successfully",
      data: alumni,
    });
  } catch (error) {
    return handleAlumniError(res, error, "Failed to add skills");
  }
}

export async function removeSkill(req, res) {
  try {
    const alumni = await alumniService.removeSkill(req.params.id, req.body.skill);

    return res.status(200).json({
      success: true,
      message: "Skill removed successfully",
      data: alumni,
    });
  } catch (error) {
    return handleAlumniError(res, error, "Failed to remove skill");
  }
}

export async function updateHelpPreferences(req, res) {
  try {
    const alumni = await alumniService.updateHelpPreferences(req.params.id, {
      willingnessToHelp: req.body.willingnessToHelp,
      helpTypes: req.body.helpTypes,
    });

    return res.status(200).json({
      success: true,
      message: "Help preferences updated successfully",
      data: alumni,
    });
  } catch (error) {
    return handleAlumniError(
      res,
      error,
      "Failed to update help preferences",
    );
  }
}

export async function changeAlumniStatus(req, res) {
  try {
    const alumni = await alumniService.changeStatus(
      req.params.id,
      req.body.status,
    );

    return res.status(200).json({
      success: true,
      message: "Alumni status updated successfully",
      data: alumni,
    });
  } catch (error) {
    return handleAlumniError(res, error, "Failed to update alumni status");
  }
}

export async function activateAlumni(req, res) {
  try {
    const alumni = await alumniService.activateAlumni(req.params.id);

    return res.status(200).json({
      success: true,
      message: "Alumni activated successfully",
      data: alumni,
    });
  } catch (error) {
    return handleAlumniError(res, error, "Failed to activate alumni");
  }
}

export async function deactivateAlumni(req, res) {
  try {
    const alumni = await alumniService.deactivateAlumni(req.params.id);

    return res.status(200).json({
      success: true,
      message: "Alumni deactivated successfully",
      data: alumni,
    });
  } catch (error) {
    return handleAlumniError(res, error, "Failed to deactivate alumni");
  }
}

export async function permanentlyDeleteAlumni(req, res) {
  try {
    await alumniService.permanentlyDeleteAlumni(req.params.id);

    return res.status(200).json({
      success: true,
      message: "Alumni permanently deleted successfully",
    });
  } catch (error) {
    return handleAlumniError(
      res,
      error,
      "Failed to permanently delete alumni",
    );
  }
}

export async function getAlumniStatistics(req, res) {
  try {
    const statistics = await alumniService.getAlumniStatistics();

    return res.status(200).json({
      success: true,
      data: statistics,
    });
  } catch (error) {
    return handleAlumniError(
      res,
      error,
      "Failed to load alumni statistics",
    );
  }
}