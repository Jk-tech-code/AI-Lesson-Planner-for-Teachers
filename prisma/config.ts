import { defineConfig } from "@prisma/config"

export default defineConfig({
  schema: "./prisma/schema.prisma",
  datasource: {
    url: "postgresql://postgres:40287101%40Jay@db.qogiqibmhxbbfknmkqtd.supabase.co:5432/postgres",
  },
})
