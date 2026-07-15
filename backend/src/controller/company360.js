import company360Service from "../service/company360Services.js";

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