// backend/src/service/Company360.js

import crypto from "node:crypto"; // crypto is a built-in module in Node.js, no need to install it and it is used for generating unique identifiers (UUIDs) for new company records. and also to hash the password of the user when creating a new user record. 🔐 Hashing passwords or data
//🔑 Generating random strings or IDs
//🛡️ Encrypting and decrypting data
//✍️ Creating digital signatures
//🔒 Verifying signatures


import prisma from "../config/prisma.js";

const writableFields = [
  "companyCode",
  "companyName",
  "industry",
  "website",
  "email",
  "phone",
  "linkedin",
  "headOffice",
  "city",
  "country",
  "postalCode",
  "companySize",
  "foundedYear",
  "description",
  "status",
  "partnershipLevel",
  "relationshipStage",
  "healthScore",
  "nextFollowUpDate",
  "totalPlacements",
  "totalOffers",
  "totalVisits",
  "totalMoUs",
  "isActive",
];

function pickCompanyData(data) {
  return Object.fromEntries(
    writableFields
      .filter((field) => data[field] !== undefined)
      .map((field) => [field, data[field]]),
  );
}

function normalizeCompanyData(data) {
  const company = pickCompanyData(data);

  if (company.companyCode) {
    company.companyCode = company.companyCode.trim().toUpperCase();
  }

  if (company.companyName) {
    company.companyName = company.companyName.trim();
  }

  if (company.email) {
    company.email = company.email.trim().toLowerCase();
  }

  if (company.website) {
    company.website = company.website.trim();
  }

  if (company.linkedin) {
    company.linkedin = company.linkedin.trim();
  }

  if (company.nextFollowUpDate) {
    company.nextFollowUpDate = new Date(company.nextFollowUpDate);
  }

  return company;
}

class Company360Service {
  async createCompany(data, createdBy = null) {
    const companyData = normalizeCompanyData(data);
    const now = new Date();

    return prisma.company360.create({
      data: {
        id: crypto.randomUUID(),
        ...companyData,
        createdBy,
        updatedBy: createdBy,
        createdAt: now,
        updatedAt: now,
      },
    });
  }

  async getCompanies({
    page = 1,
    limit = 20,
    search,
    industry,
    status,
    partnershipLevel,
    relationshipStage,
    city,
    isActive,
    includeDeleted = false,
    sortBy = "createdAt",
    sortOrder = "desc",
  } = {}) {
    const parsedPage = Math.max(Number(page) || 1, 1);
    const parsedLimit = Math.min(Math.max(Number(limit) || 20, 1), 100);

    const allowedSortFields = new Set([
      "companyName",
      "companyCode",
      "healthScore",
      "nextFollowUpDate",
      "createdAt",
      "updatedAt",
    ]);

    const orderField = allowedSortFields.has(sortBy)
      ? sortBy
      : "createdAt";

    const where = {
      ...(includeDeleted ? {} : { deletedAt: null }),
      ...(industry && { industry }),
      ...(status && { status }),
      ...(partnershipLevel && { partnershipLevel }),
      ...(relationshipStage && { relationshipStage }),
      ...(city && {
        city: {
          equals: city,
          mode: "insensitive",
        },
      }),
      ...(typeof isActive === "boolean" && { isActive }),
      ...(search && {
        OR: [
          {
            companyName: {
              contains: search.trim(),
              mode: "insensitive",
            },
          },
          {
            companyCode: {
              contains: search.trim(),
              mode: "insensitive",
            },
          },
          {
            email: {
              contains: search.trim(),
              mode: "insensitive",
            },
          },
          {
            city: {
              contains: search.trim(),
              mode: "insensitive",
            },
          },
        ],
      }),
    };

    const [companies, total] = await prisma.$transaction([
      prisma.company360.findMany({
        where,
        skip: (parsedPage - 1) * parsedLimit,
        take: parsedLimit,
        orderBy: {
          [orderField]: sortOrder === "asc" ? "asc" : "desc",
        },
      }),

      prisma.company360.count({ where }),
    ]);

    return {
      data: companies,
      pagination: {
        page: parsedPage,
        limit: parsedLimit,
        total,
        totalPages: Math.ceil(total / parsedLimit), //  Node.js, ceil refers to the Math.ceil() method. It rounds a number up to the nearest integer.
      },
    };
  }

  async getCompanyById(id, { includeDeleted = false } = {}) {
    const company = await prisma.company360.findFirst({
      where: {
        id,
        ...(includeDeleted ? {} : { deletedAt: null }),
      },
    });

    if (!company) {
      throw new Error("Company not found");
    }

    return company;
  }

  async getCompanyDetails(id) {
    const company = await prisma.company360.findFirst({
      where: {
        id,
        deletedAt: null,
      },
      include: {
        mous: {
          where: { deletedAt: null },
          orderBy: { createdAt: "desc" },
        },
        outreaches: {
          where: { deletedAt: null },
          orderBy: { interactionDate: "desc" },
        },
        deals: {
          where: { deletedAt: null },
          orderBy: { createdAt: "desc" },
          include: {
            owner: {
              select: {
                id: true,
                name: true,
                email: true,
                role: true,
              },
            },
          },
        },
        alumni: {
          orderBy: { fullName: "asc" },
        },
      },
    });

    if (!company) {
      throw new Error("Company not found");
    }

    return company;
  }

  async updateCompany(id, data, updatedBy = null) {
    await this.getCompanyById(id);

    return prisma.company360.update({
      where: { id },
      data: {
        ...normalizeCompanyData(data),
        updatedBy,
        updatedAt: new Date(),
      },
    });
  }

  async softDeleteCompany(id, updatedBy = null) {
    await this.getCompanyById(id);

    return prisma.company360.update({
      where: { id },
      data: {
        deletedAt: new Date(),
        isActive: false,
        updatedBy,
        updatedAt: new Date(),
      },
    });
  }

  async restoreCompany(id, updatedBy = null) {
    const company = await prisma.company360.findFirst({
      where: {
        id,
        deletedAt: { not: null },
      },
    });

    if (!company) {
      throw new Error("Deleted company not found");
    }

    return prisma.company360.update({
      where: { id },
      data: {
        deletedAt: null,
        isActive: true,
        updatedBy,
        updatedAt: new Date(),
      },
    });
  }

  async permanentlyDeleteCompany(id) {
    const company = await prisma.company360.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!company) {
      throw new Error("Company not found");
    }

    return prisma.company360.delete({
      where: { id },
    });
  }

  async getCompanyStatistics(id) {
    await this.getCompanyById(id);

    const [
      activeMoUs,
      totalOutreaches,
      activeDeals,
      alumniCount,
    ] = await Promise.all([
      prisma.moU.count({
        where: {
          companyId: id,
          status: "ACTIVE",
          deletedAt: null,
        },
      }),

      prisma.outreach.count({
        where: {
          companyId: id,
          deletedAt: null,
        },
      }),

      prisma.dealPipeline.count({
        where: {
          companyId: id,
          deletedAt: null,
          isArchived: false,
        },
      }),

      prisma.alumni.count({
        where: {
          companyId: id,
        },
      }),
    ]);

    return {
      activeMoUs,
      totalOutreaches,
      activeDeals,
      alumniCount,
    };
  }
}

export default new Company360Service();