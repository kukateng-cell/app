// 拼音资料库
// 文件：src/data/pinyin.ts
// 用途：存放所有拼音学习资料（声母、韵母、整体认读音节、声调）

// ============================================
// 类型定义
// ============================================

export interface PinyinItem {
  /** 拼音 */
  pinyin: string;
  /** 范例字 */
  example: string;
  /** 范例字的拼音（含声调） */
  examplePinyin: string;
  /** 范例词组 */
  word: string;
  /** 词组拼音 */
  wordPinyin: string;
  /** 口诀或记忆提示 */
  tip?: string;
}

// ============================================
// 声母（23个）
// ============================================

export const initials: PinyinItem[] = [
  { pinyin: "b", example: "波", examplePinyin: "bō", word: "玻璃", wordPinyin: "bō li", tip: "发「b」时，双唇紧闭，然后突然放开，送出一口气" },
  { pinyin: "p", example: "坡", examplePinyin: "pō", word: "皮球", wordPinyin: "pí qiú", tip: "和「b」类似，但要用力送气" },
  { pinyin: "m", example: "摸", examplePinyin: "mō", word: "妈妈", wordPinyin: "mā ma", tip: "双唇紧闭，气流从鼻腔出来" },
  { pinyin: "f", example: "佛", examplePinyin: "fó", word: "衣服", wordPinyin: "yī fu", tip: "上齿咬下唇，气流从缝隙中摩擦而出" },
  { pinyin: "d", example: "得", examplePinyin: "dé", word: "大象", wordPinyin: "dà xiàng", tip: "舌尖抵住上牙龈，然后突然放开" },
  { pinyin: "t", example: "特", examplePinyin: "tè", word: "太阳", wordPinyin: "tài yáng", tip: "和「d」类似，但要用力送气" },
  { pinyin: "n", example: "呢", examplePinyin: "ne", word: "牛奶", wordPinyin: "niú nǎi", tip: "舌尖抵住上牙龈，气流从鼻腔出来" },
  { pinyin: "l", example: "勒", examplePinyin: "lē", word: "老虎", wordPinyin: "lǎo hǔ", tip: "舌尖抵住上牙龈，气流从舌头两侧出来" },
  { pinyin: "g", example: "哥", examplePinyin: "gē", word: "哥哥", wordPinyin: "gē ge", tip: "舌根抵住软腭，然后突然放开" },
  { pinyin: "k", example: "科", examplePinyin: "kē", word: "开心", wordPinyin: "kāi xīn", tip: "和「g」类似，但要用力送气" },
  { pinyin: "h", example: "喝", examplePinyin: "hē", word: "花朵", wordPinyin: "huā duǒ", tip: "舌根接近软腭，气流摩擦而出" },
  { pinyin: "j", example: "鸡", examplePinyin: "jī", word: "机器", wordPinyin: "jī qì", tip: "舌面抵住硬腭，气流摩擦而出" },
  { pinyin: "q", example: "七", examplePinyin: "qī", word: "气球", wordPinyin: "qì qiú", tip: "和「j」类似，但要用力送气" },
  { pinyin: "x", example: "西", examplePinyin: "xī", word: "下雨", wordPinyin: "xià yǔ", tip: "舌面接近硬腭，气流摩擦而出" },
  { pinyin: "zh", example: "知", examplePinyin: "zhī", word: "蜘蛛", wordPinyin: "zhī zhū", tip: "翘起舌尖抵住硬腭前部" },
  { pinyin: "ch", example: "吃", examplePinyin: "chī", word: "吃饭", wordPinyin: "chī fàn", tip: "和「zh」类似，但要用力送气" },
  { pinyin: "sh", example: "狮", examplePinyin: "shī", word: "狮子", wordPinyin: "shī zi", tip: "翘起舌尖接近硬腭，气流摩擦而出" },
  { pinyin: "r", example: "日", examplePinyin: "rì", word: "太阳", wordPinyin: "tài yáng", tip: "和「sh」类似，但声带要振动" },
  { pinyin: "z", example: "资", examplePinyin: "zī", word: "紫色", wordPinyin: "zǐ sè", tip: "舌尖抵住上齿背，然后突然放开" },
  { pinyin: "c", example: "刺", examplePinyin: "cì", word: "草地", wordPinyin: "cǎo dì", tip: "和「z」类似，但要用力送气" },
  { pinyin: "s", example: "丝", examplePinyin: "sī", word: "扫地", wordPinyin: "sǎo dì", tip: "舌尖接近上齿背，气流摩擦而出" },
  { pinyin: "y", example: "医", examplePinyin: "yī", word: "雨衣", wordPinyin: "yǔ yī", tip: "嘴型像发「i」，气流顺畅流出" },
  { pinyin: "w", example: "乌", examplePinyin: "wū", word: "乌龟", wordPinyin: "wū guī", tip: "嘴型像发「u」，气流顺畅流出" },
];

