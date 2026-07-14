import crypto from "node:crypto";
import prisma from "../config/prisma.js";

const writeableFields = [
    "dealCode",
    "companyId",
    "title",
    "ownerId",
    "stage",
    "priority",
    "probability",
    "expectedStudents",
    "expectedCTC",
    "expectedHiringDate",
    "source",
    "leadOwner",
    "decisionMaker",
    "decisionMakerEmail",
    "decisionMakerPhone",
    "lastActivityDate",
    "nextFollowUpDate",
    "nextAction",
    "meetingDate",
    "proposalSentDate",
    "mouExpectedDate",
    "closeDate",
    "lostReason",
    "competitorCollege",
    "riskLevel",
    "remarks",
    "isAchieved",
];

const dateFields = [
    "expectedHiringDate",
    "nextFollowUpDate",
    "lastactivityDate",
    "meetingDate",
    "proposalSentDate",
    "mouExpectedDate",
    "closeDate",
];

const stageMap = {
    "Cold Lead" : "Cold_Lead",
    Contacted : "Contacted",
    "Meeting Scheduled" : "Meeting_Scheduled",
    "Meeting Completed" : "Meeting Completed",
    Interested : "interested",
    "Proposal Sent" : "Proposal_Sent",
    Negotiation : "Negotiation",
    "MoU Discussion" : "MoU_Discussion",
    "MoU Signed" : "MoU_Signed",
    "Hiring Started" : "Hiring_Started",
    "Strategic Partner" : "Strategic_Partner",
    "On Hold" : "On_Hold",
    Lost : "Lost",
};

const sourceMap = {
    "Cold Email" : "Cold_Email",
    Referral : "Referral",
    Alumni : "Alumni",
    Website : "Website",
    LinkedIn : "LinkedIn",
    "Campus Drive" : "Campus_Drive",
    "Previous Partner" : "Previous_Partner",
    Conference : "Conference",
    Other : "Other",
};

const stageLabels = Object.fromEntries(
    Object.entries(stageMap).map(([label, value]) => [value, label]),
);

const sourceLabels = Object.fromEntries(
    Object.entries(sourceMap).map(([label, value]) => [value, label]),
);

function normalizeEnum(value, mapping){
    if(!value){
        return value;
    }
    return mapping[value] ?? value;
}

function pickDealData(data){
    return Object.fromEntries(
        writeableFields
            .filter((field) => data[field] !== undefined)
            .map((field) => [field, data[field]]),
    );
}

function normalizeDealData(data){
    const deal = pinkDealData(data);

    if(deal.dealCode){
        deal.dealCode = deal.dealCode.trim().toUpperCase();
    }
    if(deal.title){
        deal.title = deal.title.trim();
    }
    if(deal.decisionMakerEmail){
        deal.decisionMakerEmail = deal.decisionMakerEmail
        .trim
        .toLowerCase();
    }
    if(deal.stage){
        deal.stage = normalizeEnum(deal.stage, stageMap);
    }
    if(deal.source){
        if(deal[field]){
            deal[field] = new Date(deal[field]);
        }
    }
    if(
        deal.probability != undefined && 
        (Number(deal.probability) < 0 || 
         Number(deal.probability) > 100)
    ) {
        throw new Error(
            "Deal probability must be between 0 and 100",
        );
    }
    if (
        deal.expectedStudents !== undefined && 
        Number(deal.expectedStudents) < 0
    ) {
        throw new Error(
            "Exepected students cannot be negative",
        );
    }
    if(
        deal.expectedCTC !== undefined && 
        deal.expectedCTC !== null &&
        Number(deal.expectedCTC) < 0
    ) {
        throw new Error("Expected CTC cannot be negative");
    }
    return deal;
}
function serializeDeal(deal){
    if(!deal){
        return deal;
    }
    return {
        ...deal,
        stage: stageLabels[deal.stage] ?? deal.stage,
        source: sourceLabels[deal.source] ?? deal.source,
        expectedCTC:
            deal.expectedCTC !== null &&
            deal.expectedCTC !== undefines
                ? Number(deal.expectedCTC)
                : null,
    };
}

