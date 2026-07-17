import company360Service from "../service/company360Services.js";

//create a new company 
export async function createCompany(req, res){
    try {
        const createdBy = req.user?.id || null;
        const company = await company360Service.createCompany(req.body, createdBy);
        return res.status(201).json({ success : true, data : company });
    } catch (error){
        console.error("create company failed", error);
        return res.status(500).json({
            success : false,
            message: error.message || "failed to create company",
        });
    }
}

//get all companies 
export async function getCompanies(req, res){
    try {
        const {
            page,
            limit,
            search,
            industry,
            status,
            partnershipStage,
            city,
            isActive,
            includeDeleted,
            sortBy,
            sortOrder,
        } = req.query;
        
        const result = await company360Service.getCompanies({
            page : page ? Number(page) : undefined,
            limit: limit ? Number(limit) : undefined,
            search,
            industry,
            status,
            partnershipLevel,
            city,
            isActive: isActive !== undefined ? isActive === "true" : undefined,
            includeDeleted: includeDeleted === "true",
            sortBy,
            sortOrder,
        });
        return res.status(200).json({ success : true, data : result});
    } catch (error) {
        console.error("get companies failed", error);
        return res.status(500).json({
            success: false,
            message: "failed to fetch companies",
        });
    }
}

// get companies by id
export async function getCompanyById(req, res){
    try {
        const { id } = req.params;
        const { includeDeleted } = req.query;

        const company = await company360Service.getCompanyById(id,{
            includeDeleted: includeDeleted === "true",
        });

        if(!company){
            return res.status(404).json({
                success: false,
                message: "company not found",
            });
        }
        return res.status(200).json({ success : true, data : company});
    } catch(error) {
        console.error("Get company By ID failed", error);
        return res.status(500).json({
            success: false,
            message: "failed to fetch company",
        });
    }
}

// get company details
export async function getCompanyDetails(req, res){
    try {
        const { id } = req.params;
        const company = await company360Service.getCompanyDetails(id);
        if(!company){
            return res.status(404).json({
                success: false,
                message: "company not found",
            });
        }
        return res.status(200).json({ success : true, data: company});
    } catch (error) {
        console.error("get company details failed", error);
        return res.status(500).json({
            success: false,
            message: error.message || "failed to fetch company details",
        });
    }
}

// get company stats
export async function getCompanyStatistics(req, res){
    try {
        const { id } = req.params;
        const stats = await company360Service.getCompanyStatistics(id);
        return res.status(200).json({ success: true, data: stats});
    } catch (error) { 
        console.error("get company satistics failed", error);
        return res.status(500).json({
            success: false,
            message: error.message || "failed to fetch company statistics",
        });
    }
}

// update any company
export async function updateCompany(req, res){
    try {
        const { id } = req.params;
        const updatedBy = req.user?.id || null;
        const company = await company360Service.updateCompany(id, req.body, updatedBy);
        return res.status(200).json({ success: true, data: company});
    } catch (error) {
        console.error("update company failed", error);
        const status = error.message === "company not found" ? 404 : 500;
        return res.status(status).json({
            success: false,
            message: error.message || "failed to update company",
        });
    }
}

// soft delete a company { isactive / disbaled }
export async function softDeleteCompany(req, res){
    try {
        const { id } = req.params;
        const updatedBy = req.user?.id || null;
        const company = await company360Service.softDeleteCompany(id, updatedBy);
        return res.status(200).json({ success : true, data: company});
    } catch (error) {
        console.error("soft delete company failed", error);
        const status = error.message === "company not found" ? 404 : 500;
        return res.status(status).json({
            success: false,
            message: error.message || " failed to soft delete the company",
        });
    }
}

