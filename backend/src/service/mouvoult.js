import crypto from 'crypto';
import prisma from "../config/prisma.js";

const writableFields = [
    "companyid",
    "mouNumber",
    "title",
    "purpose",
    "startDate",
    "endDate",
    "signedDate",
    "status",
    "collaborationType",
    "signedByInstitute",
    "renewalReminderDays",
    "documentUrl",
    "remarks",
    "isActive",
    "createdBy",
    "updatedBy  "
];

const statusMap = {
    Draft: "DRAFT",
    Pending: "PENDING",
    Active: "ACTIVE",
    Expired: "EXPIRED",
    Terminated: "TERMINATED",
    Renewed: "RENEWED",
    DRAFT: "DRAFT",
    PENDING: "PENDING",
    ACTIVE: "ACTIVE",
    EXPIRED: "EXPIRED",
    TERMINATED: "TERMINATED",
    RENEWED: "RENEWED",
};

const statusLabels = Object.fromEntries(
    Object.entries({
        DRAFT: "Draft",
        PENDING: "Pending",
        ACTIVE: "Active",
        EXPIRED: "Expired",
        TERMINATED: "Terminated",
        RENEWED: "Renewed"
    }),
);

const collaborationTypeMap = {
  Placements: "PLACEMENTS",
  Internships: "INTERNSHIPS",
  Training: "TRAINING",
  Research: "RESEARCH",
  Consultancy: "CONSULTANCY",
  "Industry Visit": "INDUSTRY_VISIT",
  Workshop: "WORKSHOP",
  Multiple: "MULTIPLE",
  Other: "OTHER",
  PLACEMENTS: "PLACEMENTS",
  INTERNSHIPS: "INTERNSHIPS",
  TRAINING: "TRAINING",
  RESEARCH: "RESEARCH",
  CONSULTANCY: "CONSULTANCY",
  INDUSTRY_VISIT: "INDUSTRY_VISIT",
  WORKSHOP: "WORKSHOP",
  MULTIPLE: "MULTIPLE",
  OTHER: "OTHER",
};

const collaborationTypeLabels = Object.fromEntries(
  Object.entries({
    PLACEMENTS: "Placements",
    INTERNSHIPS: "Internships",
    TRAINING: "Training",
    RESEARCH: "Research",
    CONSULTANCY: "Consultancy",
    INDUSTRY_VISIT: "Industry Visit",
    WORKSHOP: "Workshop",
    MULTIPLE: "Multiple",
    OTHER: "Other",
  }),
);

function normalizeEnum(value , mapping) {
    if (value === undefined || value === null || value === "") {
        return value;
    }
 
   return mapping[String(value).trim()] ?? String(value).trim(); 
}

function normalizeDateOnly(value, fieldName) {
    if(value === undefined) {
        return undefined;
    }
    if (value === null || value === "") {
        return null;
    }
const date = new Date(value);

if (Number.isNaN(date.getTime())) {
    throw new Error(`Invalid ${fieldName}`);
}

return date;
}

function normalizeString(value) {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    const trimmed = String(value).trim();
    return trimmed.length > 0 ? trimmed : null;
}

function normalizeNumber(value , filedName, { min, max } = {}) {
    if (value === undefined) {
        return undefined;
    }

    if (value === null || value === "") {
        return null;
    }     

    const num = Number(value);

    if(!Number.isFinite(num) || !Number.isInteger(num)) {
        throw new Error('${fieldName} must be an integer');
    }

    if(min !== undefined && num < min) {
        throw new Error('${fieldName} must be at least ${min}');
    }
    if(max !== undefined && num > max) {
        throw new Error('${fieldName} must be at most ${max}');
    }

    return num;
} 

function pickMouDate(data) {
    return Object.fromEntries(
        writableFields
        .filter((field) => data[field] !== undefined)
        .map((field) => [field, data[field]])
    );
}

