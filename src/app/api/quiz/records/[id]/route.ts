// 刪除單筆測驗記錄
// 檔案：src/app/api/quiz/records/[id]/route.ts
// 用途：刪除指定 ID 的測驗記錄（需登入且只能刪除自己的）

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUserId } from "@/lib/session";

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const userId = await getCurrentUserId();
  if (!userId) {
    return NextResponse.json({ error: "未登入" }, { status: 401 });
  }

  const { id } = await params;

  // 確保只能刪除自己的記錄
  const record = await prisma.quizRecord.findUnique({ where: { id } });

  if (!record || record.userId !== userId) {
    return NextResponse.json({ error: "找不到記錄" }, { status: 404 });
  }

  await prisma.quizRecord.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
