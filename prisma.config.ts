// Prisma Config
// 文件：prisma.config.ts
// 用途：Prisma 7 配置檔案，用於 Migrations 和 CLI 命令

import "dotenv/config";
import { defineConfig } from "prisma/config";

// 在 Vercel 等平台部署時，`npm install` 會觸發 postinstall 執行 `prisma generate`，
// 但此時 `DATABASE_URL` 可能尚未注入（install 階段）。
// 由於 `prisma generate` 只是讀取 schema 來產生 client 程式碼，並不需要真實連線字串，
// 因此這裡提供一個佔位值作為 fallback，避免建置失敗。
// 真正的資料庫連線是在 runtime 由 src/lib/prisma.ts 的 PrismaPg adapter
// 直接讀取 process.env.DATABASE_URL 建立的，不經過此設定檔。
const databaseUrl =
  process.env.DATABASE_URL ??
  "postgresql://placeholder:placeholder@localhost:5432/placeholder?schema=public";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: databaseUrl,
  },
});
