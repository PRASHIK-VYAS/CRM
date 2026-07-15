import crypto from "node:crypto";
import prisma from "../config/prisma.js";

const employmentTypeMap = {
    "Full Time": "FULL_TIME",
    "Part Time": "PART_TIME",
    Contract: "CONTRACT",
    Internship: "INTERNSHIP",
};

const workModeMap = {
    "On Site": "ON_SITE",
    Remote: "REMOTE",
    Hybrid: "HYBRID",
};

const employmentTypeLabels = Object.fromEntries(
    Object.entries(employmentTypeMap).map(([label, value]) => [value, label]),
);

const workModeLabels = Object.fromEntries(
    Object.entries(workModeMap).map(([label, value]) => [value, label]),
);

function normalizeEnum(value, mapping) {
    if (!value) return value;
    return mapping[value] ?? value;
}

function pickData(data) {
    const fields = [
        "alumniId",
        "companyId",
        "designation",
        "department",
        "startDate",
        "endDate",
        "isCurrent",
        "employmentType",
        "workMode",
        "location",
        "description",
        "remarks",
    ];

    return Object.fromEntries(
        fields.filter((field) => data[field] !== undefined).map((field) => [field, data[field]]),
    );
}

function normalizeData(data) {
    const record = pickData(data);

    if (record.designation) record.designation = record.designation.trim();
    if (record.department) record.department = record.department.trim();
    if (record.location) record.location = record.location.trim();
    if (record.description) record.description = record.description.trim();
    if (record.remarks) record.remarks = record.remarks.trim();

    if (record.startDate) record.startDate = new Date(record.startDate);
    if (record.endDate) record.endDate = new Date(record.endDate);

    if (record.employmentType) {
        record.employmentType = normalizeEnum(record.employmentType, employmentTypeMap);
    }

    if (record.workMode) {
        record.workMode = normalizeEnum(record.workMode, workModeMap);
    }

    return record;
}

function serialize(record) {
    if (!record) return record;

    return {
        ...record,
        employmentType: employmentTypeLabels[record.employmentType] ?? record.employmentType,
        workMode: workModeLabels[record.workMode] ?? record.workMode,
    };
}

async function syncAlumniCurrentJob(alumniId) {
    const current = await prisma.employment.findFirst({
        where: { alumniId, isCurrent: true },
        orderBy: { startDate: "desc" },
        include: {
            company: { select: { id: true, companyName: true } },
        },
    });

    await prisma.alumni.update({
        where: { id: alumniId },
        data: {
            currentDesignation: current?.designation ?? "",
            companyId: current?.companyId ?? null,
            updatedAt: new Date(),
        },
    });
}

class EmploymentService {
    async createEmployment(data) {
        const record = normalizeData(data);

        if (!record.alumniId) throw new Error("Alumni ID is required");
        if (!record.companyId) throw new Error("Company ID is required");
        if (!record.designation) throw new Error("Designation is required");
        if (!record.startDate) throw new Error("Start date is required");

        const [alumni, company] = await Promise.all([
            prisma.alumni.findUnique({
                where: { id: record.alumniId },
                select: { id: true },
            }),
            prisma.company360.findFirst({
                where: { id: record.companyId, deletedAt: null },
                select: { id: true },
            }),
        ]);

        if (!alumni) throw new Error("Alumni not found");
        if (!company) throw new Error("Company not found");

        if (record.isCurrent) {
            await prisma.employment.updateMany({
                where: { alumniId: record.alumniId, isCurrent: true },
                data: { isCurrent: false },
            });
        }

        const now = new Date();

        const employment = await prisma.employment.create({
            data: {
                id: crypto.randomUUID(),
                ...record,
                createdAt: now,
                updatedAt: now,
            },
            include: {
                alumni: { select: { id: true, fullName: true, alumniCode: true } },
                company: { select: { id: true, companyName: true, industry: true } },
            },
        });

        await syncAlumniCurrentJob(record.alumniId);
        return serialize(employment);
    }

