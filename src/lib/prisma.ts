// Prisma 7'nin yeni "prisma-client" generator'ı, klasik "@prisma/client" paketine değil,
// schema.prisma'da belirtilen custom output yoluna (src/generated/prisma) TypeScript kodu
// üretir — bu yüzden import her zaman buradan yapılmalı, "@prisma/client"tan değil. Bu generator
// artık Rust query engine'i bundle etmiyor: bağlantıyı bir "driver adapter" üzerinden kurmak
// gerekiyor (schema.prisma'daki datasource bloğunda url yok, sadece prisma.config.ts CLI için
// kullanıyor). Standart Postgres bağlantısı (pg) kullanıyoruz — Neon standart Postgres
// protokolünü de destekliyor, bu da serverless/WebSocket adaptörüne göre daha az kırılgan.
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/generated/prisma/client";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not set");
}

function createPrismaClient() {
  const pool = new Pool({ connectionString });
  const adapter = new PrismaPg(pool);
  return new PrismaClient({ adapter });
}

// Next.js dev modunda her dosya değişikliğinde modüller yeniden yüklenir; PrismaClient'ı global'e
// koymazsak her hot-reload'da yeni bir bağlantı havuzu açılır ve Neon'un bağlantı limitine hızla
// çarpılır. Production'da (tek instance) bu global önbellekleme zaten no-op'tur.
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
