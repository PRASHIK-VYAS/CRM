// Transitional aliases for callers that import model delegates from this path.
// Prisma relations are declared in prisma/schema.prisma, so no association
// bootstrap file is required.
import prisma from "../config/prisma.js";

export const User = prisma.user;
export const Company360 = prisma.company360;
export const MoU = prisma.moU;
export const Outreach = prisma.outreach;
export const DealPipeline = prisma.dealPipeline;
export const Alumni = prisma.alumni;