    async getEmploymentList({ page = 1, limit = 20, alumniId, companyId, isCurrent, search } = {}) {
        const parsedPage = Math.max(Number(page) || 1, 1);
        const parsedLimit = Math.min(Math.max(Number(limit) || 20, 1), 100);
        const conditions = [];

        if (alumniId) conditions.push({ alumniId });
        if (companyId) conditions.push({ companyId });
        if (isCurrent !== undefined) conditions.push({ isCurrent: isCurrent === "true" });

        if (search?.trim()) {
            const s = search.trim();

            conditions.push({
                OR: [
                    { designation: { contains: s, mode: "insensitive" } },
                    { department: { contains: s, mode: "insensitive" } },
                    { location: { contains: s, mode: "insensitive" } },
                    { company: { is: { companyName: { contains: s, mode: "insensitive" } } } },
                    { alumni: { is: { fullName: { contains: s, mode: "insensitive" } } } },
                ],
            });
        }

        const where = conditions.length > 0 ? { AND: conditions } : {};

        const [records, total] = await prisma.$transaction([
            prisma.employment.findMany({
                where,
                skip: (parsedPage - 1) * parsedLimit,
                take: parsedLimit,
                orderBy: { startDate: "desc" },
                include: {
                    alumni: { select: { id: true, fullName: true, alumniCode: true, department: true } },
                    company: { select: { id: true, companyName: true, industry: true, city: true } },
                },
            }),
            prisma.employment.count({ where }),
        ]);

        return {
            data: records.map(serialize),
            pagination: {
                page: parsedPage,
                limit: parsedLimit,
                total,
                totalPage: Math.ceil(total / parsedLimit),
            },
        };
    }

    async getEmploymentById(id) {
        if (!id) {
            throw new Error("Employment ID is required");
        }

        const employment = await prisma.employment.findUnique({
            where: { id },
            include: {
                alumni: { select: { id: true, fullName: true, alumniCode: true, department: true } },
                company: { select: { id: true, companyName: true, industry: true, city: true } },
            },
        });

        if (!employment) {
            throw new Error("Employment not found");
        }

        return serialize(employment);
    }

    async updateEmployment(id, data) {
        if (!id) {
            throw new Error("Employment ID is required");
        }

        const record = normalizeData(data);

        const existingEmployment = await prisma.employment.findUnique({
            where: { id },
            select: { id: true, alumniId: true, isCurrent: true },
        });

        if (!existingEmployment) {
            throw new Error("Employment not found");
        }

        if (record.alumniId) {
            const alumni = await prisma.alumni.findUnique({
                where: { id: record.alumniId },
                select: { id: true },
            });

            if (!alumni) {
                throw new Error("Alumni not found");
            }
        }

        if (record.companyId) {
            const company = await prisma.company360.findFirst({
                where: { id: record.companyId, deletedAt: null },
                select: { id: true },
            });

            if (!company) {
                throw new Error("Company not found");
            }
        }

        if (record.isCurrent === true) {
            await prisma.employment.updateMany({
                where: {
                    alumniId: record.alumniId ?? existingEmployment.alumniId,
                    isCurrent: true,
                    NOT: { id },
                },
                data: { isCurrent: false },
            });
        }

        const updatedEmployment = await prisma.employment.update({
            where: { id },
            data: {
                ...record,
                updatedAt: new Date(),
            },
            include: {
                alumni: { select: { id: true, fullName: true, alumniCode: true } },
                company: { select: { id: true, companyName: true, industry: true } },
            },
        });

        await syncAlumniCurrentJob(updatedEmployment.alumniId);
        return serialize(updatedEmployment);
    }

    async deleteEmployment(id) {
        if (!id) {
            throw new Error("Employment ID is required");
        }

        const existingEmployment = await prisma.employment.findUnique({
            where: { id },
            select: { id: true, alumniId: true, isCurrent: true },
        });

        if (!existingEmployment) {
            throw new Error("Employment not found");
        }

        await prisma.employment.delete({
            where: { id },
        });

        if (existingEmployment.isCurrent) {
            await syncAlumniCurrentJob(existingEmployment.alumniId);
        }

        return { message: "Employment deleted successfully" };
    }
}

export default new EmploymentService();
