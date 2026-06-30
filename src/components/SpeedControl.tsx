"use client";

import { useEffect, useRef, useState } from "react";
import {
  DEFAULT_RATE,
  MAX_RATE,
  MIN_RATE,
  RATE_STEP,
  useSpeechSettings,
} from "./SpeechSettingsContext";

/** 依語速倍率給一個文字標籤，幫助使用者判斷快慢 */
function rateLabel(rate: number): string {
  if (rate <= 0.6) return "慢速";
  if (rate <= 0.85) return "標準";
  if (rate <= 1.1) return "稍快";
  return "快速";
}

/**
 * 語速控制 — 導覽列上的按鈕 + 彈出面板
 * 調整全域 TTS 語速，並可立即試聽
 */
export default function SpeedControl() {
  const { rate, setRate, resetRate } = useSpeechSettings();
  const [open, setOpen] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // 點擊外部關閉彈出面板
  useEffect(() => {
    if (!open) return;
    function handleClickOutside(e: MouseEvent) {
      const target = e.target as Node;
      if (
        popoverRef.current &&
        !popoverRef.current.contains(target) &&
        buttonRef.current &&
        !buttonRef.current.contains(target)
      ) {
        setOpen(false);
      }
    }
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  // 試聽目前語速
  const handleTest = () => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance("你好，拼音學堂");
    utterance.lang = "zh-CN";
    utterance.rate = rate;
    utterance.onstart = () => setIsTesting(true);
    utterance.onend = () => setIsTesting(false);
    utterance.onerror = () => setIsTesting(false);
    window.speechSynthesis.speak(utterance);
  };

  const isCustom = Math.round(rate * 10) !== Math.round(DEFAULT_RATE * 10);

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex h-9 items-center gap-1 rounded-lg border border-gray-200 px-2.5 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50 hover:text-gray-900"
        aria-label="語速設定"
        aria-expanded={open}
        aria-haspopup="dialog"
        title="語速設定"
      >
        <span aria-hidden="true">{isTesting ? "🔊" : "🐢"}</span>
        <span className="tabular-nums">{rate.toFixed(1)}×</span>
        {isCustom && (
          <span
            className="h-1.5 w-1.5 rounded-full bg-emerald-500"
            aria-hidden="true"
          />
        )}
      </button>

      {open && (
        <div
          ref={popoverRef}
          role="dialog"
          aria-label="語速設定面板"
          className="absolute right-0 z-50 mt-2 w-72 rounded-2xl border border-gray-100 bg-white p-5 shadow-xl"
        >
          <div className="mb-1 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-800">語速設定</h3>
            {isCustom && (
              <button
                type="button"
                onClick={resetRate}
                className="text-xs text-gray-400 transition-colors hover:text-emerald-600"
              >
                重設
              </button>
            )}
          </div>
          <p className="mb-4 text-xs text-gray-400">
            調整所有拼音與例字的朗讀速度，初學者建議放慢。
          </p>

          {/* 滑桿 */}
          <div className="mb-2 flex items-baseline justify-between">
            <span className="text-2xl font-bold tabular-nums text-emerald-600">
              {rate.toFixed(1)}×
            </span>
            <span className="text-sm text-gray-500">{rateLabel(rate)}</span>
          </div>
          <input
            type="range"
            min={MIN_RATE}
            max={MAX_RATE}
            step={RATE_STEP}
            value={rate}
            onChange={(e) => setRate(parseFloat(e.target.value))}
            className="w-full accent-emerald-500"
            aria-label="語速滑桿"
          />
          <div className="mt-1 flex justify-between text-[11px] text-gray-400">
            <span>0.5× 慢</span>
            <span>1.5× 快</span>
          </div>

          {/* 試聽按鈕 */}
          <button
            type="button"
            onClick={handleTest}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-50 px-4 py-2.5 text-sm font-medium text-emerald-700 transition-colors hover:bg-emerald-100"
          >
            <span aria-hidden="true">{isTesting ? "🔊" : "🔈"}</span>
            {isTesting ? "播放中…" : "試聽此速度"}
          </button>
        </div>
      )}
    </div>
  );
}
