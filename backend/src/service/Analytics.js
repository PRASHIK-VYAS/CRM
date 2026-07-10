const { sequelize } = require("../config/database");
const { Company360, MoU, Outreach } = require("../models");
const { fn, col } = require("sequelize");

class AnalyticsService {
  async getDashboardAnalytics() {
    const [
      totalCompanies,
      activeCompanies,
      prospectCompanies,
      inactiveCompanies,
      totalMoUs,
      activeMoUs,
      totalOutreach,
      avgHealthScore,
      companiesByIndustry,
      companiesByStatus,
    ] = await Promise.all([
      Company360.count(),

      Company360.count({
        where: { status: "ACTIVE" },
      }),

      Company360.count({
        where: { status: "PROSPECT" },
      }),

      Company360.count({
        where: { status: "INACTIVE" },
      }),

      MoU.count(),

      MoU.count({
        where: { status: "ACTIVE" },
      }),

      Outreach.count(),

      Company360.findOne({
        attributes: [
          [fn("AVG", col("healthScore")), "averageHealthScore"],
        ],
        raw: true,
      }),

      Company360.findAll({
        attributes: [
          "industry",
          [fn("COUNT", col("id")), "count"],
        ],
        group: ["industry"],
        raw: true,
      }),

      Company360.findAll({
        attributes: [
          "status",
          [fn("COUNT", col("id")), "count"],
        ],
        group: ["status"],
        raw: true,
      }),
    ]);

    return {
      companies: {
        total: totalCompanies,
        active: activeCompanies,
        prospect: prospectCompanies,
        inactive: inactiveCompanies,
        averageHealthScore: Number(
          avgHealthScore.averageHealthScore || 0
        ).toFixed(2),
        byIndustry: companiesByIndustry,
        byStatus: companiesByStatus,
      },

      mou: {
        total: totalMoUs,
        active: activeMoUs,
      },

      outreach: {
        total: totalOutreach,
      },
    };
  }
}

module.exports = new AnalyticsService();