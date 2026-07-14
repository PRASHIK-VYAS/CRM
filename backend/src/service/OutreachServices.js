// backend/src/service/Outreach.js

import crypto from "node:crypto";
import prisma from "../config/prisma.js";

const outreachTypes = [
  "EMAIL",
  "PHONE_CALL",
  "MEETING",
  "LINKEDIN",
  "VISIT",
  "EVENT",
  "PLACEMENT_DRIVE",
  "INTERNSHIP",
  "MOU_DISCUSSION",
  "FOLLOW_UP",
  "OTHER",
];

const outreachStatuses = [
  "PLANNED",
  "COMPLETED",
  "CANCELLED",
  "MISSED",
];

const outreachOutcomes = [
  "POSITIVE",
  "NEUTRAL",
  "NEGATIVE",
  "NO_RESPONSE",
  "FOLLOW_UP_REQUIRED",
];

const writableFields = [
  "companyId",
  "outreachType",
  "subject",
  "description",
  "interactionDate",
  "outcome",
  "status",
  "nextFollowUpDate",
  "notes",
  "isActive",
];

function normalizeEnum(value) {
  if (!value) {
    return value;
  }

  return value
    .trim()
    .toUpperCase()
    .replace(/[\s-]+/g, "_");
}

function pickOutreachData(data) {
  return Object.fromEntries(
    writableFields
      .filter((field) => data[field] !== undefined)
      .map((field) => [field, data[field]]),
  );
}

function normalizeOutreachData(data) {
  const outreach = pickOutreachData(data);

  if (outreach.subject) {
    outreach.subject = outreach.subject.trim();
  }

  if (outreach.description) {
    outreach.description =
      outreach.description.trim();
  }

  if (outreach.outreachType) {
    outreach.outreachType = normalizeEnum(
      outreach.outreachType,
    );

    if (
      !outreachTypes.includes(
        outreach.outreachType,
      )
    ) {
      throw new Error("Invalid outreach type");
    }
  }

  if (outreach.status) {
    outreach.status = normalizeEnum(
      outreach.status,
    );

    if (
      !outreachStatuses.includes(outreach.status)
    ) {
      throw new Error("Invalid outreach status");
    }
  }

  if (outreach.outcome) {
    outreach.outcome = normalizeEnum(
      outreach.outcome,
    );

    if (
      !outreachOutcomes.includes(outreach.outcome)
    ) {
      throw new Error("Invalid outreach outcome");
    }
  }

  for (const field of [
    "interactionDate",
    "nextFollowUpDate",
    "notes",
  ]) {
    if (outreach[field]) {
      outreach[field] = new Date(outreach[field]);

      if (Number.isNaN(outreach[field].getTime())) {
        throw new Error(`${field} is invalid`);
      }
    }
  }

  return outreach;
}

