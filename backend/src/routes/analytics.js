const express = require("express");
const router = express.Router();

const analyticsController = require("../controller/analytics");
router.get("/dashboard", analyticsController.getDashboard);

module.exports = router;