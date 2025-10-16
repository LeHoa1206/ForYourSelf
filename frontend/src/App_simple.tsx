import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

// Simple Home Page
const HomePage: React.FC = () => {
  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h1 style={{ fontSize: '3rem', marginBottom: '20px' }}>🎉 VIP English Learning</h1>
      <p style={{ fontSize: '1.2rem', marginBottom: '40px' }}>Hệ thống học tiếng Anh đỉnh cao</p>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', maxWidth: '800px' }}>
        <a href="/dashboard" style={{ 
          background: 'rgba(255, 255, 255, 0.2)', 
          padding: '20px', 
          borderRadius: '15px', 
          textDecoration: 'none', 
          color: 'white',
          textAlign: 'center',
          transition: 'all 0.3s ease'
        }}>
          📊 Dashboard
        </a>
        <a href="/vocabulary" style={{ 
          background: 'rgba(255, 255, 255, 0.2)', 
          padding: '20px', 
          borderRadius: '15px', 
          textDecoration: 'none', 
          color: 'white',
          textAlign: 'center',
          transition: 'all 0.3s ease'
        }}>
          📚 Vocabulary
        </a>
        <a href="/vocabulary-learning" style={{ 
          background: 'rgba(255, 255, 255, 0.2)', 
          padding: '20px', 
          borderRadius: '15px', 
          textDecoration: 'none', 
          color: 'white',
          textAlign: 'center',
          transition: 'all 0.3s ease'
        }}>
          🎓 Learn
        </a>
        <a href="/video-learning" style={{ 
          background: 'rgba(255, 255, 255, 0.2)', 
          padding: '20px', 
          borderRadius: '15px', 
          textDecoration: 'none', 
          color: 'white',
          textAlign: 'center',
          transition: 'all 0.3s ease'
        }}>
          🎥 Video Learning
        </a>
        <a href="/quizzes" style={{ 
          background: 'rgba(255, 255, 255, 0.2)', 
          padding: '20px', 
          borderRadius: '15px', 
          textDecoration: 'none', 
          color: 'white',
          textAlign: 'center',
          transition: 'all 0.3s ease'
        }}>
          🧠 Quizzes
        </a>
        <a href="/grammar" style={{ 
          background: 'rgba(255, 255, 255, 0.2)', 
          padding: '20px', 
          borderRadius: '15px', 
          textDecoration: 'none', 
          color: 'white',
          textAlign: 'center',
          transition: 'all 0.3s ease'
        }}>
          📖 Grammar
        </a>
        <a href="/conversations" style={{ 
          background: 'rgba(255, 255, 255, 0.2)', 
          padding: '20px', 
          borderRadius: '15px', 
          textDecoration: 'none', 
          color: 'white',
          textAlign: 'center',
          transition: 'all 0.3s ease'
        }}>
          💬 AI Chat
        </a>
        <a href="/admin" style={{ 
          background: 'rgba(255, 255, 255, 0.2)', 
          padding: '20px', 
          borderRadius: '15px', 
          textDecoration: 'none', 
          color: 'white',
          textAlign: 'center',
          transition: 'all 0.3s ease'
        }}>
          ⚙️ Admin
        </a>
      </div>
      
      <div style={{ marginTop: '40px', textAlign: 'center' }}>
        <p style={{ marginBottom: '20px' }}>🔗 Trang HTML hoạt động:</p>
        <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', justifyContent: 'center' }}>
          <a href="/vocabulary_learning_working.html" style={{ 
            background: 'rgba(0, 0, 0, 0.3)', 
            padding: '10px 20px', 
            borderRadius: '25px', 
            textDecoration: 'none', 
            color: 'white',
            fontSize: '0.9rem'
          }}>
            📚 Vocabulary Learning
          </a>
          <a href="/vocabulary_working.html" style={{ 
            background: 'rgba(0, 0, 0, 0.3)', 
            padding: '10px 20px', 
            borderRadius: '25px', 
            textDecoration: 'none', 
            color: 'white',
            fontSize: '0.9rem'
          }}>
            🎯 Vocabulary Premium
          </a>
          <a href="/system_test.html" style={{ 
            background: 'rgba(0, 0, 0, 0.3)', 
            padding: '10px 20px', 
            borderRadius: '25px', 
            textDecoration: 'none', 
            color: 'white',
            fontSize: '0.9rem'
          }}>
            🧪 System Test
          </a>
        </div>
      </div>
    </div>
  )
}

