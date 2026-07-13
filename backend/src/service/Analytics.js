import prisma from "../config/prisma.js";

const industryLabels = {
  E_Commerce: "E-Commerce",
};

class AnalyticsService {
  async getDashboardAnalytics() {
    const activeRecord = { deletedAt: null };
    const [
      totalCompanies,
      activeCompanies,
      prospectCompanies,
      inactiveCompanies,
      totalMoUs,
      activeMoUs,
      totalOutreach,
      healthScore,
      companiesByIndustry,
      companiesByStatus,
    ] = await Promise.all([
      prisma.company360.count({ where: activeRecord }),
      prisma.company360.count({ where: { ...activeRecord, status: "ACTIVE" } }),
      prisma.company360.count({ where: { ...activeRecord, status: "PROSPECT" } }),
      prisma.company360.count({ where: { ...activeRecord, status: "INACTIVE" } }),
      prisma.moU.count({ where: activeRecord }),
      prisma.moU.count({ where: { ...activeRecord, status: "ACTIVE" } }),
      prisma.outreach.count({ where: activeRecord }),
      prisma.company360.aggregate({
        where: activeRecord,
        _avg: { healthScore: true },
      }),
      prisma.company360.groupBy({
        by: ["industry"],
        where: activeRecord,
        _count: { id: true },
      }),
      prisma.company360.groupBy({
        by: ["status"],
        where: activeRecord,
        _count: { id: true },
      }),
    ]);

    return {
      companies: {
        total: totalCompanies,
        active: activeCompanies,
        prospect: prospectCompanies,
        inactive: inactiveCompanies,
        averageHealthScore: Number(healthScore._avg.healthScore ?? 0).toFixed(2),
        byIndustry: companiesByIndustry.map(({ industry, _count }) => ({
          industry: industryLabels[industry] ?? industry,
          count: _count.id,
        })),
        byStatus: companiesByStatus.map(({ status, _count }) => ({
          status,
          count: _count.id,
        })),
      },
      mou: { total: totalMoUs, active: activeMoUs },
      outreach: { total: totalOutreach },
    };
  }
}

export default new AnalyticsService();
