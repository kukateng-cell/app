// 資料搬移 API
// 檔案：src/app/api/quiz/migrate/route.ts
// 用途：登入後，將使用者瀏覽器 localStorage 中的舊測驗記錄搬到雲端資料庫
// 流程：client 端把 localStorage 記錄 POST 過來 → 寫入該使用者帳號 → 回傳成功後 client 清除 localStorage

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUserId } from "@/lib/session";

interface MigrateItem {
  date?: string;
  score?: number;
  total?: number;
  answers?: unknown[];
}

/** POST /api/quiz/migrate — 批次搬移多筆記錄 */
export async function POST(req: NextRequest) {
  const userId = await getCurrentUserId();
  if (!userId) {
    return NextResponse.json({ error: "未登入" }, { status: 401 });
  }

  const body = await req.json();
  const items = Array.isArray(body?.records) ? (body.records as MigrateItem[]) : [];

  if (items.length === 0) {
    return NextResponse.json({ ok: true, migrated: 0 });
  }

  // 過濾並轉換為資料庫記錄
  const validItems = items
    .filter(
      (it) =>
        typeof it.score === "number" &&
        typeof it.total === "number" &&
        Array.isArray(it.answers) &&
        it.total > 0
    )
    .map((it) => ({
      userId,
      score: it.score as number,
      total: it.total as number,
      percentage: Math.round(((it.score as number) / (it.total as number)) * 100),
      answers: JSON.stringify(it.answers),
      // 若有日期則用原日期，否則用現在
      createdAt: it.date ? new Date(it.date) : new Date(),
    }));

  if (validItems.length === 0) {
    return NextResponse.json({ ok: true, migrated: 0 });
  }

  // 批次寫入（最多 50 筆，避免一次太多）
  const result = await prisma.quizRecord.createMany({
    data: validItems.slice(0, 50),
  });

  return NextResponse.json({ ok: true, migrated: result.count });
}
