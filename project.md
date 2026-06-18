# 拼音学堂 — 中文拼音学习网站

> 一个互动式的中文拼音学习网站，帮助零基础学习者循序渐进地掌握声母、韵母、整体认读音节和声调。

---

## 📋 专案简介

「拼音学堂」是一个专为中文拼音初学者设计的学习网站。网站提供四大学习模块，涵盖拼音的完整知识体系，并内建语音发音功能与互动测验，让学习变得更轻松有趣。

### 核心特色

| 特色         | 说明                                                         |
| ------------ | ------------------------------------------------------------ |
| 🎙️ 语音发音  | 使用浏览器内建的 Web Speech API，点击即可听到标准中文发音    |
| 📚 四大模块  | 声母（23个）、韵母（24个）、整体认读音节（16个）、声调（5种）|
| 🎯 互动测验  | 随机出题、即时反馈、进度追踪、分数统计                      |
| � Email 登入 | Email 验证码（OTP）登入，无需密码，Gmail 寄送验证码          |
| ☁️ 云端记录 | 登入后测验记录存在资料库，跨装置同步，换浏览器也不遗失       |
| �📱 响应式设计 | 支援桌面与移动设备，随时随地学习                            |
| 🎨 视觉引导  | 每个模块使用专属配色，帮助记忆与区分                        |

---

## 🛠️ 技术栈

| 技术              | 版本    | 用途                          |
| ----------------- | ------- | ----------------------------- |
| **Next.js**       | 16.2.9  | React 全端框架（App Router）  |
| **TypeScript**    | 5.x     | 型别安全的开发体验            |
| **Tailwind CSS**  | v4      | 实用优先的 CSS 框架           |
| **React**         | 19.2.4  | UI 建构库                     |
| **Web Speech API**| 内建    | 浏览器原生语音合成（TTS）     |
| **Prisma**        | 7.8.0   | 型别安全的 ORM（使用者/测验记录）|
| **PostgreSQL**    | Neon 云端 | 关联式资料库（云端记录储存）  |
| **nodemailer**    | —       | 经由 Gmail SMTP 寄送 OTP 验证码 |
| **jose**          | —       | JWT 签署与验证（session cookie 加密）|

---

## 📁 专案结构

```
elegant-clock-3/
├── src/
│   ├── app/                          # Next.js App Router 页面
│   │   ├── layout.tsx                # 全局 Layout（Navbar + Footer）
│   │   ├── page.tsx                  # 首页（Hero + 模块导览 + 统计）
│   │   ├── globals.css               # 全局样式与 Tailwind 设定
│   │   ├── actions/
│   │   │   └── auth.ts               # 登入 Server Actions（寄码/验证/登出）
│   │   ├── api/
│   │   │   ├── auth/me/route.ts      # 取得登入状态
│   │   │   ├── quiz/migrate/route.ts # 本机→云端资料搬移
│   │   │   └── quiz/records/         # 测验记录 CRUD API（需登入）
│   │   ├── learn/
│   │   │   ├── page.tsx              # 学习总览页
│   │   │   ├── initials/page.tsx     # 声母学习页
│   │   │   ├── finals/page.tsx       # 韵母学习页
│   │   │   ├── syllables/page.tsx    # 整体认读音节学习页
│   │   │   └── tones/page.tsx        # 声调学习页
│   │   ├── login/
│   │   │   └── page.tsx              # 登入页（Email OTP 两阶段验证）
│   │   ├── quiz/
│   │   │   └── page.tsx              # 互动测验页
│   │   └── history/
│   │       └── page.tsx              # 测验记录页（成绩历史与逐题复习）
│   │
│   ├── components/                   # 可重用元件
│   │   ├── Navbar.tsx                # 导览列（含移动端选单、登入/登出）
│   │   ├── Footer.tsx                # 页脚
│   │   ├── PronounceButton.tsx       # 发音按钮（Web Speech API）
│   │   └── PinyinCard.tsx            # 拼音卡片（展示拼音、范例字、词组）
│   │
│   ├── data/
│   │   └── pinyin.ts                 # 拼音资料库与测验出题引擎
│   │
│   ├── lib/
│   │   ├── prisma.ts                 # Prisma Client 单例
│   │   ├── session.ts                # JWT session 管理（加密 cookie）
│   │   ├── email.ts                  # Gmail SMTP 寄送验证码
│   │   ├── quiz-history.ts           # 测验记录工具库（localStorage 储存 / 统计）
│   │   └── quiz-history-cloud.ts     # 云端测验记录工具库（经 API 存取）
│   │
│   └── generated/                    # Prisma 自动生成的程式码
│       └── prisma/
│
├── prisma/
│   └── schema.prisma                 # 资料库 Schema（User / OtpCode / QuizRecord）
│
├── public/                           # 静态资源
├── .env                              # 环境变数（DATABASE_URL / SMTP / SESSION_SECRET）
├── next.config.ts                    # Next.js 设定
├── tsconfig.json                     # TypeScript 设定
├── docs/
│   ├── LOGIN_SETUP.md               # 登入系统设定教学
│   └── project.md                   # 测验记录功能开发 Checklist
├── package.json                      # 专案依赖与脚本
└── README.md                         # 专案说明
```

