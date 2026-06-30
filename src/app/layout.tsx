import type { Metadata } from "next";
import { Noto_Sans_TC } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { SpeechSettingsProvider } from "@/components/SpeechSettingsContext";

const notoSansTC = Noto_Sans_TC({
  variable: "--font-noto-sans-tc",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  title: "拼音学堂 — 中文拼音学习网站",
  description: "从零开始学习中文拼音，包含声母、韵母、整体认读音节和声调，附带发音功能和互动测验。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="zh-TW"
      className={`${notoSansTC.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-gray-50 font-sans">
        <SpeechSettingsProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </SpeechSettingsProvider>
      </body>
    </html>
  );
}
