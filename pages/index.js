import { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

export default function Home() {
  const [question, setQuestion] = useState('')
  const [answer, setAnswer] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!question.trim()) return

    setIsLoading(true)
    setAnswer('')

    try {
      const response = await fetch('/api/ask', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ question })
      })

      const data = await response.json()

      if (response.ok) {
        setAnswer(data.answer)
      } else {
        setAnswer(data.error || '發生錯誤，請重試。')
      }
    } catch (error) {
      setAnswer('連接失敗，請檢查網絡連接並重試。')
    } finally {
      setIsLoading(false)
    }
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

        {answer && (
          <div className="answer-section">
            <h3>回答：</h3>
            <div className="answer-content markdown-content">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {answer}
              </ReactMarkdown>
            </div>
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
