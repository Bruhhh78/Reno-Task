import "dotenv/config";
import { defineConfig } from "@prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    // Direct connection (port 5432) — required for Prisma CLI migrations
    // Transaction pooler (port 6543) does NOT support DDL statements
    url: process.env.DIRECT_URL!,
  },
});
