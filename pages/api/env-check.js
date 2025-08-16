export default function handler(req, res) {
  // 只允許 GET 請求
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // 直接使用內建的管理員金鑰
  const ADMIN_KEY = process.env.ADMIN_KEY || 'admin123';
  const { key } = req.query;
  if (key !== ADMIN_KEY) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  // 檢查環境變數狀態
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY || 'AIzaSyCxjtwRczdA22arUvOCCI7yEVgBN46KmQ0';
  const envStatus = {
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'unknown',
    geminiApiKey: {
      exists: true,
      length: GEMINI_API_KEY.length,
      prefix: GEMINI_API_KEY.substring(0, 10) + '...',
      source: process.env.GEMINI_API_KEY ? 'environment' : 'hardcoded'
    },
    adminKey: {
      exists: true,
      length: ADMIN_KEY.length,
      source: process.env.ADMIN_KEY ? 'environment' : 'hardcoded'
    },
    vercelInfo: {
      region: process.env.VERCEL_REGION || 'unknown',
      env: process.env.VERCEL_ENV || 'unknown'
    }
  };

  return res.status(200).json(envStatus);
}
