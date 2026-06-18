// Session 管理（JWT Cookie）
// 文件：src/lib/session.ts
// 用途：登入後建立 / 讀取 / 刪除加密的 session cookie
// 說明：使用 jose 函式庫以 HMAC HS256 簽署 JWT，存在 httpOnly cookie

import "server-only";
import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";

const SESSION_COOKIE = "session";
// 7 天過期
const EXPIRES_IN_SECONDS = 7 * 24 * 60 * 60;

// 從環境變數取得密鑰，若未設定則在開發環境使用預設值（不安全，僅開發用）
function getSecret(): Uint8Array {
  const secret =
    process.env.SESSION_SECRET ||
    "dev-only-insecure-secret-please-set-SESSION_SECRET-in-env";
  return new TextEncoder().encode(secret);
}

export interface SessionPayload {
  userId: string;
  email: string;
  expiresAt: number; // unix 秒
}

/** 建立 JWT 並寫入 cookie（登入成功時呼叫） */
export async function createSession(userId: string, email: string) {
  const expiresAt = Math.floor(Date.now() / 1000) + EXPIRES_IN_SECONDS;

  const session = await new SignJWT({ userId, email })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime(expiresAt)
    .setIssuedAt()
    .sign(getSecret());

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, session, {
    httpOnly: true,
    // 開發環境（http）關閉 secure，生產環境（https）開啟
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: EXPIRES_IN_SECONDS,
  });
}

/** 讀取並驗證當前 session，回傳 payload 或 null */
export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const session = cookieStore.get(SESSION_COOKIE)?.value;
  if (!session) return null;

  try {
    const { payload } = await jwtVerify(session, getSecret(), {
      algorithms: ["HS256"],
    });
    return {
      userId: payload.userId as string,
      email: payload.email as string,
      expiresAt: payload.exp as number,
    };
  } catch {
    return null;
  }
}

/** 取得目前登入的使用者 ID，未登入回傳 null */
export async function getCurrentUserId(): Promise<string | null> {
  const session = await getSession();
  return session?.userId ?? null;
}

/** 刪除 session cookie（登出時呼叫） */
export async function deleteSession() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}
