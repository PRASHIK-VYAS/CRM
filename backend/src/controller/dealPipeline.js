import dealPipelineService from "../service/DealPipeline.js";

// create a new deal
export async function createDeal(req, res){
    try {
        const createdBy = req.user?.id || null;
        const deal = await dealPipelineService.createDeal(req.body, createdBy);
        return res.status(201).json({ success : true, data : deal });
    } catch (error) {
        console.error("create deal failed", error);
        return res.status(500).json({
            success: false,
            message: error.message || "failed to create deal",
        });
    }
}

// get all deals with filters
export async function getDeals(req, res){
    try {
        const {
            page,
            limit, 
            search,
            companyId,
            ownerId,
            stage,
            priority,
            source,
            riskLevel,
            minimumProbability,
            maximumProbability,
            followUpFrom,
            followUpTo,
            includeArchived,
            includeDeleted,
            sortBy,
            sortOrder,
        } = req.query;
        
        const result = await dealPipelineService.getDefaultSettings({
            page: page ? Number(page) : undefined,
            limit: limit ? Number(limit) : undefined,
            search,
            companyId,
            ownerId,
            stage,
            priority,
            source,
            riskLevel,
            minimumProbability: minimumProbability ? Number(minimumProbability) : undefined,
            maximumProbability: maximumProbability ? Number(maximumProbability) : undefined,
            followUpFrom,
            followUpTo,
            includeArchived: includeArchived === "true",
            includeDeleted: includeDeleted === "true",
            sortBy,
            sortOrder,
        });
        return res.status(200).json({ success: true, data: result});
    } catch (error) {
        console.error("get deals failed", error);
        return res.status(500).json({
            success: false,
            message: "failed to fetch deals",
        });
    }
}

// get deal by id
export async function getDealById(req, res){
    try{
        const { id } = req.params;
        const { includeDeleted } = req.query;

        const deal = await dealPipelineService.getDealById(id, {
            includeDeleted: includeDeleted === "true",
        });

        if(!deal) {
            return res.status(404).json({
                success : false,
                message: "deal not found",
            });
        }
        return res.status(200).json({ success : true, data: deal});
    } catch (error) {
        console.error("get deals by id failed", error);
        return res.status(500).json({
            success: false,
            message: "failed to fetch deal",
        });
    }
}

// get deals by company 
export async function getDealsByCompany(req, res){
    try {
        const { companyId } = req.params;
        const deals = await dealPipelineService.getDealByCompany(companyId);
        return res.status(200).json({ success : true, data : deals});
    } catch (error) {
        console.error("get deals by company failed ", error);
        const status = error.message === "company not found" ? 404 : 500;
        return res.status(status).json({
            success: false,
            message: error.message || "failed to fetch deals by company"
        });
    }
}

// get deals by owner 
export async function getDealsByOwner(req, res){
    try {
        const { ownerId } = req.params;
        const deals = await dealPipelineService.getDealByOwner(ownerId);
        return res.status(200).json({ success: true, data: deals });
    } catch (error) {
        console.error("get deals by owner failed", error);
        const status = error.message === "deal owner not found" ? 404 : 500;
        return res.status(status).json({
            success: false,
            message: error.message || "failed to fetch deals by owner",
        });
    }
}

// update a deal
export async function updateDeal(req, res){
    try {
        const { id } = req.params;
        const updatedBy = req.user?.id || null;
        const deal = await dealPipelineService.updateDeal(id, req.body, updatedBy);
        return res.status(200).json({ success: true, data: deal });
    } catch (error) {
        console.error("update deal failed", error);
        const status = error.message === "Deal not found" ? 404 : 500;
        return res.status(status).json({
            success: false,
            message: error.message || "failed to update deal",
        });
    }
}

// change deal stage
export async function changeDealStage(req, res){
    try {
        const { id } = req.params;
        const updatedBy = req.user?.id || null;
        const { stage, probability, nextAction, nextFollowUpDate, lostReason } = req.body;
        const deal = await dealPipelineService.changeDealStage(id, stage, {
            probability,
            nextAction,
            nextFollowUpDate,
            lostReason,
            updatedBy,
        });
        return res.status(200).json({ success : true, data: deal });
    } catch (error) {
        console.error("change deal stage failed", error);
        const status = error.message === "deal not found " ? 404 : 500;
        return res.status(status).json({
            success: false,
            message: error.message || "failed to change deal stage",
        });
    }
}

// reassign deal 
export async function reassignDeal(req, res){
    try {
        const { id } = req.params;
        const updatedBy = req.user?.id || null;
        const { ownerId } = req.body;
        const deal = await dealPipelineService.reassignDeal(id, ownerId, updatedBy);
        return res.status(200).json({ success: true, data: deal });
    } catch (error) {
        console.error("reassign deal failed", error);
        const status = error.message === "deal not found" | error.message === "nwe deal owner not found" ? 404 : 500;
        return res.status(status).json({
            success : false,
            message: error.message || "failed to reassign deal",
        });
    }
}

// archive deal 
export async function archiveDeal(req, res){
    try {
        const { id } = req.params;
        const updatedBy = req.user?.id || null;
        const deal = await dealPipelineService.archiveDeal(id, updatedBy);
        return res.status(200).json({ success: true, data: deal });
    } catch (error) {
        console.error("archive deal failed ", error);
        const status = error.message === "deal not found" ? 404 : 500;
        return res.status(status).json({
            success: false,
            message: error.message || "failed to archive deal",
        });
    }
}

// restore deal
export async function restoreDeal(req, res) {
    try {
        const { id } = req.params;
        const updatedBy = req.user?.id || null;
        const deal = await dealPipelineService.restoreDeal(id, updatedBy);
        return res.status(200).json({ success: true, data: deal });
    } catch (error) {
        console.error("restore deal failed", error);
        const status = error.message === "Deal not found" || error.message === "Deleted deal not found" ? 404 : 500;
        return res.status(status).json({
            success: false,
            message: error.message || "failed to restore deal",
        });
    }
}