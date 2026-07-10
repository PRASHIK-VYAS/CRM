class AnalyticsService {
    async getDashBoardAnalytics() {
        const totalCOmpanies = await Company360.count();
        const activeCompanies = await Company360.count({
            where : { status : "ACTIVE" }
        });
        const totalMoUs = await MoU.count();
        const activeMoUs = await MoU.count({
            where : { status : "ACTIVE" }
        });
        const companiesByIndustry = await Company360.findAll({
            attributes : [
                "industry",
                [sequelize.fn("COUNT", sequelize.col("id")), "count"]
            ],
            group : ["industry"]
        });
        const totalOutreach = await Outreach.count();
        return {
            totalCompanies,
            activeCompanies,
            totalMoUs,
            activeMoUs,
            totalOutreach,
            companiesByIndustry
        };
    }
}