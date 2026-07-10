const analyticsService = require("../service/Analytics");

exports.getDashboard = async (req, res) => {
    try {
        const analytics = await analyticsService.getDashboardAnalytics();
        return res.status(200).json({
            success : true,
            data : analytics,
        });
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success : false,
            message : "Failed to load dashboard analytics",
        });
    }
};