// ============================================
// 韵母（24个）
// ============================================

export const finals: PinyinItem[] = [
  // 单韵母（6个）
  { pinyin: "a", example: "啊", examplePinyin: "ā", word: "爸爸", wordPinyin: "bà ba", tip: "张大嘴巴，像看医生时说「啊」" },
  { pinyin: "o", example: "喔", examplePinyin: "ō", word: "喔喔", wordPinyin: "ō ō", tip: "嘴巴圆圆，像公鸡叫" },
  { pinyin: "e", example: "鹅", examplePinyin: "é", word: "白鹅", wordPinyin: "bái é", tip: "嘴巴扁扁，像鹅的嘴巴" },
  { pinyin: "i", example: "衣", examplePinyin: "yī", word: "衣服", wordPinyin: "yī fu", tip: "嘴巴展开，像微笑的样子" },
  { pinyin: "u", example: "乌", examplePinyin: "wū", word: "乌鸦", wordPinyin: "wū yā", tip: "嘴巴嘟起，像吹蜡烛" },
  { pinyin: "ü", example: "鱼", examplePinyin: "yú", word: "小鱼", wordPinyin: "xiǎo yú", tip: "嘴巴像发「u」，但嘴唇要更往前突" },
  // 复韵母（9个）
  { pinyin: "ai", example: "爱", examplePinyin: "ài", word: "爱心", wordPinyin: "ài xīn", tip: "由「a」滑向「i」" },
  { pinyin: "ei", example: "欸", examplePinyin: "ēi", word: "杯子", wordPinyin: "bēi zi", tip: "由「e」滑向「i」" },
  { pinyin: "ui", example: "威", examplePinyin: "wēi", word: "水", wordPinyin: "shuǐ", tip: "由「u」滑向「ei」" },
  { pinyin: "ao", example: "袄", examplePinyin: "ǎo", word: "猫", wordPinyin: "māo", tip: "由「a」滑向「o」" },
  { pinyin: "ou", example: "欧", examplePinyin: "ōu", word: "狗", wordPinyin: "gǒu", tip: "由「o」滑向「u」" },
  { pinyin: "iu", example: "优", examplePinyin: "yōu", word: "牛", wordPinyin: "niú", tip: "由「i」滑向「ou」" },
  { pinyin: "ie", example: "耶", examplePinyin: "yē", word: "蝴蝶", wordPinyin: "hú dié", tip: "由「i」滑向「ê」" },
  { pinyin: "üe", example: "约", examplePinyin: "yuē", word: "月亮", wordPinyin: "yuè liang", tip: "由「ü」滑向「ê」" },
  { pinyin: "er", example: "耳", examplePinyin: "ěr", word: "耳朵", wordPinyin: "ěr duo", tip: "发「e」时，舌尖向上卷" },
  // 鼻韵母（9个）
  { pinyin: "an", example: "安", examplePinyin: "ān", word: "面包", wordPinyin: "miàn bāo", tip: "由「a」滑向鼻音「n」" },
  { pinyin: "en", example: "恩", examplePinyin: "ēn", word: "门", wordPinyin: "mén", tip: "由「e」滑向鼻音「n」" },
  { pinyin: "in", example: "因", examplePinyin: "yīn", word: "森林", wordPinyin: "sēn lín", tip: "由「i」滑向鼻音「n」" },
  { pinyin: "un", example: "温", examplePinyin: "wēn", word: "春天", wordPinyin: "chūn tiān", tip: "由「u」滑向鼻音「n」" },
  { pinyin: "ün", example: "晕", examplePinyin: "yūn", word: "云朵", wordPinyin: "yún duǒ", tip: "由「ü」滑向鼻音「n」" },
  { pinyin: "ang", example: "昂", examplePinyin: "áng", word: "帮忙", wordPinyin: "bāng máng", tip: "由「a」滑向后鼻音「ng」" },
  { pinyin: "eng", example: "亨", examplePinyin: "hēng", word: "风筝", wordPinyin: "fēng zhēng", tip: "由「e」滑向后鼻音「ng」" },
  { pinyin: "ing", example: "鹰", examplePinyin: "yīng", word: "星星", wordPinyin: "xīng xing", tip: "由「i」滑向后鼻音「ng」" },
  { pinyin: "ong", example: "轰", examplePinyin: "hōng", word: "红色", wordPinyin: "hóng sè", tip: "由「o」滑向后鼻音「ng」" },
];

