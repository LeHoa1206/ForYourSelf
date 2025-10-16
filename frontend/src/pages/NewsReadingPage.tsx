import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  BookOpen, Search, Bookmark, Heart, Clock, Globe, Filter,
  ChevronLeft, ChevronRight, Play, Pause, Volume2, VolumeX,
  Star, Share, Download, Eye, EyeOff, Settings, Languages
} from 'lucide-react'

// Interfaces
interface NewsArticle {
  ArticleID: number
  Title: string
  Content: string
  Summary: string
  SourceName: string
  SourceURL: string
  LanguageName: string
  Category: string
  DifficultyLevel: string
  ReadingTime: number
  WordCount: number
  PublishedAt: string
}

interface Vocabulary {
  ArticleVocabID: number
  Word: string
  Position: number
  Context: string
  Difficulty: string
  IsImportant: boolean
  Translation?: string
  Pronunciation?: string
  PartOfSpeech?: string
  ExampleSentence?: string
  TargetLanguageName?: string
}

interface Language {
  LanguageID: number
  LanguageName: string
  NativeName: string
  Flag: string
}

const NewsReadingPage: React.FC = () => {
  // States
  const [articles, setArticles] = useState<NewsArticle[]>([])
  const [currentArticle, setCurrentArticle] = useState<NewsArticle | null>(null)
  const [vocabulary, setVocabulary] = useState<Vocabulary[]>([])
  const [languages, setLanguages] = useState<Language[]>([])
  const [selectedLanguage, setSelectedLanguage] = useState<number>(1)
  const [targetLanguage, setTargetLanguage] = useState<number>(2)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // Reading states
  const [readingProgress, setReadingProgress] = useState(0)
  const [timeSpent, setTimeSpent] = useState(0)
  const [wordsLookedUp, setWordsLookedUp] = useState(0)
  const [isReading, setIsReading] = useState(false)
  const [startTime, setStartTime] = useState<number | null>(null)
  
  // UI states
  const [showTranslation, setShowTranslation] = useState(false)
  const [selectedWord, setSelectedWord] = useState<string>('')
  const [selectedTranslation, setSelectedTranslation] = useState<Vocabulary | null>(null)
  const [showBookmarks, setShowBookmarks] = useState(false)
  const [showFavorites, setShowFavorites] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  
  // Filters
  const [category, setCategory] = useState('')
  const [difficulty, setDifficulty] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  
  // Refs
  const contentRef = useRef<HTMLDivElement>(null)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  // Load initial data
  useEffect(() => {
    loadLanguages()
    loadArticles()
  }, [])

  // Timer for reading time
  useEffect(() => {
    if (isReading && startTime) {
      timerRef.current = setInterval(() => {
        setTimeSpent(Math.floor((Date.now() - startTime) / 1000))
      }, 1000)
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
    
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [isReading, startTime])

  const loadLanguages = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/languages')
      const data = await response.json()
      setLanguages(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error('Failed to load languages:', err)
      // Fallback languages
      setLanguages([
        { LanguageID: 1, LanguageName: 'English', NativeName: 'English', Flag: '🇺🇸' },
        { LanguageID: 2, LanguageName: 'French', NativeName: 'Français', Flag: '🇫🇷' },
        { LanguageID: 3, LanguageName: 'Spanish', NativeName: 'Español', Flag: '🇪🇸' },
        { LanguageID: 4, LanguageName: 'Japanese', NativeName: '日本語', Flag: '🇯🇵' },
        { LanguageID: 5, LanguageName: 'Chinese', NativeName: '中文', Flag: '🇨🇳' }
      ])
    }
  }

  const loadArticles = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        language_id: selectedLanguage.toString(),
        limit: '20'
      })
      
      if (category) params.append('category', category)
      if (difficulty) params.append('difficulty', difficulty)
      
      const response = await fetch(`http://localhost:8000/simple_articles.php`)
      const data = await response.json()
      
      if (data.success) {
        setArticles(data.data)
      } else {
        setError(data.error)
      }
    } catch (err) {
      setError('Failed to load articles')
    } finally {
      setLoading(false)
    }
  }

  const loadArticle = async (articleId: number) => {
    try {
      const response = await fetch(`http://localhost:8000/news_api.php/api/news/articles/${articleId}`)
      const data = await response.json()
      
      if (data.success) {
        setCurrentArticle(data.data.article)
        setVocabulary(data.data.vocabulary)
        setReadingProgress(0)
        setTimeSpent(0)
        setWordsLookedUp(0)
        setIsReading(true)
        setStartTime(Date.now())
      }
    } catch (err) {
      console.error('Failed to load article:', err)
    }
  }

  const handleWordClick = async (word: string) => {
    if (!currentArticle) return
    
    setSelectedWord(word)
    setWordsLookedUp(prev => prev + 1)
    
    try {
      const response = await fetch('http://localhost:8000/news_api.php/api/news/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          word: word,
          target_language_id: targetLanguage,
          article_id: currentArticle.ArticleID
        })
      })
      
      const data = await response.json()
      
      if (data.success) {
        setSelectedTranslation(data.data.translations[0] || null)
        setShowTranslation(true)
      }
    } catch (err) {
      console.error('Translation failed:', err)
    }
  }

  const handleScroll = () => {
    if (!contentRef.current) return
    
    const element = contentRef.current
    const scrollTop = element.scrollTop
    const scrollHeight = element.scrollHeight - element.clientHeight
    const progress = (scrollTop / scrollHeight) * 100
    
    setReadingProgress(Math.min(progress, 100))
  }

  const saveReadingHistory = async () => {
    if (!currentArticle) return
    
    try {
      await fetch('http://localhost:8000/news_api.php/api/news/history', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          article_id: currentArticle.ArticleID,
          language_id: selectedLanguage,
          progress: readingProgress,
          time_spent: timeSpent,
          words_looked_up: wordsLookedUp,
          completed: readingProgress >= 90
        })
      })
    } catch (err) {
      console.error('Failed to save reading history:', err)
    }
  }

  const addToBookmarks = async () => {
    if (!currentArticle) return
    
    try {
      await fetch('http://localhost:8000/news_api.php/api/news/bookmarks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          article_id: currentArticle.ArticleID
        })
      })
    } catch (err) {
      console.error('Failed to add bookmark:', err)
    }
  }

  const addToFavorites = async () => {
    if (!selectedTranslation) return
    
    try {
      await fetch('http://localhost:8000/news_api.php/api/news/favorites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          word: selectedWord,
          translation: selectedTranslation.Translation,
          language_id: selectedLanguage
        })
      })
    } catch (err) {
      console.error('Failed to add favorite:', err)
    }
  }

  // Split content into words for clickable words
  const renderContent = (content: string) => {
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
          className="cursor-pointer hover:bg-yellow-200 hover:text-black transition-colors duration-200 rounded px-1"
          onClick={() => handleWordClick(cleanWord.toLowerCase())}
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
              <BookOpen className="h-8 w-8 text-white" />
              <h1 className="text-2xl font-bold text-white">News Reading</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Language Selector */}
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(Number(e.target.value))}
                className="bg-white/20 text-white rounded-lg px-3 py-2 border border-white/30"
              >
                {Array.isArray(languages) && languages.map(lang => (
                  <option key={lang.LanguageID} value={lang.LanguageID}>
                    {lang.LanguageName}
                  </option>
                ))}
              </select>
              
              {/* Target Language */}
              <select
                value={targetLanguage}
                onChange={(e) => setTargetLanguage(Number(e.target.value))}
                className="bg-white/20 text-white rounded-lg px-3 py-2 border border-white/30"
              >
                {Array.isArray(languages) && languages.map(lang => (
                  <option key={lang.LanguageID} value={lang.LanguageID}>
                    {lang.LanguageName}
                  </option>
                ))}
              </select>
              
              <button
                onClick={() => setShowSettings(true)}
                className="p-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors"
              >
                <Settings className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!currentArticle ? (
          // Article List
          <div className="space-y-6">
            {/* Filters */}
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-white text-sm font-medium mb-2">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-white/20 text-white rounded-lg px-3 py-2 border border-white/30"
                  >
                    <option value="">All Categories</option>
                    <option value="General">General</option>
                    <option value="Technology">Technology</option>
                    <option value="Environment">Environment</option>
                    <option value="Health">Health</option>
                    <option value="Business">Business</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-white text-sm font-medium mb-2">Difficulty</label>
                  <select
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value)}
                    className="w-full bg-white/20 text-white rounded-lg px-3 py-2 border border-white/30"
                  >
                    <option value="">All Levels</option>
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-white text-sm font-medium mb-2">Search</label>
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search articles..."
                    className="w-full bg-white/20 text-white rounded-lg px-3 py-2 border border-white/30 placeholder-white/50"
                  />
                </div>
                
                <div className="flex items-end">
                  <button
                    onClick={loadArticles}
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200"
                  >
                    Filter Articles
                  </button>
                </div>
              </div>
            </div>

            {/* Articles Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {articles.map(article => (
                <motion.div
                  key={article.ArticleID}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white/10 backdrop-blur-lg rounded-xl p-6 hover:bg-white/20 transition-all duration-200 cursor-pointer"
                  onClick={() => loadArticle(article.ArticleID)}
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
                      <span className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {article.ReadingTime} min
                      </span>
                      <span className="flex items-center">
                        <BookOpen className="h-4 w-4 mr-1" />
                        {article.WordCount} words
                      </span>
                    </div>
                    <span>{article.SourceName}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        ) : (
          // Reading Interface
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Reading Progress */}
            <div className="lg:col-span-1">
              <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 sticky top-8">
                <h3 className="text-white font-semibold mb-4">Reading Progress</h3>
                
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-white/70 text-sm mb-1">
                      <span>Progress</span>
                      <span>{Math.round(readingProgress)}%</span>
                    </div>
                    <div className="w-full bg-white/20 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${readingProgress}%` }}
                      />
                    </div>
                  </div>
                  
                  <div className="text-white/70 text-sm space-y-2">
                    <div className="flex justify-between">
                      <span>Time Spent</span>
                      <span>{Math.floor(timeSpent / 60)}:{(timeSpent % 60).toString().padStart(2, '0')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Words Looked Up</span>
                      <span>{wordsLookedUp}</span>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <button
                      onClick={addToBookmarks}
                      className="flex-1 bg-white/20 text-white px-3 py-2 rounded-lg hover:bg-white/30 transition-colors text-sm"
                    >
                      <Bookmark className="h-4 w-4 inline mr-1" />
                      Bookmark
                    </button>
                    <button
                      onClick={() => setCurrentArticle(null)}
                      className="flex-1 bg-white/20 text-white px-3 py-2 rounded-lg hover:bg-white/30 transition-colors text-sm"
                    >
                      Back
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Article Content */}
            <div className="lg:col-span-3">
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

                <div 
                  ref={contentRef}
                  onScroll={handleScroll}
                  className="prose prose-lg max-w-none text-white leading-relaxed"
                  style={{ maxHeight: '70vh', overflowY: 'auto' }}
                >
                  <div className="text-lg leading-8">
                    {renderContent(currentArticle.Content)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Translation Popup */}
      <AnimatePresence>
        {showTranslation && selectedTranslation && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            onClick={() => setShowTranslation(false)}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl p-6 max-w-md w-full mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-gray-900">
                  {selectedWord}
                </h3>
                <button
                  onClick={() => setShowTranslation(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>
              
              <div className="space-y-3">
                <div>
                  <span className="text-sm text-gray-500">Translation:</span>
                  <p className="text-lg font-medium text-gray-900">
                    {selectedTranslation.Translation}
                  </p>
                </div>
                
                {selectedTranslation.Pronunciation && (
                  <div>
                    <span className="text-sm text-gray-500">Pronunciation:</span>
                    <p className="text-gray-700">{selectedTranslation.Pronunciation}</p>
                  </div>
                )}
                
                {selectedTranslation.PartOfSpeech && (
                  <div>
                    <span className="text-sm text-gray-500">Part of Speech:</span>
                    <p className="text-gray-700">{selectedTranslation.PartOfSpeech}</p>
                  </div>
                )}
                
                {selectedTranslation.ExampleSentence && (
                  <div>
                    <span className="text-sm text-gray-500">Example:</span>
                    <p className="text-gray-700 italic">{selectedTranslation.ExampleSentence}</p>
                  </div>
                )}
              </div>
              
              <div className="flex space-x-3 mt-6">
                <button
                  onClick={addToFavorites}
                  className="flex-1 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
                >
                  <Heart className="h-4 w-4 inline mr-1" />
                  Add to Favorites
                </button>
                <button
                  onClick={() => setShowTranslation(false)}
                  className="flex-1 bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default NewsReadingPage
