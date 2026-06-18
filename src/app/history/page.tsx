"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  getQuizHistory,
  getQuizStats,
  deleteQuizRecord,
  clearQuizHistory,
  formatDate,
  type QuizRecord,
} from "@/lib/quiz-history";
import {
  getQuizHistoryCloud,
  deleteQuizRecordCloud,
  clearQuizHistoryCloud,
  migrateLocalToCloud,
} from "@/lib/quiz-history-cloud";

export default function HistoryPage() {
  const [history, setHistory] = useState<QuizRecord[]>([]);
  const [stats, setStats] = useState({
    totalAttempts: 0,
    averageScore: 0,
    bestScore: 0,
    latestScore: 0,
  });
  const [mounted, setMounted] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [loggedIn, setLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [migrateMsg, setMigrateMsg] = useState<string | null>(null);

  // 載入記錄（依登入狀態選擇資料來源）
  async function refresh() {
    if (loggedIn) {
      const cloudRecords = await getQuizHistoryCloud();
      setHistory(cloudRecords);
      setStats(computeStats(cloudRecords));
    } else {
      const localRecords = getQuizHistory();
      setHistory(localRecords);
      setStats(getQuizStats());
    }
  }

  // 從記錄陣列計算統計（雲端記錄用）
  function computeStats(records: QuizRecord[]) {
    if (records.length === 0) {
      return { totalAttempts: 0, averageScore: 0, bestScore: 0, latestScore: 0 };
    }
    const ps = records.map((r) => r.percentage);
    return {
      totalAttempts: records.length,
      averageScore: Math.round(ps.reduce((a, b) => a + b, 0) / ps.length),
      bestScore: Math.max(...ps),
      latestScore: records[0].percentage,
    };
  }

  useEffect(() => {
    (async () => {
      // 先檢查登入狀態
      try {
        const res = await fetch("/api/auth/me");
        const data = await res.json();
        const isLogged = data.loggedIn === true;
        setLoggedIn(isLogged);

        if (isLogged) {
          // 登入：載入雲端，並嘗試搬移 localStorage 舊資料
          const localRecords = getQuizHistory();
          if (localRecords.length > 0) {
            const n = await migrateLocalToCloud(localRecords);
            if (n > 0) {
              setMigrateMsg(`✓ 已將 ${n} 筆本機記錄搬移到您的帳號`);
              clearQuizHistory(); // 搬移成功後清除本機
            }
          }
          const cloudRecords = await getQuizHistoryCloud();
          setHistory(cloudRecords);
          setStats(computeStats(cloudRecords));
        } else {
          // 未登入：讀 localStorage
          const localRecords = getQuizHistory();
          setHistory(localRecords);
          setStats(getQuizStats());
        }
      } catch {
        // 失敗則退回 localStorage
        const localRecords = getQuizHistory();
        setHistory(localRecords);
        setStats(getQuizStats());
      }
      setMounted(true);
      setLoading(false);
    })();
  }, []);

  async function handleDelete(id: string) {
    if (loggedIn) {
      await deleteQuizRecordCloud(id);
    } else {
      deleteQuizRecord(id);
    }
    refresh();
  }

  async function handleClearAll() {
    if (!confirm("确定要清除所有测验记录吗？此操作无法复原。")) return;
    if (loggedIn) {
      await clearQuizHistoryCloud();
    } else {
      clearQuizHistory();
    }
    refresh();
  }

  function toggleExpand(id: string) {
    setExpandedId(expandedId === id ? null : id);
  }

  // SSR 安全的载入画面
  if (!mounted || loading) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <div className="text-4xl">⏳</div>
        <p className="mt-4 text-gray-500">载入中…</p>
      </div>
    );
  }

  // 未登入提示橫幅
  const loginBanner = !loggedIn && history.length > 0 ? (
    <div className="mb-6 flex flex-col items-center justify-between gap-3 rounded-xl bg-emerald-50 px-5 py-4 sm:flex-row">
      <p className="text-sm text-emerald-800">
        🔑 登入後可將記錄永久儲存在雲端，換裝置也不會遺失
      </p>
      <Link
        href="/login"
        className="rounded-full bg-emerald-500 px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-emerald-600"
      >
        登入
      </Link>
    </div>
  ) : null;

  // 空状态
  if (history.length === 0) {
    return (
      <div className="mx-auto flex max-w-2xl flex-col items-center px-4 py-20 text-center">
        <div className="mb-6 text-6xl">📭</div>
        <h1 className="mb-4 text-3xl font-bold text-gray-900">还没有测验记录</h1>
        <p className="mb-8 max-w-md text-lg text-gray-500">
          完成一次测验后，你的成绩会自动记录在这里，方便追踪学习进度。
        </p>
        <Link
          href="/quiz"
          className="inline-flex items-center gap-2 rounded-full bg-emerald-500 px-10 py-4 text-lg font-semibold text-white shadow-lg shadow-emerald-200 transition-all hover:bg-emerald-600 hover:shadow-xl hover:shadow-emerald-300"
        >
          🚀 去测验
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      {/* 搬移訊息 */}
      {migrateMsg && (
        <div className="mb-6 rounded-xl bg-emerald-50 px-5 py-3 text-center text-sm text-emerald-800">
          {migrateMsg}
        </div>
      )}

      {/* 登入提示 */}
      {loginBanner}

      {/* 标题 */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">📊 测验记录</h1>
          <p className="mt-1 text-sm text-gray-500">
            共 {stats.totalAttempts} 次测验
            {loggedIn && <span className="ml-2 text-emerald-600">· 雲端同步</span>}
          </p>
        </div>
        <button
          onClick={handleClearAll}
          className="rounded-lg px-4 py-2 text-sm font-medium text-red-500 transition-colors hover:bg-red-50"
        >
          🗑️ 清除全部
        </button>
      </div>

      {/* 统计卡片 */}
      <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard
          icon="📝"
          label="测验次数"
          value={`${stats.totalAttempts}`}
          color="bg-blue-50 text-blue-600"
        />
        <StatCard
          icon="📈"
          label="平均分数"
          value={`${stats.averageScore}%`}
          color="bg-amber-50 text-amber-600"
        />
        <StatCard
          icon="🏆"
          label="最佳成绩"
          value={`${stats.bestScore}%`}
          color="bg-emerald-50 text-emerald-600"
        />
        <StatCard
          icon="🆕"
          label="最近成绩"
          value={`${stats.latestScore}%`}
          color="bg-purple-50 text-purple-600"
        />
      </div>

      {/* 记录列表 */}
      <div className="space-y-4">
        {history.map((record) => {
          const isExpanded = expandedId === record.id;
          const correctCount = record.score;
          const wrongCount = record.total - record.score;

          return (
            <div
              key={record.id}
              className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md"
            >
              {/* 记录摘要 */}
              <button
                onClick={() => toggleExpand(record.id)}
                className="flex w-full items-center gap-4 px-5 py-4 text-left transition-colors hover:bg-gray-50"
              >
                {/* 分数圆圈 */}
                <div
                  className={`flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full text-lg font-bold ${
                    record.percentage >= 80
                      ? "bg-emerald-100 text-emerald-600"
                      : record.percentage >= 50
                        ? "bg-amber-100 text-amber-600"
                        : "bg-red-100 text-red-500"
                  }`}
                >
                  {record.percentage}%
                </div>

                {/* 资讯 */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-gray-900">
                      {correctCount} / {record.total} 题正确
                    </span>
                    {wrongCount > 0 && (
                      <span className="text-sm text-red-400">
                        （错 {wrongCount} 题）
                      </span>
                    )}
                  </div>
                  <p className="mt-0.5 text-sm text-gray-400">
                    {formatDate(record.date)}
                  </p>
                </div>

                {/* 展开图示 */}
                <span
                  className={`text-gray-400 transition-transform ${
                    isExpanded ? "rotate-180" : ""
                  }`}
                >
                  ▼
                </span>
              </button>

              {/* 展开详情 */}
              {isExpanded && (
                <div className="border-t border-gray-100 bg-gray-50 px-5 py-4">
                  {/* 答题概况 */}
                  <div className="mb-4 flex flex-wrap gap-1.5">
                    {record.answers.map((a, i) => (
                      <span
                        key={i}
                        className={`flex h-8 w-8 items-center justify-center rounded-lg text-xs font-medium ${
                          a.isCorrect
                            ? "bg-emerald-100 text-emerald-600"
                            : "bg-red-100 text-red-500"
                        }`}
                        title={`第 ${i + 1} 题`}
                      >
                        {a.isCorrect ? "✓" : "✕"}
                      </span>
                    ))}
                  </div>

                  {/* 逐题明细 */}
                  <div className="space-y-3">
                    {record.answers.map((a, i) => (
                      <div
                        key={i}
                        className={`rounded-xl border p-4 ${
                          a.isCorrect
                            ? "border-emerald-200 bg-white"
                            : "border-red-200 bg-white"
                        }`}
                      >
                        <div className="flex items-start gap-2">
                          <span className="text-lg">
                            {a.isCorrect ? "✅" : "❌"}
                          </span>
                          <div className="min-w-0 flex-1">
                            <p className="font-medium text-gray-900">
                              {i + 1}. {a.question}
                            </p>
                            <div className="mt-2 space-y-1 text-sm">
                              <p className="text-emerald-600">
                                ✓ 正确答案：
                                {a.options[a.correctAnswer]}
                              </p>
                              {!a.isCorrect && (
                                <p className="text-red-500">
                                  ✕ 你的答案：
                                  {a.options[a.selectedAnswer]}
                                </p>
                              )}
                            </div>
                            <p className="mt-2 rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-700">
                              💡 {a.explanation}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* 删除按钮 */}
                  <div className="mt-4 flex justify-end">
                    <button
                      onClick={() => handleDelete(record.id)}
                      className="rounded-lg px-4 py-2 text-sm font-medium text-red-500 transition-colors hover:bg-red-50"
                    >
                      🗑️ 删除此记录
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* 底部行动按钮 */}
      <div className="mt-8 flex justify-center gap-4">
        <Link
          href="/quiz"
          className="inline-flex items-center gap-2 rounded-full bg-emerald-500 px-8 py-3 font-semibold text-white shadow-lg shadow-emerald-200 transition-all hover:bg-emerald-600"
        >
          🔄 再测一次
        </Link>
        <Link
          href="/learn"
          className="inline-flex items-center gap-2 rounded-full bg-gray-100 px-8 py-3 font-semibold text-gray-600 transition-colors hover:bg-gray-200"
        >
          📚 去复习
        </Link>
      </div>
    </div>
  );
}

// ============================================
// 统计卡片元件
// ============================================

function StatCard({
  icon,
  label,
  value,
  color,
}: {
  icon: string;
  label: string;
  value: string;
  color: string;
}) {
  return (
    <div className={`rounded-2xl p-4 text-center ${color}`}>
      <div className="text-2xl">{icon}</div>
      <div className="mt-2 text-xl font-bold">{value}</div>
      <div className="mt-0.5 text-xs opacity-80">{label}</div>
    </div>
  );
}