// ============================================
// 整体认读音节（16个）
// ============================================

export const wholeSyllables: PinyinItem[] = [
  { pinyin: "zhi", example: "织", examplePinyin: "zhī", word: "蜘蛛", wordPinyin: "zhī zhū" },
  { pinyin: "chi", example: "吃", examplePinyin: "chī", word: "吃饭", wordPinyin: "chī fàn" },
  { pinyin: "shi", example: "狮", examplePinyin: "shī", word: "狮子", wordPinyin: "shī zi" },
  { pinyin: "ri", example: "日", examplePinyin: "rì", word: "日子", wordPinyin: "rì zi" },
  { pinyin: "zi", example: "字", examplePinyin: "zì", word: "写字", wordPinyin: "xiě zì" },
  { pinyin: "ci", example: "刺", examplePinyin: "cì", word: "刺猬", wordPinyin: "cì wei" },
  { pinyin: "si", example: "丝", examplePinyin: "sī", word: "丝瓜", wordPinyin: "sī guā" },
  { pinyin: "yi", example: "一", examplePinyin: "yī", word: "衣服", wordPinyin: "yī fu" },
  { pinyin: "wu", example: "五", examplePinyin: "wǔ", word: "乌龟", wordPinyin: "wū guī" },
  { pinyin: "yu", example: "鱼", examplePinyin: "yú", word: "小鱼", wordPinyin: "xiǎo yú" },
  { pinyin: "ye", example: "夜", examplePinyin: "yè", word: "树叶", wordPinyin: "shù yè" },
  { pinyin: "yue", example: "月", examplePinyin: "yuè", word: "月亮", wordPinyin: "yuè liang" },
  { pinyin: "yuan", example: "圆", examplePinyin: "yuán", word: "圆形", wordPinyin: "yuán xíng" },
  { pinyin: "yin", example: "音", examplePinyin: "yīn", word: "音乐", wordPinyin: "yīn yuè" },
  { pinyin: "yun", example: "云", examplePinyin: "yún", word: "白云", wordPinyin: "bái yún" },
  { pinyin: "ying", example: "鹰", examplePinyin: "yīng", word: "老鹰", wordPinyin: "lǎo yīng" },
];

// ============================================
// 声调（4声 + 轻声）
// ============================================

export interface ToneItem {
  /** 声调名称 */
  name: string;
  /** 声调符号 */
  symbol: string;
  /** 调值 */
  value: string;
  /** 范例字 */
  example: string;
  /** 范例拼音 */
  examplePinyin: string;
  /** 说明 */
  description: string;
  /** 手势方向描述 */
  gesture: string;
}

export const tones: ToneItem[] = [
  {
    name: "第一声",
    symbol: "ˉ",
    value: "55",
    example: "妈",
    examplePinyin: "mā",
    description: "高平调，声音又高又平，像医生检查喉咙时说「啊」",
    gesture: "→ 手势从左向右平移",
  },
  {
    name: "第二声",
    symbol: "ˊ",
    value: "35",
    example: "麻",
    examplePinyin: "má",
    description: "上升调，声音从低到高，像在问「什么？」",
    gesture: "↗ 手势从左下向右上扬",
  },
  {
    name: "第三声",
    symbol: "ˇ",
    value: "214",
    example: "马",
    examplePinyin: "mǎ",
    description: "降升调，声音先降后升，像在说「嗯？」表示疑惑",
    gesture: "∨ 手势先向下再向上画勾",
  },
  {
    name: "第四声",
    symbol: "ˋ",
    value: "51",
    example: "骂",
    examplePinyin: "mà",
    description: "下降调，声音从高到低，像在生气地说「不对！」",
    gesture: "↘ 手势从左上向右下落",
  },
  {
    name: "轻声",
    symbol: "˙",
    value: "·",
    example: "吗",
    examplePinyin: "ma",
    description: "轻短调，声音又轻又短，没有明显的高低变化",
    gesture: "· 轻轻一点",
  },
];

// ============================================
// 测验题目生成
// ============================================

