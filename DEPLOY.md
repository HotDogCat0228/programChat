# 🚀 部署指南

## 一鍵部署到 Vercel (推薦)

### 第一步：準備 API 金鑰
1. 前往 [Google AI Studio](https://aistudio.google.com/app/apikey)
2. 登入你的 Google 帳號
3. 點擊 "Create API Key"
4. 複製生成的 API 金鑰 (格式類似：`AIzaSyxxxxxxxxx`)

### 第二步：部署到 Vercel
1. 點擊下方按鈕開始部署：

   [![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/HotDogCat0228/programChat&project-name=program-chat&repository-name=program-chat)

2. 使用 GitHub 帳號登入 Vercel
3. 選擇你的 GitHub 帳號
4. 為專案命名（例如：`my-copilot-ask`）

### 第三步：設定環境變數
在 Vercel 部署頁面中，添加以下環境變數：

| 變數名稱 | 值 | 說明 |
|---------|---|------|
| `GEMINI_API_KEY` | `你的Gemini API金鑰` | 從 Google AI Studio 取得 |
| `ADMIN_KEY` | `你自己設定的密碼` | 用於查看統計頁面 |

### 第四步：完成部署
1. 點擊 "Deploy" 按鈕
2. 等待部署完成（約 1-2 分鐘）
3. 點擊 "Visit" 查看你的網站

## 🎉 恭喜！

你的 Copilot Ask 網站現在已經上線了！

### 功能測試
- **主頁面**: 測試問答功能
- **統計頁面**: `你的域名/api/stats?key=你的管理員密碼`

### 自訂域名（可選）
1. 在 Vercel 專案設定中點擊 "Domains"
2. 添加你的自訂域名
3. 按照指示設定 DNS

## 📊 使用統計

你的網站會自動追蹤：
- 總請求數
- 每日使用量
- 用戶分布
- 錯誤率

所有數據都是匿名化的，保護用戶隱私。

## 🔧 進階設定

### 修改 AI 行為
編輯 `pages/api/ask.js` 文件中的 `systemPrompt` 變數。

### 調整介面
修改 `pages/index.js` 中的樣式和佈局。

### 監控與警告
考慮設定 Vercel 的監控功能來追蹤網站效能。

## ❓ 常見問題

**Q: API 配額不夠用怎麼辦？**
A: Google Gemini 免費版每日有 1,500 次請求限制。可以升級到付費版或考慮添加多個 AI 服務。

**Q: 網站載入很慢？**
A: Vercel 的免費版在閒置後需要冷啟動。考慮升級到 Pro 版本以獲得更好的效能。

**Q: 如何備份數據？**
A: 統計數據存儲在記憶體中，重啟會重置。如需持久化存儲，可以整合資料庫服務。

## 🆘 需要幫助？

- [開啟 GitHub Issue](https://github.com/HotDogCat0228/programChat/issues)
- [查看 Vercel 文檔](https://vercel.com/docs)
- [Google Gemini API 文檔](https://ai.google.dev/docs)
