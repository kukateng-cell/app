"use client";

import {
  createContext,
  useCallback,
  useContext,
  useSyncExternalStore,
  type ReactNode,
} from "react";

// ============================================
// 常數
// ============================================

/** localStorage 儲存鍵 */
const STORAGE_KEY = "pinyin-speech-rate";

/** 預設語速（與原本寫死的 0.8 一致） */
export const DEFAULT_RATE = 0.8;

/** 語速範圍 */
export const MIN_RATE = 0.5;
export const MAX_RATE = 1.5;
export const RATE_STEP = 0.1;

// ============================================
// Context 型別
// ============================================

interface SpeechSettingsContextValue {
  /** 目前語速（0.5 ~ 1.5） */
  rate: number;
  /** 設定語速 */
  setRate: (rate: number) => void;
  /** 重設為預設語速 */
  resetRate: () => void;
}

const SpeechSettingsContext = createContext<SpeechSettingsContextValue | null>(
  null
);

// ============================================
// 工具函數
// ============================================

/** 將語速限制在合法範圍內，並四捨五入到小數一位 */
function clampRate(rate: number): number {
  if (!Number.isFinite(rate)) return DEFAULT_RATE;
  const rounded = Math.round(rate * 10) / 10;
  return Math.min(MAX_RATE, Math.max(MIN_RATE, rounded));
}

/** 從 localStorage 讀取語速（失敗時回退預設值） */
function readRate(): number {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw == null) return DEFAULT_RATE;
    return clampRate(parseFloat(raw));
  } catch {
    return DEFAULT_RATE;
  }
}

/** 寫入 localStorage（靜默忽略失敗） */
function writeRate(rate: number): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, String(rate));
  } catch {
    // localStorage 不可用或空間不足時靜默忽略
  }
}

// ============================================
// useSyncExternalStore：把 localStorage 當外部 store
// ============================================

/**
 * 訂閱 localStorage 變化：
 *   - 同頁籤：setRate/resetRate 寫入後會 dispatch 一個 storage 事件觸發重新讀取
 *   - 跨頁籤：瀏覽器原生 storage 事件自動同步
 */
function useExternalRate(): number {
  const subscribe = useCallback((onChange: () => void) => {
    window.addEventListener("storage", onChange);
    return () => window.removeEventListener("storage", onChange);
  }, []);

  // 客戶端快照：讀取 localStorage（值相等，不會造成無限迴圈）
  const getSnapshot = useCallback(() => readRate(), []);
  // SSR 快照：一律回傳預設值，避免 hydration mismatch
  const getServerSnapshot = useCallback(() => DEFAULT_RATE, []);

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

/** 同頁籤寫入後通知訂閱者重新讀取 */
function notifyListeners() {
  window.dispatchEvent(new StorageEvent("storage", { key: STORAGE_KEY }));
}

// ============================================
// Provider
// ============================================

/**
 * 語音設定 Provider — 全域管理 TTS 語速，並持久化到 localStorage
 */
export function SpeechSettingsProvider({ children }: { children: ReactNode }) {
  const rate = useExternalRate();

  const setRate = useCallback((next: number) => {
    writeRate(clampRate(next));
    notifyListeners();
  }, []);

  const resetRate = useCallback(() => {
    writeRate(DEFAULT_RATE);
    notifyListeners();
  }, []);

  return (
    <SpeechSettingsContext.Provider value={{ rate, setRate, resetRate }}>
      {children}
    </SpeechSettingsContext.Provider>
  );
}

// ============================================
// Hook
// ============================================

/** 取得語音設定；若未在 Provider 內則回退為預設值 */
export function useSpeechSettings(): SpeechSettingsContextValue {
  const ctx = useContext(SpeechSettingsContext);
  // Provider 必定在 layout 包覆整個 app，這裡以防萬一
  if (ctx) return ctx;
  return {
    rate: DEFAULT_RATE,
    setRate: () => {},
    resetRate: () => {},
  };
}