export interface QuizQuestion {
  question: string;
  options: string[];
  answer: number;
  explanation: string;
  /** 需要朗读的文字（例如句子判断题）；有的话答题画面会显示发音按钮 */
  audioText?: string;
}

// ============================================
// 句子判断题资料库
// ============================================

export interface SentenceItem {
  /** 中文句子 */
  sentence: string;
  /** 每个字对应的拼音（含声调） */
  pinyin: string[];
}

/**
 * 句子题：挑选某一声母明显出现最多次的句子，
 * 让学习者朗读后判断哪一个声母出现最多。
 */
export const sentences: SentenceItem[] = [
  { sentence: "爸爸抱宝宝", pinyin: ["bà", "ba", "bào", "bǎo", "bǎo"] },
  { sentence: "妈妈买毛帽", pinyin: ["mā", "ma", "mǎi", "máo", "mào"] },
  { sentence: "弟弟读大书", pinyin: ["dì", "di", "dú", "dà", "shū"] },
  { sentence: "婆婆泼葡萄", pinyin: ["pó", "po", "pō", "pú", "tao"] },
  { sentence: "哥哥喝果汁", pinyin: ["gē", "ge", "hē", "guǒ", "zhī"] },
  { sentence: "老虎拉柳树", pinyin: ["lǎo", "hǔ", "lā", "liǔ", "shù"] },
  { sentence: "他们天天跳舞", pinyin: ["tā", "men", "tiān", "tiān", "tiào", "wǔ"] },
  { sentence: "公公讲故事", pinyin: ["gōng", "gong", "jiǎng", "gù", "shì"] },
  { sentence: "姐姐吃鸡翅膀", pinyin: ["jiě", "jie", "chī", "jī", "chì", "bǎng"] },
  { sentence: "小狗咬骨头", pinyin: ["xiǎo", "gǒu", "yǎo", "gǔ", "tou"] },
];

/** 去除拼音声调符号（保留字母，ü 转成 v 以利比对） */
function stripToneMark(p: string): string {
  return p
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace("ü", "v");
}

/** 从单字拼音中提取声母；无独立声母（如 a、er）则回传 null */
function extractInitial(p: string): string | null {
  const base = stripToneMark(p);
  // 由长到短比对，确保 zh/ch/sh 优先于 z/c/s
  const orderedInitials = [...initials].sort(
    (a, b) => b.pinyin.length - a.pinyin.length
  );
  for (const init of orderedInitials) {
    if (base.startsWith(init.pinyin)) return init.pinyin;
  }
  return null;
}

/** 统计句子中每个声母出现次数，回传「出现最多声母」与其次数 */
function countMostCommonInitial(
  pinyinList: string[]
): { initial: string; count: number; all: Record<string, number> } | null {
  const counts: Record<string, number> = {};
  for (const p of pinyinList) {
    const init = extractInitial(p);
    if (init) counts[init] = (counts[init] || 0) + 1;
  }
  const entries = Object.entries(counts).sort((a, b) => b[1] - a[1]);
  if (entries.length === 0) return null;
  const [initial, count] = entries[0];
  return { initial, count, all: counts };
}

