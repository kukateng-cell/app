// 測驗記錄 API
// 檔案：src/app/api/quiz/records/route.ts
// 用途：取得（GET）/ 新增（POST）當前登入使用者的測驗記錄
// 注意：所有操作都需要登入（有效的 session cookie）

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUserId } from "@/lib/session";

/** GET /api/quiz/records — 取得當前使用者的所有測驗記錄（最新在前） */
export async function GET() {
  const userId = await getCurrentUserId();
  if (!userId) {
    return NextResponse.json({ error: "未登入" }, { status: 401 });
  }

  const records = await prisma.quizRecord.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: 100, // 最多回傳 100 筆
  });

  // 解析 answers JSON 字串
  return NextResponse.json({
    records: records.map((r) => ({
      id: r.id,
      date: r.createdAt.toISOString(),
      score: r.score,
      total: r.total,
      percentage: r.percentage,
      answers: JSON.parse(r.answers),
    })),
  });
}

/** POST /api/quiz/records — 新增一筆測驗記錄 */
export async function POST(req: NextRequest) {
  const userId = await getCurrentUserId();
  if (!userId) {
    return NextResponse.json({ error: "未登入" }, { status: 401 });
  }

  const body = await req.json();
  const { score, total, answers } = body as {
    score?: number;
    total?: number;
    answers?: unknown[];
  };

  // 基本欄位檢查
  if (
    typeof score !== "number" ||
    typeof total !== "number" ||
    !Array.isArray(answers) ||
    total <= 0
  ) {
    return NextResponse.json({ error: "參數不正確" }, { status: 400 });
  }

  const percentage = Math.round((score / total) * 100);

  const record = await prisma.quizRecord.create({
    data: {
      userId,
      score,
      total,
      percentage,
      answers: JSON.stringify(answers),
    },
  });

  return NextResponse.json({
    ok: true,
    record: {
      id: record.id,
      date: record.createdAt.toISOString(),
      score: record.score,
      total: record.total,
      percentage: record.percentage,
    },
  });
}

/** DELETE /api/quiz/records — 清除當前使用者的所有記錄 */
export async function DELETE() {
  const userId = await getCurrentUserId();
  if (!userId) {
    return NextResponse.json({ error: "未登入" }, { status: 401 });
  }

  await prisma.quizRecord.deleteMany({ where: { userId } });
  return NextResponse.json({ ok: true });
}