function normalizeMouData(data) {
    const mou = pickMouDate(data);

    if (mou.companyId !== undefined && mou.companyId !== null) {
        mou.companyId = String(mou.companyId).trim();
    }

    if (mou.mouNumber) {
        mou.mouNumber = String(mou.mouNumber).trim().toUpperCase();
    }
    if (mou.title) {
        mou.title = String(mou.title).trim();
    }
    if(mou.purpose !== undefined) {
        mou.purpose = normalizeString(mou.purpose);
    }
    if(mou.signedByCompany !== undefined) {
        mou.signedByCompany = normalizeString(mou.signedByCompany);
    }
    if(mou.signedByInstitute !== undefined) {
        mou.signedByInstitute = normalizeString(mou.signedByInstitute);
    }
    if (mou.documentUrl !== undefined) {
    mou.documentUrl = normalizeString(mou.documentUrl);
    }
    if (mou.remarks !== undefined) {
        mou.remarks = normalizeString(mou.remarks);
    }   
    if (mou.status !== undefined) {
    mou.status = normalizeEnum(mou.status, statusMap);
    }

    if(mou.collaborationType !== undefined) {
        mou.collaborationType = normalizeEnum(
            mou.collaborationType,
            collaborationTypeMap
        );
    }
    if (mou.startDate !== undefined) {
        mou.startDate = normalizeDateOnly(mou.startDate, "startDate");
    }
    if (mou.endDate !== undefined) {
        mou.endDate = normalizeDateOnly(mou.endDate, "endDate");
    }

    if (mou.signedDate !== undefined) {
        mou.signedDate = normalizeDateOnly(mou.signedDate, "signedDate");
    }   

    if(mou.renewalReminderDays !== undefined) {
        mou.renewalReminderDays = normalizeNumber(
            mou.renewalReminderDays,
            "renewalReminderDays",
            {min:0, max: 365},
        );
    }
    if (mou.isActive !== undefined) {
        mou.isActive = Boolean(mou.isActive);
    }

    return mou;
}
function serializeMou(mou) {
  if (!mou) {
    return mou;
  }

  return {
    ...mou,
    status: statusLabels[mou.status] ?? mou.status,
    collaborationType:
      collaborationTypeLabels[mou.collaborationType] ??
      mou.collaborationType,
  };
}

function validateMouData({
    startDate,
    endDate,
    signedDate,
}) {
    if (startDate && endDate && startDate > endDate) {
        throw new Error("StartDate cannot be after endDate");
    }
    if (signedDate && startDate && signedDate < startDate) {
        throw new Error("Signed Date cannot be before start Date");
    }
    if (signedDate && endDate && signedDate > endDate) {
        throw new Error("Signed Date cannot be after end Date");
    }
}

class MouService {
    async createMou(data) {
        const mouData = normalizeMouData(data);

        if(!mouData.companyId) {
            throw new Error("companyId is required");
        }
        if(!mouData.mouNumber) {
            throw new Error("mouNumber is required");
        }
        if(!mouData.title) {
            throw new Error("title is required");
        }
        if(!mouData.startDate) {
            throw new Error("startDate is required");
        }
        if(!mouData.endDate) {
            throw new Error("endDate is required");
        }
        if(!mouData.signedDate) {
            throw new Error("signedDate is required");
        }
        if(!mouData.collaborationType) {
            throw new Error("collaborationType is required");
        }

        validateMouDates(mouData);
        const [existingMou, company] = await Promise.all([
            prisna.mou.findUnique({
                where: {mouNumber: mouData.mouNumber},
                select: {id: true}
            }),
            prisna.company.findUnique({
                where: {
                   id: mouData.companyId,
                   deletedAt: null,
                },
                select: {id: true,companycode: true, companyname: true}, 
            }),
        ]);

        if(existingMou) {
            throw new Error("Mou number already exists");
        }
        if(!company) {
            throw new Error("Company not found");
        }
        const now = new Date();

        const mou = await prisma.mou.create({
            data: {
                id: crypto.randomUUID(),
                ...mouData,
                isActive: mouData.isActive ?? true,
                createdAt: now,
                updated: now,
            },
            include: {
                company: {
                    select: {
                        id: true,
                            companyCode: true,
                            companyName: true,
                            industry: true,
                            status: true,
                        },
                    },
                },
            });

            return serializeMou(mou);      
            }

