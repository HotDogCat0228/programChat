export default function Home() {
  return (
    <div style={{ 
      padding: '2rem', 
      textAlign: 'center',
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h1>🤖 Copilot Ask - 測試頁面</h1>
      <p>如果你看到這個頁面，表示部署成功！</p>
      <p>現在讓我們載入完整版本...</p>
      
      <div style={{ 
        background: 'rgba(255,255,255,0.1)',
        padding: '1rem',
        borderRadius: '8px',
        margin: '2rem 0'
      }}>
        <h2>✅ 部署狀態檢查</h2>
        <p>✅ Next.js 正常運行</p>
        <p>✅ React 組件載入成功</p>
        <p>✅ CSS 樣式正常</p>
      </div>
      
      <button 
        onClick={() => window.location.reload()}
        style={{
          background: '#10b981',
          color: 'white',
          border: 'none',
          padding: '1rem 2rem',
          borderRadius: '8px',
          fontSize: '1rem',
          cursor: 'pointer'
        }}
      >
        🔄 重新載入
      </button>
    </div>
  )
}
