# 🤖 Copilot Ask - AI 程式碼問答助手

一個簡潔美觀的 AI 程式碼問答網站，使用 Next.js + Google Gemini API 構建。

![Copilot Ask](https://img.shields.io/badge/Next.js-12.2.5-black?style=for-the-badge&logo=next.js)
![Gemini API](https://img.shields.io/badge/Google-Gemini%20API-4285f4?style=for-the-badge&logo=google)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

## ✨ 功能特色

- 🆓 **完全免費** - 使用 Google Gemini API 免費額度
- 🎨 **美觀介面** - 響應式設計，支援手機和桌面
- 🤖 **智能回答** - 專門優化的程式碼問答助手
- 📊 **流量統計** - 內建簡易流量追蹤系統
- � **一鍵部署** - 支援 Vercel 自動部署
- 🇹🇼 **繁體中文** - 完全本地化介面

## 🎯 線上展示

[🔗 立即體驗](https://hotdog-ai-chat-2025.vercel.app) (部署完成後可用)

## 🚀 快速部署

### 1. Fork 此專案
點擊右上角的 **Fork** 按鈕

### 2. 部署到 Vercel
[![Deploy to Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FHotDogCat0228%2FprogramChat.git&project-name=hotdog-ai-chat-2025)

### 3. 設定環境變數
在 Vercel 專案設定中添加：
```
GEMINI_API_KEY=你的Google_Gemini_API金鑰
ADMIN_KEY=你的管理員密碼
```

### 4. 完成！
網站會自動建置和部署 🎉

## 🛠️ 本地開發

```bash
# 1. 克隆專案
git clone https://github.com/HotDogCat0228/programChat.git
cd programChat

# 2. 安裝依賴
npm install

# 3. 複製環境變數檔案
cp .env.local.example .env.local

# 4. 編輯 .env.local，添加你的 API 金鑰
# GEMINI_API_KEY=你的金鑰
# ADMIN_KEY=你的管理員密碼

# 5. 啟動開發伺服器
npm run dev
```

## 🔑 API 金鑰取得

### Google Gemini API (免費)
1. 前往 [Google AI Studio](https://aistudio.google.com/app/apikey)
2. 創建新的 API 金鑰
3. 複製金鑰到 `.env.local`

**免費限制：**
- 每分鐘 15 次請求
- 每日 1,500 次請求
- 完全免費使用

## 📊 流量統計

訪問 `/api/stats?key=你的管理員密碼` 查看：
- 總請求數和今日請求
- 活躍用戶統計
- 24小時使用分布圖
- 成功率和錯誤追蹤

## 🏗️ 技術架構

- **Frontend**: Next.js 12 + React 17
- **Styling**: Styled-JSX (內建 CSS-in-JS)
- **AI API**: Google Gemini 1.5 Flash
- **部署**: Vercel (推薦)
- **Node.js**: v12+ (相容舊版本)

## 📁 專案結構

```
copilot-ask/
├── pages/
│   ├── index.js          # 主頁面
│   └── api/
│       ├── ask.js        # AI 問答 API
│       └── stats.js      # 統計頁面 API
├── lib/
│   └── analytics.js      # 流量追蹤邏輯
├── styles/
│   └── globals.css       # 全域樣式
└── .env.local           # 環境變數
```

## � 自訂配置

### 修改 AI 提示詞
編輯 `pages/api/ask.js` 中的 `systemPrompt`：
```javascript
const systemPrompt = "你是一個程式碼助手...";
```

### 調整介面樣式
編輯 `pages/index.js` 中的 `<style jsx>`

### 新增功能
- 添加用戶登入系統
- 整合更多 AI 模型
- 新增對話歷史記錄
- 支援程式碼語法高亮

## 🤝 貢獻

歡迎提交 Issue 和 Pull Request！

1. Fork 專案
2. 創建功能分支 (`git checkout -b feature/amazing-feature`)
3. 提交變更 (`git commit -m 'Add some amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 開啟 Pull Request

## 📄 授權

此專案採用 MIT 授權 - 查看 [LICENSE](LICENSE) 檔案了解詳情

## � 致謝

- [Next.js](https://nextjs.org/) - React 全端框架
- [Google Gemini](https://ai.google.dev/) - 免費 AI API
- [Vercel](https://vercel.com/) - 免費部署平台

---

⭐ 如果這個專案對你有幫助，請給個 Star！

📧 有問題嗎？[開啟 Issue](https://github.com/HotDogCat0228/programChat/issues/new)
