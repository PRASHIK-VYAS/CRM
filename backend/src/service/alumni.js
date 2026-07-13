import crypto from "node:crypto";
import prisma from "../config/prisma.js";

const writableFields = [
  "alumniCode",
  "fullName",
  "email",
  "phone",
  "department",
  "batchYear",
  "currentDesignation",
  "seniorityLevel",
  "companyId",
  "linkedin",
  "location",
  "skills",
  "willingnessToHelp",
  "helpTypes",
  "influenceScore",
  "relationshipScore",
  "lastContactedAt",
  "status",
  "notes",
];

const seniorityLevelMap = {
  "Entry Level": "Entry_Level",
  "Mid Level": "Mid_Level",
  "Senior Level": "Senior_Level",
  Lead: "Lead",
  Manager: "Manager",
  Director: "Director",
  Founder: "Founder",
  HR: "HR",
  Other: "Other",
};

const seniorityLevelLabels = Object.fromEntries(
  Object.entries(seniorityLevelMap).map(
    ([label, value]) => [value, label],
  ),
);

const statusMap = {
  Active: "Active",
  Inactive: "Inactive",
  "Not Reachable": "Not_Reachable",
};

const statusLabels = Object.fromEntries(
  Object.entries(statusMap).map(
    ([label, value]) => [value, label],
  ),
);

function normalizeEnum(value, mapping) {
  if (!value) {
    return value;
  }

  return mapping[value] ?? value;
}

function normalizeStringArray(value, fieldName) {
  if (value === undefined) {
    return undefined;
  }

  if (value === null) {
    return [];
  }

  if (!Array.isArray(value)) {
    throw new Error(`${fieldName} must be an array`);
  }

  return [
    ...new Set(
      value
        .filter((item) => typeof item === "string")
        .map((item) => item.trim())
        .filter(Boolean),
    ),
  ];
}

function pickAlumniData(data) {
  return Object.fromEntries(
    writableFields
      .filter((field) => data[field] !== undefined)
      .map((field) => [field, data[field]]),
  );
}

function normalizeAlumniData(data) {
  const alumni = pickAlumniData(data);

  if (alumni.alumniCode) {
    alumni.alumniCode = alumni.alumniCode
      .trim()
      .toUpperCase();
  }

  if (alumni.fullName) {
    alumni.fullName = alumni.fullName.trim();
  }

  if (alumni.email) {
    alumni.email = alumni.email
      .trim()
      .toLowerCase();
  }

  if (alumni.phone) {
    alumni.phone = alumni.phone.trim();
  }

  if (alumni.department) {
    alumni.department = alumni.department.trim();
  }

  if (alumni.currentDesignation) {
    alumni.currentDesignation =
      alumni.currentDesignation.trim();
  }

  if (alumni.linkedin) {
    alumni.linkedin = alumni.linkedin.trim();
  }

  if (alumni.location) {
    alumni.location = alumni.location.trim();
  }

  if (alumni.seniorityLevel) {
    alumni.seniorityLevel = normalizeEnum(
      alumni.seniorityLevel,
      seniorityLevelMap,
    );
  }

  if (alumni.status) {
    alumni.status = normalizeEnum(
      alumni.status,
      statusMap,
    );
  }

  if (alumni.batchYear !== undefined) {
    alumni.batchYear = Number(alumni.batchYear);

    const currentYear = new Date().getFullYear();

    if (
      !Number.isInteger(alumni.batchYear) ||
      alumni.batchYear < 1900 ||
      alumni.batchYear > currentYear
    ) {
      throw new Error("Invalid alumni batch year");
    }
  }

  for (const field of [
    "influenceScore",
    "relationshipScore",
  ]) {
    if (alumni[field] !== undefined) {
      alumni[field] = Number(alumni[field]);

      if (
        !Number.isFinite(alumni[field]) ||
        alumni[field] < 0 ||
        alumni[field] > 100
      ) {
        throw new Error(
          `${field} must be between 0 and 100`,
        );
      }
    }
  }

  if (alumni.skills !== undefined) {
    alumni.skills = normalizeStringArray(
      alumni.skills,
      "Skills",
    );
  }

  if (alumni.helpTypes !== undefined) {
    alumni.helpTypes = normalizeStringArray(
      alumni.helpTypes,
      "Help types",
    );
  }

  if (alumni.lastContactedAt) {
    alumni.lastContactedAt = new Date(
      alumni.lastContactedAt,
    );
  }

  return alumni;
}