            async getMouList({
                page = 1,
                limit = 20,
                search,
                companyId,
                status,
                collaborationType,
                isActive,
                startDateFrom,
                startDateTo,
                signedDateFrom,
                signedDateTo,
                sortBy = "createdAt" ,
                sortOrder = "desc",
            } = {}) {

                const parsedPage = Math.max(Number(page) || 1,1);
                const parsedLimit = Math.min(Math.max(Number(Limit) || 20,1), 100);

                const allowedSortFields = new Set([
                    "mouNumber",
                    "title",
                    "startDate",
                    "endDate",
                    "signedDate",
                    "status",
                    "collaborationType",
                    "renewalReminderDays",
                    "createdAt",
                    "updatedAt",
                ]);

                const orderField = allowedSortFields.has(sortBy)
                ? sortBy
                : "createdAt";

                const conditions = [
                    {
                        deletedAt: null,
                    },
                ];

                if (companyId) {
                    conditions.push({ companyId: String(companyId).trim()});
                }

                if (status) {
                    conditions.push({
                        status: normalizeEnum(status, statusMap),
                    });
                }
                if (collaborationType) {
                    conditions.push({
                        collaborationType: normalizeEnum(
                            collaborationType,
                            collaborationTypeMap,
                        ),
                    });
                }

                if (isActive !== undefined) {
                    conditions.push({
                        isActive:
                        isActive === true ||
                        isActive === "true" ||
                        isActive === 1 ||
                        isActive === "1",
                    });
                }
                if (startDateFrom || startDateTo) {
                    conditions.push({
                        startDate: {
                            ...(startDateFrom && {
                                gte: normalizeDateOnly(startDateFrom, "start date"),
                            }),
                            ...(startDateTo && {
                                lte: normalizeDateOnly(startDateTo, "start date"),
                            }),
                        },
                    });
                }

                if (enddateFrom || endDateTo) {
                    conditions.push({
                        endDate: {
                            ...(endDateFrom && {
                                gte: normalizeDateOnly(endDateFrom, "end date"),
                            }),
                            ...MouService(endDateTo && {
                                lte: normalizeDateOnly(endDateTo, "end Date"),
                            }),
                        },
                    });
                }
                if (signedDateFrom || signedDateTo) {
                    conditions.push({
                        signedDate: {
                            ...(signedDateFrom && {
                                gte: normalizeDateOnly(signedDateFrom, "signed date"),
                            }),
                            ...MouService(signedDateTo && {
                                lte: normalizeDateOnly(signedDateTo, "signed date"),
                            }),
                        },
                    });
                }
                
                if (search?.trim()) {
                    const searchValue = search.trim();

                    conditions.push({
                        OR: [
                            {
                                mouNumber: {
                                    contains: searchValue,
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
                              purpose: {
                                contains: searchValue,
                                mode: "insensitive",
                              }  ,
                            },
                            {
                                signedByCompany: {
                                    contains: searchValue,
                                    mode: "insensitive",
                                },
                            },
                            {
                                signedByInstitute: {
                                    contains: searchValue,
                                    mode: "insensitive",
                                },
                            },
                            {
                                company: {
                                    companyName: {
                                        contains: searchValue,
                                        mode: "insensitive",
                                    },
                                },
                            },
                        ],
                    });
                }
                const WHERE = 
                conditions.length > 0 ? {And: conditions } : {};

                const[mous, total] = await prisma.$transaction([
                    prisma.moU.findMany({
                        where,
                        skip: (parsedPage - 1) * parsedLimit,
                        take: parsedLimit,
                        orderBy: {
                            [orderField]: sortOrder === "asc" ? "asc" : "desc",
                        },
                        include: {
                            company: {
                                select: {
                                    id: true,
                                    companyCode: true,
                                    companyName: true,
                                    industry: true,
                                    status: true,
                                },
                            },
                        },
                    }),
                    prisma.moU.count({where}),
                ]);

                return {
                    data: mous.map(serializeMou),
                    pagination: {
                        page: parsedPage,
                        limit: parsedLimit,
                        total,
                        totalpages: Math.ceil(total / parsedLimit),
                    },
                };
              }

              async getMouById(id) {
                const mou = await prisma.moU.findFfirst({
                    where: {
                        id,
                        deletedAt: null,
                    },
                    include: {
                        comapnay:{
                            select: {
                                id: true,
                                companyCode: true,
                                companyname: true,
                                industry: true,
                                website:true,
                                city: true,
                                country: true,
                                status: true,
                                relationshipStage: true,
                            },
                        },
                    },
                });

                if (!now) {
                    throw new Error("MoU not found");
                }

                return serializeMou(mou);
              }

              async getMouByNumber(mouNumber) {
                if (!mouNumber) {
                    throw new Error("MoU number is required");
                }

                const mou = await prisma.moU.findFirst({
                    where: {
                        mouNumber: mouNumber.trim().toUpperCase(),
                        deletedAt: null,
                    },
                    include: {
                        company: {
                            select: {
                                id: true,
                                companyCode: true,
                                companyName: true,
                                industry: true,
                            },
                        },
                    },
                });

                if (!mou) {
                    throw new error("MoU not found");
                }

                return serializeMou(mou);
              }


              async getMouByCompany(companyId) {
                const company = await prisma.company360.findFirst({
                    where: {
                        id:companyId,
                        deletedAt: null,
                    },
                    select: {
                        id: true,
                        companyCode: true,
                        companyName: true,
                    },
                });

                if (!company) {
                    throw new Error("company not found");
                }

                const mous = await prisma.moU.findMany({
                    where: {
                        companyId,
                        deletedAt: null,
                    },
                    orderBy: [
                        {signedDate: "desc"},
                        {endDate: "desc"},
                        {title: "asc"},
                    ],
                });

                return{
                    company,
                    mous: mous.mao(serializeMou),
                };
              }

              async updateMou(id, data) {
                const existingMou = await prisma.moU.findFirst({
                    where: {
                        id,
                        deletedAt: null,
                    },
                });


                if (!existingMou) {
                    throw new Error("Mou not found");
                }


                const mouData = normalizeMouData(data);

                if (
                    mouData.mouNumber &&
                    mouData.mouNumber !== existingMou.mouNumber
                ) {
                    const duplicate = await prisma.moU.findUnique({
                        where: { mouNumber: mouData.mouNumber},
                        select: {id:true},
                    });

                    if (duplicate) {
                        throw new Error("MoU number already exists");
                    }
                }

                if (mouData.companyId) {
                    const company = await prisma.company360.findFirst({
                       where: {
                        id: mouData.companyId,
                        deletedAt: null,
                       } ,
                       select: { id: true},
                    });

                    if (!company) {
                        throw new Error("Company not found");
                    }
                }

                validateMouDates({
                    startDate:
                    mouData.startDate ?? existingMou.startDate,
                    endDate: mouData.endDate ?? existingMou.endDate,
                    signedDate:
                    mouData.signedDate ?? existingMou.signedDate,
                });

                const mou = await prisma.moU.update({
                    where: { id },
                    data:{
                        ...mouData,
                        updatedAt: new Date(),
                    },

                    include: {
                        company: {
                          select: {
                            id: true,
                            companyCode: true,
                            companyName: true,
                            industry: true,
                          } , 
                        },
                    },
                });

                return serializeMou(mou) ;
        
              }

              async changeStatus(id, status) {
                const existingMou = await prisma.moU.findFirst({
                    where: {
                        id,
                        deletedAt: null,
                    },
                    select: { id: true },
                });

                if(!existingMou) {
                    throw new Error("MoU not found");
                }

                const normalizedStatus = normalizeEnum(status, statusMap);

                if (!Object.values(statusMap).includes(normalizedStatus)) {
                    throw new Error("Invalid MoU status");
                }

                const mou = await prisma.moU.updates({
                    where: {id},
                    data: {
                        status: normalizedStatus,
                        updatedAt: new Date(),
                    },

                    include: {
                        company:{
                            select:{
                                id: true,
                                companyCode: true,
                                companyName: true,
                                industry: true,
                            },
                        },
                    },
                });
                return serializeMou(mou);
            }

                async activeMou(id) {
                    return prisma.mou.update({
                        where: {id},
                        data: {
                            isActive: true,
                            updatedAt: new Date(),
                        },
                    });
                }


                async deactivateMou(id) {
                    return prisma.moU.update({
                        where: {id},
                        data: {
                            isActive: false,
                            updatedAt: new Date(),
                        },
                    });
                }

                async softDeleteMou(id) {
                    const mou = await prisma.moU.findFirst({
                        where: {
                            id,
                            deletedAt: null,
                        },
                        select: {id: true},
                    });

                    if(!mou) {
                        throw new Error("MoU not found");
                    }

                    return prisma.moU.update({
                        where: {id},
                        data: {
                            isActive: false,
                            deletedAt: new Date(),
                            updatedAt: new Date(),
                        },
                    });
                }
                async permanentlyDeleteMou(id) {
                    const mou = await prisma.moU.findUnique({
                        where: {id},
                        select: {id: true},
                    });
                    if (!mou) {
                        throw new Error("MoU not found");
                    }

                    return prisma.moU.delete({
                        where: {id},
                    });
                }

                async getMouStatistics() {
                    const [
                        total,
                        active,
                        draft,
                        pending,
                        expired,
                        terminated,
                        renewed,
                        byCollaborationType,
                        byStatus,
                        expiringSoon,
                     ] = await Promise.all([
                            prisma.moU.count({
                                where: {deletedAt: null},
                            }),

                            prisma.moU.count({
                                where: {
                                    deletedAt: null,
                                    status: "ACTIVE",
                                    isActive: true,
                                },
                            }),

                            prisma.moU.count({
                                where: {
                                    deletedAt: null,
                                    status: "DRAFT",
                                },
                            }),

                            prisma.moU.count({
                                where: {
                                    deletedAt: null,
                                    status: "PENDING",
                                },
                            }),

                            prisma.moU.count({
                                where: {
                                    deletedAt: null,
                                    status: "Expired",
                                },
                            }),

                            prisma.moU.count({
                                whhere: {
                                    deletedAt: null,
                                    status: "TERMINATED",
                                },
                            }),

                            prisma.moU.groupBy({
                                by: ["collaborationType"],
                                where: {deletedAt: null},
                                _count: {
                                    id: true,
                                },
                            }),

                            prisma.moU.groupBy({
                                by: ["status"],
                                where: { deletedAt: null},
                                _count: {
                                    id: true,
                                },
                            }),

                            prisma.moU.count({
                                where: {
                                    deletedAt: null,
                                    endDate: {
                                        gte: new Date(),
                                        lte: new Date(Data.now() + 90 * 24 * 60 * 1000),
                                    },
                                },
                            }),
                        ]);
                        return {
                            total,
                            active,
                            draft,
                            pending,
                            expired,
                            terminated,
                            renewed,
                            expiringSoon,

                            byCollaborationType: byCollaborationType.map(
                                ({ collaborationType, _count }) => ({
                                    collaborationType:
                                    collaborationTypeLabels[collaborationType]  ?? 
                                    collaborationType,
                                    count: _count.id,
                                }),
                            ),

                            byStatus: byStatus.map(({ status, _count}) => ({
                                status: statusLabels[status] ?? status,
                                count: _count.id,
                            })),
                        };
                }
              }
              export default new MouService();
                

            
            


    