class OutreachService {
  async createOutreach(data, createdBy) {
    if (!createdBy) {
      throw new Error("Created-by user is required");
    }

    const outreachData =
      normalizeOutreachData(data);

    if (!outreachData.companyId) {
      throw new Error("Company is required");
    }

    if (!outreachData.outreachType) {
      throw new Error("Outreach type is required");
    }

    if (!outreachData.subject) {
      throw new Error("Subject is required");
    }

    const company =
      await prisma.company360.findFirst({
        where: {
          id: outreachData.companyId,
          deletedAt: null,
        },
        select: {
          id: true,
        },
      });

    if (!company) {
      throw new Error("Company not found");
    }

    const now = new Date();

    return prisma.outreach.create({
      data: {
        id: crypto.randomUUID(),
        ...outreachData,
        interactionDate:
          outreachData.interactionDate ?? now,
        outcome:
          outreachData.outcome ?? "NEUTRAL",
        status:
          outreachData.status ?? "PLANNED",
        isActive:
          outreachData.isActive ?? true,
        createdBy,
        updatedBy: createdBy,
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
  }

  async getOutreaches({
    page = 1,
    limit = 20,
    search,
    companyId,
    outreachType,
    status,
    outcome,
    createdBy,
    isActive,
    interactionFrom,
    interactionTo,
    followUpFrom,
    followUpTo,
    includeDeleted = false,
    sortBy = "interactionDate",
    sortOrder = "desc",
  } = {}) {
    const parsedPage = Math.max(
      Number(page) || 1,
      1,
    );

    const parsedLimit = Math.min(
      Math.max(Number(limit) || 20, 1),
      100,
    );

    const allowedSortFields = new Set([
      "subject",
      "outreachType",
      "interactionDate",
      "status",
      "outcome",
      "nextFollowUpDate",
      "createdAt",
      "updatedAt",
    ]);

    const orderField = allowedSortFields.has(sortBy)
      ? sortBy
      : "interactionDate";

    const conditions = [];

    if (!includeDeleted) {
      conditions.push({
        deletedAt: null,
      });
    }

    if (companyId) {
      conditions.push({ companyId });
    }

    if (outreachType) {
      conditions.push({
        outreachType:
          normalizeEnum(outreachType),
      });
    }

    if (status) {
      conditions.push({
        status: normalizeEnum(status),
      });
    }

    if (outcome) {
      conditions.push({
        outcome: normalizeEnum(outcome),
      });
    }

    if (createdBy) {
      conditions.push({ createdBy });
    }

    if (typeof isActive === "boolean") {
      conditions.push({ isActive });
    }

    if (interactionFrom || interactionTo) {
      conditions.push({
        interactionDate: {
          ...(interactionFrom && {
            gte: new Date(interactionFrom),
          }),
          ...(interactionTo && {
            lte: new Date(interactionTo),
          }),
        },
      });
    }

    if (followUpFrom || followUpTo) {
      conditions.push({
        nextFollowUpDate: {
          ...(followUpFrom && {
            gte: new Date(followUpFrom),
          }),
          ...(followUpTo && {
            lte: new Date(followUpTo),
          }),
        },
      });
    }

    if (search?.trim()) {
      const searchValue = search.trim();

      conditions.push({
        OR: [
          {
            subject: {
              contains: searchValue,
              mode: "insensitive",
            },
          },
          {
            description: {
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
          {
            company: {
              companyCode: {
                contains: searchValue,
                mode: "insensitive",
              },
            },
          },
        ],
      });
    }

    const where =
      conditions.length > 0
        ? { AND: conditions }
        : {};

    const [outreaches, total] =
      await prisma.$transaction([
        prisma.outreach.findMany({
          where,
          skip:
            (parsedPage - 1) * parsedLimit,
          take: parsedLimit,
          orderBy: {
            [orderField]:
              sortOrder === "asc"
                ? "asc"
                : "desc",
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

        prisma.outreach.count({ where }),
      ]);

    return {
      data: outreaches,
      pagination: {
        page: parsedPage,
        limit: parsedLimit,
        total,
        totalPages: Math.ceil(
          total / parsedLimit,
        ),
      },
    };
  }

  async getOutreachById(
    id,
    { includeDeleted = false } = {},
  ) {
    const outreach =
      await prisma.outreach.findFirst({
        where: {
          id,
          ...(includeDeleted
            ? {}
            : { deletedAt: null }),
        },
        include: {
          company: {
            select: {
              id: true,
              companyCode: true,
              companyName: true,
              industry: true,
              email: true,
              phone: true,
              relationshipStage: true,
            },
          },
        },
      });

    if (!outreach) {
      throw new Error("Outreach not found");
    }

    return outreach;
  }

  async getOutreachesByCompany(companyId) {
    const company =
      await prisma.company360.findFirst({
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

    const outreaches =
      await prisma.outreach.findMany({
        where: {
          companyId,
          deletedAt: null,
        },
        orderBy: {
          interactionDate: "desc",
        },
      });

    return {
      company,
      outreaches,
    };
  }

  async updateOutreach(
    id,
    data,
    updatedBy = null,
  ) {
    await this.getOutreachById(id);

    const outreachData =
      normalizeOutreachData(data);

    if (outreachData.companyId) {
      const company =
        await prisma.company360.findFirst({
          where: {
            id: outreachData.companyId,
            deletedAt: null,
          },
          select: {
            id: true,
          },
        });

      if (!company) {
        throw new Error("Company not found");
      }
    }

    return prisma.outreach.update({
      where: { id },
      data: {
        ...outreachData,
        updatedBy,
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
  }

  async completeOutreach(
    id,
    {
      outcome = "NEUTRAL",
      description,
      nextFollowUpDate,
      updatedBy = null,
    } = {},
  ) {
    await this.getOutreachById(id);

    const normalizedOutcome =
      normalizeEnum(outcome);

    if (
      !outreachOutcomes.includes(
        normalizedOutcome,
      )
    ) {
      throw new Error(
        "Invalid outreach outcome",
      );
    }

    return prisma.outreach.update({
      where: { id },
      data: {
        status: "COMPLETED",
        outcome: normalizedOutcome,
        ...(description !== undefined && {
          description:
            description?.trim() || null,
        }),
        ...(nextFollowUpDate !== undefined && {
          nextFollowUpDate:
            nextFollowUpDate
              ? new Date(nextFollowUpDate)
              : null,
        }),
        updatedBy,
        updatedAt: new Date(),
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
  }

  async cancelOutreach(
    id,
    {
      description,
      updatedBy = null,
    } = {},
  ) {
    await this.getOutreachById(id);

    return prisma.outreach.update({
      where: { id },
      data: {
        status: "CANCELLED",
        isActive: false,
        ...(description !== undefined && {
          description:
            description?.trim() || null,
        }),
        updatedBy,
        updatedAt: new Date(),
      },
    });
  }

  async markOutreachMissed(
    id,
    updatedBy = null,
  ) {
    await this.getOutreachById(id);

    return prisma.outreach.update({
      where: { id },
      data: {
        status: "MISSED",
        outcome: "NO_RESPONSE",
        updatedBy,
        updatedAt: new Date(),
      },
    });
  }

  async scheduleFollowUp(
    id,
    {
      nextFollowUpDate,
      nextSubject,
      createdBy,
    },
  ) {
    if (!nextFollowUpDate) {
      throw new Error(
        "Next follow-up date is required",
      );
    }

    if (!createdBy) {
      throw new Error(
        "Created-by user is required",
      );
    }

    const currentOutreach =
      await this.getOutreachById(id);

    const followUpDate =
      new Date(nextFollowUpDate);

    if (
      Number.isNaN(followUpDate.getTime())
    ) {
      throw new Error(
        "Invalid follow-up date",
      );
    }

    const now = new Date();

    return prisma.$transaction(
      async (transaction) => {
        await transaction.outreach.update({
          where: { id },
          data: {
            nextFollowUpDate: followUpDate,
            outcome:
              "FOLLOW_UP_REQUIRED",
            updatedBy: createdBy,
            updatedAt: now,
          },
        });

        return transaction.outreach.create({
          data: {
            id: crypto.randomUUID(),
            companyId:
              currentOutreach.companyId,
            outreachType: "FOLLOW_UP",
            subject:
              nextSubject?.trim() ||
              `Follow-up: ${currentOutreach.subject}`,
            description:
              currentOutreach.description,
            interactionDate: followUpDate,
            outcome: "NEUTRAL",
            status: "PLANNED",
            isActive: true,
            createdBy,
            updatedBy: createdBy,
            createdAt: now,
            updatedAt: now,
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
      },
    );
  }

  async getUpcomingFollowUps({
    days = 7,
    companyId,
    createdBy,
  } = {}) {
    const from = new Date();
    const to = new Date();

    to.setDate(
      to.getDate() +
        Math.max(Number(days) || 7, 1),
    );

    return prisma.outreach.findMany({
      where: {
        deletedAt: null,
        isActive: true,
        ...(companyId && { companyId }),
        ...(createdBy && { createdBy }),
        nextFollowUpDate: {
          gte: from,
          lte: to,
        },
      },
      orderBy: {
        nextFollowUpDate: "asc",
      },
      include: {
        company: {
          select: {
            id: true,
            companyCode: true,
            companyName: true,
            email: true,
            phone: true,
          },
        },
      },
    });
  }

  async getOverdueOutreaches() {
    return prisma.outreach.findMany({
      where: {
        deletedAt: null,
        isActive: true,
        status: "PLANNED",
        interactionDate: {
          lt: new Date(),
        },
      },
      orderBy: {
        interactionDate: "asc",
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
  }

  async changeOutreachStatus(
    id,
    status,
    updatedBy = null,
  ) {
    await this.getOutreachById(id);

    const normalizedStatus =
      normalizeEnum(status);

    if (
      !outreachStatuses.includes(
        normalizedStatus,
      )
    ) {
      throw new Error(
        "Invalid outreach status",
      );
    }

    return prisma.outreach.update({
      where: { id },
      data: {
        status: normalizedStatus,
        isActive: ![
          "CANCELLED",
          "MISSED",
        ].includes(normalizedStatus),
        updatedBy,
        updatedAt: new Date(),
      },
    });
  }

  async softDeleteOutreach(
    id,
    updatedBy = null,
  ) {
    await this.getOutreachById(id);

    return prisma.outreach.update({
      where: { id },
      data: {
        deletedAt: new Date(),
        isActive: false,
        updatedBy,
        updatedAt: new Date(),
      },
    });
  }

  async restoreOutreach(
    id,
    updatedBy = null,
  ) {
    const outreach =
      await prisma.outreach.findFirst({
        where: {
          id,
          deletedAt: {
            not: null,
          },
        },
      });

    if (!outreach) {
      throw new Error(
        "Deleted outreach not found",
      );
    }

    return prisma.outreach.update({
      where: { id },
      data: {
        deletedAt: null,
        isActive: true,
        updatedBy,
        updatedAt: new Date(),
      },
    });
  }

  async permanentlyDeleteOutreach(id) {
    const outreach =
      await prisma.outreach.findUnique({
        where: { id },
        select: { id: true },
      });

    if (!outreach) {
      throw new Error("Outreach not found");
    }

    return prisma.outreach.delete({
      where: { id },
    });
  }

  async getOutreachStatistics({
    companyId,
    from,
    to,
  } = {}) {
    const baseWhere = {
      deletedAt: null,
      ...(companyId && { companyId }),
      ...((from || to) && {
        interactionDate: {
          ...(from && {
            gte: new Date(from),
          }),
          ...(to && {
            lte: new Date(to),
          }),
        },
      }),
    };

    const [
      total,
      planned,
      completed,
      cancelled,
      missed,
      followUpsRequired,
      byType,
      byOutcome,
      byStatus,
    ] = await Promise.all([
      prisma.outreach.count({
        where: baseWhere,
      }),

      prisma.outreach.count({
        where: {
          ...baseWhere,
          status: "PLANNED",
        },
      }),

      prisma.outreach.count({
        where: {
          ...baseWhere,
          status: "COMPLETED",
        },
      }),

      prisma.outreach.count({
        where: {
          ...baseWhere,
          status: "CANCELLED",
        },
      }),

      prisma.outreach.count({
        where: {
          ...baseWhere,
          status: "MISSED",
        },
      }),

      prisma.outreach.count({
        where: {
          ...baseWhere,
          outcome:
            "FOLLOW_UP_REQUIRED",
        },
      }),

      prisma.outreach.groupBy({
        by: ["outreachType"],
        where: baseWhere,
        _count: {
          id: true,
        },
      }),

      prisma.outreach.groupBy({
        by: ["outcome"],
        where: baseWhere,
        _count: {
          id: true,
        },
      }),

      prisma.outreach.groupBy({
        by: ["status"],
        where: baseWhere,
        _count: {
          id: true,
        },
      }),
    ]);

    return {
      total,
      planned,
      completed,
      cancelled,
      missed,
      followUpsRequired,
      completionRate:
        total > 0
          ? Number(
              (
                (completed / total) *
                100
              ).toFixed(2),
            )
          : 0,
      byType: byType.map(
        ({ outreachType, _count }) => ({
          outreachType,
          count: _count.id,
        }),
      ),
      byOutcome: byOutcome.map(
        ({ outcome, _count }) => ({
          outcome,
          count: _count.id,
        }),
      ),
      byStatus: byStatus.map(
        ({ status, _count }) => ({
          status,
          count: _count.id,
        }),
      ),
    };
  }
}

export default new OutreachService();