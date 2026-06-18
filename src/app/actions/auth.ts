// 認證 Server Actions
// 文件：src/app/actions/auth.ts
// 用途：OTP 登入流程（寄送驗證碼、驗證、登出）
// 流程：輸入 email → 系統寄 6 位數驗證碼 → 使用者輸入驗證碼 → 驗證成功建立 session

"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { createSession, deleteSession } from "@/lib/session";
import { sendOtpEmail } from "@/lib/email";

// 驗證碼有效期：10 分鐘
const OTP_TTL_MS = 10 * 60 * 1000;
// 同一 email 未驗證的驗證碼最多保留數量（防止濫發）
const MAX_ACTIVE_CODES = 5;

// ============================================
// 工具函數
// ============================================

/** 產生 6 位數驗證碼 */
function generateCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

/** 簡易 email 格式檢查 */
function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/** rate-limit：同一 email 每 60 秒只能發一次 */
async function checkRateLimit(email: string): Promise<boolean> {
  const recent = await prisma.otpCode.findFirst({
    where: {
      email,
      createdAt: { gt: new Date(Date.now() - 60 * 1000) },
    },
    orderBy: { createdAt: "desc" },
  });
  return !recent; // 沒有最近 60 秒內的紀錄才允許
}

// ============================================
// Server Actions
// ============================================

export type AuthState = {
  ok: boolean;
  message?: string;
  step?: "email" | "code";
  email?: string;
};

/**
 * 步驟一：寄送驗證碼到 email
 * 前端用 useActionState 呼叫
 */
export async function sendCodeAction(
  _prev: AuthState,
  formData: FormData
): Promise<AuthState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();

  if (!isValidEmail(email)) {
    return { ok: false, message: "請輸入正確的 email 格式", step: "email" };
  }

  // rate-limit 檢查
  const allowed = await checkRateLimit(email);
  if (!allowed) {
    return {
      ok: false,
      message: "請求過於頻繁，請等候 60 秒後再試",
      step: "email",
    };
  }

  const code = generateCode();

  // 存入資料庫（含過期時間）
  await prisma.otpCode.create({
    data: {
      email,
      code,
      expiresAt: new Date(Date.now() + OTP_TTL_MS),
    },
  });

  // 清理過舊的驗證碼（只保留最近 MAX_ACTIVE_CODES 筆）
  const allCodes = await prisma.otpCode.findMany({
    where: { email, used: false },
    orderBy: { createdAt: "desc" },
  });
  if (allCodes.length > MAX_ACTIVE_CODES) {
    const toDelete = allCodes.slice(MAX_ACTIVE_CODES).map((c) => c.id);
    await prisma.otpCode.deleteMany({ where: { id: { in: toDelete } } });
  }

  // 寄信
  try {
    await sendOtpEmail(email, code);
  } catch (e) {
    console.error("寄信失敗：", e);
    return {
      ok: false,
      message: "驗證碼寄送失敗，請檢查 SMTP 設定或稍後再試",
      step: "email",
    };
  }

  return {
    ok: true,
    step: "code",
    email,
    message: `驗證碼已寄送至 ${email}，請查看信箱（含垃圾郵件匣）`,
  };
}

/**
 * 步驟二：驗證驗證碼並登入
 */
export async function verifyCodeAction(
  _prev: AuthState,
  formData: FormData
): Promise<AuthState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const code = String(formData.get("code") ?? "").trim();

  if (!email || !code) {
    return { ok: false, step: "code", email, message: "請輸入驗證碼" };
  }

  // 找出該 email 最新、未使用、未過期的驗證碼
  const record = await prisma.otpCode.findFirst({
    where: {
      email,
      code,
      used: false,
      expiresAt: { gt: new Date() },
    },
    orderBy: { createdAt: "desc" },
  });

  if (!record) {
    return {
      ok: false,
      step: "code",
      email,
      message: "驗證碼不正確或已過期，請重新索取",
    };
  }

  // 標記為已使用
  await prisma.otpCode.update({
    where: { id: record.id },
    data: { used: true },
  });

  // 建立或取得使用者
  const user = await prisma.user.upsert({
    where: { email },
    update: {}, // 已存在則不更新
    create: { email },
  });

  // 建立 session
  await createSession(user.id, user.email);

  revalidatePath("/", "layout");
  redirect("/history");
}

/**
 * 登出
 */
export async function logoutAction(): Promise<void> {
  await deleteSession();
  revalidatePath("/", "layout");
  redirect("/");
}