---

## 📖 功能模块详解

### 1. 🏠 首页（`/`）

- **Hero 区域**：渐层背景搭配装饰拼音字元（ā, é, ǐ, ò），醒目的标题与行动按钮
- **四大学习模块卡片**：快速导览到各学习单元
- **数据统计区**：展示各分类的数量（声母 23、韵母 24、整体认读 16、声调 5）

### 2. 📚 学习总览页（`/learn`）

- 以步骤化方式呈现学习路径（Step 1 → Step 4）
- 每个模块卡片包含图标、标题、说明与学习重点列表
- 底部设有「开始测验」的行动呼吁区

### 3. 🔤 声母学习页（`/learn/initials`） — 翠绿色主题

- 展示全部 **23 个声母**（b, p, m, f, d, t, n, l, g, k, h, j, q, x, zh, ch, sh, r, z, c, s, y, w）
- 每张卡片包含：拼音字元、范例字（含发音）、词组（含发音）、记忆口诀
- 前后导航：返回总览 / 前往韵母

### 4. 🎵 韵母学习页（`/learn/finals`） — 天蓝色主题

- 展示全部 **24 个韵母**，分为三大类：
  - **单韵母**（6个）：a, o, e, i, u, ü
  - **复韵母**（9个）：ai, ei, ui, ao, ou, iu, ie, üe, er
  - **鼻韵母**（9个）：an, en, in, un, ün, ang, eng, ing, ong
- 每类独立分区展示，帮助学习者系统化记忆

### 5. 📖 整体认读音节页（`/learn/syllables`） — 紫色主题

- 展示全部 **16 个整体认读音节**（zhi, chi, shi, ri, zi, ci, si, yi, wu, yu, ye, yue, yuan, yin, yun, ying）
- 强调不需拼读、直接整体记忆的学习特点

### 6. 🎶 声调学习页（`/learn/tones`） — 琥珀色主题

- **经典「ma」对比区**：并排展示 mā, má, mǎ, mà，直观感受四声差异
- **五种声调详细卡片**：
  - 第一声（ˉ）调值 55 — 高平调
  - 第二声（ˊ）调值 35 — 上扬调
  - 第三声（ˇ）调值 214 — 先降后升
  - 第四声（ˋ）调值 51 — 下降调
  - 轻声（无符号） — 轻短柔和
- 每个声调卡片附有手势提示，帮助记忆

### 7. ✏️ 互动测验页（`/quiz`）

- **随机出题**：每次测验随机生成 **8 道题目**
  - 5 道声母配对题（根据词组选出对应的声母）
  - 3 道声调辨别题（辨识声调类型）
- **互动机制**：
  - 进度条即时显示答题进度
  - 答题后即时显示正确/错误反馈（绿色=正确、红色=错误）
  - 每题附有详细说明
  - 得分即时累计
- **结果页面**：
  - SVG 圆环图表显示得分比例
  - 答题明细一览（✓/✕）
  - 依分数显示鼓励讯息
  - 提供「再来一次」、「去复习」与「查看记录」按钮
- **记录储存（依登入状态自动切换）**：
  - 🔐 已登入：记录存到云端资料库（跨装置同步）
  - 👤 未登入：记录存到本机 `localStorage`，并显示登入提示

