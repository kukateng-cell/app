"use client";

import { useState } from "react";
import { useSpeechSettings } from "./SpeechSettingsContext";

interface PronounceButtonProps {
  /** 要朗读的拼音或文字 */
  text: string;
  /** 按钮大小 */
  size?: "sm" | "md" | "lg";
  /** 自定义样式 */
  className?: string;
}

/**
 * 发音按钮 — 使用浏览器 Web Speech API 朗读拼音
 */
export default function PronounceButton({
  text,
  size = "md",
  className = "",
}: PronounceButtonProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const { rate } = useSpeechSettings();

  const handleSpeak = () => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "zh-CN";
    utterance.rate = rate;

    utterance.onstart = () => setIsPlaying(true);
    utterance.onend = () => setIsPlaying(false);
    utterance.onerror = () => setIsPlaying(false);

    window.speechSynthesis.speak(utterance);
  };

  const sizeClasses = {
    sm: "w-8 h-8 text-base",
    md: "w-10 h-10 text-xl",
    lg: "w-14 h-14 text-2xl",
  };

  return (
    <button
      onClick={handleSpeak}
      className={`inline-flex items-center justify-center rounded-full bg-emerald-500 text-white shadow-sm transition-all hover:bg-emerald-600 hover:scale-110 active:scale-95 ${sizeClasses[size]} ${className}`}
      title={`朗读：${text}`}
      aria-label={`朗读 ${text}`}
    >
      {isPlaying ? "🔊" : "🔈"}
    </button>
  );
}
