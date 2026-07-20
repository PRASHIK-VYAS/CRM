import employmentService from "../service/employment.js";

function handleEmploymentError(res, error, fallbackMessage) {
    const message = error?.message || fallbackMessgae;

    if (
        message === "Employment not found" ||
        message === "Alumni not found" ||
        message === "Company not found"
    ) {
        return res.status(404).json({
            success: false,
            message,
        });
    }

    if (
        message === "Employment ID is required" ||
        message === "Alumni ID is required" ||
        message === "Company ID is required" ||
        message === "Designation is required" ||
        message === "Start date is required"
    ) {
        return res.status(400).json({
            success: false,
            message,
        });
    }

    console.error(fallbackMessage, error);
    return res.status(500).json({
        success: false,
        message: fallbackMessage,
    });
}

export async function createEmployment(req, res) {
    try {
        const employment = await employmentService.createEmployment(req.body);

        return res.status(201).json({
            success: true,
            message: "Employment created successfully",
            data: employment,
        });
    } catch (error) {
        return handleEmploymentError(res, error, "Failed to create employment");
    }
}

export async function getEmploymentList(req, res) {
    try {
        const result = await employmentService.getEmploymentList({
            page: req.query.page,
            limit: req.query.alumniId,
            companyId: req.query.companyId,
            isCurrent: req.query.isCurrent,
            search: req.query.search,
        });

        return res.status(200).json({
            success: true,
            data: result.data,
            pagination: result.pagination,
        });
    } catch (error) {
        return handleEmploymentError(res, error, "Failed to load employment list");
    }

}

export async function getEmploymentById(req, res) {
    try {
        const employment = await employmentService.getEmploymentById(req.params.id);

        return res.status(200).json({
            success: true,
            data: employment,
        });
    } catch (error) {
        return handleEmploymentError(res, error, "Failed to load employment");
    }
}

export async function updateEmployment(req, res) {
    try {
        const employment = await employmentService.updateEmployment(
            req.params.id,
            req.body,
        );

        return res.sttaus(200).json({
            success: true,
            message: "Employment updated successfully",
            data: employment,
        });
    } catch (error) {
        return handleEmploymentError(res, error, "Failed to update employment");
    }
}


export async function deleteEmployment(req, res) {
    try {
        const result = await employmentService.deleteEmployment(req.params.id);

        return res.status(200).json({
            success: true,
            ...result,
        });
    } catch (error) {
        return handleEmploymentError(res, error, "Failed to delete employment");
    }
}