### 8. 🔐 登入页（`/login`）

采用 **Email 验证码（OTP）登入**，无需密码，任何 email 皆可使用。

**两阶段验证流程：**

1. **步骤一（输入 email）**：使用者输入 email → 系统寄送 6 位数验证码
2. **步骤二（输入验证码）**：使用者输入验证码 → 验证成功即登入

**功能特色：**

- **Gmail 寄信**：透过 nodemailer + Gmail 应用程式密码发送验证码邮件（含 HTML 美化版型）
- **安全防护**：
  - 验证码 10 分钟内有效
  - 同一 email 60 秒内只能寄送一次（rate-limit）
  - 验证码使用后即失效
- **使用体验**：
  - 60 秒倒计时防止重复寄送
  - 验证码自动聚焦、数字键盘输入
  - 错误讯息即时反馈
- **登入后**：自动跳转至记录页，并显示搬移本机资料的提示

### 9. 📊 测验记录页（`/history`）

记录使用者每次测验的成绩与逐题作答明细，方便追踪学习进度与复习错题。

**双模式资料来源（依登入状态）：**

- 🔐 **已登入**：从云端资料库读取（跨装置同步，标记「☁️ 云端同步」）
- 👤 **未登入**：从本机 `localStorage` 读取
- 🔄 **自动搬移**：首次登入时，自动将本机既有记录上传到该使用者帐号，并清除本机

**功能特色：**

- **自动记录**：测验完成时自动储存（含每题的题目、选项、正确答案、你的答案、解释）
- **统计摘要**（4 格卡片）：
  - 📝 测验次数
  - 📈 平均分数
  - 🏆 最佳成绩
  - 🆕 最近成绩
- **记录列表**：每笔显示分数圆圈、正确 / 错误数、日期时间
- **展开逐题明细**：点击记录可展开查看：
  - ✅/❌ 正确或错误标记
  - 题目内容、正确答案、你的答案（答错时显示）
  - 💡 解释说明
  - 答题概况（✓/✕ 一览）
- **记录管理**：删除单笔记录 / 清除全部记录（含确认对话框）
- **记录上限**：最多保留 50 笔，超过自动截断

---

## 🎨 设计规范

### 配色系统

| 模块         | Tailwind 色系 | 代表色        | 用途                     |
| ------------ | ------------- | ------------- | ------------------------ |
| 声母         | `emerald`     | 🟢 翠绿       | 拼音的开头辅音           |
| 韵母         | `sky`         | 🔵 天蓝       | 拼音的母音部分           |
| 整体认读音节 | `violet`      | 🟣 紫色       | 整体记忆的特殊音节       |
| 声调         | `amber`       | 🟡 琥珀       | 声调变化                 |
| 主题色       | `emerald/teal`| 🟢 渐层       | 首页 Hero、按钮、导览列  |

### 字体

- **Noto Sans TC**（思源黑体繁体中文）— 透过 `next/font/google` 载入
- 支援完整的中文字元渲染，确保拼音声调符号（ˉˊˇˋ）正确显示

---

## 🚀 快速开始

### 环境需求

- **Node.js** ≥ 18.18.0（推荐 v20+）
- **npm** ≥ 9

### 安装与运行

```bash
# 1. 安装依赖
npm install

# 2. 启动开发服务器
npm run dev

# 3. 打开浏览器
# 访问 http://localhost:3000
```

### 登入系统设定（选用）

登入与云端记录功能需要额外设定资料库与 Gmail。完整步骤请见 [`docs/LOGIN_SETUP.md`](docs/LOGIN_SETUP.md)，摘要如下：

1. **设定 `.env`**（3 个环境变数）：
   - `DATABASE_URL`：Neon 云端 PostgreSQL 连线字串
   - `SMTP_USER` / `SMTP_PASS`：Gmail 地址与应用程式密码
   - `SESSION_SECRET`：JWT 加密密钥
2. **建立资料表**：`npm run db:push`
3. **启动测试**：登入页寄送验证码 → 完成测验 → 记录同步到云端

> 💡 不设定登入系统时，测验记录仍会存到本机 `localStorage`，基础学习功能不受影响。

### 可用脚本

