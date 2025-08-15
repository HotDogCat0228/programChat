// import OpenAI from 'openai';
// import { GoogleGenerativeAI } from '@google/generative-ai';

// 初始化 AI 客戶端
// const openai = process.env.OPENAI_API_KEY ? new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY,
// }) : null;

// const genAI = process.env.GEMINI_API_KEY ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY) : null;

export default async function handler(req, res) {
  // 只允許 POST 請求
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { question } = req.body;

    if (!question || question.trim() === '') {
      return res.status(400).json({ error: '請輸入問題' });
    }

    // 暫時提供模擬回答以測試基本功能
    const mockAnswer = `🤖 **Copilot 助手回答** (模擬模式)

**你的問題**: ${question}

**程式碼建議**:
\`\`\`javascript
// 這是一個範例回答
function exampleFunction() {
  console.log("Hello from Copilot!");
  return "success";
}
\`\`\`

📝 **說明**: 這是模擬回答。要啟用真正的 AI 回答，請設定 API 金鑰：

1. **Google Gemini (免費)**: https://ai.google.dev/
2. **OpenAI GPT (付費)**: https://platform.openai.com/api-keys

在 \`.env.local\` 檔案中加入：
\`\`\`
GEMINI_API_KEY=你的金鑰
\`\`\``;

    return res.status(200).json({ answer: mockAnswer });

  } catch (error) {
    console.error('API 錯誤:', error);
    return res.status(500).json({ error: '發生錯誤，請稍後再試。' });
  }
}
