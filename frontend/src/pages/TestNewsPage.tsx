import React, { useState, useEffect } from 'react'

interface Article {
  ArticleID: number
  Title: string
  Content: string
  Summary: string
  SourceName: string
  Category: string
  DifficultyLevel: string
  ReadingTime: number
  WordCount: number
}

const TestNewsPage: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentArticle, setCurrentArticle] = useState<Article | null>(null)
  const [isSpeaking, setIsSpeaking] = useState(false)

  useEffect(() => {
    loadArticles()
  }, [])

  const loadArticles = async () => {
    try {
      setLoading(true)
      const response = await fetch('http://localhost:8000/simple_articles.php')
      const data = await response.json()
      
      if (data.success) {
        setArticles(data.data)
      } else {
        setError('Failed to load articles')
      }
    } catch (err) {
      setError('Failed to connect to server')
    } finally {
      setLoading(false)
    }
  }

  const speakWord = (text: string) => {
    console.log('Speaking:', text)
    
    if (isSpeaking) {
      window.speechSynthesis.cancel()
      setIsSpeaking(false)
      return
    }
    
    setIsSpeaking(true)
    
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = 'en-US'
    utterance.rate = 0.8
    utterance.pitch = 1
    utterance.volume = 0.8
    
    utterance.onend = () => {
      setIsSpeaking(false)
    }
    
    utterance.onerror = () => {
      setIsSpeaking(false)
    }
    
    window.speechSynthesis.speak(utterance)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center">
        <div className="text-red-400 text-xl">{error}</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
      <div className="bg-white/10 backdrop-blur-lg border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-white">📰 Test News Page</h1>
            <button
              onClick={() => speakWord('Hello, this is a test')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                isSpeaking 
                  ? 'bg-red-500 text-white' 
                  : 'bg-green-500 text-white hover:bg-green-600'
              }`}
            >
              {isSpeaking ? '⏹️ Stop' : '🔊 Test Speech'}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!currentArticle ? (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-4">Choose an Article to Read</h2>
              <p className="text-white/70">Click on any article to start reading</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {articles.map(article => (
                <div
                  key={article.ArticleID}
                  className="bg-white/10 backdrop-blur-lg rounded-xl p-6 hover:bg-white/20 transition-all duration-200 cursor-pointer"
                  onClick={() => setCurrentArticle(article)}
                >
                  <h3 className="text-white font-semibold text-lg mb-2">
                    {article.Title}
                  </h3>
                  <p className="text-white/70 text-sm mb-4">
                    {article.Summary}
                  </p>
                  <div className="flex items-center justify-between text-white/50 text-sm">
                    <span>⏱️ {article.ReadingTime} min</span>
                    <span>📚 {article.WordCount} words</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8">
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-white mb-4">
                {currentArticle.Title}
              </h1>
              <p className="text-white/70 text-lg mb-6">
                {currentArticle.Summary}
              </p>
            </div>

            <div className="bg-white/5 rounded-lg p-6 mb-6">
              <h3 className="text-white font-semibold mb-4">📖 Article Content</h3>
              <div className="text-lg leading-8 text-white">
                {currentArticle.Content}
              </div>
            </div>

            <div className="flex space-x-4">
              <button
                onClick={() => setCurrentArticle(null)}
                className="px-6 py-3 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors"
              >
                ← Back to Articles
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default TestNewsPage