/** 生成随机测验题目 */
export function generateQuiz(): QuizQuestion[] {
  const questions: QuizQuestion[] = [];

  // 题目类型 1：声母配对
  const initialSample = [...initials].sort(() => Math.random() - 0.5).slice(0, 5);
  for (const item of initialSample) {
    const distractors = initials
      .filter((i) => i.pinyin !== item.pinyin)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3)
      .map((i) => i.pinyin);
    const options = [...distractors, item.pinyin].sort(() => Math.random() - 0.5);
    questions.push({
      question: `「${item.word}」的声母是什么？`,
      options,
      answer: options.indexOf(item.pinyin),
      explanation: `「${item.word}」（${item.wordPinyin}）的声母是「${item.pinyin}」`,
    });
  }

  // 题目类型 2：声调辨别
  const toneSample = [...tones].sort(() => Math.random() - 0.5).slice(0, 3);
  for (const tone of toneSample) {
    const allToneNames = tones.map((t) => t.name);
    const distractors = allToneNames
      .filter((n) => n !== tone.name)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);
    const options = [...distractors, tone.name].sort(() => Math.random() - 0.5);
    questions.push({
      question: `「${tone.example}」（${tone.examplePinyin}）是第几声？`,
      options,
      answer: options.indexOf(tone.name),
      explanation: `「${tone.example}」读作「${tone.examplePinyin}」，是${tone.name}`,
    });
  }

  // 题目类型 3：句子判断（哪一个声母出现最多）
  const sentenceSample = [...sentences].sort(() => Math.random() - 0.5).slice(0, 2);
  for (const s of sentenceSample) {
    const result = countMostCommonInitial(s.pinyin);
    if (!result) continue;
    const { initial: mostCommon, count, all } = result;

    // 干扰项优先取句中其他声母，不足再从常用声母补足
    const distractorPool = Object.keys(all).filter((k) => k !== mostCommon);
    const filler = initials
      .map((i) => i.pinyin)
      .filter((p) => p !== mostCommon && !distractorPool.includes(p));
    while (distractorPool.length < 3 && filler.length) {
      distractorPool.push(filler.shift()!);
    }
    const distractors = distractorPool.sort(() => Math.random() - 0.5).slice(0, 3);

    const options = [...distractors, mostCommon].sort(() => Math.random() - 0.5);
    questions.push({
      question: `请朗读句子，选出出现最多的声母：「${s.sentence}」`,
      options,
      answer: options.indexOf(mostCommon),
      explanation: `「${s.sentence}」（${s.pinyin.join(" ")}）中，「${mostCommon}」出现了 ${count} 次，是最多的声母`,
      audioText: s.sentence,
    });
  }

  return questions.sort(() => Math.random() - 0.5);
}

// ============================================
// 今日拼音（依日期轮换）
// ============================================

/** 今日拼音所属分类（声调不参与轮换，因为结构不同） */
export type PinyinCategory = "initials" | "finals" | "wholeSyllables";

/** 今日拼音结果 */
export interface DailyPinyin {
  /** 选中项（声母/韵母/整体认读；声调不参与轮换，因为结构不同） */
  item: PinyinItem;
  /** 所属分类 */
  category: PinyinCategory;
  /** 分类中文名称 */
  categoryLabel: string;
  /** 对应学习页路径 */
  href: string;
  /** 日期字串（YYYY-MM-DD，UTC） */
  date: string;
}

/** 池中单笔的型别 */
interface DailyPoolEntry {
  readonly item: PinyinItem;
  readonly category: PinyinCategory;
  readonly categoryLabel: string;
  readonly href: string;
}

/** 所有可轮换的拼音卡（依固定順序，确保日期映射稳定；唯读以防误改） */
const DAILY_POOL: readonly DailyPoolEntry[] = [
  ...initials.map((item) => ({ item, category: "initials" as const, categoryLabel: "声母", href: "/learn/initials" })),
  ...finals.map((item) => ({ item, category: "finals" as const, categoryLabel: "韵母", href: "/learn/finals" })),
  ...wholeSyllables.map((item) => ({ item, category: "wholeSyllables" as const, categoryLabel: "整体认读音节", href: "/learn/syllables" })),
];

/**
 * 依日期取得「今日拼音」。
 *
 * 采用 UTC 日期作为种子，确保：
 *  - 同一天所有使用者看到同一个拼音（具教学/社群一致性）
 *  - Server 与 Client 渲染结果一致，避免 hydration mismatch
 *  - 每天自动轮换，DAILY_POOL.length 天为一个循环
 *
 * @param date 参考日期（预设为「现在」）；可传入特定日期以利测试
 */
export function getDailyPinyin(date: Date = new Date()): DailyPinyin {
  const pool = DAILY_POOL;
  if (pool.length === 0) {
    throw new Error(
      "getDailyPinyin：DAILY_POOL 为空，请确认 initials/finals/wholeSyllables 资料已载入"
    );
  }

  // 以 UTC 日期组成 YYYY-MM-DD，作为稳定的天序号种子
  const yyyy = date.getUTCFullYear();
  const mm = String(date.getUTCMonth() + 1).padStart(2, "0");
  const dd = String(date.getUTCDate()).padStart(2, "0");
  const dateStr = `${yyyy}-${mm}-${dd}`;

  // 将日期转成一个整数序号：自 1970-01-01 (UTC) 起的天数
  const epochMs = Date.UTC(yyyy, date.getUTCMonth(), date.getUTCDate());
  const dayIndex = Math.floor(epochMs / (24 * 60 * 60 * 1000));

  const selected = pool[((dayIndex % pool.length) + pool.length) % pool.length];

  return {
    item: selected.item,
    category: selected.category,
    categoryLabel: selected.categoryLabel,
    href: selected.href,
    date: dateStr,
  };
}