// Simple Dashboard Page
const DashboardPage: React.FC = () => {
  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      padding: '20px',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h1>📊 Dashboard</h1>
      <p>Trang Dashboard đang được phát triển...</p>
      <a href="/" style={{ color: 'white', textDecoration: 'underline' }}>← Quay lại trang chủ</a>
    </div>
  )
}

// Simple Vocabulary Page
const VocabularyPage: React.FC = () => {
  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      padding: '20px',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h1>📚 Vocabulary</h1>
      <p>Trang Vocabulary đang được phát triển...</p>
      <a href="/" style={{ color: 'white', textDecoration: 'underline' }}>← Quay lại trang chủ</a>
    </div>
  )
}

// Simple Vocabulary Learning Page
const VocabularyLearningPage: React.FC = () => {
  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      padding: '20px',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h1>🎓 Vocabulary Learning</h1>
      <p>Trang Vocabulary Learning đang được phát triển...</p>
      <a href="/" style={{ color: 'white', textDecoration: 'underline' }}>← Quay lại trang chủ</a>
    </div>
  )
}

// Simple Video Learning Page
const VideoLearningPage: React.FC = () => {
  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      padding: '20px',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h1>🎥 Video Learning</h1>
      <p>Trang Video Learning đang được phát triển...</p>
      <a href="/" style={{ color: 'white', textDecoration: 'underline' }}>← Quay lại trang chủ</a>
    </div>
  )
}

// Simple Quizzes Page
const QuizzesPage: React.FC = () => {
  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      padding: '20px',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h1>🧠 Quizzes</h1>
      <p>Trang Quizzes đang được phát triển...</p>
      <a href="/" style={{ color: 'white', textDecoration: 'underline' }}>← Quay lại trang chủ</a>
    </div>
  )
}

// Simple Grammar Page
const GrammarPage: React.FC = () => {
  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      padding: '20px',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h1>📖 Grammar</h1>
      <p>Trang Grammar đang được phát triển...</p>
      <a href="/" style={{ color: 'white', textDecoration: 'underline' }}>← Quay lại trang chủ</a>
    </div>
  )
}

// Simple Conversations Page
const ConversationsPage: React.FC = () => {
  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      padding: '20px',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h1>💬 AI Chat</h1>
      <p>Trang AI Chat đang được phát triển...</p>
      <a href="/" style={{ color: 'white', textDecoration: 'underline' }}>← Quay lại trang chủ</a>
    </div>
  )
}

// Simple Admin Page
const AdminPanel: React.FC = () => {
  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      padding: '20px',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h1>⚙️ Admin Panel</h1>
      <p>Trang Admin Panel đang được phát triển...</p>
      <a href="/" style={{ color: 'white', textDecoration: 'underline' }}>← Quay lại trang chủ</a>
    </div>
  )
}

// Main App Component
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/vocabulary" element={<VocabularyPage />} />
        <Route path="/vocabulary-learning" element={<VocabularyLearningPage />} />
        <Route path="/video-learning" element={<VideoLearningPage />} />
        <Route path="/quizzes" element={<QuizzesPage />} />
        <Route path="/grammar" element={<GrammarPage />} />
        <Route path="/conversations" element={<ConversationsPage />} />
        <Route path="/admin" element={<AdminPanel />} />
      </Routes>
    </Router>
  )
}

export default App