| 指令             | 说明                             |
| ---------------- | -------------------------------- |
| `npm run dev`    | 启动开发服务器（Turbopack）      |
| `npm run build`  | 建置生产版本                     |
| `npm run start`  | 启动生产服务器                   |
| `npm run lint`   | 执行 ESLint 程式码检查           |
| `npm run db:push`| 同步 Schema 至资料库（Prisma）   |
| `npm run db:migrate` | 建立并套用资料库 Migration |
| `npm run db:studio` | 启动 Prisma Studio（资料库视觉化管理） |

---

## 🧩 核心元件说明

### `PronounceButton`

发音按钮元件，使用浏览器的 **Web Speech API**（`window.speechSynthesis`）播放中文语音。

```
Props:
  - text: string       // 要发音的文字
  - size: "sm"|"md"|"lg"  // 按钮大小
  - className?: string    // 自定义样式
```

- 语言设定：`zh-CN`
- 语速：`0.8`（稍慢，适合学习）
- 状态显示：闲置时 🔈、播放中 🔊

### `PinyinCard`

拼音展示卡片，呈现单个拼音单元的完整资讯。

```
Props:
  - item: PinyinItem    // 拼音资料
  - color: "emerald"|"sky"|"violet"|"amber"  // 主题色
```

### `generateQuiz()`

测验出题引擎，位于 `src/data/pinyin.ts`。

- 从声母资料中随机生成 5 道配对题
- 从声调资料中随机生成 3 道辨别题
- 每题提供 4 个选项与详细说明
- 每次调用结果不同，确保测验的多样性

### 测验记录工具库（`src/lib/quiz-history.ts`）

使用浏览器 `localStorage` 储存与读取测验记录，SSR 安全（含可用性检查）。

```
API:
  - saveQuizRecord(score, total, answers)  // 储存一笔记录
  - getQuizHistory()                        // 取得所有记录（最新在前）
  - getQuizStats()                          // 统计摘要（次数 / 平均 / 最佳 / 最近）
  - deleteQuizRecord(id)                    // 删除单笔记录
  - clearQuizHistory()                      // 清除全部记录
  - formatDate(iso)                         // ISO 日期格式化
```

- 记录上限：最多 50 笔，超过自动截断
- 每笔记录包含完整题目快照，可在事后复习
- 未登入时使用此工具库；登入后改用 `quiz-history-cloud.ts`

### 云端测验记录工具库（`src/lib/quiz-history-cloud.ts`）

登入后透过 API 存取云端测验记录，介面与 `quiz-history.ts` 对齐，方便页面切换资料来源。

```
API:
  - saveQuizRecordCloud(score, total, answers)  // 新增一笔到云端
  - getQuizHistoryCloud()                       // 取得云端所有记录
  - deleteQuizRecordCloud(id)                   // 删除云端单笔
  - clearQuizHistoryCloud()                     // 清除云端全部
  - migrateLocalToCloud(records)                // 本机记录批次搬移到云端
```

### Session 管理（`src/lib/session.ts`）

使用 **jose** 签署 JWT，存在 `httpOnly` cookie 中管理登入状态。

```
API:
  - createSession(userId, email)  // 建立 JWT 并写入 cookie（登入时呼叫）
  - getSession()                  // 读取并验证当前 session
  - getCurrentUserId()            // 取得当前登入使用者 ID（API 鉴权用）
  - deleteSession()               // 删除 cookie（登出时呼叫）
```

- Cookie 选项：`httpOnly`、`sameSite=lax`、生产环境启用 `secure`
- 过期时间：7 天
- 密钥由环境变数 `SESSION_SECRET` 提供

### Email 寄送（`src/lib/email.ts`）

使用 **nodemailer** 经由 Gmail SMTP 寄送 OTP 验证码邮件。

- 认证：`SMTP_USER`（Gmail 地址）+ `SMTP_PASS`（应用程式密码）
- 提供 HTML 美化版型（含品牌 logo、验证码醒目显示、过期提醒）
- transporter 建立后快取，避免重复连线

### 登入 Server Actions（`src/app/actions/auth.ts`）

OTP 登入的核心逻辑，透过 `useActionState` 在表单中呼叫。

