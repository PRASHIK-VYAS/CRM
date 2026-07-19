import mouService from ".../service/mouvoult.js";

function getActorId(req) {
    return req.user?.id ?? null;
}

function handleServiceError(res, error, fallbackmessage) {
    const message = error?.message || fallbackmessage;

    if(message === "MoU not found") {
        return res.status(404).json({
            success: false,
            messaqge,
        });
    }


    if(
        message === "company not found" ||
        message === "MoU number already exists" ||
        message === "Invalid MoU status" ||
        message === "Invalid start date" ||
        message === "Invalid end date" ||
        message === "Invalid signed date" ||
        message === "Start date cannot be after end date" ||
        message === "Signed date cannot be before start date" ||
        message === "Signed date cannot be after end date" ||
        message === "Company is required" ||
        message === "MoU number is required" ||
        message === "Title is required" ||
        message === "Start date is required" ||
        message === "End date is required" ||
        message === "Signed date is required" ||
        message === "Collaboration type is required" 
    ){
        return res.status(400).json({
            success: false,
        });
    }
     console.error(fallbackMessage, error);
  return res.status(500).json({
    success: false,
    message: fallbackMessage,

});
}

export async function createMou(req, res) {
    try {
        const payload = {
            ...req.body,
            createdBy : getActorId(req),
            updatedBy : getActorId(req),
        };

        const mou = await mouService.createMou(payload);

        return res.status(201).json({
            success: true,
            message: "MoU created successfully",
            data: mou,
        });
    } catch (error) {
        return handleServiceError(res, error, "Falied to create MoU");
    }
}
export async function getMouList(req, res) {
    try {
        const result = await mouService.getMouList({
            page: req.query.page,
            limit: req.query.limit,
            search: req.query.search,
            companyId: req.query.companyId,
            status: req.query.status,
            collaborationType: req.query.collaborationType,
            isActive: req.query.isActive,
            startDateFrom: req.query.startDateFrom,
            startDateTo: req.query.startDateTo,
            endDateFrom: req.query.endDateFrom,
            endDateTo: req.query.endDateTo,
            signedDateFrom: req.query.signedDateFrom,
            signedDateTo: req.query.signedDateTo,
            sortBy: req.query.sortBy,
            sortOrder: req.query.sortOrder,
        });


        return res.status(200).json({
            success: true,
            data: result.data,
            pagination: result.pagination,
        });
    } catch (error) {
        return handleServiceError(res, error, "Failed to load MoU list");
    }
}

export async function getMouById(req, res) {
    try{
        const mou = await mouService.getMouById(req.params.id);

        return res.status(200).json({
            success: true,
            data: mou,
        });
    } catch (error) {
        return handleService(res, error, "Failed to load MoU by number");

    }
}

export async function getMouBycompany(req, res) {
    try{
        const result = await mouService.getMouByCompany(req.params.companyId);

        return res.status(200).json({
            success: true,
            data: result,
        });
    }catch(error) {
        return handleServiceError(res, error, "Failed to load company MoUs");
    }
}

export async function updateMou(req, res) {
    try {
        const payload = {
            ...req.body,
            updatedby: getActorId(req),
        };

        const mou = await mouService.updateMou(req.params.id, payload);
        return res.status(200).json({
            success: true,
            message: "MoU updated successfully",
            data: mou,
        });
    } catch (error) {
        return handleServiceError(res, error, "Failed to update MoU");
    }
}

export async function changeMouStatus(req, res) {
    try {
        const mou = await mouService.changeStatus(
            req.params.id,
            req.body.status,
        );

        return res.status(200).json({
            success: true,
            message: "MoU sttaus updated successfully",
            data: mou,
        });
    } catch (error) {
        return handleServiceError(res, error, "Failed to update MoU status");
    }
}

export async function activate(req, res) {
    try {
        const mou = await mouService.activeMou(req.parans.id);

        return res.status(200).json({
            success: true,
            message: "MoU activated successfully",
            data: mou,
        });
    } catch (error) {
        return handleService(res, error, "Failed to activate MoU");
    }
}

export async function deactivateMou(req, res) {
    try {
        const mou = await mouService.deactivateMou(req.parans.id);

        return res.status(200).json({
            success: true,
            message: "MoU deactivated successfully",
        });
    } catch (error) {
        return handleServicceError(res, error, "Failed to deactivate MoU");
    }
}

export async function softDeleteMou(req, res) {
    try {
        const mou =  await mouService.softDelete(req.params.id);

        return res.status(200).json({
            success: true,
            message: "MoU deleted successfully",
            data: mou,
        });
    } catch (error) {
        return handleServiceError(res, error, "Failed to delete MoU");
    }
}

export async function permanentlyDeleteMou(req, res){
    try {
        await mouService.permanentlyDeleteMou(req.params.id);

        return res.status(200).json({
            success: true,
            message: "MoU permanently deleted successfully",
        });
    } catch (error) {
        return handleServiceError(
            res,
            error,
            "Failed to permanently delete MoU",
        );
    }
}

export async function getMouStatistics(req, res) {
    try {
        const statistics = await mouService.getMouStatistics();

        return res.status(200).json({
            success: true,
            data: statistics,
        });
    } catch (error) {
        return handleServiceError(res, error, "Failed to load MoU statistics");
    }
}







