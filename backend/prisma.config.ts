import dotenv from "dotenv";
import { defineConfig, env } from "prisma/config";

dotenv.config({ path: [".env", "../.env"] });

const runtimeUrl = env("DATABASE_URL");
const migrationUrl =
  process.env.DIRECT_URL ?? runtimeUrl.replace(":6543/", ":5432/");

export default defineConfig({
  schema: "./prisma/schema.prisma",
  migrations: {
    path: "./prisma/migrations",
  },
  datasource: {
    url: migrationUrl,
  },
});
