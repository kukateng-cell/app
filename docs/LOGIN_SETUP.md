# 登入系統設定指南

本專案已內建 **Email 驗證碼登入（OTP）** 與 **雲端測驗記錄** 功能。
要讓功能實際運作，需要完成以下三項設定（約 10 分鐘）。

---

## 設定一：Neon 資料庫（免費雲端 PostgreSQL）

測驗記錄和使用者資料需要存在資料庫裡，Neon 提供免費方案。

1. 前往 https://neon.tech 註冊（可用 Google 帳號直接登入）
2. 建立新專案（New Project）
   - Name：`pinyin`（自取）
   - Region：選離你最近的（例：AWS Singapore）
   - PostgreSQL version：預設即可
3. 在 Dashboard 首頁找到 **Connection Details**
4. 複製 **Connection string**，格式類似：
   ```
   postgresql://neondb_owner:xxxxx@ep-aaa-bbb.ap-southeast-1.aws.neon.tech/neondb?sslmode=require
   ```
5. 貼到專案的 `.env` 檔的 `DATABASE_URL`：
   ```env
   DATABASE_URL="postgresql://neondb_owner:xxxxx@ep-aaa-bbb...neon.tech/neondb?sslmode=require"
   ```

---

## 設定二：Gmail 應用程式密碼（寄驗證碼用）

Google 已停用「低安全性應用程式」，必須用「應用程式密碼」才能透過 Gmail 寄信。

### 步驟

1. 登入 Google 帳號 → https://myaccount.google.com
2. 左側選 **安全性**
3. 確認 **兩步驟驗證（2-Step Verification）** 已開啟
   - 若未開啟，先開啟它（需要一支手機收碼）
4. 在安全性頁面搜尋 **應用程式密碼（App Passwords）**
   - 直接連結：https://myaccount.google.com/apppasswords
5. 輸入名稱（例：`pinyin-site`）→ 建立
6. 畫面會顯示一個 **16 位密碼**（4-4-4-4 格式）
7. 複製這組密碼（**去掉空格**），填入 `.env`：
   ```env
   SMTP_USER="你的@gmail.com"
   SMTP_PASS="abcd1234efgh5678"   # 16位應用程式密碼，不含空格
   ```

> ⚠️ 這組密碼只會顯示一次，請妥善保管。它**不是**你的 Google 登入密碼。

---

## 設定三：Session 加密密鑰

用來簽署登入的 cookie，避免被竄改。在終端機執行：

```powershell
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

複製輸出的亂數字串，填入 `.env`：

```env
SESSION_SECRET="剛剛產生的長字串"
```

---

## 設定四：建立資料表（Migration）

完成上述三項設定後，在**專案目錄**執行：

```powershell
cd C:\Users\kukat\OneDrive\Desktop\aa\elegant-clock-3
npm run db:push
```

這會把資料表結構同步到 Neon 資料庫。看到 `🚀 Your database is now in sync` 即成功。

---

## 啟動與測試

```powershell
npm run dev
```

1. 打開 http://localhost:3000
2. 點右上角 **登入**
3. 輸入 email → 收驗證碼 → 輸入驗證碼 → 登入成功
4. 做測驗，記錄會存到你的帳號（雲端）
5. 換瀏覽器登入同一 email，記錄還在 ✅

---

## 常見問題

### Q: 驗證碼收不到？
- 檢查垃圾郵件匣
- 確認 `.env` 的 `SMTP_USER` / `SMTP_PASS` 正確
- 看終端機是否有 `寄信失敗` 的錯誤訊息

### Q: `db:push` 報錯？
- 確認 `DATABASE_URL` 連線字串完整（含 `?sslmode=require`）
- 確認網路能連到 Neon

### Q: `npm` 報 `ENOENT: package.json`？
- 你不在專案目錄。在 VS Code 用 `Ctrl+~` 開終端機，或先 `cd` 到專案目錄。
