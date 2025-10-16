import React, { useState, useEffect } from 'react'
import { API_ENDPOINTS } from '../config/api'

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

const SimpleNewsPage: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentArticle, setCurrentArticle] = useState<Article | null>(null)
  const [selectedLanguage, setSelectedLanguage] = useState('vi')
  const [selectedWord, setSelectedWord] = useState<string | null>(null)
  const [translationData, setTranslationData] = useState<any>(null)
  const [showTranslation, setShowTranslation] = useState(false)
  const [translationPosition, setTranslationPosition] = useState({ x: 0, y: 0 })
  const [isTranslating, setIsTranslating] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)

  // Process text when article is selected
  useEffect(() => {
    if (currentArticle && currentArticle.Content) {
      processText(currentArticle.Content)
    }
  }, [currentArticle])

  useEffect(() => {
    loadArticles()
  }, [])

  const loadArticles = async () => {
    try {
      setLoading(true)
      console.log('Fetching articles from:', API_ENDPOINTS.ARTICLES)
      
      const response = await fetch(API_ENDPOINTS.ARTICLES)
      console.log('Response status:', response.status)
      console.log('Response ok:', response.ok)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      console.log('Response data:', data)
      
      if (data.success) {
        setArticles(data.data)
        console.log('Articles loaded successfully:', data.data.length)
      } else {
        setError('Failed to load articles from database: ' + (data.error || 'Unknown error'))
      }
    } catch (err) {
      console.error('Error loading articles:', err)
      setError('Failed to connect to database: ' + (err instanceof Error ? err.message : 'Unknown error'))
    } finally {
      setLoading(false)
    }
  }

  const translateWord = async (word: string, event: React.MouseEvent) => {
    if (isTranslating) return
    
    setIsTranslating(true)
    setSelectedWord(word)
    
    // Get mouse position for popup
    const rect = event.currentTarget.getBoundingClientRect()
    setTranslationPosition({
      x: rect.left + rect.width / 2,
      y: rect.top - 10
    })
    
    try {
      const response = await fetch(API_ENDPOINTS.TRANSLATE, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          word: word,
          target_language: selectedLanguage,
          source_language: 'en',
          user_id: 1, // Default user
          article_id: currentArticle?.ArticleID || 1
        })
      })
      
      const data = await response.json()
      
      if (data.success) {
        setTranslationData(data.data)
        setShowTranslation(true)
      } else {
        alert(`Translation failed: ${data.error}`)
      }
    } catch (err) {
      console.error('Translation error:', err)
      alert('Translation service unavailable. Please try again.')
    } finally {
      setIsTranslating(false)
    }
  }

  const handleWordClick = (word: string, event: React.MouseEvent) => {
    translateWord(word, event)
  }

  const speakWord = (text: string, language: string = 'en-US') => {
    console.log('Speaking word:', text, 'in language:', language)
    
    if (isSpeaking) {
      console.log('Already speaking, stopping...')
      stopSpeaking()
      return
    }
    
    setIsSpeaking(true)
    
    // Stop any current speech
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel()
    }
    
    const utterance = new SpeechSynthesisUtterance(text)
    
    // Set language based on selection
    const languageMap: { [key: string]: string } = {
      'vi': 'vi-VN',
      'fr': 'fr-FR', 
      'es': 'es-ES',
      'ja': 'ja-JP',
      'zh': 'zh-CN',
      'ko': 'ko-KR',
      'de': 'de-DE',
      'en': 'en-US'
    }
    
    utterance.lang = languageMap[language] || 'en-US'
    utterance.rate = 0.8
    utterance.pitch = 1
    utterance.volume = 0.8
    
    utterance.onstart = () => {
      console.log('Speech started')
    }
    
    utterance.onend = () => {
      console.log('Speech ended')
      setIsSpeaking(false)
    }
    
    utterance.onerror = (event) => {
      console.error('Speech synthesis failed:', event.error)
      setIsSpeaking(false)
    }
    
    try {
      window.speechSynthesis.speak(utterance)
      console.log('Speech synthesis initiated')
    } catch (error) {
      console.error('Error starting speech:', error)
      setIsSpeaking(false)
    }
  }

  const stopSpeaking = () => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel()
      setIsSpeaking(false)
    }
  }

  const [textSegments, setTextSegments] = useState<any[]>([])
  const [isProcessingText, setIsProcessingText] = useState(false)

  const processText = async (content: string) => {
    try {
      setIsProcessingText(true)
      const response = await fetch(API_ENDPOINTS.TEXT_PROCESSOR, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: content })
      })
      
      const data = await response.json()
      
      if (data.success) {
        setTextSegments(data.data.segments)
        console.log('Text processed:', data.data.language, data.data.segments.length, 'segments')
      } else {
        console.error('Text processing failed:', data.error)
        // Fallback to simple word splitting
        setTextSegments(content.split(/(\s+|[.,!?;:])/))
      }
    } catch (err) {
      console.error('Text processing error:', err)
      // Fallback to simple word splitting
      setTextSegments(content.split(/(\s+|[.,!?;:])/))
    } finally {
      setIsProcessingText(false)
    }
  }

  const renderContent = (content: string) => {
    // If we have processed segments, use them
    if (textSegments.length > 0) {
      return textSegments.map((segment, index) => {
        const cleanSegment = segment.replace(/[.,!?;:\s]/g, '')
        const isPunctuation = /[.,!?;:\s]/.test(segment)
        const isEmpty = cleanSegment.length === 0
        
        if (isPunctuation || isEmpty) {
          return <span key={index}>{segment}</span>
        }
        
        return (
          <span
            key={index}
            className={`cursor-pointer hover:bg-yellow-200 hover:text-black transition-colors duration-200 rounded px-1 ${
              isTranslating && selectedWord === cleanSegment.toLowerCase() ? 'bg-yellow-300 text-black' : ''
            }`}
            onClick={(e) => handleWordClick(cleanSegment.toLowerCase(), e)}
          >
            {segment}
          </span>
        )
      })
    }
    
    // Fallback to original word splitting
    const words = content.split(/(\s+|[.,!?;:])/)
    
    return words.map((word, index) => {
      const cleanWord = word.replace(/[.,!?;:]/g, '')
      const isPunctuation = /[.,!?;:]/.test(word)
      
      if (isPunctuation || cleanWord.length < 3) {
        return <span key={index}>{word}</span>
      }
      
      return (
        <span
          key={index}
          className={`cursor-pointer hover:bg-yellow-200 hover:text-black transition-colors duration-200 rounded px-1 ${
            isTranslating && selectedWord === cleanWord.toLowerCase() ? 'bg-yellow-300 text-black' : ''
          }`}
          onClick={(e) => handleWordClick(cleanWord.toLowerCase(), e)}
        >
          {word}
        </span>
      )
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading articles...</div>
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
      {/* Header */}
      <div className="bg-white/10 backdrop-blur-lg border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <h1 className="text-2xl font-bold text-white">📰 News Reading</h1>
                {currentArticle && (
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <span className="text-white/70">Translate to:</span>
                      <select
                        value={selectedLanguage}
                        onChange={(e) => setSelectedLanguage(e.target.value)}
                        className="bg-white/20 text-white rounded px-3 py-1 border border-white/30"
                      >
                        <option value="vi">🇻🇳 Tiếng Việt</option>
                        <option value="fr">🇫🇷 Français</option>
                        <option value="es">🇪🇸 Español</option>
                        <option value="ja">🇯🇵 日本語</option>
                        <option value="zh">🇨🇳 中文</option>
                        <option value="ko">🇰🇷 한국어</option>
                        <option value="de">🇩🇪 Deutsch</option>
                      </select>
                    </div>
                    <button
                      onClick={() => speakWord('Hello', 'en')}
                      className="bg-green-500/20 text-green-300 px-3 py-1 rounded hover:bg-green-500/30 transition-colors"
                    >
                      🔊 Test Speech
                    </button>
                  </div>
                )}
              </div>
              <div className="text-white/70">
                {articles.length} articles available
              </div>
            </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!currentArticle ? (
          // Article List
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-4">Choose an Article to Read</h2>
              <p className="text-white/70">Click on any article to start reading and learning vocabulary</p>
              
              {/* Test Speech Button */}
              <div className="mt-6">
                <button
                  onClick={() => speakWord('Hello, this is a test', 'en')}
                  className="bg-green-500/20 text-green-300 px-6 py-3 rounded-lg hover:bg-green-500/30 transition-colors border border-green-500/30"
                >
                  🔊 Test Speech Feature
                </button>
                <p className="text-white/50 text-sm mt-2">Click to test if speech synthesis works</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {articles.map(article => (
                <div
                  key={article.ArticleID}
                  className="bg-white/10 backdrop-blur-lg rounded-xl p-6 hover:bg-white/20 transition-all duration-200 cursor-pointer"
                  onClick={() => setCurrentArticle(article)}
                >
                  <div className="flex items-center justify-between mb-4">
                    <span className="bg-blue-500/20 text-blue-300 px-2 py-1 rounded-full text-xs">
                      {article.Category}
                    </span>
                    <span className="bg-green-500/20 text-green-300 px-2 py-1 rounded-full text-xs">
                      {article.DifficultyLevel}
                    </span>
                  </div>
                  
                  <h3 className="text-white font-semibold text-lg mb-2 line-clamp-2">
                    {article.Title}
                  </h3>
                  
                  <p className="text-white/70 text-sm mb-4 line-clamp-3">
                    {article.Summary}
                  </p>
                  
                  <div className="flex items-center justify-between text-white/50 text-sm">
                    <div className="flex items-center space-x-4">
                      <span>⏱️ {article.ReadingTime} min</span>
                      <span>📚 {article.WordCount} words</span>
                    </div>
                    <span>{article.SourceName}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          // Reading Interface
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8">
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <span className="bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full text-sm">
                    {currentArticle.Category}
                  </span>
                  <span className="bg-green-500/20 text-green-300 px-3 py-1 rounded-full text-sm">
                    {currentArticle.DifficultyLevel}
                  </span>
                </div>
                <div className="text-white/50 text-sm">
                  {currentArticle.SourceName} • {currentArticle.ReadingTime} min read
                </div>
              </div>
              
              <h1 className="text-3xl font-bold text-white mb-4">
                {currentArticle.Title}
              </h1>
              
              <p className="text-white/70 text-lg mb-6">
                {currentArticle.Summary}
              </p>
            </div>

            <div className="bg-white/5 rounded-lg p-6 mb-6">
              <h3 className="text-white font-semibold mb-4">📖 Article Content</h3>
              {isProcessingText && (
                <div className="mb-4 flex items-center space-x-2 text-blue-300">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-300"></div>
                  <span>Processing text for translation...</span>
                </div>
              )}
              <div className="text-lg leading-8 text-white">
                {renderContent(currentArticle.Content)}
              </div>
            </div>

            <div className="flex space-x-4">
              <button
                onClick={() => setCurrentArticle(null)}
                className="px-6 py-3 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors"
              >
                ← Back to Articles
              </button>
              <button
                onClick={() => alert('Bookmark feature coming soon!')}
                className="px-6 py-3 bg-blue-500/20 text-blue-300 rounded-lg hover:bg-blue-500/30 transition-colors"
              >
                🔖 Bookmark
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Translation Popup */}
      {showTranslation && translationData && (
        <div
          className="fixed z-50 bg-white rounded-lg shadow-2xl border border-gray-200 p-4 max-w-sm"
          style={{
            left: `${translationPosition.x - 150}px`,
            top: `${translationPosition.y - 200}px`,
            transform: 'translateX(-50%)'
          }}
        >
          <div className="flex justify-between items-start mb-3">
            <div className="flex items-center space-x-2">
              <h3 className="font-bold text-gray-800 text-lg">{selectedWord}</h3>
              <button
                onClick={() => speakWord(selectedWord || '', 'en')}
                disabled={isSpeaking}
                className={`p-1 rounded-full transition-colors ${
                  isSpeaking 
                    ? 'bg-red-100 text-red-600' 
                    : 'bg-blue-100 text-blue-600 hover:bg-blue-200'
                }`}
                title="Đọc từ gốc"
              >
                {isSpeaking ? '⏹️' : '🔊'}
              </button>
            </div>
            <button
              onClick={() => setShowTranslation(false)}
              className="text-gray-500 hover:text-gray-700 text-xl"
            >
              ×
            </button>
          </div>
          
          <div className="space-y-3">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Translation:</span>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => speakWord(translationData.translation, selectedLanguage)}
                    disabled={isSpeaking}
                    className={`p-2 rounded-full transition-colors ${
                      isSpeaking 
                        ? 'bg-red-100 text-red-600' 
                        : 'bg-green-100 text-green-600 hover:bg-green-200'
                    }`}
                    title="Đọc bản dịch"
                  >
                    {isSpeaking ? '⏹️' : '🔊'}
                  </button>
                  <span className="text-xs text-gray-500">
                    {isSpeaking ? 'Speaking...' : 'Click to speak'}
                  </span>
                </div>
              </div>
              <div className="text-lg font-semibold text-blue-600">
                {translationData.translation}
              </div>
            </div>
            
            {translationData.pronunciation && (
              <div>
                <span className="text-sm text-gray-600">Pronunciation:</span>
                <div className="text-sm text-gray-700 italic">
                  {translationData.pronunciation}
                </div>
              </div>
            )}
            
            {translationData.partOfSpeech && (
              <div>
                <span className="text-sm text-gray-600">Part of Speech:</span>
                <span className="ml-2 bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                  {translationData.partOfSpeech}
                </span>
              </div>
            )}
            
            {translationData.example && (
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Example:</span>
                  <div className="flex space-x-1">
                    <button
                      onClick={() => speakWord(translationData.example.original, 'en')}
                      disabled={isSpeaking}
                      className={`p-1 rounded-full transition-colors ${
                        isSpeaking 
                          ? 'bg-red-100 text-red-600' 
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                      title="Đọc câu gốc"
                    >
                      {isSpeaking ? '⏹️' : '🔊'}
                    </button>
                    <button
                      onClick={() => speakWord(translationData.example.translated, selectedLanguage)}
                      disabled={isSpeaking}
                      className={`p-1 rounded-full transition-colors ${
                        isSpeaking 
                          ? 'bg-red-100 text-red-600' 
                          : 'bg-blue-100 text-blue-600 hover:bg-blue-200'
                      }`}
                      title="Đọc câu dịch"
                    >
                      {isSpeaking ? '⏹️' : '🔊'}
                    </button>
                  </div>
                </div>
                <div className="text-sm text-gray-700 mt-1">
                  <div className="italic">"{translationData.example.original}"</div>
                  <div className="text-blue-600">"{translationData.example.translated}"</div>
                </div>
              </div>
            )}
            
            {translationData.synonyms && translationData.synonyms.length > 0 && (
              <div>
                <span className="text-sm text-gray-600">Related words:</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {translationData.synonyms.slice(0, 3).map((synonym: any, index: number) => (
                    <span
                      key={index}
                      className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs"
                    >
                      {synonym.word}: {synonym.translation}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Loading overlay */}
      {isTranslating && (
        <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-40">
          <div className="bg-white rounded-lg p-4 flex items-center space-x-3">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            <span className="text-gray-700">Translating "{selectedWord}"...</span>
          </div>
        </div>
      )}

      {/* Speaking overlay */}
      {isSpeaking && (
        <div className="fixed bottom-4 right-4 bg-white rounded-lg shadow-lg p-3 flex items-center space-x-3 z-50">
          <div className="animate-pulse text-blue-600">🔊</div>
          <span className="text-gray-700">Speaking...</span>
          <button
            onClick={stopSpeaking}
            className="bg-red-100 text-red-600 px-2 py-1 rounded text-sm hover:bg-red-200"
          >
            Stop
          </button>
        </div>
      )}
    </div>
  )
}

export default SimpleNewsPage
