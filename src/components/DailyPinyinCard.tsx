import Link from "next/link";
import PinyinCard from "./PinyinCard";
import { getDailyPinyin, type PinyinCategory } from "@/data/pinyin";

/**
 * 今日拼音卡 — 依日期轮换展示一个拼音，吸引使用者每天回访学习。
 *
 * 使用 UTC 日期作为种子（详见 getDailyPinyin），确保所有使用者同一天
 * 看到同一个拼音，且 Server / Client 渲染一致（无 hydration mismatch）。
 *
 * 这是一个 Server Component：内含的 PronounceButton 才是 Client Component。
 */
export default function DailyPinyinCard() {
  const daily = getDailyPinyin();

  // 依分类决定卡片配色，与各学习页主题一致
  // satisfies 确保每个 PinyinCategory 都有对应值（编译期检查）
  const colorMap = {
    initials: "emerald",
    finals: "sky",
    wholeSyllables: "violet",
  } as const satisfies Record<PinyinCategory, "emerald" | "sky" | "violet">;

  // 分类 emoji
  const emojiMap = {
    initials: "🔤",
    finals: "🎵",
    wholeSyllables: "📖",
  } as const satisfies Record<PinyinCategory, string>;

  const color = colorMap[daily.category];
  const emoji = emojiMap[daily.category];

  // 将日期格式化为易读的中文格式（仅显示，不影响选取逻辑）
  const displayDate = new Intl.DateTimeFormat("zh-TW", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "long",
    timeZone: "UTC",
  }).format(new Date(`${daily.date}T00:00:00Z`));

  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-16 sm:py-20">
      <div className="mb-8 text-center">
        <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-1.5 text-sm font-medium text-emerald-600">
          <span aria-hidden="true">📅</span> 今日拼音 · {displayDate}
        </div>
        <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
          每日学一个
        </h2>
        <p className="mt-3 text-base text-gray-500">
          每天一个新拼音，{daily.categoryLabel}轮换，循序渐进打好基础
        </p>
      </div>

      <div className="mx-auto max-w-md">
        <div className="mb-3 flex items-center justify-between px-1">
          <span className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-500">
            <span aria-hidden="true">{emoji}</span>
            {daily.categoryLabel}
          </span>
          <Link
            href={daily.href}
            className="text-sm font-medium text-emerald-500 transition-colors hover:text-emerald-600"
          >
            查看全部 →
          </Link>
        </div>

        <PinyinCard item={daily.item} color={color} />
      </div>
    </section>
  );
}