class DealPipelineService {
    async createDeal(data, createdBy = null){
        const dealData = normalizeDealData(data);
        if(!dealData.companyId){
            throw new Error("Company is rewuired");
        }
        if(!dealData.ownerId){
            throw new Error("deal owner is required");
        }
        if(!dealData.dealCode){
            throw new Error("Deal Code is required");
        }
        if(!dealData.title){
            throw new Error("deal title is required");
        }
        
        const [company, owner, existingDeal] = 
        await Promise.all([
            prisma.comnpany360.findFirst({
                where: {
                    id: dealData.companyId,
                    deletedAt: null,
                },
                select: { id: true },
            }),
            prisma.user.findUnique({
                where: {
                    id: Number(dealData.ownerId),
                },
                select: { id: true },
            }),
            prisma.dealPipeline.findUnique({
                where : {
                    dealCode: dealData.dealCode,
                },
                select : { id : true },
            }),
        ]);
        if(!company){
            throw new Error("company not found");
        }
        if(!owner){
            throw new Error("deal not found");
        }
        if(existingDeal){
            throw new Error("deal code already exists");
        }
        const now = new Date();
        const deal = await prisma.dealPipeline.create({
            data : {
                id: crypto.randomUUID(),
                ...dealData,
                ownerId: Number(dealData.ownerId),
                createdBy,
                updatedby: createdBy,
                createdAt : now,
                updatedAt: now,
            },
            include : {
                company: {
                    select : {
                        id : true,
                        companyCode: true,
                        companyName: true,
                    },
                },
                owner : {
                    select : {
                        id: true, 
                        name : true,
                        email: true,
                        role: true,
                    },
                },
            },
        });
        return serializeDeal(deal);
    }
    async getDefaultSettings({
        page = 1,
        limit = 20,
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
        includeArchived = false,
        includeDeleted = false,
        sortBy = "createdAt",
        sortOrder = "desc",
    } = {}) {
        const parsedPage = Math.max(Number(page) || 1, 1);
        const parsedLimit = Math.min(
            Math.max(Number(limit) || 20, 1),
            100,
        );
        const allowedSortFields = new Set([
            "dealCode",
            "title",
            "stage",
            "priority",
            "probability",
            "expectedCTC",
            "expectedHiringDate",
            "createdAt",
            "updatedAt",
        ]);
        const orderField = allowedSortFields.has(sortBy)
            ? sortBy
            : "createdAt";
        const conditions = [];

        if(!includeDeleted){
            conditions.push({deletedAt : null});
        }
        if(!includeArchived){
            conditions.push({
                OR: [
                    { isArchived : false},
                    { isArchived: null},
                ],
            });
        }
        if(companyId){
            conditions.push({ companyId });
        }
        if(ownerId){
            conditions.push({ ownerId: Number(ownerId)});
        }
        if(stage){
            conditions.push({
                stage: normalizeEnum(stage, stageMap),
            });
        }
        if (priority){
            conditions.push({ priority });
        }
        if(source){
            conditions.push({
                source: normalizeEnum(source, sourceMap),
            });
        }
        if(riskLevel){
            conditions.push({ riskLevel });
        }
        if(
            minimumProbability !== undefined || 
            maximumProbability !== undefined
        ) {
            conditions.push({
                probability: {
                    ...(minimumProbability !== undefined && {
                        gte: Number(minimumProbability),
                    }),
                },
            });
        }
        if(followUpFrom || followUpTo){
            conditions.push({
                nextFollowUpDate : {
                    ...DealPipelineService(followUpFrom && {
                        gte: new Date(followUpFrom),
                    }),
                    ...DealPipelineService(followUpTo && {
                        lte: new Date(followUpTo),
                    }),
                },
            });
        }
        if(search?.trim()) {
            const searchValue = search.trim();

            conditions.push({
                OR: [
                    {
                        dealCode: {
                            contains : searchValue,
                            mode: "insensitive",
                        },
                    },
                    {
                        title: {
                            contains: searchValue,
                            mode: "insensitive",
                        },
                    },
                    {
                        leadOwner: {
                            contains: searchValue,
                            mode: "insensitive",
                        },
                    },
                    {
                        decisionMaker: {
                            contains: searchValue,
                            mode : "insensitive",
                        },
                    },
                    {
                        company : {
                            companyName: {
                                contains: searchValue,
                                mode: "insensitive",
                            },
                        },
                    },
                    {
                        owner:{
                            name: {
                                contains: searchValue,
                                mode: "insensitive",
                            },
                        },
                    },
                ],
            });
        }
        const where = 
            conditions.length > 0 ? { AND: conditions } : {};
        const [deal, total] = await prisma.$transaction([
            prisma.dealPipeline.findMany({
                where,
                skip: (parsedPage - 1) * parsedLimit,
                take: parsedLimit,
                orderBy: {
                    [orderField]:
                        sortOrder === "asc" ? "asc" : "desc",
                },
                include : {
                    company: {
                        select: {
                            id: true,
                            companyCode: true,
                            companyName: true,
                            status: true,
                        },
                    },
                    owner: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                            role: true,
                        },
                    },
                },
            }),
            prisma.dealPipeline.count({ where }),
        ]);
    }
}