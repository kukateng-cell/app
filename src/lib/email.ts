// Email 寄信工具
// 文件：src/lib/email.ts
// 用途：使用 Gmail SMTP 寄送 OTP 驗證碼
// 設定：需在 .env 設定 SMTP_USER（Gmail 地址）與 SMTP_PASS（應用程式密碼）

import "server-only";
import nodemailer from "nodemailer";

let transporterCache: nodemailer.Transporter | null = null;

/** 建立（並快取）Gmail SMTP transporter */
function getTransporter(): nodemailer.Transporter {
  if (transporterCache) return transporterCache;

  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!user || !pass) {
    throw new Error(
      "尚未設定 SMTP_USER 或 SMTP_PASS，請在 .env 設定 Gmail 地址與應用程式密碼"
    );
  }

  transporterCache = nodemailer.createTransport({
    service: "gmail",
    auth: { user, pass },
  });

  return transporterCache;
}

/** 寄送 OTP 驗證碼到指定 email */
export async function sendOtpEmail(email: string, code: string): Promise<void> {
  const transporter = getTransporter();

  const siteName = "拼音学堂";

  const html = `
    <div style="font-family: -apple-system, 'Noto Sans TC', sans-serif; max-width: 480px; margin: 0 auto; padding: 24px;">
      <div style="text-align: center; margin-bottom: 24px;">
        <span style="display: inline-block; width: 48px; height: 48px; line-height: 48px; border-radius: 12px; background: linear-gradient(135deg, #34d399, #14b8a6); color: white; font-size: 24px; font-weight: bold;">拼</span>
        <h1 style="margin: 16px 0 0; font-size: 20px; color: #1f2937;">${siteName}</h1>
      </div>
      <p style="color: #4b5563; font-size: 15px;">您好！這是您的登入驗證碼：</p>
      <div style="text-align: center; margin: 24px 0;">
        <span style="display: inline-block; font-size: 36px; font-weight: bold; letter-spacing: 8px; color: #059669; background: #ecfdf5; padding: 16px 24px; border-radius: 12px;">${code}</span>
      </div>
      <p style="color: #6b7280; font-size: 13px;">驗證碼將在 10 分鐘後失效。若這不是您本人的操作，請忽略此郵件。</p>
      <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 24px 0;" />
      <p style="color: #9ca3af; font-size: 12px; text-align: center;">${siteName} · 此郵件由系統自動寄送，請勿回覆</p>
    </div>
  `;

  await transporter.sendMail({
    from: `"${siteName}" <${process.env.SMTP_USER}>`,
    to: email,
    subject: `【${siteName}】您的登入驗證碼：${code}`,
    html,
  });
}
