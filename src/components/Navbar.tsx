"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { logoutAction } from "@/app/actions/auth";

const navLinks = [
  { href: "/", label: "首页" },
  { href: "/learn", label: "学习" },
  { href: "/quiz", label: "测验" },
  { href: "/history", label: "记录" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [user, setUser] = useState<{ loggedIn: boolean; email: string | null }>(
    { loggedIn: false, email: null }
  );

  // 載入登入狀態
  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then(setUser)
      .catch(() => {});
  }, [pathname]); // 每次切換頁面重新檢查（處理剛登入的情況）

  const emailName = user.email ? user.email.split("@")[0] : null;

  return (
    <header className="sticky top-0 z-50 border-b border-gray-100 bg-white/80 backdrop-blur-md">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 text-xl font-bold text-white shadow-sm">
            拼
          </span>
          <span className="text-xl font-bold text-gray-800">拼音学堂</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => {
            const isActive =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-emerald-50 text-emerald-600"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                {link.label}
              </Link>
            );
          })}

          {/* 登入 / 使用者區塊 */}
          {user.loggedIn ? (
            <div className="ml-2 flex items-center gap-2 border-l border-gray-200 pl-3">
              <span
                className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-sm font-bold text-emerald-700"
                title={user.email ?? ""}
              >
                {emailName?.[0]?.toUpperCase() ?? "U"}
              </span>
              <form action={logoutAction}>
                <button
                  type="submit"
                  className="rounded-lg px-3 py-2 text-sm font-medium text-gray-500 transition-colors hover:bg-gray-50 hover:text-gray-900"
                >
                  登出
                </button>
              </form>
            </div>
          ) : (
            <Link
              href="/login"
              className="ml-2 rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-emerald-600"
            >
              登入
            </Link>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="flex h-10 w-10 items-center justify-center rounded-lg text-gray-600 hover:bg-gray-50 md:hidden"
          aria-label="菜单"
        >
          {mobileOpen ? "✕" : "☰"}
        </button>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t border-gray-100 bg-white md:hidden">
          {navLinks.map((link) => {
            const isActive =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={`block px-4 py-3 text-sm font-medium ${
                  isActive
                    ? "bg-emerald-50 text-emerald-600"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
          {/* 登入 / 使用者區塊（手機版） */}
          <div className="border-t border-gray-100">
            {user.loggedIn ? (
              <div className="flex items-center justify-between px-4 py-3">
                <span className="flex items-center gap-2 text-sm text-gray-600">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-sm font-bold text-emerald-700">
                    {emailName?.[0]?.toUpperCase() ?? "U"}
                  </span>
                  {emailName}
                </span>
                <form action={logoutAction}>
                  <button
                    type="submit"
                    className="rounded-lg px-3 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50"
                  >
                    登出
                  </button>
                </form>
              </div>
            ) : (
              <Link
                href="/login"
                onClick={() => setMobileOpen(false)}
                className="block bg-emerald-500 px-4 py-3 text-center text-sm font-semibold text-white"
              >
                登入
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
