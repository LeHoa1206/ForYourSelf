import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, Volume2, RotateCcw, Check, X, Clock, Target, Zap, Star, Sparkles, BookOpen, Brain, PenTool, ArrowLeft, ArrowRight, Play, Pause } from 'lucide-react'

// Interfaces
interface Language {
  LanguageID: number
  Name: string
  NativeName: string
  Flag: string
  Code: string
}

interface Topic {
  TopicID: number
  Title: string
  Description: string
  Level: string
  Icon: string
  VocabularyCount?: number
  LanguageID: number
}

interface Vocabulary {
  WordID: number
  Word: string
  Phonetic?: string
  Type: string
  Meaning: string
  Example?: string
  Audio?: string
  TopicID: number
  LanguageID: number
}

// Study Method Types
type StudyMethod = 'flashcard' | 'spaced' | 'writing'

// Study Stats Interface
interface StudyStats {
  correct: number
  studied: number
  time: number
  streak: number
  accuracy: number
}

// Main Vocabulary Page Component
const VocabularyPage: React.FC = () => {
  // State Management
  const [currentStep, setCurrentStep] = useState<'language' | 'topic' | 'method' | 'study' | 'results'>('language')
  const [languages, setLanguages] = useState<Language[]>([])
  const [topics, setTopics] = useState<Topic[]>([])
  const [vocabulary, setVocabulary] = useState<Vocabulary[]>([])
  
  const [selectedLanguage, setSelectedLanguage] = useState<Language | null>(null)
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null)
  const [selectedMethod, setSelectedMethod] = useState<StudyMethod | null>(null)
  const [topicProgress, setTopicProgress] = useState<{ [key: number]: { completed: boolean, masteredCount: number, totalCount: number } }>({})
  const [isLoading, setIsLoading] = useState(false)
  const [showKeyboardShortcuts, setShowKeyboardShortcuts] = useState(false)
  const [theme, setTheme] = useState<'dark' | 'light' | 'neon'>('neon')
  
  // Debug theme changes
  useEffect(() => {
    console.log('Theme changed to:', theme)
    console.log('Current theme object:', themes[theme])
  }, [theme])
  
  // Theme change handler
  const handleThemeChange = (newTheme: 'dark' | 'light' | 'neon') => {
    console.log('handleThemeChange called with:', newTheme)
    setTheme(newTheme)
    // Force re-render by updating a dummy state
    setTopicProgress(prev => ({ ...prev }))
  }
  
  // Theme configurations - Bright & Clear
  const themes = {
    dark: {
      background: 'bg-gradient-to-br from-slate-800 via-blue-800 to-slate-900',
      card: 'bg-white/20 border-white/40 backdrop-blur-lg shadow-lg',
      cardHover: 'hover:bg-white/30 hover:border-white/50 hover:shadow-2xl',
      text: 'text-white',
      textSecondary: 'text-gray-200',
      accent: 'from-blue-300 to-cyan-300',
      accentHover: 'hover:from-blue-200 hover:to-cyan-200',
      button: 'bg-blue-400/30 border-blue-300/50 text-white font-semibold',
      buttonHover: 'hover:bg-blue-300/40 hover:border-blue-200/60',
      particles: 'bg-blue-300/30',
      glow: 'shadow-blue-300/30'
    },
    light: {
      background: 'bg-gradient-to-br from-blue-100 via-white to-indigo-100',
      card: 'bg-white/95 border-blue-300/80 backdrop-blur-lg shadow-xl',
      cardHover: 'hover:bg-white hover:border-blue-400/90 hover:shadow-2xl',
      text: 'text-gray-900',
      textSecondary: 'text-gray-700',
      accent: 'from-blue-800 to-indigo-800',
      accentHover: 'hover:from-blue-700 hover:to-indigo-700',
      button: 'bg-blue-700/30 border-blue-600/60 text-blue-900 font-bold',
      buttonHover: 'hover:bg-blue-600/40 hover:border-blue-500/80',
      particles: 'bg-blue-600/50',
      glow: 'shadow-blue-600/50'
    },
    neon: {
      background: 'bg-gradient-to-br from-emerald-800 via-teal-800 to-cyan-800',
      card: 'bg-emerald-400/20 border-emerald-300/50 backdrop-blur-lg shadow-lg',
      cardHover: 'hover:bg-emerald-300/30 hover:border-emerald-200/60 hover:shadow-2xl',
      text: 'text-white',
      textSecondary: 'text-emerald-100',
      accent: 'from-emerald-300 to-cyan-300',
      accentHover: 'hover:from-emerald-200 hover:to-cyan-200',
      button: 'bg-emerald-400/30 border-emerald-300/50 text-white font-semibold',
      buttonHover: 'hover:bg-emerald-300/40 hover:border-emerald-200/60',
      particles: 'bg-emerald-300/30',
      glow: 'shadow-emerald-300/30'
    }
  }
  
  const currentTheme = themes[theme]
  
  // Debug current theme
  useEffect(() => {
    console.log('Current theme:', theme)
    console.log('Current theme object:', currentTheme)
  }, [theme, currentTheme])
  
  const [currentWordIndex, setCurrentWordIndex] = useState(0)
  const [studyStats, setStudyStats] = useState<StudyStats>({
    correct: 0,
    studied: 0,
    time: 0,
    streak: 0,
    accuracy: 0
  })
  
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isFlipped, setIsFlipped] = useState(false)
  const [writingInput, setWritingInput] = useState('')
  const [showAnswer, setShowAnswer] = useState(false)
  
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const startTimeRef = useRef<number>(Date.now())

  // No more sample data - only use API



  // Effects
  useEffect(() => {
    fetchLanguages()
  }, [])

  const loadTopicProgress = (topicId: number) => {
    const flashcardProgress = localStorage.getItem(`flashcard_progress_${topicId}`);
    const spacedProgress = localStorage.getItem(`spaced_progress_${topicId}`);
    const writingProgress = localStorage.getItem(`writing_progress_${topicId}`);
    
    let masteredCount = 0;
    let totalCount = 0;
    let completed = false;
    
    if (flashcardProgress) {
      const data = JSON.parse(flashcardProgress);
      totalCount = Object.keys(data).length;
      masteredCount = Object.values(data).filter((item: any) => item.level === 'mastered').length;
      completed = masteredCount === totalCount && totalCount > 0;
    }
    
    if (spacedProgress) {
      const data = JSON.parse(spacedProgress);
      totalCount = Object.keys(data).length;
      masteredCount = Object.values(data).filter((item: any) => item.level === 'mastered').length;
      completed = masteredCount === totalCount && totalCount > 0;
    }
    
    if (writingProgress) {
      const data = JSON.parse(writingProgress);
      totalCount = Object.keys(data).length;
      masteredCount = Object.values(data).filter((item: any) => item.level === 'mastered').length;
      completed = masteredCount === totalCount && totalCount > 0;
    }
    
    return { completed, masteredCount, totalCount };
  }

  useEffect(() => {
    if (selectedLanguage) {
      fetchTopics(selectedLanguage.LanguageID)
    }
  }, [selectedLanguage])

  useEffect(() => {
    if (selectedTopic) {
      fetchVocabulary(selectedTopic.TopicID)
    }
  }, [selectedTopic])

  useEffect(() => {
    if (currentStep === 'study') {
      startTimeRef.current = Date.now()
      const timer = setInterval(() => {
        setStudyStats(prev => ({
          ...prev,
          time: Math.floor((Date.now() - startTimeRef.current) / 1000)
        }))
      }, 1000)
      return () => clearInterval(timer)
    }
  }, [currentStep])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case 'h':
            e.preventDefault();
            setShowKeyboardShortcuts(!showKeyboardShortcuts);
            break;
          case '1':
            e.preventDefault();
            if (currentStep === 'method' && selectedTopic) {
              selectMethod({ id: 'flashcard', name: 'Flashcard', description: 'Học từ vựng với thẻ ghi nhớ', icon: '🃏' });
            }
            break;
          case '2':
            e.preventDefault();
            if (currentStep === 'method' && selectedTopic) {
              selectMethod({ id: 'spaced', name: 'Lặp lại ngắt quãng', description: 'Học từ vựng với phương pháp lặp lại ngắt quãng', icon: '🔄' });
            }
            break;
          case '3':
            e.preventDefault();
            if (currentStep === 'method' && selectedTopic) {
              selectMethod({ id: 'writing', name: 'Luyện viết', description: 'Luyện viết từ vựng', icon: '✍️' });
            }
            break;
          case 'ArrowLeft':
            e.preventDefault();
            if (currentStep === 'topic') {
              setCurrentStep('language');
              setSelectedLanguage(null);
            } else if (currentStep === 'method') {
              setCurrentStep('topic');
              setSelectedTopic(null);
            }
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [currentStep, selectedTopic, showKeyboardShortcuts]);

  // API Functions
  const fetchLanguages = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch('http://localhost:8000/api/languages')
      if (response.ok) {
        const result = await response.json()
        if (result.success) {
          setLanguages(result.data)
        } else {
          setError('Failed to fetch languages: ' + (result.message || 'API error'))
        }
      } else {
        setError(`Failed to fetch languages: HTTP error! status: ${response.status}`)
      }
    } catch (error: any) {
      console.error('Failed to fetch languages:', error)
      setError('Failed to fetch languages: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  const fetchTopics = async (languageId: number) => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(`http://localhost:8000/api/topics?languageId=${languageId}`)
      if (response.ok) {
        const result = await response.json()
        if (result.success && result.data.length > 0) {
          setTopics(result.data)
        } else {
          setError('No topics found for this language: ' + (result.message || 'API error'))
        }
      } else {
        setError(`Failed to fetch topics: HTTP error! status: ${response.status}`)
      }
    } catch (error: any) {
      console.error('Failed to fetch topics:', error)
      setError('Failed to fetch topics: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  const fetchVocabulary = async (topicId: number) => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(`http://localhost:8000/api/vocabulary?topicId=${topicId}`)
      if (response.ok) {
        const result = await response.json()
        if (result.success && result.data.length > 0) {
          setVocabulary(result.data)
        } else {
          setError('No vocabulary found for this topic: ' + (result.message || 'API error'))
        }
      } else {
        setError(`Failed to fetch vocabulary: HTTP error! status: ${response.status}`)
      }
    } catch (error: any) {
      console.error('Failed to fetch vocabulary:', error)
      setError('Failed to fetch vocabulary: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  // Event Handlers
  const selectLanguage = (language: Language) => {
    setSelectedLanguage(language)
    setCurrentStep('topic')
  }

  const selectTopic = (topic: Topic) => {
    // Check if topic is 100% completed using the same logic as display
    const progress = loadTopicProgress(topic.TopicID, topic.VocabularyCount || 0);
    
    if (progress.completed) {
      const confirmed = window.confirm(
        `🎉 Chủ đề "${topic.Title}" đã hoàn thành 100%!\n\n` +
        `Bạn có muốn học lại chủ đề này không?\n\n` +
        `✅ Đã thuộc: ${progress.masteredCount}/${progress.totalCount} từ vựng\n` +
        `📚 Đã học: ${progress.studiedCount}/${progress.totalCount} từ vựng`
      );
      
      if (!confirmed) {
        return; // User doesn't want to study again
      }
    }
    
    setSelectedTopic(topic)
    setCurrentStep('method')
  }

  const selectMethod = (method: StudyMethod) => {
    if (selectedTopic) {
      const topicId = selectedTopic.TopicID
      switch (method) {
        case 'flashcard':
          window.location.href = `/vocabulary/flashcard/${topicId}`
          break
        case 'spaced':
          window.location.href = `/vocabulary/spaced/${topicId}`
          break
        case 'writing':
          window.location.href = `/vocabulary/writing/${topicId}`
          break
        default:
          setSelectedMethod(method)
          setCurrentStep('study')
          setCurrentWordIndex(0)
          setIsFlipped(false)
          setWritingInput('')
          setShowAnswer(false)
          setStudyStats({ correct: 0, studied: 0, time: 0, streak: 0, accuracy: 0 })
      }
    }
  }

  const playAudio = (audioUrl: string) => {
    if (audioRef.current) {
      audioRef.current.src = audioUrl
      audioRef.current.play()
      setIsPlaying(true)
      audioRef.current.onended = () => setIsPlaying(false)
      audioRef.current.onerror = () => {
        console.error('Error playing audio:', audioUrl)
        setIsPlaying(false)
      }
    }
  }

  const nextWord = () => {
    if (currentWordIndex < vocabulary.length - 1) {
      setCurrentWordIndex(currentWordIndex + 1)
      setIsFlipped(false)
      setWritingInput('')
      setShowAnswer(false)
    } else {
      setCurrentStep('results')
    }
  }

  const prevWord = () => {
    if (currentWordIndex > 0) {
      setCurrentWordIndex(currentWordIndex - 1)
      setIsFlipped(false)
      setWritingInput('')
      setShowAnswer(false)
    }
  }

  const restartStudy = () => {
    setCurrentStep('study')
    setCurrentWordIndex(0)
    setIsFlipped(false)
    setWritingInput('')
    setShowAnswer(false)
    setStudyStats({ correct: 0, studied: 0, time: 0, streak: 0, accuracy: 0 })
  }

  const backToLanguage = () => {
    setCurrentStep('language')
    setSelectedLanguage(null)
    setSelectedTopic(null)
    setSelectedMethod(null)
  }

  const backToTopic = () => {
    setCurrentStep('topic')
    setSelectedTopic(null)
    setSelectedMethod(null)
  }

  const backToMethod = () => {
    setCurrentStep('method')
    setSelectedMethod(null)
  }

  // Study Method Handlers
  const handleFlashcardFlip = () => {
    setIsFlipped(!isFlipped)
    if (!isFlipped) {
      setStudyStats(prev => ({
        ...prev,
        studied: prev.studied + 1,
        accuracy: prev.studied > 0 ? (prev.correct / prev.studied) * 100 : 0
      }))
    }
  }

  const handleFlashcardAnswer = (isCorrect: boolean) => {
    setStudyStats(prev => ({
      ...prev,
      correct: prev.correct + (isCorrect ? 1 : 0),
      streak: isCorrect ? prev.streak + 1 : 0,
      accuracy: ((prev.correct + (isCorrect ? 1 : 0)) / (prev.studied + 1)) * 100
    }))
    setTimeout(nextWord, 1000)
  }

  const handleWritingCheck = () => {
    const currentWord = vocabulary[currentWordIndex]
    const isCorrect = writingInput.toLowerCase() === currentWord.Word.toLowerCase()
    
    setStudyStats(prev => ({
      ...prev,
      studied: prev.studied + 1,
      correct: prev.correct + (isCorrect ? 1 : 0),
      streak: isCorrect ? prev.streak + 1 : 0,
      accuracy: ((prev.correct + (isCorrect ? 1 : 0)) / (prev.studied + 1)) * 100
    }))
    
    setShowAnswer(true)
  }

  const handleSpacedRepetition = (quality: number) => {
    const isCorrect = quality >= 3
    
    setStudyStats(prev => ({
      ...prev,
      studied: prev.studied + 1,
      correct: prev.correct + (isCorrect ? 1 : 0),
      streak: isCorrect ? prev.streak + 1 : 0,
      accuracy: ((prev.correct + (isCorrect ? 1 : 0)) / (prev.studied + 1)) * 100
    }))
    
    setTimeout(nextWord, 1000)
  }

  // Loading Component
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-800 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold mb-2">Đang tải...</h2>
          <p className="text-lg opacity-80">Vui lòng chờ trong giây lát</p>
        </div>
      </div>
    )
  }

  // Error Display
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-600 via-pink-600 to-purple-800 text-white p-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-8">
            <h1 className="text-4xl font-bold mb-4">⚠️ Lỗi Kết Nối</h1>
            <p className="text-xl mb-6">{error}</p>
            <div className="space-y-4">
              <p className="text-lg">Vui lòng kiểm tra:</p>
              <ul className="text-left max-w-md mx-auto space-y-2">
                <li>• Backend server đang chạy (port 8000)</li>
                <li>• Database đã được khởi tạo</li>
                <li>• Kết nối mạng ổn định</li>
              </ul>
              <button
                onClick={() => window.location.reload()}
                className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full font-bold text-lg hover:from-blue-600 hover:to-purple-600 transform hover:scale-105 transition-all duration-300"
              >
                🔄 Thử Lại
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Render based on current step
  switch (currentStep) {
    case 'language':
      return <LanguageSelector languages={languages} onSelect={selectLanguage} theme={currentTheme} setTheme={setTheme} />
    
    case 'topic':
      return (
        <TopicSelector 
          topics={topics} 
          selectedLanguage={selectedLanguage!} 
          onSelect={selectTopic}
          onBack={backToLanguage}
          theme={currentTheme}
          setTheme={setTheme}
        />
      )
    
    case 'method':
      return (
        <MethodSelector 
          selectedTopic={selectedTopic!} 
          onSelect={selectMethod}
          onBack={backToTopic}
          theme={currentTheme}
          setTheme={setTheme}
        />
      )
    
    case 'study':
      return (
        <StudyMode 
          vocabulary={vocabulary}
          selectedMethod={selectedMethod!}
          selectedTopic={selectedTopic!}
          selectedLanguage={selectedLanguage!}
          currentWordIndex={currentWordIndex}
          studyStats={studyStats}
          isFlipped={isFlipped}
          writingInput={writingInput}
          showAnswer={showAnswer}
          isPlaying={isPlaying}
          onFlip={handleFlashcardFlip}
          onAnswer={handleFlashcardAnswer}
          onWritingCheck={handleWritingCheck}
          onSpacedRepetition={handleSpacedRepetition}
          onNext={nextWord}
          onPrev={prevWord}
          onBack={backToMethod}
          onPlayAudio={playAudio}
          onWritingInputChange={setWritingInput}
        />
      )
    
    case 'results':
      return (
        <StudyResults 
          stats={studyStats}
          totalWords={vocabulary.length}
          onRestart={restartStudy}
          onBack={backToMethod}
        />
      )
    
    default:
      return <LanguageSelector languages={languages} onSelect={selectLanguage} />
  }
}

// Language Selector Component
const LanguageSelector: React.FC<{
  languages: Language[]
  onSelect: (language: Language) => void
  theme: any
  setTheme: (theme: 'dark' | 'light' | 'neon') => void
}> = ({ languages, onSelect, theme, setTheme }) => {
  return (
    <div 
      className={`min-h-screen ${theme.background} ${theme.text} p-6 relative overflow-hidden`}
      style={{
        backgroundColor: theme === 'dark' ? '#1e293b' : theme === 'light' ? '#ffffff' : '#064e3b'
      }}
    >
      {/* Simple Beautiful Background */}
      <div className="absolute inset-0">
        <div className={`absolute top-10 left-10 w-72 h-72 ${theme.particles} rounded-full blur-3xl animate-pulse`}></div>
        <div className={`absolute bottom-10 right-10 w-96 h-96 ${theme.particles} rounded-full blur-3xl animate-pulse delay-1000`}></div>
        <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 ${theme.particles} rounded-full blur-3xl animate-pulse delay-500`}></div>
      </div>
      
      <div className="max-w-6xl mx-auto relative z-10">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <motion.h1 
              className={`text-6xl font-bold mb-6 bg-gradient-to-r ${theme.accent} bg-clip-text text-transparent drop-shadow-lg relative`}
              style={{
                color: theme === 'light' ? '#111827' : undefined,
                background: theme === 'light' ? 'linear-gradient(to right, #1e40af, #1e3a8a)' : undefined,
                WebkitBackgroundClip: theme === 'light' ? 'text' : undefined,
                WebkitTextFillColor: theme === 'light' ? 'transparent' : undefined
              }}
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <span className="relative z-10">🌍 Chọn Ngôn Ngữ</span>
              <div className={`absolute inset-0 bg-gradient-to-r ${theme.accent} blur-sm opacity-50`}></div>
            </motion.h1>
            <motion.p 
              className={`text-xl ${theme.textSecondary} mb-8 font-medium drop-shadow-sm`}
              style={{
                color: theme === 'light' ? '#374151' : undefined
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              Chọn ngôn ngữ bạn muốn học từ vựng
            </motion.p>
          </motion.div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
          {languages.map((language, index) => (
            <motion.div
              key={language.LanguageID}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ 
                scale: 1.05, 
                y: -5
              }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onSelect(language)}
              className="group cursor-pointer"
            >
              <div className={`${theme.card} border rounded-2xl p-6 text-center ${theme.cardHover} transition-all duration-300 relative`}>
                {/* Background glow for better visibility */}
                <div className={`absolute inset-0 ${theme.glow} opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl`}></div>
                
                <motion.div 
                  className="text-7xl mb-4 relative z-10"
                  whileHover={{ scale: 1.15, rotate: 8 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="drop-shadow-lg">
                    {language.Flag}
                  </div>
                </motion.div>
                
                <h3 className={`text-xl font-bold mb-2 ${theme.text} relative z-10 drop-shadow-sm`} style={{
                  color: theme === 'light' ? '#111827' : undefined
                }}>
                  {language.NativeName}
                </h3>
                
                <p className={`text-sm ${theme.textSecondary} mb-4 relative z-10`} style={{
                  color: theme === 'light' ? '#1f2937' : undefined
                }}>
                  {language.Name}
                </p>
                
                <div className={`${theme.button} rounded-full px-4 py-2 text-xs font-bold ${theme.buttonHover} transition-all duration-300 relative z-10 shadow-md`}>
                  {language.Code.toUpperCase()}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        
        {/* Simple Theme Selector & Keyboard Shortcuts */}
        <motion.div 
          className="mt-12 flex justify-center space-x-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          {/* Theme Selector */}
          <div className="flex space-x-3">
            {(['dark', 'light', 'neon'] as const).map((themeName) => (
              <button
                key={themeName}
                onClick={() => {
                  console.log('LanguageSelector theme button clicked:', themeName)
                  alert(`LanguageSelector theme changed to: ${themeName}`)
                  setTheme(themeName)
                }}
                className={`px-5 py-3 rounded-full text-sm font-bold transition-all duration-300 shadow-md ${
                  theme === themeName 
                    ? `${theme.button} ${theme.buttonHover}` 
                    : `${theme.card} ${theme.cardHover}`
                }`}
              >
                <span className="flex items-center space-x-2">
                  <span className="text-lg">
                    {themeName === 'dark' ? '🌙' : themeName === 'light' ? '☀️' : '⚡'}
                  </span>
                  <span className="capitalize">{themeName}</span>
                </span>
              </button>
            ))}
          </div>
          
          {/* Keyboard Shortcuts Help */}
          <button
            onClick={() => setShowKeyboardShortcuts(!showKeyboardShortcuts)}
            className={`px-6 py-3 ${theme.button} border rounded-full ${theme.buttonHover} transition-all duration-300 shadow-md`}
          >
            <span className="flex items-center space-x-2 font-semibold">
              <span className="text-lg">⌨️</span>
              <span>Phím tắt (Ctrl+H)</span>
            </span>
          </button>
        </motion.div>
      </div>
    </div>
  )
}

// Topic Selector Component
const TopicSelector: React.FC<{
  topics: Topic[]
  selectedLanguage: Language
  onSelect: (topic: Topic) => void
  onBack: () => void
  theme: any
  setTheme: (theme: 'dark' | 'light' | 'neon') => void
}> = ({ topics, selectedLanguage, onSelect, onBack, theme, setTheme }) => {
  const loadTopicProgress = (topicId: number, actualVocabularyCount: number) => {
    const flashcardProgress = localStorage.getItem(`flashcard_progress_${topicId}`);
    const spacedProgress = localStorage.getItem(`spaced_progress_${topicId}`);
    const writingProgress = localStorage.getItem(`writing_progress_${topicId}`);
    
    let masteredCount = 0;
    let studiedCount = 0; // Số từ đã học (có trong localStorage)
    let completed = false;
    
    // Kiểm tra tất cả các phương pháp học
    const allProgress = [];
    if (flashcardProgress) allProgress.push(JSON.parse(flashcardProgress));
    if (spacedProgress) allProgress.push(JSON.parse(spacedProgress));
    if (writingProgress) allProgress.push(JSON.parse(writingProgress));
    
    if (allProgress.length > 0) {
      // Lấy tất cả từ đã học từ các phương pháp
      const allStudiedWords = new Set();
      const allMasteredWords = new Set();
      
      allProgress.forEach(progress => {
        Object.keys(progress).forEach(wordId => {
          allStudiedWords.add(wordId);
          if (progress[wordId].level === 'mastered') {
            allMasteredWords.add(wordId);
          }
        });
      });
      
      studiedCount = allStudiedWords.size;
      masteredCount = allMasteredWords.size;
      
      // Chỉ hoàn thành 100% khi:
      // 1. Đã học hết tất cả từ vựng trong topic (studiedCount === actualVocabularyCount)
      // 2. Tất cả từ đã học đều thuộc (masteredCount === studiedCount)
      completed = studiedCount === actualVocabularyCount && 
                 masteredCount === studiedCount && 
                 studiedCount > 0;
    }
    
    return { completed, masteredCount, studiedCount, totalCount: actualVocabularyCount };
  }
  return (
    <div className={`min-h-screen ${theme.background} ${theme.text} p-6 relative overflow-hidden`}>
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className={`absolute top-10 left-10 w-72 h-72 ${theme.particles} rounded-full blur-3xl animate-pulse`}></div>
        <div className={`absolute bottom-10 right-10 w-96 h-96 ${theme.particles} rounded-full blur-3xl animate-pulse delay-1000`}></div>
        <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 ${theme.particles} rounded-full blur-3xl animate-pulse delay-500`}></div>
      </div>
      
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-8">
          <button
            onClick={onBack}
            className={`mb-4 px-6 py-3 ${theme.button} backdrop-blur-lg border rounded-full ${theme.buttonHover} transition-all duration-300 shadow-md`}
          >
            ← Quay lại chọn ngôn ngữ
          </button>
          <h1 className={`text-4xl font-bold mb-2 bg-gradient-to-r ${theme.accent} bg-clip-text text-transparent drop-shadow-lg`}>
            {selectedLanguage.Flag} {selectedLanguage.NativeName}
          </h1>
          <p className={`text-xl ${theme.textSecondary} font-medium drop-shadow-sm`}>Chọn chủ đề từ vựng để học</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {topics.map((topic) => {
            const progress = loadTopicProgress(topic.TopicID, topic.VocabularyCount || 0);
            return (
              <div
                key={topic.TopicID}
                onClick={() => onSelect(topic)}
                className="group cursor-pointer transform transition-all duration-300 hover:scale-105 hover:-translate-y-2"
              >
                <div className={`${theme.card} backdrop-blur-lg border rounded-2xl p-6 ${theme.cardHover} transition-all duration-300 relative ${
                  progress.completed 
                    ? 'bg-green-500/20 border-green-400/50 hover:bg-green-500/30' 
                    : ''
                }`}>
                  <div className="flex justify-between items-start mb-4">
                    <div className="text-4xl group-hover:scale-110 transition-transform duration-300">
                      {topic.Icon}
                    </div>
                    {progress.completed && (
                      <div className="bg-green-500/80 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center space-x-1">
                        <span>✅</span>
                        <span>100%</span>
                      </div>
                    )}
                  </div>
                  
                  <h3 className={`text-xl font-bold mb-2 ${theme.text}`} style={{
                    color: theme === 'light' ? '#111827' : undefined
                  }}>{topic.Title}</h3>
                  <p className={`text-sm ${theme.textSecondary} mb-4`} style={{
                    color: theme === 'light' ? '#374151' : undefined
                  }}>{topic.Description}</p>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className={`${theme.button} rounded-full px-3 py-1 text-xs font-medium`}>
                        {topic.Level}
                      </span>
                      <span className={`text-sm ${theme.textSecondary}`} style={{
                        color: theme === 'light' ? '#374151' : undefined
                      }}>
                        {topic.VocabularyCount || 0} từ vựng
                      </span>
                    </div>
                    
                    {progress.completed && (
                      <div className="bg-green-500/20 rounded-lg p-3 text-center">
                        <div className="text-sm font-medium text-green-300">
                          🎉 Hoàn thành 100%
                        </div>
                        <div className="text-xs text-green-200 mt-1">
                          {progress.masteredCount}/{progress.totalCount} từ đã thuộc
                        </div>
                      </div>
                    )}
                    
                    {!progress.completed && progress.studiedCount > 0 && (
                      <div className="bg-yellow-500/20 rounded-lg p-3 text-center">
                        <div className="text-sm font-medium text-yellow-300">
                          📚 Đang học: {progress.masteredCount}/{progress.studiedCount} (đã học {progress.studiedCount}/{progress.totalCount})
                        </div>
                        <div className="w-full bg-yellow-500/30 rounded-full h-2 mt-2">
                          <div 
                            className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${(progress.studiedCount / progress.totalCount) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    )}
                    
                    {progress.studiedCount === 0 && (
                      <div className="bg-blue-500/20 rounded-lg p-3 text-center">
                        <div className="text-sm font-medium text-blue-300">
                          🆕 Chưa bắt đầu học
                        </div>
                        <div className="text-xs text-blue-200 mt-1">
                          {progress.totalCount} từ vựng sẵn sàng
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        
        {/* Theme Selector */}
        <div className="mt-12 flex justify-center">
          <div className="flex space-x-3">
            {(['dark', 'light', 'neon'] as const).map((themeName) => (
              <button
                key={themeName}
                onClick={() => {
                  console.log('TopicSelector theme button clicked:', themeName)
                  alert(`TopicSelector theme changed to: ${themeName}`)
                  setTheme(themeName)
                }}
                className={`px-5 py-3 rounded-full text-sm font-bold transition-all duration-300 shadow-md ${
                  theme === themeName 
                    ? `${theme.button} ${theme.buttonHover}` 
                    : `${theme.card} ${theme.cardHover}`
                }`}
              >
                <span className="flex items-center space-x-2">
                  <span className="text-lg">
                    {themeName === 'dark' ? '🌙' : themeName === 'light' ? '☀️' : '⚡'}
                  </span>
                  <span className="capitalize">{themeName}</span>
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// Method Selector Component
const MethodSelector: React.FC<{
  selectedTopic: Topic
  onSelect: (method: StudyMethod) => void
  onBack: () => void
  theme: any
  setTheme: (theme: 'dark' | 'light' | 'neon') => void
}> = ({ selectedTopic, onSelect, onBack, theme, setTheme }) => {
  const methods = [
    {
      id: 'flashcard' as StudyMethod,
      name: 'Flashcards',
      description: 'Học từ vựng với thẻ ghi nhớ tương tác',
      icon: '🃏',
      color: 'from-purple-500 to-pink-500'
    },
    {
      id: 'spaced' as StudyMethod,
      name: 'Lặp Lại Ngắt Quãng',
      description: 'Lặp lại theo khoảng thời gian tối ưu',
      icon: '🔄',
      color: 'from-green-500 to-teal-500'
    },
    {
      id: 'writing' as StudyMethod,
      name: 'Luyện Viết',
      description: 'Luyện viết từ vựng chính xác',
      icon: '✍️',
      color: 'from-yellow-500 to-orange-500'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-800 text-white p-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <button
            onClick={onBack}
            className="mb-4 px-6 py-3 bg-white/20 backdrop-blur-lg border border-white/30 rounded-full hover:bg-white/30 transition-all duration-300"
          >
            ← Quay lại chọn chủ đề
          </button>
          <h1 className="text-4xl font-bold mb-2">
            {selectedTopic.Icon} {selectedTopic.Title}
          </h1>
          <p className="text-xl opacity-90">Chọn phương pháp học tập</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {methods.map((method) => (
            <div
              key={method.id}
              onClick={() => onSelect(method.id)}
              className="group cursor-pointer transform transition-all duration-300 hover:scale-105 hover:-translate-y-2"
            >
              <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-8 hover:bg-white/20 hover:shadow-2xl transition-all duration-300">
                <div className="text-6xl mb-6 group-hover:scale-110 transition-transform duration-300">
                  {method.icon}
                </div>
                <h3 className="text-2xl font-bold mb-4">{method.name}</h3>
                <p className="text-lg opacity-80 mb-6">{method.description}</p>
                <div className={`w-full h-2 bg-gradient-to-r ${method.color} rounded-full`}></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// Study Mode Component
const StudyMode: React.FC<{
  vocabulary: Vocabulary[]
  selectedMethod: StudyMethod
  selectedTopic: Topic
  selectedLanguage: Language
  currentWordIndex: number
  studyStats: StudyStats
  isFlipped: boolean
  writingInput: string
  showAnswer: boolean
  isPlaying: boolean
  onFlip: () => void
  onAnswer: (isCorrect: boolean) => void
  onWritingCheck: () => void
  onSpacedRepetition: (quality: number) => void
  onNext: () => void
  onPrev: () => void
  onBack: () => void
  onPlayAudio: (audioUrl: string) => void
  onWritingInputChange: (value: string) => void
}> = (props) => {
  const {
    vocabulary,
    selectedMethod,
    selectedTopic,
    selectedLanguage,
    currentWordIndex,
    studyStats,
    isFlipped,
    writingInput,
    showAnswer,
    isPlaying,
    onFlip,
    onAnswer,
    onWritingCheck,
    onSpacedRepetition,
    onNext,
    onPrev,
    onBack,
    onPlayAudio,
    onWritingInputChange
  } = props

  const currentWord = vocabulary[currentWordIndex]
  const progress = ((currentWordIndex + 1) / vocabulary.length) * 100

  if (!currentWord) return null

  const getMethodColor = () => {
    switch (selectedMethod) {
      case 'flashcard': return 'from-purple-600 via-blue-600 to-indigo-800'
      case 'spaced': return 'from-green-600 via-teal-600 to-blue-600'
      case 'writing': return 'from-yellow-600 via-orange-600 to-red-600'
      default: return 'from-blue-600 via-purple-600 to-indigo-800'
    }
  }

  const getMethodIcon = () => {
    switch (selectedMethod) {
      case 'flashcard': return '🃏'
      case 'spaced': return '🔄'
      case 'writing': return '✍️'
      default: return '📚'
    }
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br ${getMethodColor()} text-white p-6`}>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <span className="text-2xl mr-3">{selectedLanguage.Flag}</span>
            <h1 className="text-3xl font-bold">{getMethodIcon()} {selectedMethod === 'flashcard' ? 'Flashcards' : 
                                                      selectedMethod === 'spaced' ? 'Lặp Lại Ngắt Quãng' : 
                                                      'Luyện Viết'}</h1>
            <span className="text-2xl ml-3">{selectedTopic.Icon}</span>
          </div>
          <p className="text-lg opacity-90 mb-4">{selectedTopic.Title}</p>
          
          {/* Progress Bar */}
          <div className="w-full bg-white/20 rounded-full h-3 mb-4">
            <div 
              className="bg-gradient-to-r from-green-400 to-blue-500 h-3 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          
          <p className="text-sm opacity-70">
            {currentWordIndex + 1} / {vocabulary.length} từ vựng
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-green-400">{studyStats.correct}</div>
            <div className="text-sm opacity-80">Đúng</div>
          </div>
          <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-blue-400">{studyStats.studied}</div>
            <div className="text-sm opacity-80">Đã học</div>
          </div>
          <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-purple-400">{studyStats.streak}</div>
            <div className="text-sm opacity-80">Streak</div>
          </div>
          <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-yellow-400">{Math.round(studyStats.accuracy)}%</div>
            <div className="text-sm opacity-80">Chính xác</div>
          </div>
        </div>

        {/* Back Button */}
        <div className="text-center mb-6">
          <button
            onClick={onBack}
            className="px-6 py-3 bg-white/20 backdrop-blur-lg border border-white/30 rounded-full hover:bg-white/30 transition-all duration-300"
          >
            ← Quay lại
          </button>
        </div>

        {/* Study Content */}
        <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-8 mb-8">
          <div className="text-center">
            {/* Audio Button */}
            <button
              onClick={() => onPlayAudio(currentWord.Audio || '')}
              className="mb-6 p-4 bg-white/20 rounded-full hover:bg-white/30 transition-all duration-300"
            >
              {isPlaying ? '⏸️' : '🔊'}
            </button>

            {/* Flashcard Method */}
            {selectedMethod === 'flashcard' && (
              <div className="mb-8">
                <div className="perspective-1000">
                  <div className={`relative w-96 h-64 transition-transform duration-700 transform-style-preserve-3d mx-auto ${isFlipped ? 'rotate-y-180' : ''}`}>
                    {/* Front */}
                    <div className="absolute inset-0 w-full h-full backface-hidden">
                      <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-8 h-full flex flex-col justify-center items-center text-center">
                        <h2 className="text-3xl font-bold mb-2">{currentWord.Word}</h2>
                        <p className="text-lg opacity-80 mb-2">/{currentWord.Phonetic}/</p>
                        <p className="text-sm opacity-60">{currentWord.Type}</p>
                      </div>
                    </div>
                    
                    {/* Back */}
                    <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180">
                      <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-8 h-full flex flex-col justify-center items-center text-center">
                        <h2 className="text-3xl font-bold mb-4 text-yellow-300">{currentWord.Meaning}</h2>
                        <p className="text-lg opacity-80 mb-4">"{currentWord.Example}"</p>
                        <div className="flex space-x-4">
                          <button
                            onClick={() => onAnswer(true)}
                            className="px-6 py-3 bg-green-500 rounded-full font-bold hover:bg-green-600 transition-all duration-300 transform hover:scale-105"
                          >
                            ✅ Đúng
                          </button>
                          <button
                            onClick={() => onAnswer(false)}
                            className="px-6 py-3 bg-red-500 rounded-full font-bold hover:bg-red-600 transition-all duration-300 transform hover:scale-105"
                          >
                            ❌ Sai
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <button
                  onClick={onFlip}
                  className="mt-6 px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full font-bold text-lg hover:from-blue-600 hover:to-purple-600 transform hover:scale-105 transition-all duration-300 shadow-lg"
                >
                  {isFlipped ? '🔄 Xem từ' : '👁️ Xem nghĩa'}
                </button>
              </div>
            )}

            {/* Writing Method */}
            {selectedMethod === 'writing' && (
              <div className="mb-8">
                <div className="text-center mb-6">
                  <h2 className="text-3xl font-bold mb-2 text-yellow-300">{currentWord.Meaning}</h2>
                  <p className="text-lg opacity-80 mb-4">"{currentWord.Example}"</p>
                  <p className="text-sm opacity-60 mb-4">/{currentWord.Phonetic}/ • {currentWord.Type}</p>
                </div>
                
                <div className="max-w-md mx-auto">
                  <input
                    type="text"
                    value={writingInput}
                    onChange={(e) => onWritingInputChange(e.target.value)}
                    placeholder="Nhập từ vựng..."
                    className="w-full p-4 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 text-center text-xl font-bold"
                    onKeyPress={(e) => e.key === 'Enter' && !showAnswer && onWritingCheck()}
                    disabled={showAnswer}
                  />
                  
                  {!showAnswer && (
                    <button
                      onClick={onWritingCheck}
                      className="w-full mt-4 px-6 py-3 bg-gradient-to-r from-green-500 to-teal-500 rounded-lg font-bold hover:from-green-600 hover:to-teal-600 transition-all duration-300 transform hover:scale-105"
                    >
                      Kiểm tra
                    </button>
                  )}
                  
                  {showAnswer && (
                    <div className="mt-4 p-4 bg-white/20 rounded-lg">
                      <p className="text-lg font-bold mb-2">Đáp án: {currentWord.Word}</p>
                      <p className={`text-sm mb-4 ${writingInput.toLowerCase() === currentWord.Word.toLowerCase() ? 'text-green-400' : 'text-red-400'}`}>
                        {writingInput.toLowerCase() === currentWord.Word.toLowerCase() ? '✅ Đúng!' : '❌ Sai!'}
                      </p>
                      <button
                        onClick={onNext}
                        className="w-full px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg font-bold hover:from-blue-600 hover:to-purple-600 transition-all duration-300"
                      >
                        {currentWordIndex === vocabulary.length - 1 ? 'Hoàn thành' : 'Tiếp theo'}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Spaced Repetition Method */}
            {selectedMethod === 'spaced' && (
              <div className="mb-8">
                <div className="text-center mb-6">
                  <h2 className="text-3xl font-bold mb-2">{currentWord.Word}</h2>
                  <p className="text-lg opacity-80 mb-2">/{currentWord.Phonetic}/</p>
                  <p className="text-sm opacity-60 mb-4">{currentWord.Type}</p>
                </div>
                
                <button
                  onClick={onFlip}
                  className="w-full h-32 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center text-white font-bold text-xl hover:from-blue-600 hover:to-purple-600 transition-all duration-300 transform hover:scale-105 mb-6"
                >
                  {isFlipped ? '🔄 Ẩn nghĩa' : '👁️ Xem nghĩa'}
                </button>
                
                {isFlipped && (
                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-bold mb-2 text-yellow-300">{currentWord.Meaning}</h3>
                    <p className="text-lg opacity-80">"{currentWord.Example}"</p>
                  </div>
                )}
                
                {isFlipped && (
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      onClick={() => onSpacedRepetition(1)}
                      className="px-6 py-3 bg-red-500 rounded-lg font-bold hover:bg-red-600 transition-all duration-300 transform hover:scale-105"
                    >
                      😞 Khó
                    </button>
                    <button
                      onClick={() => onSpacedRepetition(2)}
                      className="px-6 py-3 bg-yellow-500 rounded-lg font-bold hover:bg-yellow-600 transition-all duration-300 transform hover:scale-105"
                    >
                      😐 Trung bình
                    </button>
                    <button
                      onClick={() => onSpacedRepetition(3)}
                      className="px-6 py-3 bg-green-500 rounded-lg font-bold hover:bg-green-600 transition-all duration-300 transform hover:scale-105"
                    >
                      😊 Dễ
                    </button>
                    <button
                      onClick={() => onSpacedRepetition(4)}
                      className="px-6 py-3 bg-blue-500 rounded-lg font-bold hover:bg-blue-600 transition-all duration-300 transform hover:scale-105"
                    >
                      🎉 Rất dễ
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Navigation */}
            <div className="flex justify-between items-center">
              <button
                onClick={onPrev}
                disabled={currentWordIndex === 0}
                className="px-6 py-3 bg-white/20 rounded-lg font-bold hover:bg-white/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                ← Trước
              </button>
              
              <div className="text-center">
                <p className="text-sm opacity-70">
                  Thời gian: {Math.floor(studyStats.time / 60)}:{(studyStats.time % 60).toString().padStart(2, '0')}
                </p>
              </div>
              
              <button
                onClick={onNext}
                disabled={currentWordIndex === vocabulary.length - 1}
                className="px-6 py-3 bg-white/20 rounded-lg font-bold hover:bg-white/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Sau →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Study Results Component
const StudyResults: React.FC<{
  stats: StudyStats
  totalWords: number
  onRestart: () => void
  onBack: () => void
}> = ({ stats, totalWords, onRestart, onBack }) => {
  const accuracy = totalWords > 0 ? (stats.correct / totalWords) * 100 : 0
  const timeMinutes = Math.floor(stats.time / 60)
  const timeSeconds = stats.time % 60

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 text-white p-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4">🎉 Kết Quả Học Tập</h1>
          <p className="text-xl opacity-90">Chúc mừng bạn đã hoàn thành bài học!</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 text-center">
            <div className="text-4xl font-bold text-green-400 mb-2">{stats.correct}</div>
            <div className="text-sm opacity-80">Từ đúng</div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 text-center">
            <div className="text-4xl font-bold text-blue-400 mb-2">{totalWords}</div>
            <div className="text-sm opacity-80">Tổng từ</div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 text-center">
            <div className="text-4xl font-bold text-yellow-400 mb-2">{Math.round(accuracy)}%</div>
            <div className="text-sm opacity-80">Độ chính xác</div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 text-center">
            <div className="text-4xl font-bold text-purple-400 mb-2">{timeMinutes}:{timeSeconds.toString().padStart(2, '0')}</div>
            <div className="text-sm opacity-80">Thời gian</div>
          </div>
        </div>

        {/* Performance Message */}
        <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-8 mb-12">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">
              {accuracy >= 90 ? '🌟 Xuất sắc!' :
               accuracy >= 80 ? '🎯 Tốt lắm!' :
               accuracy >= 70 ? '👍 Khá tốt!' :
               accuracy >= 60 ? '💪 Cần cố gắng!' :
               '📚 Hãy ôn lại nhé!'}
            </h2>
            <p className="text-lg opacity-80 mb-6">
              {accuracy >= 90 ? 'Bạn đã nắm vững từ vựng này!' :
               accuracy >= 80 ? 'Kết quả rất tốt, tiếp tục phát huy!' :
               accuracy >= 70 ? 'Khá tốt, hãy ôn lại một chút!' :
               accuracy >= 60 ? 'Cần ôn lại nhiều hơn!' :
               'Hãy học lại từ đầu để nắm vững hơn!'}
            </p>
            
            {stats.streak > 0 && (
              <div className="bg-yellow-500/20 border border-yellow-500/30 rounded-lg p-4 mb-6">
                <p className="text-yellow-300 font-bold">🔥 Streak: {stats.streak} từ liên tiếp đúng!</p>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center space-x-4">
          <button
            onClick={onBack}
            className="px-8 py-4 bg-white/20 backdrop-blur-lg border border-white/30 rounded-full font-bold text-lg hover:bg-white/30 transition-all duration-300"
          >
            ← Quay lại
          </button>
          <button
            onClick={onRestart}
            className="px-8 py-4 bg-gradient-to-r from-green-500 to-blue-500 rounded-full font-bold text-lg hover:from-green-600 hover:to-blue-600 transform hover:scale-105 transition-all duration-300 shadow-lg"
          >
            🔄 Học lại
          </button>
        </div>
      </div>
    </div>
  )
}

export default VocabularyPage