// 登入頁面
// 文件：src/app/login/page.tsx
// 用途：Email OTP 登入（兩階段：寄驗證碼 → 驗證）

"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import {
  sendCodeAction,
  verifyCodeAction,
  type AuthState,
} from "@/app/actions/auth";

const initialState: AuthState = { ok: false, step: "email" };

export default function LoginPage() {
  // step: "email"（輸入 email）| "code"（輸入驗證碼）
  const [step, setStep] = useState<"email" | "code">("email");
  const [email, setEmail] = useState("");
  const [countdown, setCountdown] = useState(0);

  const [sendState, sendFormAction, sendPending] = useActionState(
    sendCodeAction,
    initialState
  );
  const [verifyState, verifyFormAction, verifyPending] = useActionState(
    verifyCodeAction,
    initialState
  );

  // 當寄送成功，切換到驗證碼步驟
  function handleSendSuccess() {
    if (sendState.ok && sendState.step === "code") {
      setStep("code");
      if (sendState.email) setEmail(sendState.email);
      startCountdown();
    }
  }

  function startCountdown() {
    setCountdown(60);
    const timer = setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) {
          clearInterval(timer);
          return 0;
        }
        return c - 1;
      });
    }, 1000);
  }

  const message = step === "email" ? sendState.message : verifyState.message;

  return (
    <div className="mx-auto flex max-w-md flex-col items-center px-4 py-16">
      <div className="mb-8 text-center">
        <span className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 text-3xl font-bold text-white shadow-lg shadow-emerald-200">
          拼
        </span>
        <h1 className="text-3xl font-bold text-gray-900">
          {step === "email" ? "登入拼音学堂" : "輸入驗證碼"}
        </h1>
        <p className="mt-2 text-gray-500">
          {step === "email"
            ? "輸入 email 即可登入，不需密碼"
            : `我們已將驗證碼寄至 ${email}`}
        </p>
      </div>

      {/* 訊息提示 */}
      {message && (
        <div
          className={`mb-4 w-full rounded-xl px-4 py-3 text-sm ${
            (step === "email" ? sendState.ok : verifyState.ok)
              ? "bg-emerald-50 text-emerald-700"
              : "bg-red-50 text-red-600"
          }`}
        >
          {message}
        </div>
      )}

      {/* 步驟一：輸入 email */}
      {step === "email" && (
        <form
          action={sendFormAction}
          onSubmit={handleSendSuccess}
          className="w-full space-y-4"
        >
          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Email 地址
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-gray-900 outline-none transition-all focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
            />
          </div>
          <button
            type="submit"
            disabled={sendPending}
            className="w-full rounded-xl bg-emerald-500 px-6 py-3 font-semibold text-white shadow-lg shadow-emerald-200 transition-all hover:bg-emerald-600 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60"
          >
            {sendPending ? "寄送中…" : "寄送驗證碼"}
          </button>
        </form>
      )}

      {/* 步驟二：輸入驗證碼 */}
      {step === "code" && (
        <form action={verifyFormAction} className="w-full space-y-4">
          {/* 保留 email 供 Server Action 讀取 */}
          <input type="hidden" name="email" value={email} />

          <div>
            <label
              htmlFor="code"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              6 位數驗證碼
            </label>
            <input
              id="code"
              name="code"
              type="text"
              inputMode="numeric"
              pattern="[0-9]{6}"
              maxLength={6}
              required
              autoFocus
              autoComplete="one-time-code"
              placeholder="000000"
              className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-center text-2xl font-bold tracking-[0.5em] text-gray-900 outline-none transition-all focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
            />
            <p className="mt-2 text-center text-xs text-gray-400">
              驗證碼 10 分鐘內有效
            </p>
          </div>

          <button
            type="submit"
            disabled={verifyPending}
            className="w-full rounded-xl bg-emerald-500 px-6 py-3 font-semibold text-white shadow-lg shadow-emerald-200 transition-all hover:bg-emerald-600 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60"
          >
            {verifyPending ? "驗證中…" : "登入"}
          </button>

          {/* 重新寄送 */}
          <div className="text-center">
            {countdown > 0 ? (
              <span className="text-sm text-gray-400">
                {countdown} 秒後可重新寄送
              </span>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setStep("email");
                }}
                className="text-sm font-medium text-emerald-600 hover:text-emerald-700"
              >
                ← 重新輸入 email
              </button>
            )}
          </div>
        </form>
      )}

      <div className="mt-8 text-center">
        <Link
          href="/"
          className="text-sm text-gray-400 hover:text-gray-600"
        >
          ← 返回首頁
        </Link>
      </div>
    </div>
  );
}
