// 雲端測驗記錄工具庫（client 端）
// 檔案：src/lib/quiz-history-cloud.ts
// 用途：登入後透過 API 存取雲端的測驗記錄
// 說明：與 quiz-history.ts（localStorage）介面對齊，方便頁面切換資料來源

import type { QuizRecord, QuizAnswerRecord } from "./quiz-history";

const API_BASE = "/api/quiz";

/** 新增一筆測驗記錄到雲端 */
export async function saveQuizRecordCloud(
  score: number,
  total: number,
  answers: QuizAnswerRecord[]
): Promise<QuizRecord | null> {
  try {
    const res = await fetch(`${API_BASE}/records`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ score, total, answers }),
    });
    if (!res.ok) return null;
    const data = await res.json();
    // 補齊 answers（API 回傳不含 answers 明細，但前端已有）
    return {
      id: data.record.id,
      date: data.record.date,
      score: data.record.score,
      total: data.record.total,
      percentage: data.record.percentage,
      answers,
    };
  } catch {
    return null;
  }
}

/** 取得所有雲端測驗記錄（最新在前） */
export async function getQuizHistoryCloud(): Promise<QuizRecord[]> {
  try {
    const res = await fetch(`${API_BASE}/records`, { cache: "no-store" });
    if (!res.ok) return [];
    const data = await res.json();
    return data.records as QuizRecord[];
  } catch {
    return [];
  }
}

/** 刪除雲端指定一筆記錄 */
export async function deleteQuizRecordCloud(id: string): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE}/records/${id}`, { method: "DELETE" });
    return res.ok;
  } catch {
    return false;
  }
}

/** 清除雲端所有記錄 */
export async function clearQuizHistoryCloud(): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE}/records`, { method: "DELETE" });
    return res.ok;
  } catch {
    return false;
  }
}

/** 將 localStorage 記錄搬移到雲端，回傳成功搬移的筆數 */
export async function migrateLocalToCloud(
  records: QuizRecord[]
): Promise<number> {
  if (records.length === 0) return 0;
  try {
    const res = await fetch(`${API_BASE}/migrate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ records }),
    });
    if (!res.ok) return 0;
    const data = await res.json();
    return data.migrated as number;
  } catch {
    return 0;
  }
}