function serializeAlumni(alumni) {
  if (!alumni) {
    return alumni;
  }

  return {
    ...alumni,
    seniorityLevel:
      seniorityLevelLabels[alumni.seniorityLevel] ??
      alumni.seniorityLevel,
    status:
      statusLabels[alumni.status] ?? alumni.status,
  };
}

class AlumniService {
  async createAlumni(data) {
    const alumniData = normalizeAlumniData(data);

    if (!alumniData.alumniCode) {
      throw new Error("Alumni code is required");
    }

    if (!alumniData.fullName) {
      throw new Error("Full name is required");
    }

    if (!alumniData.email) {
      throw new Error("Email is required");
    }

    if (!alumniData.department) {
      throw new Error("Department is required");
    }

    if (!alumniData.batchYear) {
      throw new Error("Batch year is required");
    }

    if (!alumniData.currentDesignation) {
      throw new Error(
        "Current designation is required",
      );
    }

    const [existingCode, existingEmail, company] =
      await Promise.all([
        prisma.alumni.findUnique({
          where: {
            alumniCode: alumniData.alumniCode,
          },
          select: { id: true },
        }),

        prisma.alumni.findUnique({
          where: {
            email: alumniData.email,
          },
          select: { id: true },
        }),

        alumniData.companyId
          ? prisma.company360.findFirst({
              where: {
                id: alumniData.companyId,
                deletedAt: null,
              },
              select: { id: true },
            })
          : null,
      ]);

    if (existingCode) {
      throw new Error("Alumni code already exists");
    }

    if (existingEmail) {
      throw new Error("Alumni email already exists");
    }

    if (alumniData.companyId && !company) {
      throw new Error("Company not found");
    }

    const now = new Date();

    const alumni = await prisma.alumni.create({
      data: {
        id: crypto.randomUUID(),
        skills: [],
        helpTypes: [],
        ...alumniData,
        createdAt: now,
        updatedAt: now,
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

    return serializeAlumni(alumni);
  }

  async getAlumniList({
    page = 1,
    limit = 20,
    search,
    department,
    batchYear,
    seniorityLevel,
    companyId,
    willingnessToHelp,
    status,
    minimumInfluenceScore,
    minimumRelationshipScore,
    skill,
    sortBy = "createdAt",
    sortOrder = "desc",
  } = {}) {
    const parsedPage = Math.max(Number(page) || 1, 1);
    const parsedLimit = Math.min(
      Math.max(Number(limit) || 20, 1),
      100,
    );

    const allowedSortFields = new Set([
      "alumniCode",
      "fullName",
      "email",
      "department",
      "batchYear",
      "currentDesignation",
      "seniorityLevel",
      "influenceScore",
      "relationshipScore",
      "lastContactedAt",
      "createdAt",
      "updatedAt",
    ]);

    const orderField = allowedSortFields.has(sortBy)
      ? sortBy
      : "createdAt";

    const conditions = [];

    if (department) {
      conditions.push({
        department: {
          equals: department.trim(),
          mode: "insensitive",
        },
      });
    }

    if (batchYear) {
      conditions.push({
        batchYear: Number(batchYear),
      });
    }

    if (seniorityLevel) {
      conditions.push({
        seniorityLevel: normalizeEnum(
          seniorityLevel,
          seniorityLevelMap,
        ),
      });
    }

    if (companyId) {
      conditions.push({ companyId });
    }

    if (willingnessToHelp) {
      conditions.push({ willingnessToHelp });
    }

    if (status) {
      conditions.push({
        status: normalizeEnum(status, statusMap),
      });
    }

    if (minimumInfluenceScore !== undefined) {
      conditions.push({
        influenceScore: {
          gte: Number(minimumInfluenceScore),
        },
      });
    }

    if (minimumRelationshipScore !== undefined) {
      conditions.push({
        relationshipScore: {
          gte: Number(minimumRelationshipScore),
        },
      });
    }

    if (skill) {
      conditions.push({
        skills: {
          array_contains: [skill.trim()],
        },
      });
    }

    if (search?.trim()) {
      const searchValue = search.trim();

      conditions.push({
        OR: [
          {
            alumniCode: {
              contains: searchValue,
              mode: "insensitive",
            },
          },
          {
            fullName: {
              contains: searchValue,
              mode: "insensitive",
            },
          },
          {
            email: {
              contains: searchValue,
              mode: "insensitive",
            },
          },
          {
            phone: {
              contains: searchValue,
              mode: "insensitive",
            },
          },
          {
            department: {
              contains: searchValue,
              mode: "insensitive",
            },
          },
          {
            currentDesignation: {
              contains: searchValue,
              mode: "insensitive",
            },
          },
          {
            location: {
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

    const where =
      conditions.length > 0 ? { AND: conditions } : {};

    const [alumni, total] = await prisma.$transaction([
      prisma.alumni.findMany({
        where,
        skip: (parsedPage - 1) * parsedLimit,
        take: parsedLimit,
        orderBy: {
          [orderField]:
            sortOrder === "asc" ? "asc" : "desc",
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

      prisma.alumni.count({ where }),
    ]);

    return {
      data: alumni.map(serializeAlumni),
      pagination: {
        page: parsedPage,
        limit: parsedLimit,
        total,
        totalPages: Math.ceil(total / parsedLimit),
      },
    };
  }

  async getAlumniById(id) {
    const alumni = await prisma.alumni.findUnique({
      where: { id },
      include: {
        company: {
          select: {
            id: true,
            companyCode: true,
            companyName: true,
            industry: true,
            website: true,
            city: true,
            country: true,
            status: true,
            relationshipStage: true,
          },
        },
      },
    });

    if (!alumni) {
      throw new Error("Alumni not found");
    }

    return serializeAlumni(alumni);
  }

  async getAlumniByCode(alumniCode) {
    if (!alumniCode) {
      throw new Error("Alumni code is required");
    }

    const alumni = await prisma.alumni.findUnique({
      where: {
        alumniCode: alumniCode.trim().toUpperCase(),
      },
      include: {
        company: {
          select: {
            id: true,
            companyCode: true,
            companyName: true,
          },
        },
      },
    });

    if (!alumni) {
      throw new Error("Alumni not found");
    }

    return serializeAlumni(alumni);
  }

  async getAlumniByEmail(email) {
    if (!email) {
      throw new Error("Email is required");
    }

    const alumni = await prisma.alumni.findUnique({
      where: {
        email: email.trim().toLowerCase(),
      },
      include: {
        company: {
          select: {
            id: true,
            companyCode: true,
            companyName: true,
          },
        },
      },
    });

    if (!alumni) {
      throw new Error("Alumni not found");
    }

    return serializeAlumni(alumni);
  }

  async getAlumniByCompany(companyId) {
    const company = await prisma.company360.findFirst({
      where: {
        id: companyId,
        deletedAt: null,
      },
      select: {
        id: true,
        companyCode: true,
        companyName: true,
      },
    });

    if (!company) {
      throw new Error("Company not found");
    }

    const alumni = await prisma.alumni.findMany({
      where: { companyId },
      orderBy: [
        {
          influenceScore: "desc",
        },
        {
          relationshipScore: "desc",
        },
        {
          fullName: "asc",
        },
      ],
    });

    return {
      company,
      alumni: alumni.map(serializeAlumni),
    };
  }

  async updateAlumni(id, data) {
    const existingAlumni =
      await prisma.alumni.findUnique({
        where: { id },
      });

    if (!existingAlumni) {
      throw new Error("Alumni not found");
    }

    const alumniData = normalizeAlumniData(data);

    if (
      alumniData.alumniCode &&
      alumniData.alumniCode !==
        existingAlumni.alumniCode
    ) {
      const duplicate = await prisma.alumni.findUnique({
        where: {
          alumniCode: alumniData.alumniCode,
        },
        select: { id: true },
      });

      if (duplicate) {
        throw new Error(
          "Alumni code already exists",
        );
      }
    }

    if (
      alumniData.email &&
      alumniData.email !== existingAlumni.email
    ) {
      const duplicate = await prisma.alumni.findUnique({
        where: {
          email: alumniData.email,
        },
        select: { id: true },
      });

      if (duplicate) {
        throw new Error(
          "Alumni email already exists",
        );
      }
    }

    if (alumniData.companyId) {
      const company =
        await prisma.company360.findFirst({
          where: {
            id: alumniData.companyId,
            deletedAt: null,
          },
          select: { id: true },
        });

      if (!company) {
        throw new Error("Company not found");
      }
    }

    const alumni = await prisma.alumni.update({
      where: { id },
      data: {
        ...alumniData,
        updatedAt: new Date(),
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

    return serializeAlumni(alumni);
  }

  async assignCompany(id, companyId) {
    const [alumni, company] = await Promise.all([
      prisma.alumni.findUnique({
        where: { id },
        select: { id: true },
      }),

      prisma.company360.findFirst({
        where: {
          id: companyId,
          deletedAt: null,
        },
        select: {
          id: true,
          companyCode: true,
          companyName: true,
        },
      }),
    ]);

    if (!alumni) {
      throw new Error("Alumni not found");
    }

    if (!company) {
      throw new Error("Company not found");
    }

    const updatedAlumni =
      await prisma.alumni.update({
        where: { id },
        data: {
          companyId,
          updatedAt: new Date(),
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

    return serializeAlumni(updatedAlumni);
  }

  async removeCompany(id) {
    const alumni = await prisma.alumni.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!alumni) {
      throw new Error("Alumni not found");
    }

    const updatedAlumni =
      await prisma.alumni.update({
        where: { id },
        data: {
          companyId: null,
          updatedAt: new Date(),
        },
      });

    return serializeAlumni(updatedAlumni);
  }

  async updateScores(
    id,
    {
      influenceScore,
      relationshipScore,
    },
  ) {
    const alumni = await prisma.alumni.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!alumni) {
      throw new Error("Alumni not found");
    }

    const scoreData = normalizeAlumniData({
      influenceScore,
      relationshipScore,
    });

    const updatedAlumni =
      await prisma.alumni.update({
        where: { id },
        data: {
          ...scoreData,
          updatedAt: new Date(),
        },
      });

    return serializeAlumni(updatedAlumni);
  }

  async recordContact(
    id,
    {
      notes,
      relationshipScore,
    } = {},
  ) {
    const alumni = await prisma.alumni.findUnique({
      where: { id },
    });

    if (!alumni) {
      throw new Error("Alumni not found");
    }

    const data = {
      lastContactedAt: new Date(),
      updatedAt: new Date(),
    };

    if (notes !== undefined) {
      data.notes = notes?.trim() || null;
    }

    if (relationshipScore !== undefined) {
      const score = Number(relationshipScore);

      if (
        !Number.isFinite(score) ||
        score < 0 ||
        score > 100
      ) {
        throw new Error(
          "Relationship score must be between 0 and 100",
        );
      }

      data.relationshipScore = score;
    }

    const updatedAlumni =
      await prisma.alumni.update({
        where: { id },
        data,
      });

    return serializeAlumni(updatedAlumni);
  }

  async addSkills(id, skills) {
    const alumni = await prisma.alumni.findUnique({
      where: { id },
      select: {
        id: true,
        skills: true,
      },
    });

    if (!alumni) {
      throw new Error("Alumni not found");
    }

    const existingSkills = Array.isArray(
      alumni.skills,
    )
      ? alumni.skills
      : [];

    const newSkills = normalizeStringArray(
      skills,
      "Skills",
    );

    const updatedAlumni =
      await prisma.alumni.update({
        where: { id },
        data: {
          skills: [
            ...new Set([
              ...existingSkills,
              ...newSkills,
            ]),
          ],
          updatedAt: new Date(),
        },
      });

    return serializeAlumni(updatedAlumni);
  }

  async removeSkill(id, skill) {
    const alumni = await prisma.alumni.findUnique({
      where: { id },
      select: {
        id: true,
        skills: true,
      },
    });

    if (!alumni) {
      throw new Error("Alumni not found");
    }

    const existingSkills = Array.isArray(
      alumni.skills,
    )
      ? alumni.skills
      : [];

    const updatedAlumni =
      await prisma.alumni.update({
        where: { id },
        data: {
          skills: existingSkills.filter(
            (item) =>
              String(item).toLowerCase() !==
              skill.trim().toLowerCase(),
          ),
          updatedAt: new Date(),
        },
      });

    return serializeAlumni(updatedAlumni);
  }

  async updateHelpPreferences(
    id,
    {
      willingnessToHelp,
      helpTypes,
    },
  ) {
    const alumni = await prisma.alumni.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!alumni) {
      throw new Error("Alumni not found");
    }

    const allowedWillingness = [
      "Yes",
      "No",
      "Maybe",
    ];

    if (
      willingnessToHelp &&
      !allowedWillingness.includes(
        willingnessToHelp,
      )
    ) {
      throw new Error(
        "Invalid willingness-to-help value",
      );
    }

    const updatedAlumni =
      await prisma.alumni.update({
        where: { id },
        data: {
          ...(willingnessToHelp && {
            willingnessToHelp,
          }),
          ...(helpTypes !== undefined && {
            helpTypes: normalizeStringArray(
              helpTypes,
              "Help types",
            ),
          }),
          updatedAt: new Date(),
        },
      });

    return serializeAlumni(updatedAlumni);
  }

  async changeStatus(id, status) {
    const alumni = await prisma.alumni.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!alumni) {
      throw new Error("Alumni not found");
    }

    const normalizedStatus = normalizeEnum(
      status,
      statusMap,
    );

    if (
      !Object.values(statusMap).includes(
        normalizedStatus,
      )
    ) {
      throw new Error("Invalid alumni status");
    }

    const updatedAlumni =
      await prisma.alumni.update({
        where: { id },
        data: {
          status: normalizedStatus,
          updatedAt: new Date(),
        },
      });

    return serializeAlumni(updatedAlumni);
  }

  async deactivateAlumni(id) {
    return this.changeStatus(id, "Inactive");
  }

  async activateAlumni(id) {
    return this.changeStatus(id, "Active");
  }

  async permanentlyDeleteAlumni(id) {
    const alumni = await prisma.alumni.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!alumni) {
      throw new Error("Alumni not found");
    }

    return prisma.alumni.delete({
      where: { id },
    });
  }

  async getAlumniStatistics() {
    const [
      total,
      active,
      willingToHelp,
      connectedToCompanies,
      averageScores,
      byDepartment,
      byBatchYear,
      bySeniorityLevel,
      byStatus,
    ] = await Promise.all([
      prisma.alumni.count(),

      prisma.alumni.count({
        where: {
          status: "Active",
        },
      }),

      prisma.alumni.count({
        where: {
          willingnessToHelp: "Yes",
          status: "Active",
        },
      }),

      prisma.alumni.count({
        where: {
          companyId: {
            not: null,
          },
        },
      }),

      prisma.alumni.aggregate({
        _avg: {
          influenceScore: true,
          relationshipScore: true,
        },
      }),

      prisma.alumni.groupBy({
        by: ["department"],
        _count: {
          id: true,
        },
        orderBy: {
          _count: {
            id: "desc",
          },
        },
      }),

      prisma.alumni.groupBy({
        by: ["batchYear"],
        _count: {
          id: true,
        },
        orderBy: {
          batchYear: "desc",
        },
      }),

      prisma.alumni.groupBy({
        by: ["seniorityLevel"],
        _count: {
          id: true,
        },
      }),

      prisma.alumni.groupBy({
        by: ["status"],
        _count: {
          id: true,
        },
      }),
    ]);

    return {
      total,
      active,
      willingToHelp,
      connectedToCompanies,
      withoutCompany:
        total - connectedToCompanies,
      averageInfluenceScore: Number(
        averageScores._avg.influenceScore ?? 0,
      ).toFixed(2),
      averageRelationshipScore: Number(
        averageScores._avg.relationshipScore ?? 0,
      ).toFixed(2),
      byDepartment: byDepartment.map(
        ({ department, _count }) => ({
          department,
          count: _count.id,
        }),
      ),
      byBatchYear: byBatchYear.map(
        ({ batchYear, _count }) => ({
          batchYear,
          count: _count.id,
        }),
      ),
      bySeniorityLevel: bySeniorityLevel.map(
        ({ seniorityLevel, _count }) => ({
          seniorityLevel:
            seniorityLevelLabels[seniorityLevel] ??
            seniorityLevel,
          count: _count.id,
        }),
      ),
      byStatus: byStatus.map(
        ({ status, _count }) => ({
          status:
            statusLabels[status] ?? status,
          count: _count.id,
        }),
      ),
    };
  }
}

export default new AlumniService();