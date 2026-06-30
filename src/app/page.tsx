import Link from "next/link";
import { initials, finals, wholeSyllables, tones } from "@/data/pinyin";
import DailyPinyinCard from "@/components/DailyPinyinCard";

// 「今日拼音」依當下日期選取，需每次請求重新渲染，
// 否則靜態建置會把當天的拼音「凍結」直到下次部署。
export const revalidate = 0;

const features = [
  {
    href: "/learn/initials",
    title: "声母",
    subtitle: `${initials.length} 个`,
    description: "学习拼音开头的辅音，打好发音基础",
    icon: "🔤",
    gradient: "from-emerald-400 to-teal-500",
  },
  {
    href: "/learn/finals",
    title: "韵母",
    subtitle: `${finals.length} 个`,
    description: "掌握单韵母、复韵母和鼻韵母",
    icon: "🎵",
    gradient: "from-sky-400 to-blue-500",
  },
  {
    href: "/learn/syllables",
    title: "整体认读音节",
    subtitle: `${wholeSyllables.length} 个`,
    description: "不需拼读，直接整体记忆的音节",
    icon: "📖",
    gradient: "from-violet-400 to-purple-500",
  },
  {
    href: "/learn/tones",
    title: "声调",
    subtitle: `${tones.length} 种`,
    description: "四声加轻声，让发音准确到位",
    icon: "🎶",
    gradient: "from-amber-400 to-orange-500",
  },
];

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute left-10 top-10 text-9xl">ā</div>
          <div className="absolute right-20 top-20 text-8xl">é</div>
          <div className="absolute bottom-10 left-1/4 text-9xl">ǐ</div>
          <div className="absolute bottom-20 right-1/3 text-8xl">ò</div>
        </div>
        <div className="relative mx-auto max-w-4xl px-4 py-20 text-center sm:py-32">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/60 px-4 py-2 text-sm font-medium text-emerald-700 backdrop-blur-sm">
            🎓 免费学习 · 互动发音 · 趣味测验
          </div>
          <h1 className="mb-6 text-5xl font-bold tracking-tight text-gray-900 sm:text-6xl">
            轻松学会
            <span className="bg-gradient-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent">
              中文拼音
            </span>
          </h1>
          <p className="mx-auto mb-10 max-w-2xl text-lg leading-relaxed text-gray-600">
            从声母、韵母到声调，循序渐进地学习中文拼音基础知识。
            点击播放按钮即可听到标准发音，还有趣味测验检验学习成果！
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/learn"
              className="inline-flex items-center gap-2 rounded-full bg-emerald-500 px-8 py-4 text-lg font-semibold text-white shadow-lg shadow-emerald-200 transition-all hover:bg-emerald-600 hover:shadow-xl hover:shadow-emerald-300"
            >
              📚 开始学习
            </Link>
            <Link
              href="/quiz"
              className="inline-flex items-center gap-2 rounded-full bg-white px-8 py-4 text-lg font-semibold text-gray-700 shadow-md transition-all hover:bg-gray-50 hover:shadow-lg"
            >
              ✏️ 趣味测验
            </Link>
          </div>
        </div>
      </section>

      {/* 今日拼音（依日期轮换） */}
      <DailyPinyinCard />

      {/* Features Grid */}
      <section className="mx-auto w-full max-w-6xl px-4 py-16 sm:py-24">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            四大学习模块
          </h2>
          <p className="mt-4 text-lg text-gray-500">
            全面覆盖拼音基础知识，适合零基础学习者
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <Link
              key={feature.href}
              href={feature.href}
              className="group flex flex-col rounded-2xl border-2 border-gray-100 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl"
            >
              <div
                className={`mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${feature.gradient} text-3xl shadow-sm`}
              >
                {feature.icon}
              </div>
              <div className="flex items-baseline gap-2">
                <h3 className="text-xl font-bold text-gray-900">
                  {feature.title}
                </h3>
                <span className="text-sm font-medium text-gray-400">
                  {feature.subtitle}
                </span>
              </div>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-gray-500">
                {feature.description}
              </p>
              <span className="mt-4 text-sm font-medium text-emerald-500 transition-transform group-hover:translate-x-1">
                开始学习 →
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-5xl px-4">
          <div className="grid grid-cols-2 gap-8 text-center sm:grid-cols-4">
            <div>
              <div className="text-4xl font-bold text-emerald-500">
                {initials.length}
              </div>
              <div className="mt-2 text-sm text-gray-500">声母</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-sky-500">
                {finals.length}
              </div>
              <div className="mt-2 text-sm text-gray-500">韵母</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-violet-500">
                {wholeSyllables.length}
              </div>
              <div className="mt-2 text-sm text-gray-500">整体认读</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-amber-500">
                {tones.length}
              </div>
              <div className="mt-2 text-sm text-gray-500">声调</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
