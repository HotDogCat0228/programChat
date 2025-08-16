const { getAnalytics } = require('../../lib/analytics');

export default function handler(req, res) {
  // 直接使用內建的管理員金鑰
  const ADMIN_KEY = process.env.ADMIN_KEY || 'admin123';
  const adminKey = req.query.key;
  if (adminKey !== ADMIN_KEY) {
    return res.status(401).json({ error: '需要管理員權限' });
  }

  try {
    const stats = getAnalytics();
    
    // 返回 HTML 格式的統計頁面
    const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Copilot Ask - 流量統計</title>
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body { 
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          max-width: 800px; 
          margin: 0 auto; 
          padding: 20px;
          background: #f5f5f5;
        }
        .card {
          background: white;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          margin: 20px 0;
        }
        .stat-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 15px;
          margin: 20px 0;
        }
        .stat-item {
          text-align: center;
          padding: 15px;
          background: #f8f9fa;
          border-radius: 6px;
        }
        .stat-number {
          font-size: 2em;
          font-weight: bold;
          color: #2563eb;
        }
        .stat-label {
          color: #6b7280;
          font-size: 0.9em;
        }
        .hourly-chart {
          display: flex;
          align-items: end;
          height: 100px;
          gap: 4px;
          margin: 20px 0;
        }
        .hour-bar {
          flex: 1;
          background: #3b82f6;
          min-height: 4px;
          border-radius: 2px 2px 0 0;
          display: flex;
          align-items: end;
          justify-content: center;
          color: white;
          font-size: 0.7em;
        }
        h1 { color: #1f2937; text-align: center; }
        h2 { color: #374151; border-bottom: 2px solid #e5e7eb; padding-bottom: 8px; }
        .refresh-btn {
          background: #10b981;
          color: white;
          padding: 8px 16px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          margin: 10px 0;
        }
        .refresh-btn:hover { background: #059669; }
        .time { color: #6b7280; font-size: 0.9em; text-align: center; }
      </style>
    </head>
    <body>
      <h1>🤖 Copilot Ask - 流量統計</h1>
      
      <div class="card">
        <div class="stat-grid">
          <div class="stat-item">
            <div class="stat-number">${stats.總請求數}</div>
            <div class="stat-label">總請求數</div>
          </div>
          <div class="stat-item">
            <div class="stat-number">${stats.今日請求}</div>
            <div class="stat-label">今日請求</div>
          </div>
          <div class="stat-item">
            <div class="stat-number">${stats.成功率}</div>
            <div class="stat-label">成功率</div>
          </div>
        </div>
      </div>

      <div class="card">
        <h2>💬 對話功能</h2>
        <p><strong>✅ 上下文記憶</strong>: 支援連續對話，AI 可以參考之前的問題和回答</p>
        <p><strong>🔄 會話管理</strong>: 每個用戶會話獨立追蹤，支援多輪對話</p>
        <p><strong>📝 對話記錄</strong>: 即時顯示問答歷史，可一鍵清除</p>
        <p><strong>⚡ 智能回應</strong>: AI 能理解「之前的問題」、「剛才提到的」等上下文</p>
          <div class="stat-item">
            <div class="stat-number">${stats.活躍會話}</div>
            <div class="stat-label">活躍會話</div>
          </div>
          <div class="stat-item">
            <div class="stat-number">${stats.平均對話輪數}</div>
            <div class="stat-label">平均對話輪數</div>
          </div>
        </div>
      </div>

      <div class="card">
        <h2>📊 每小時請求分布</h2>
        <div class="hourly-chart">
          ${Array.from({length: 24}, (_, i) => {
            const count = stats.每小時分布[i] || 0;
            const maxCount = Math.max(...Object.values(stats.每小時分布), 1);
            const height = (count / maxCount) * 80 + 4;
            return `<div class="hour-bar" style="height: ${height}px" title="${i}:00-${i+1}:00: ${count} 次">${count > 0 ? count : ''}</div>`;
          }).join('')}
        </div>
        <div style="display: flex; justify-content: space-between; font-size: 0.8em; color: #6b7280;">
          <span>0時</span>
          <span>6時</span>
          <span>12時</span>
          <span>18時</span>
          <span>23時</span>
        </div>
        <p><strong>熱門時段:</strong> ${stats.熱門時段}</p>
      </div>

      <div class="card">
        <h2>🔧 系統資訊</h2>
        <p><strong>錯誤次數:</strong> ${stats.錯誤次數}</p>
        <p><strong>最後更新:</strong> ${new Date().toLocaleString('zh-TW')}</p>
        <button class="refresh-btn" onclick="window.location.reload()">刷新數據</button>
      </div>

      <div class="time">
        自動刷新: 每 30 秒
      </div>

      <script>
        // 每 30 秒自動刷新
        setTimeout(() => {
          window.location.reload();
        }, 30000);
      </script>
    </body>
    </html>`;

    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.status(200).send(html);
    
  } catch (error) {
    console.error('統計頁面錯誤:', error);
    res.status(500).json({ error: '無法載入統計資料' });
  }
}
