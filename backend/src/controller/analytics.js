import analyticsService from "../service/Analytics.js";

export async function getDashboard(req, res) {
  try {
    const analytics = await analyticsService.getDashboardAnalytics();
    return res.status(200).json({ success: true, data: analytics });
  } catch (error) {
    console.error("Dashboard analytics failed:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to load dashboard analytics",
    });
  }
}
