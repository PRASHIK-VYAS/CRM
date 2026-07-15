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