```
Actions:
  - sendCodeAction(state, formData)    // 步骤一：产生验证码并寄信
  - verifyCodeAction(state, formData)  // 步骤二：验证码校验、建立使用者、登入
  - logoutAction()                     // 登出
```

- **Upssert 使用者**：验证成功时自动建立或取得使用者帐号
- **rate-limit**：同一 email 60 秒内只能寄送一次验证码
- **验证码生命周期**：10 分钟有效，使用后标记为 `used`
- **登入后**：建立 session cookie 并跳转至记录页

---

## 📊 资料结构

### `PinyinItem`（拼音项目）

```typescript
interface PinyinItem {
  pinyin: string;        // 拼音（如 "b"）
  example: string;       // 范例字（如 "波"）
  examplePinyin: string; // 范例字拼音（如 "bō"）
  word: string;          // 词组（如 "玻璃"）
  wordPinyin: string;    // 词组拼音（如 "bō li"）
  tip?: string;          // 记忆口诀（可选）
}
```

### `ToneItem`（声调项目）

```typescript
interface ToneItem {
  name: string;         // 名称（如 "第一声"）
  symbol: string;       // 符号（如 "ˉ"）
  value: string;        // 调值（如 "55"）
  example: string;      // 范例字（如 "妈"）
  examplePinyin: string;// 范例拼音（如 "mā"）
  description: string;  // 描述
  gesture: string;      // 手势提示
}
```

### `QuizQuestion`（测验题目）

```typescript
interface QuizQuestion {
  question: string;    // 题目
  options: string[];   // 4 个选项
  answer: number;      // 正确答案的索引（0-3）
  explanation: string; // 说明
}
```

### `QuizRecord`（测验记录）

```typescript
interface QuizRecord {
  id: string;                      // 唯一 ID
  date: string;                    // ISO 日期字串
  score: number;                   // 答对题数
  total: number;                   // 总题数
  percentage: number;              // 正确率（0-100）
  answers: QuizAnswerRecord[];     // 逐题明细
}

interface QuizAnswerRecord {
  question: string;       // 题目
  options: string[];      // 选项
  correctAnswer: number;  // 正确答案索引
  selectedAnswer: number; // 使用者选择索引
  explanation: string;    // 解释
  isCorrect: boolean;     // 是否答对
}
```

### 资料库模型（Prisma Schema）

登入系统与云端记录使用以下三个资料表，定义于 `prisma/schema.prisma`：

```prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  otpCodes    OtpCode[]
  quizRecords QuizRecord[]
}

model OtpCode {
  id        String   @id @default(cuid())
  email     String
  code      String          // 6 位数验证码
  expiresAt DateTime        // 过期时间
  used      Boolean  @default(false)
  createdAt DateTime @default(now())

  user   User?  @relation(fields: [userId], references: [id], onDelete: Cascade)
  userId String?

  @@index([email, code])
}

model QuizRecord {
  id        String   @id @default(cuid())
  answers   String   // JSON 字串（逐题明细）
  score     Int
  total     Int
  percentage Int
  createdAt DateTime @default(now())

  user   User   @relation(fields: [userId], references: [id], onDelete: Cascade)
  userId String

  @@index([userId, createdAt])
}
```

---

## 🔮 未来展望

- [x] ~~将测验记录迁移至 Prisma + PostgreSQL（搭配帐号系统，跨装置同步）~~ ✅ 已完成
- [x] ~~新增 Email 帐号登入系统~~ ✅ 已完成
- [ ] 增加拼音拼写练习（拼读组合练习）
- [ ] 新增「错题本」：自动汇整历史错题供集中复习
- [ ] 增加更多题型的测验（听力辨识、填空等）
- [ ] 支援繁简体切换
- [ ] 加入语音辨识功能，让学习者练习发音并即时纠正
- [ ] 新增学习成就系统与徽章奖励
- [ ] 图表化学习曲线（折线图显示成绩趋势）
- [ ] 支援 Google OAuth 一键登入（除现有 OTP 外）
- [ ] 加入使用者个人资料编辑（暱称、头像）

---

## 📄 授权资讯

本专案仅供学习用途。拼音学习资料参考自中国教育部《汉语拼音方案》。

---

*让学习拼音变得简单有趣 · 拼音学堂 © 2026*
