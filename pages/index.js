import { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

export default function Home() {
  const [question, setQuestion] = useState('')
  const [conversations, setConversations] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [sessionId] = useState(() => 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9))

  // 處理鍵盤事件
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault() // 防止換行
      handleSubmit(e)
    }
    // Shift+Enter 會自然換行，不需要特別處理
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!question.trim()) return

    setIsLoading(true)

    // 添加用戶問題到對話記錄
    const newConversations = [...conversations, { type: 'question', content: question, timestamp: new Date() }]
    setConversations(newConversations)
    setQuestion('')

    try {
      const response = await fetch('/api/ask', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          question: newConversations[newConversations.length - 1].content,
          sessionId,
          conversationHistory: newConversations.slice(-10) // 只發送最近10條對話記錄
        })
      })

      const data = await response.json()

      if (response.ok) {
        // 添加 AI 回答到對話記錄
        setConversations(prev => [...prev, { 
          type: 'answer', 
          content: data.answer, 
          timestamp: new Date() 
        }])
      } else {
        setConversations(prev => [...prev, { 
          type: 'error', 
          content: data.error || '發生錯誤，請重試。', 
          timestamp: new Date() 
        }])
      }
    } catch (error) {
      setConversations(prev => [...prev, { 
        type: 'error', 
        content: '連接失敗，請檢查網絡連接並重試。', 
        timestamp: new Date() 
      }])
    } finally {
      setIsLoading(false)
      // 提交後自動滾動到最新訊息
      setTimeout(() => {
        const lastMessage = document.querySelector('.conversation-item:last-child')
        if (lastMessage) {
          lastMessage.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'nearest'
          })
        }
      }, 100)
    }
  }

  const clearConversation = () => {
    setConversations([])
    // 清除後聚焦到輸入框
    setTimeout(() => {
      const inputElement = document.querySelector('.question-input')
      if (inputElement) {
        inputElement.focus()
      }
    }, 100)
  }

  return (
    <div className="container">
      <header>
        <h1>GitHub Copilot 問答助手</h1>
        <p>向我提出任何程式相關的問題，我會協助您解答！</p>
      </header>

      <main>
        {conversations.length === 0 && (
          <div className="welcome-section">
            <div className="welcome-card">
              <h2>👋 歡迎使用 AI 程式碼助手！</h2>
              <p>我可以幫您解答各種程式設計問題，包括：</p>
              <div className="feature-list">
                <div className="feature-item">🔧 程式碼除錯與優化</div>
                <div className="feature-item">📚 技術概念解釋</div>
                <div className="feature-item">💡 最佳實踐建議</div>
                <div className="feature-item">🚀 框架與函式庫使用</div>
              </div>
              <p className="tip">💬 <strong>對話記憶</strong>：我會記住我們的對話內容，可以進行連續問答</p>
              <p className="tip">⌨️ <strong>快捷鍵</strong>：按 <kbd>Enter</kbd> 發送，<kbd>Shift + Enter</kbd> 換行</p>
            </div>
          </div>
        )}

        {conversations.length > 0 && (
          <div className="conversation-history">
            {conversations.map((conv, index) => (
              <div key={index} className={`conversation-item ${conv.type}`}>
                {conv.type === 'question' && (
                  <div className="question-bubble">
                    <div className="bubble-header">
                      <span className="user-icon">👤</span>
                      <span className="timestamp">{conv.timestamp.toLocaleTimeString('zh-TW')}</span>
                    </div>
                    <div className="bubble-content">{conv.content}</div>
                  </div>
                )}
                
                {conv.type === 'answer' && (
                  <div className="answer-bubble">
                    <div className="bubble-header">
                      <span className="ai-icon">🤖</span>
                      <span className="timestamp">{conv.timestamp.toLocaleTimeString('zh-TW')}</span>
                    </div>
                    <div className="bubble-content markdown-content">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {conv.content}
                      </ReactMarkdown>
                    </div>
                  </div>
                )}
                
                {conv.type === 'error' && (
                  <div className="error-bubble">
                    <div className="bubble-header">
                      <span className="error-icon">❌</span>
                      <span className="timestamp">{conv.timestamp.toLocaleTimeString('zh-TW')}</span>
                    </div>
                    <div className="bubble-content">{conv.content}</div>
                  </div>
                )}
              </div>
            ))}
            
            {isLoading && (
              <div className="conversation-item answer">
                <div className="answer-bubble loading-bubble">
                  <div className="bubble-header">
                    <span className="ai-icon">🤖</span>
                    <span className="timestamp">思考中...</span>
                  </div>
                  <div className="bubble-content">
                    <div className="typing-indicator">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* 固定在底部的輸入區域 */}
      <div className="input-container">
        {conversations.length > 0 && (
          <div className="chat-controls">
            <button onClick={clearConversation} className="clear-btn">
              🗑️ 清除對話
            </button>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="question-form">
          <div className="input-group">
            <textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="在這裡輸入您的程式問題... (Enter發送，Shift+Enter換行)"
              className="question-input"
              rows="3"
              disabled={isLoading}
            />
          </div>
          <button 
            type="submit" 
            disabled={!question.trim() || isLoading}
            className={`submit-button ${isLoading ? 'loading' : ''}`}
          >
            {isLoading ? '思考中...' : '發送 ⏎'}
          </button>
        </form>
      </div>

      {/* 管理員統計連結 */}
      <div className="stats-link">
        <a 
          href="/api/stats?key=admin123" 
          target="_blank"
          rel="noopener noreferrer"
        >
          📊 統計
        </a>
      </div>

      <style jsx>{`
        .container {
          min-height: 100vh;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          display: flex;
          flex-direction: column;
          padding-bottom: 200px; /* 為固定輸入框留空間 */
        }

        header {
          text-align: center;
          padding: 2rem 2rem 1rem 2rem;
          flex-shrink: 0;
        }

        h1 {
          color: white;
          font-size: 2.5rem;
          font-weight: 700;
          margin-bottom: 1rem;
          text-shadow: 0 2px 4px rgba(0,0,0,0.3);
        }

        header p {
          color: rgba(255, 255, 255, 0.9);
          font-size: 1.1rem;
          max-width: 600px;
          margin: 0 auto;
        }

        main {
          flex: 1;
          padding: 0 2rem;
          overflow-y: auto;
          max-width: 800px;
          margin: 0 auto;
          width: 100%;
        }

        .input-container {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          border-top: 1px solid rgba(255, 255, 255, 0.2);
          padding: 1rem 2rem 2rem 2rem;
          box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.1);
          z-index: 100;
        }

        .chat-controls {
          display: flex;
          justify-content: center;
          margin-bottom: 1rem;
        }

        .clear-btn {
          background: rgba(102, 126, 234, 0.1);
          color: #667eea;
          border: 1px solid rgba(102, 126, 234, 0.3);
          padding: 0.5rem 1rem;
          border-radius: 0.5rem;
          cursor: pointer;
          font-size: 0.9rem;
          transition: all 0.2s ease;
        }

        .clear-btn:hover {
          background: rgba(102, 126, 234, 0.2);
        }

        .question-form {
          max-width: 800px;
          margin: 0 auto;
          display: flex;
          gap: 1rem;
          align-items: flex-end;
        }

        .input-group {
          flex: 1;
        }

        .question-input {
          width: 100%;
          padding: 1rem;
          border: 2px solid #e2e8f0;
          border-radius: 0.75rem;
          font-size: 1rem;
          font-family: inherit;
          resize: vertical;
          min-height: 60px;
          transition: border-color 0.2s ease, box-shadow 0.2s ease;
          background: white;
        }

        .question-input:focus {
          outline: none;
          border-color: #667eea;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }

        .question-input:disabled {
          background-color: #f8f9fa;
          cursor: not-allowed;
        }

        .submit-button {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 1rem 1.5rem;
          border: none;
          border-radius: 0.75rem;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
          flex-shrink: 0;
        }

        .submit-button:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(102, 126, 234, 0.6);
        }

        .submit-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }

        .submit-button.loading {
          position: relative;
          color: transparent;
        }

        .submit-button.loading::after {
          content: '';
          position: absolute;
          width: 20px;
          height: 20px;
          top: 50%;
          left: 50%;
          margin-left: -10px;
          margin-top: -10px;
          border: 2px solid transparent;
          border-top: 2px solid white;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .welcome-section {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 60vh;
          padding: 2rem 0;
        }

        .welcome-card {
          background: rgba(255, 255, 255, 0.95);
          padding: 2rem;
          border-radius: 1rem;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
          backdrop-filter: blur(10px);
          text-align: center;
          max-width: 600px;
        }

        .welcome-card h2 {
          color: #2d3748;
          margin-bottom: 1rem;
          font-size: 1.5rem;
        }

        .welcome-card p {
          color: #4a5568;
          margin-bottom: 1rem;
          line-height: 1.6;
        }

        .feature-list {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.5rem;
          margin: 1rem 0;
          text-align: left;
        }

        .feature-item {
          color: #667eea;
          font-size: 0.9rem;
          padding: 0.25rem;
        }

        .tip {
          font-size: 0.9rem;
          color: #6b7280 !important;
          margin: 0.5rem 0 !important;
        }

        .tip kbd {
          background: #f3f4f6;
          border: 1px solid #d1d5db;
          border-radius: 3px;
          padding: 2px 4px;
          font-family: monospace;
          font-size: 0.8em;
        }

        .conversation-history {
          padding-bottom: 2rem;
        }

        .conversation-item {
          margin-bottom: 1.5rem;
        }

        .question-bubble, .answer-bubble, .error-bubble {
          background: white;
          border-radius: 1rem;
          padding: 1.5rem;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
          position: relative;
        }

        .question-bubble {
          background: linear-gradient(135deg, #e3f2fd 0%, #f3e5f5 100%);
          margin-left: 2rem;
        }

        .answer-bubble {
          background: white;
          margin-right: 2rem;
        }

        .error-bubble {
          background: linear-gradient(135deg, #ffebee 0%, #fce4ec 100%);
          margin-left: 2rem;
        }

        .loading-bubble {
          background: #f8f9fa;
        }

        .bubble-header {
          display: flex;
          align-items: center;
          margin-bottom: 1rem;
          padding-bottom: 0.5rem;
          border-bottom: 1px solid rgba(0, 0, 0, 0.1);
        }

        .user-icon, .ai-icon, .error-icon {
          font-size: 1.5rem;
          margin-right: 0.75rem;
        }

        .timestamp {
          font-size: 0.8rem;
          color: #6b7280;
          margin-left: auto;
        }

        .bubble-content {
          color: #2d3748;
          line-height: 1.6;
        }

        .typing-indicator {
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .typing-indicator span {
          height: 8px;
          width: 8px;
          background: #667eea;
          border-radius: 50%;
          animation: typing 1.4s infinite ease-in-out;
        }

        .typing-indicator span:nth-child(2) {
          animation-delay: 0.2s;
        }

        .typing-indicator span:nth-child(3) {
          animation-delay: 0.4s;
        }

        @keyframes typing {
          0%, 60%, 100% {
            transform: scale(1);
            opacity: 0.5;
          }
          30% {
            transform: scale(1.2);
            opacity: 1;
          }
        }

        .stats-link {
          position: fixed;
          top: 1rem;
          right: 1rem;
          z-index: 1000;
        }

        .stats-link a {
          color: rgba(255, 255, 255, 0.8);
          font-size: 0.8rem;
          text-decoration: none;
          padding: 4px 8px;
          border-radius: 4px;
          background: rgba(255, 255, 255, 0.1);
          transition: all 0.2s ease;
        }

        .stats-link a:hover {
          background: rgba(255, 255, 255, 0.2);
          color: white;
        }

        @media (max-width: 768px) {
          .container {
            padding-bottom: 220px;
          }

          header {
            padding: 1rem;
          }

          h1 {
            font-size: 2rem;
          }

          main {
            padding: 0 1rem;
          }

          .input-container {
            padding: 1rem;
          }

          .question-form {
            flex-direction: column;
            gap: 0.5rem;
          }

          .submit-button {
            width: 100%;
          }

          .question-bubble, .answer-bubble, .error-bubble {
            margin-left: 0.5rem;
            margin-right: 0.5rem;
          }

          .feature-list {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  )
}
