// prisma.config.ts
// Configuration Prisma 7 — connection string

import { defineConfig } from "prisma/config";
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

export default defineConfig({
  earlyAccess: true,
  schema: "./prisma/schema.prisma",
  datasource: {
    url: process.env.DATABASE_URL,
  },
  migrate: {
    async adapter() {
      const { PrismaNeon } = await import("@prisma/adapter-neon");
      const { Pool } = await import("@neondatabase/serverless");
      const pool = new Pool({ connectionString: process.env.DATABASE_URL });
      return new PrismaNeon(pool as any);
    },
  },
} as any);
