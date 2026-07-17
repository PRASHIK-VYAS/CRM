import express from "express";
import cors from "cors";
import prisma from "./config/prisma.js";
import authRoutes from "./routes/auth.js";
import analyticsRoutes from "./routes/analytics.js";
import company360Routes from "./routes/company360.js";

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => res.json({ status: "ok" }));
app.use("/auth", authRoutes);
app.use("/analytics", analyticsRoutes);
app.use("/api/company360", company360Routes);

async function shutdown(signal) {
  console.log(`${signal} received; closing database connections`);
  await prisma.$disconnect();
  process.exit(0);
}

process.once("SIGINT", () => shutdown("SIGINT"));
process.once("SIGTERM", () => shutdown("SIGTERM"));

try {
  await prisma.$connect();
  app.listen(port, () => {
    console.log(`Server running on port ${port} — DB connected with Prisma`);
  });
} catch (error) {
  console.error("DB connection failed:", error);
  await prisma.$disconnect();
  process.exit(1);
}

export default app;
