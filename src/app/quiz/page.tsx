"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { generateQuiz } from "@/data/pinyin";
import type { QuizQuestion } from "@/data/pinyin";
import { saveQuizRecord, type QuizAnswerRecord } from "@/lib/quiz-history";
import { saveQuizRecordCloud } from "@/lib/quiz-history-cloud";

export default function QuizPage() {
  const [questions, setQuestions] = useState<QuizQuestion[] | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState<boolean[]>([]);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [loggedIn, setLoggedIn] = useState(false);
  const [saveHint, setSaveHint] = useState<string | null>(null);
  const hasSavedRef = useRef(false);

  // 載入登入狀態
  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((d) => setLoggedIn(d.loggedIn === true))
      .catch(() => {});
  }, []);

  const startQuiz = () => {
    setQuestions(generateQuiz());
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setScore(0);
    setAnswers([]);
    setSelectedAnswers([]);
    hasSavedRef.current = false;
  };

  const handleSelect = (index: number) => {
    if (showResult) return;
    setSelectedAnswer(index);
    setShowResult(true);

    const isCorrect = index === questions![currentIndex].answer;
    if (isCorrect) setScore(score + 1);
    setAnswers([...answers, isCorrect]);
    setSelectedAnswers([...selectedAnswers, index]);
  };

  // 测验完成时自动储存记录
  useEffect(() => {
    if (
      !hasSavedRef.current &&
      questions &&
      currentIndex >= questions.length &&
      selectedAnswers.length === questions.length
    ) {
      hasSavedRef.current = true;
      const records: QuizAnswerRecord[] = questions.map((q, i) => ({
        question: q.question,
        options: q.options,
        correctAnswer: q.answer,
        selectedAnswer: selectedAnswers[i],
        explanation: q.explanation,
        isCorrect: selectedAnswers[i] === q.answer,
      }));

      // 登入 → 存雲端；未登入 → 存 localStorage
      if (loggedIn) {
        saveQuizRecordCloud(score, questions.length, records).then((ok) => {
          setSaveHint(ok ? "✓ 已記錄到您的帳號" : "✗ 記錄儲存失敗");
        });
      } else {
        // 用 microtask 延遲 setState，避免 effect 內同步觸發渲染
        queueMicrotask(() => {
          saveQuizRecord(score, questions.length, records);
          setSaveHint("✓ 已記錄（本機）");
        });
      }
    }
  }, [currentIndex, questions, selectedAnswers, score, loggedIn]);

  const handleNext = () => {
    if (currentIndex + 1 >= questions!.length) {
      setCurrentIndex(currentIndex + 1); // 到结果页
    } else {
      setCurrentIndex(currentIndex + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    }
  };

  // 开始画面
  if (!questions) {
    return (
      <div className="mx-auto flex max-w-2xl flex-col items-center px-4 py-20 text-center">
        <div className="mb-6 text-6xl">✏️</div>
        <h1 className="mb-4 text-4xl font-bold text-gray-900">拼音测验</h1>
        <p className="mb-8 max-w-md text-lg text-gray-500">
          测验包含声母配对和声调辨别题目，共 8 题。
          看看你能答对几题！
        </p>
        <button
          onClick={startQuiz}
          className="inline-flex items-center gap-2 rounded-full bg-emerald-500 px-10 py-4 text-lg font-semibold text-white shadow-lg shadow-emerald-200 transition-all hover:bg-emerald-600 hover:shadow-xl hover:shadow-emerald-300"
        >
          🚀 开始测验
        </button>

        <div className="mt-10 grid w-full grid-cols-3 gap-4 text-center">
          <div className="rounded-xl bg-gray-50 p-4">
            <div className="text-2xl">📝</div>
            <div className="mt-2 text-sm text-gray-500">8 道题目</div>
          </div>
          <div className="rounded-xl bg-gray-50 p-4">
            <div className="text-2xl">🎯</div>
            <div className="mt-2 text-sm text-gray-500">随机出题</div>
          </div>
          <div className="rounded-xl bg-gray-50 p-4">
            <div className="text-2xl">📊</div>
            <div className="mt-2 text-sm text-gray-500">即时反馈</div>
          </div>
        </div>
      </div>
    );
  }

  // 结果画面
  if (currentIndex >= questions.length) {
    const percentage = Math.round((score / questions.length) * 100);
    const messages = [
      { min: 90, emoji: "🏆", message: "太棒了！你是拼音高手！" },
      { min: 70, emoji: "🎉", message: "做得很好！继续加油！" },
      { min: 50, emoji: "💪", message: "不错哦！再多练习吧！" },
      { min: 0, emoji: "📚", message: "别灰心！回去复习再来挑战！" },
    ];
    const result = messages.find((m) => percentage >= m.min)!;

    return (
      <div className="mx-auto flex max-w-2xl flex-col items-center px-4 py-20 text-center">
        <div className="mb-6 text-7xl">{result.emoji}</div>
        <h1 className="mb-2 text-4xl font-bold text-gray-900">测验完成！</h1>
        <p className="mb-4 text-lg text-gray-500">{result.message}</p>

        {/* 記錄儲存狀態 / 登入提示 */}
        {saveHint && (
          <p className="mb-4 text-sm text-gray-500">{saveHint}</p>
        )}
        {!loggedIn && (
          <Link
            href="/login"
            className="mb-4 inline-block rounded-full bg-gray-100 px-5 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-200"
          >
            🔑 登入以永久儲存記錄（換裝置也不會遺失）
          </Link>
        )}

        {/* 分数圆环 */}
        <div className="relative mb-8 flex h-40 w-40 items-center justify-center">
          <svg className="h-full w-full -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="#f0f0f0"
              strokeWidth="8"
            />
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="#10b981"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={`${(percentage / 100) * 283} 283`}
            />
          </svg>
          <div className="absolute flex flex-col items-center">
            <span className="text-4xl font-bold text-gray-900">{score}</span>
            <span className="text-sm text-gray-400">/ {questions.length}</span>
          </div>
        </div>

        {/* 答题明细 */}
        <div className="mb-8 flex gap-2">
          {answers.map((correct, i) => (
            <span
              key={i}
              className={`flex h-10 w-10 items-center justify-center rounded-lg text-sm font-medium ${
                correct
                  ? "bg-emerald-100 text-emerald-600"
                  : "bg-red-100 text-red-500"
              }`}
            >
              {correct ? "✓" : "✕"}
            </span>
          ))}
        </div>

        <div className="flex flex-wrap justify-center gap-4">
          <button
            onClick={startQuiz}
            className="inline-flex items-center gap-2 rounded-full bg-emerald-500 px-8 py-3 font-semibold text-white shadow-lg shadow-emerald-200 transition-all hover:bg-emerald-600"
          >
            🔄 再来一次
          </button>
          <Link
            href="/learn"
            className="inline-flex items-center gap-2 rounded-full bg-gray-100 px-8 py-3 font-semibold text-gray-600 transition-colors hover:bg-gray-200"
          >
            📚 去复习
          </Link>
          <Link
            href="/history"
            className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-8 py-3 font-semibold text-blue-600 transition-colors hover:bg-blue-100"
          >
            📊 查看记录
          </Link>
        </div>
      </div>
    );
  }

  // 答题画面
  const question = questions[currentIndex];
  const progress = ((currentIndex + 1) / questions.length) * 100;

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      {/* 进度条 */}
      <div className="mb-8">
        <div className="mb-2 flex items-center justify-between text-sm text-gray-400">
          <span>
            第 {currentIndex + 1} / {questions.length} 题
          </span>
          <span>得分：{score}</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-gray-100">
          <div
            className="h-full rounded-full bg-emerald-400 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* 题目 */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold leading-relaxed text-gray-900">
          {question.question}
        </h2>
      </div>

      {/* 选项 */}
      <div className="space-y-3">
        {question.options.map((option, index) => {
          const isSelected = selectedAnswer === index;
          const isCorrect = index === question.answer;

          let className =
            "flex w-full items-center gap-3 rounded-xl border-2 px-5 py-4 text-lg font-medium transition-all ";
          if (!showResult) {
            className +=
              "border-gray-200 bg-white text-gray-700 hover:border-emerald-300 hover:bg-emerald-50 cursor-pointer";
          } else if (isCorrect) {
            className +=
              "border-emerald-400 bg-emerald-50 text-emerald-700";
          } else if (isSelected) {
            className += "border-red-400 bg-red-50 text-red-600";
          } else {
            className += "border-gray-200 bg-white text-gray-400";
          }

          return (
            <button
              key={index}
              onClick={() => handleSelect(index)}
              disabled={showResult}
              className={className}
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-sm">
                {String.fromCharCode(65 + index)}
              </span>
              <span className="flex-1 text-left">{option}</span>
              {showResult && isCorrect && <span className="text-xl">✓</span>}
              {showResult && isSelected && !isCorrect && (
                <span className="text-xl">✕</span>
              )}
            </button>
          );
        })}
      </div>

      {/* 结果说明 */}
      {showResult && (
        <div
          className={`mt-6 rounded-xl p-5 ${
            selectedAnswer === question.answer
              ? "bg-emerald-50"
              : "bg-amber-50"
          }`}
        >
          <p
            className={`text-sm font-medium ${
              selectedAnswer === question.answer
                ? "text-emerald-700"
                : "text-amber-700"
            }`}
          >
            {selectedAnswer === question.answer ? "✅ " : "💡 "}
            {question.explanation}
          </p>
        </div>
      )}

      {/* 下一题按钮 */}
      {showResult && (
        <button
          onClick={handleNext}
          className="mt-6 w-full rounded-full bg-gray-900 px-8 py-4 text-lg font-semibold text-white transition-colors hover:bg-gray-800"
        >
          {currentIndex + 1 >= questions.length ? "查看结果 →" : "下一题 →"}
        </button>
      )}
    </div>
  );
}
