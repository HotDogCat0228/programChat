import { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

export default function Home() {
  const [question, setQuestion] = useState('')
  const [conversations, setConversations] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [sessionId] = useState(() => 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9))

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
          question,
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
    }
  }

  const clearConversation = () => {
    setConversations([])
  }

  return (
    <div className="container">
      <header>
        <h1>GitHub Copilot 問答助手</h1>
        <p>向我提出任何程式相關的問題，我會協助您解答！</p>
      </header>

      <main>
        <form onSubmit={handleSubmit} className="question-form">
          <div className="input-group">
            <textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="在這裡輸入您的程式問題..."
              className="question-input"
              rows="4"
              disabled={isLoading}
            />
          </div>
          <button 
            type="submit" 
            disabled={!question.trim() || isLoading}
            className={`submit-button ${isLoading ? 'loading' : ''}`}
          >
            {isLoading ? '思考中...' : '發送問題'}
          </button>
        </form>

        {conversations.length > 0 && (
          <div className="conversation-history">
            <div className="history-header">
              <h3>對話記錄</h3>
              <button onClick={clearConversation} className="clear-btn">
                🗑️ 清除記錄
              </button>
            </div>
            
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

      {/* 管理員統計連結 */}
      <div style={{ textAlign: 'center', marginTop: '1rem', opacity: 0.6 }}>
        <a 
          href="/api/stats?key=admin123" 
          target="_blank"
          style={{ 
            color: '#ffffff', 
            fontSize: '0.8rem', 
            textDecoration: 'none',
            padding: '4px 8px',
            borderRadius: '4px',
            background: 'rgba(255,255,255,0.1)'
          }}
        >
          📊 統計
        </a>
      </div>

      <style jsx>{`
        .container {
          min-height: 100vh;
          padding: 2rem;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
        }

        header {
          text-align: center;
          margin-bottom: 3rem;
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
          max-width: 800px;
          margin: 0 auto;
        }

        .question-form {
          background: white;
          padding: 2rem;
          border-radius: 1rem;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
          margin-bottom: 2rem;
          backdrop-filter: blur(10px);
        }

        .input-group {
          margin-bottom: 1.5rem;
        }

        .question-input {
          width: 100%;
          padding: 1rem;
          border: 2px solid #e2e8f0;
          border-radius: 0.75rem;
          font-size: 1rem;
          font-family: inherit;
          resize: vertical;
          min-height: 120px;
          transition: border-color 0.2s ease, box-shadow 0.2s ease;
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
          padding: 1rem 2rem;
          border: none;
          border-radius: 0.75rem;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
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

        .answer-section {
          background: white;
          padding: 2rem;
          border-radius: 1rem;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
        }

        .answer-section h3 {
          color: #2d3748;
          font-size: 1.25rem;
          font-weight: 600;
          margin-bottom: 1rem;
          padding-bottom: 0.5rem;
          border-bottom: 2px solid #e2e8f0;
        }

        .answer-content {
          color: #4a5568;
          line-height: 1.7;
        }

        .conversation-history {
          max-width: 800px;
          margin: 0 auto 2rem;
        }

        .history-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
          padding: 0 1rem;
        }

        .history-header h3 {
          color: white;
          margin: 0;
          font-size: 1.2rem;
        }

        .clear-btn {
          background: rgba(255, 255, 255, 0.1);
          color: white;
          border: 1px solid rgba(255, 255, 255, 0.2);
          padding: 0.5rem 1rem;
          border-radius: 0.5rem;
          cursor: pointer;
          font-size: 0.9rem;
          transition: all 0.2s ease;
        }

        .clear-btn:hover {
          background: rgba(255, 255, 255, 0.2);
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

        @media (max-width: 768px) {
          .container {
            padding: 1rem;
          }

          h1 {
            font-size: 2rem;
          }

          .question-form, .answer-section {
            padding: 1.5rem;
          }
        }
      `}</style>
    </div>
  )
}
