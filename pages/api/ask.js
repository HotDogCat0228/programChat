const { trackRequest, trackError } = require('../../lib/analytics');

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { question } = req.body;
    
    // 獲取用戶 IP (用於匿名統計)
    const userIP = req.headers['x-forwarded-for'] || 
                   req.headers['x-real-ip'] || 
                   req.connection.remoteAddress || 
                   req.socket.remoteAddress ||
                   '127.0.0.1';

    if (!question || question.trim() === '') {
      return res.status(400).json({ error: '請輸入問題' });
    }

    // 記錄請求到流量追蹤
    trackRequest(userIP, question);

    // 檢查是否有 Gemini API 金鑰
    if (!process.env.GEMINI_API_KEY) {
      const mockAnswer = `⚠️ **需要設定 AI API 金鑰**

**你的問題**: ${question}

要啟用真正的 AI 回答，請設定 API 金鑰：

1. **Google Gemini (免費)**: https://ai.google.dev/
2. **OpenAI GPT (付費)**: https://platform.openai.com/api-keys

在 \`.env.local\` 檔案中加入：
\`\`\`
GEMINI_API_KEY=你的金鑰
\`\`\`

然後重新啟動伺服器。`;
      
      return res.status(200).json({ answer: mockAnswer });
    }

    // 動態導入 Google Generative AI（相容 Node.js v12）
    let answer;
    try {
      const { GoogleGenerativeAI } = require('@google/generative-ai');
      const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
      
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      
      console.log('📊 API 請求詳情:');
      console.log('- 時間:', new Date().toLocaleString('zh-TW'));
      console.log('- 問題長度:', question.length, '字元');
      console.log('- 免費限制: 15 請求/分鐘, 1500 請求/日');
      
      const systemPrompt = "你是一個程式碼助手，類似 GitHub Copilot。請用繁體中文回答程式碼相關問題。\n\n特點：\n- 提供清楚、實用的程式碼建議\n- 包含程式碼範例和解釋\n- 重點是實務應用和最佳實踐\n- 可以回答各種程式語言的問題（JavaScript、TypeScript、Python、React、Next.js 等）\n- 用 Markdown 格式回答，包含程式碼區塊\n\n請保持回答簡潔但完整，重點放在實用性。";
      
      const fullPrompt = systemPrompt + "\n\n問題：" + question;

      const result = await model.generateContent(fullPrompt);
      const response = await result.response;
      answer = response.text();
      
      // 添加用量資訊到回答末尾
      const usageInfo = `\n\n---\n📊 **API 用量資訊**:\n- 使用模型: Gemini-1.5-Flash (免費)\n- 免費限制: 15 請求/分鐘, 1,500 請求/日\n- 查看詳細用量: [Google AI Studio](https://aistudio.google.com/app/apikey)`;
      answer = answer + usageInfo;
      
    } catch (error) {
      console.error('Gemini API 錯誤:', error);
      
      // 記錄錯誤到追蹤系統
      trackError(error, userIP);
      
      let errorMessage = '🤖 AI 服務暫時無法使用';
      if (error.message && error.message.includes('API_KEY_INVALID')) {
        errorMessage = '❌ Gemini API 金鑰無效，請檢查 .env.local 檔案中的 API 金鑰';
      } else if (error.message && error.message.includes('QUOTA_EXCEEDED')) {
        errorMessage = '⚠️ API 配額已用完，請稍後再試';
      }
      
      return res.status(500).json({ error: errorMessage });
    }

    return res.status(200).json({ answer });

  } catch (error) {
    console.error('API 錯誤:', error);
    
    // 記錄錯誤到追蹤系統
    const userIP = req.headers['x-forwarded-for'] || 
                   req.headers['x-real-ip'] || 
                   req.connection.remoteAddress || 
                   '127.0.0.1';
    trackError(error, userIP);
    
    return res.status(500).json({ error: '發生錯誤，請稍後再試。' });
  }
}
