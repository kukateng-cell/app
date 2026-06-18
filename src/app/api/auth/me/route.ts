// 取得目前登入使用者
// 檔案：src/app/api/auth/me/route.ts
// 用途：回傳目前 session 的使用者資訊（email），供 Navbar 等 client 元件使用

import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";

export async function GET() {
  const session = await getSession();

  if (!session) {
    return NextResponse.json({ loggedIn: false, email: null });
  }

  return NextResponse.json({
    loggedIn: true,
    email: session.email,
  });
}
