import "dotenv/config";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },
  // Neon's pooled connection (PgBouncer) can't run the shadow-database
  // operations `migrate dev` needs — CLI commands use the direct connection.
  datasource: {
    url: env("DIRECT_URL"),
  },
});