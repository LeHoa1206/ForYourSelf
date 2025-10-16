import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Brain, 
  Clock, 
  Star, 
  Target, 
  Award, 
  Trophy, 
  Medal, 
  Crown,
  Zap,
  Flame,
  Lightning,
  TrendingUp,
  BarChart3,
  PieChart,
  LineChart,
  CheckCircle,
  XCircle,
  AlertCircle,
  Info,
  Play,
  Pause,
  RotateCcw,
  SkipForward,
  SkipBack,
  Timer,
  Calendar,
  User,
  Users,
  Eye,
  EyeOff,
  BookOpen,
  Bookmark,
  Heart,
  Share2,
  Download,
  Settings,
  Filter,
  Search,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ChevronDown,
  Plus,
  Minus,
  RefreshCw,
  Save,
  Edit,
  Trash2,
  Copy,
  ExternalLink,
  Lock,
  Unlock,
  Shield,
  ShieldCheck,
  ShieldAlert,
  Key,
  Mail,
  Phone,
  MapPin,
  Globe,
  Wifi,
  WifiOff,
  Battery,
  BatteryLow,
  Signal,
  SignalHigh,
  SignalLow,
  Volume2,
  VolumeX,
  Mic,
  MicOff,
  Camera,
  CameraOff,
  Monitor,
  Smartphone,
  Tablet,
  Headphones,
  Speaker,
  Volume1,
  Volume3,
  Repeat,
  Shuffle,
  SkipEnd,
  SkipStart,
  FastForward,
  Rewind,
  PlayCircle,
  PauseCircle,
  StopCircle,
  Square,
  Circle,
  Triangle,
  Hexagon,
  Pentagon,
  Octagon,
  Diamond,
  Heart as HeartIcon,
  Sparkles,
  Gem,
  Star as StarIcon,
  Rocket,
  Sun,
  Moon,
  Cloud,
  CloudRain,
  CloudSnow,
  CloudLightning,
  Wind,
  Droplets,
  Thermometer,
  Gauge,
  Activity,
  TrendingDown,
  Equal,
  Divide,
  Multiply,
  Calculator,
  Hash,
  Percent,
  DollarSign,
  Euro,
  PoundSterling,
  Yen,
  Rupee,
  Won,
  Ruble,
  Lira,
  Franc,
  Peso,
  Real,
  Shekel,
  Taka,
  Baht,
  Ringgit,
  Rupiah,
  Dong,
  Kip,
  Riel,
  Tugrik,
  Som,
  Tenge,
  Manat,
  Lari,
  Dram,
  Afghani,
  Dinar,
  Dirham,
  Riyal,
  Rial
} from 'lucide-react'
import { useTheme } from '../contexts/ThemeContext'
import { 
  Card3D, 
  GlassCard, 
  NeonButton, 
  ParticleBackground, 
  TypingText, 
  CountUp, 
  LoadingSpinner3D,
  PageTransition,
  TiltCard
} from '../components/Animations'

interface Quiz {
  QuizID: number
  Title: string
  Type: string
  Level: string
  Duration: number
  Description?: string
  QuestionsCount?: number
  Difficulty?: string
  Category?: string
  Tags?: string[]
  CreatedAt?: string
  UpdatedAt?: string
  IsActive?: boolean
  IsPublic?: boolean
  Attempts?: number
  AverageScore?: number
  BestScore?: number
  PassRate?: number
}

interface Question {
  QuestionID: number
  QuizID: number
  Content: string
  OptionA: string
  OptionB: string
  OptionC: string
  OptionD: string
  CorrectAnswer: string
  Explanation?: string
  Difficulty?: string
  Category?: string
  Points?: number
  TimeLimit?: number
  ImageUrl?: string
  AudioUrl?: string
  VideoUrl?: string
}

interface QuizResult {
  score: number
  correctCount: number
  totalQuestions: number
  timeSpent: number
  answers: { [questionId: number]: string }
  correctAnswers: { [questionId: number]: string }
  explanations: { [questionId: number]: string }
}

const QuizzesPage: React.FC = () => {
  const { colors, theme } = useTheme()
  const [quizzes, setQuizzes] = useState<Quiz[]>([])
  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null)
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [userAnswers, setUserAnswers] = useState<{ [questionId: number]: string }>({})
  const [quizResult, setQuizResult] = useState<QuizResult | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedLevel, setSelectedLevel] = useState('')
  const [selectedType, setSelectedType] = useState('')
  const [sortBy, setSortBy] = useState('newest')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [favorites, setFavorites] = useState<number[]>([])
  const [showFilters, setShowFilters] = useState(false)
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false)
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [minDuration, setMinDuration] = useState(0)
  const [maxDuration, setMaxDuration] = useState(60)
  const [minQuestions, setMinQuestions] = useState(0)
  const [maxQuestions, setMaxQuestions] = useState(50)
  const [currentPage, setCurrentPage] = useState(1)
  const [quizzesPerPage] = useState(12)
  const [isQuizActive, setIsQuizActive] = useState(false)
  const [timeRemaining, setTimeRemaining] = useState(0)
  const [quizStartTime, setQuizStartTime] = useState<Date | null>(null)
  const [showResults, setShowResults] = useState(false)
  const [showExplanation, setShowExplanation] = useState(false)

  const types = [
    'All', 'Multiple Choice', 'True/False', 'Fill in the Blank', 'Matching', 
    'Listening', 'Speaking', 'Reading', 'Writing', 'Grammar', 'Vocabulary'
  ]

  const tags = [
    'Beginner', 'Intermediate', 'Advanced', 'Grammar', 'Vocabulary', 'Pronunciation',
    'Listening', 'Speaking', 'Reading', 'Writing', 'Business', 'Academic', 'Travel',
    'Daily Life', 'Work', 'School', 'Family', 'Friends', 'Food', 'Shopping',
    'Health', 'Technology', 'Environment', 'Culture', 'History', 'Science'
  ]

  useEffect(() => {
    fetchQuizzes()
  }, [selectedLevel, searchTerm, selectedType, sortBy, currentPage])

  useEffect(() => {
    if (isQuizActive && selectedQuiz) {
      setTimeRemaining(selectedQuiz.Duration * 60) // Convert minutes to seconds
      setQuizStartTime(new Date())
    }
  }, [isQuizActive, selectedQuiz])

  useEffect(() => {
    if (isQuizActive && timeRemaining > 0) {
      const timer = setTimeout(() => {
        setTimeRemaining(timeRemaining - 1)
      }, 1000)
      return () => clearTimeout(timer)
    } else if (isQuizActive && timeRemaining === 0) {
      handleSubmitQuiz()
    }
  }, [isQuizActive, timeRemaining])

  const fetchQuizzes = async () => {
    setLoading(true)
    setError(null)
    try {
      const params = new URLSearchParams()
      if (selectedLevel) params.append('level', selectedLevel)
      if (searchTerm) params.append('search', searchTerm)
      if (selectedType) params.append('type', selectedType)
      params.append('sort', sortBy)
      params.append('page', currentPage.toString())
      params.append('limit', quizzesPerPage.toString())

      const response = await fetch(`http://localhost:8000/api/quizzes?${params.toString()}`)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const result = await response.json()
      if (result.success) {
        setQuizzes(result.data)
      } else {
        setError(result.message || 'Failed to fetch quizzes')
      }
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  const fetchQuizQuestions = async (quizId: number) => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(`http://localhost:8000/api/quizzes/${quizId}/questions`)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const result = await response.json()
      if (result.success) {
        setQuestions(result.data)
        setIsQuizActive(true)
        setCurrentQuestionIndex(0)
        setUserAnswers({})
        setQuizResult(null)
        setShowResults(false)
        setShowExplanation(false)
      } else {
        setError(result.message || 'Failed to fetch quiz questions')
      }
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  const handleStartQuiz = (quiz: Quiz) => {
    setSelectedQuiz(quiz)
    fetchQuizQuestions(quiz.QuizID)
  }

  const handleAnswerSelect = (questionId: number, answer: string) => {
    setUserAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }))
  }

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    }
  }

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1)
    }
  }

  const handleSubmitQuiz = async () => {
    if (!selectedQuiz) return

    setLoading(true)
    try {
      const timeSpent = quizStartTime ? Math.floor((new Date().getTime() - quizStartTime.getTime()) / 1000) : 0
      
      const response = await fetch(`http://localhost:8000/api/quizzes/${selectedQuiz.QuizID}/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          answers: userAnswers,
          timeSpent: timeSpent
        })
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()
      if (result.success) {
        setQuizResult({
          score: result.data.score,
          correctCount: result.data.correctCount,
          totalQuestions: result.data.totalQuestions,
          timeSpent: timeSpent,
          answers: userAnswers,
          correctAnswers: {},
          explanations: {}
        })
        setIsQuizActive(false)
        setShowResults(true)
      } else {
        setError(result.message || 'Failed to submit quiz')
      }
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  const handleBackToQuizzes = () => {
    setSelectedQuiz(null)
    setQuestions([])
    setCurrentQuestionIndex(0)
    setUserAnswers({})
    setQuizResult(null)
    setIsQuizActive(false)
    setShowResults(false)
    setShowExplanation(false)
    setTimeRemaining(0)
    setQuizStartTime(null)
  }

  const toggleFavorite = (quizId: number) => {
    setFavorites(prev => 
      prev.includes(quizId) 
        ? prev.filter(id => id !== quizId)
        : [...prev, quizId]
    )
  }

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Beginner': return colors.success
      case 'Intermediate': return colors.warning
      case 'Advanced': return colors.error
      default: return colors.info
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'Multiple Choice': return <Target className="w-5 h-5" />
      case 'True/False': return <CheckCircle className="w-5 h-5" />
      case 'Fill in the Blank': return <Edit className="w-5 h-5" />
      case 'Listening': return <Volume2 className="w-5 h-5" />
      case 'Speaking': return <Mic className="w-5 h-5" />
      case 'Reading': return <BookOpen className="w-5 h-5" />
      case 'Writing': return <Edit className="w-5 h-5" />
      case 'Grammar': return <BookOpen className="w-5 h-5" />
      case 'Vocabulary': return <BookOpen className="w-5 h-5" />
      default: return <Brain className="w-5 h-5" />
    }
  }

  const getDifficultyIcon = (level: string) => {
    switch (level) {
      case 'Beginner': return <Star className="w-4 h-4" />
      case 'Intermediate': return <Target className="w-4 h-4" />
      case 'Advanced': return <Crown className="w-4 h-4" />
      default: return <BookOpen className="w-4 h-4" />
    }
  }

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN')
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return colors.success
    if (score >= 60) return colors.warning
    return colors.error
  }

  const getScoreIcon = (score: number) => {
    if (score >= 90) return <Crown className="w-6 h-6" />
    if (score >= 80) return <Trophy className="w-6 h-6" />
    if (score >= 70) return <Medal className="w-6 h-6" />
    if (score >= 60) return <Award className="w-6 h-6" />
    return <Target className="w-6 h-6" />
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    fetchQuizzes()
  }

  const handleFilterChange = (filterType: string, value: any) => {
    switch (filterType) {
      case 'level':
        setSelectedLevel(value)
        break
      case 'type':
        setSelectedType(value)
        break
      case 'sort':
        setSortBy(value)
        break
      case 'viewMode':
        setViewMode(value)
        break
      case 'tag':
        setSelectedTags(prev => 
          prev.includes(value) 
            ? prev.filter(tag => tag !== value)
            : [...prev, value]
        )
        break
    }
  }

  const clearFilters = () => {
    setSelectedLevel('')
    setSelectedType('')
    setSearchTerm('')
    setSelectedTags([])
    setMinDuration(0)
    setMaxDuration(60)
    setMinQuestions(0)
    setMaxQuestions(50)
    setSortBy('newest')
  }

  const filteredQuizzes = quizzes.filter(quiz => {
    if (selectedTags.length > 0) {
      // This would need to be implemented based on actual quiz tags
      return true
    }
    if (minDuration > 0 || maxDuration < 60) {
      return quiz.Duration >= minDuration && quiz.Duration <= maxDuration
    }
    if (minQuestions > 0 || maxQuestions < 50) {
      return (quiz.QuestionsCount || 0) >= minQuestions && (quiz.QuestionsCount || 0) <= maxQuestions
    }
    return true
  })

  const paginatedQuizzes = filteredQuizzes.slice(
    (currentPage - 1) * quizzesPerPage,
    currentPage * quizzesPerPage
  )

  const totalPages = Math.ceil(filteredQuizzes.length / quizzesPerPage)

  if (loading && !selectedQuiz) {
    return (
      <PageTransition>
        <div className="min-h-screen flex items-center justify-center pt-20" style={{ background: colors.background }}>
          <ParticleBackground>
            <div className="text-center">
              <LoadingSpinner3D size={80} />
              <motion.p 
                className="mt-6 text-xl font-bold"
                style={{ color: colors.text }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <TypingText text="Đang tải quiz..." speed={100} />
              </motion.p>
            </div>
          </ParticleBackground>
        </div>
      </PageTransition>
    )
  }

  if (error) {
    return (
      <PageTransition>
        <div className="min-h-screen flex items-center justify-center pt-20 p-4" style={{ background: colors.background }}>
          <GlassCard className="max-w-md text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200 }}
            >
              <div className="text-6xl mb-4">❌</div>
              <h2 className="text-2xl font-bold mb-4" style={{ color: colors.error }}>
                Lỗi tải quiz
              </h2>
              <p className="mb-6 opacity-80">{error}</p>
              <NeonButton onClick={fetchQuizzes} variant="primary">
                Thử lại
              </NeonButton>
            </motion.div>
          </GlassCard>
        </div>
      </PageTransition>
    )
  }

  // Quiz Taking Interface
  if (isQuizActive && selectedQuiz && questions.length > 0) {
    const currentQuestion = questions[currentQuestionIndex]
    const progress = ((currentQuestionIndex + 1) / questions.length) * 100

    return (
      <PageTransition>
        <div className="min-h-screen pt-20" style={{ background: colors.background }}>
          <ParticleBackground>
            <div className="max-w-4xl mx-auto p-4">
              {/* Quiz Header */}
              <motion.div
                className="mb-8"
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8 }}
              >
                <GlassCard className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <NeonButton
                        variant="secondary"
                        onClick={handleBackToQuizzes}
                        className="flex items-center space-x-2"
                      >
                        <ChevronLeft className="w-5 h-5" />
                        <span>Thoát quiz</span>
                      </NeonButton>
                      
                      <div className="flex items-center space-x-2">
                        <Brain className="w-6 h-6" style={{ color: colors.accent }} />
                        <h1 className="text-2xl font-bold" style={{ color: colors.text }}>
                          {selectedQuiz.Title}
                        </h1>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold" style={{ color: colors.warning }}>
                          {formatTime(timeRemaining)}
                        </div>
                        <div className="text-sm opacity-60" style={{ color: colors.textSecondary }}>
                          Thời gian còn lại
                        </div>
                      </div>
                      
                      <div className="text-center">
                        <div className="text-2xl font-bold" style={{ color: colors.info }}>
                          {currentQuestionIndex + 1} / {questions.length}
                        </div>
                        <div className="text-sm opacity-60" style={{ color: colors.textSecondary }}>
                          Câu hỏi
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
                    <motion.div
                      className="h-3 rounded-full"
                      style={{ background: `linear-gradient(90deg, ${colors.primary}, ${colors.accent})` }}
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        {getDifficultyIcon(selectedQuiz.Level)}
                        <span 
                          className="px-3 py-1 rounded-full text-sm font-medium"
                          style={{ 
                            background: `${getLevelColor(selectedQuiz.Level)}20`,
                            color: getLevelColor(selectedQuiz.Level)
                          }}
                        >
                          {selectedQuiz.Level}
                        </span>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        {getTypeIcon(selectedQuiz.Type)}
                        <span className="opacity-80" style={{ color: colors.textSecondary }}>
                          {selectedQuiz.Type}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      <NeonButton
                        variant="secondary"
                        size="sm"
                        onClick={handlePreviousQuestion}
                        disabled={currentQuestionIndex === 0}
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </NeonButton>
                      
                      <NeonButton
                        variant="primary"
                        size="sm"
                        onClick={handleNextQuestion}
                        disabled={currentQuestionIndex === questions.length - 1}
                      >
                        <ChevronRight className="w-4 h-4" />
                      </NeonButton>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>

              {/* Question */}
              <motion.div
                className="mb-8"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <Card3D intensity={0.05}>
                  <GlassCard className="p-8">
                    <div className="mb-6">
                      <h2 className="text-2xl font-bold mb-4" style={{ color: colors.text }}>
                        Câu {currentQuestionIndex + 1}: {currentQuestion.Content}
                      </h2>
                      
                      {currentQuestion.ImageUrl && (
                        <div className="mb-6">
                          <img
                            src={currentQuestion.ImageUrl}
                            alt="Question image"
                            className="max-w-full h-auto rounded-lg"
                          />
                        </div>
                      )}
                      
                      {currentQuestion.AudioUrl && (
                        <div className="mb-6">
                          <audio controls className="w-full">
                            <source src={currentQuestion.AudioUrl} type="audio/mpeg" />
                            Your browser does not support the audio element.
                          </audio>
                        </div>
                      )}
                    </div>
                    
                    {/* Answer Options */}
                    <div className="space-y-4">
                      {['A', 'B', 'C', 'D'].map((option, index) => {
                        const optionKey = `Option${option}` as keyof Question
                        const optionText = currentQuestion[optionKey] as string
                        const isSelected = userAnswers[currentQuestion.QuestionID] === option
                        
                        return (
                          <motion.div
                            key={option}
                            className={`p-4 rounded-xl cursor-pointer transition-all duration-300 ${
                              isSelected ? 'scale-105' : 'hover:scale-102'
                            }`}
                            style={{
                              background: isSelected 
                                ? `${colors.primary}20` 
                                : 'rgba(255, 255, 255, 0.05)',
                              border: `2px solid ${isSelected ? colors.primary : colors.border}`,
                              color: colors.text
                            }}
                            onClick={() => handleAnswerSelect(currentQuestion.QuestionID, option)}
                            whileHover={{ 
                              background: isSelected 
                                ? `${colors.primary}30` 
                                : 'rgba(255, 255, 255, 0.1)',
                              boxShadow: `0 0 20px ${colors.primary}40`
                            }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <div className="flex items-center space-x-4">
                              <div 
                                className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                                  isSelected ? 'text-white' : 'opacity-60'
                                }`}
                                style={{
                                  background: isSelected ? colors.primary : 'transparent',
                                  border: `2px solid ${isSelected ? colors.primary : colors.border}`
                                }}
                              >
                                {option}
                              </div>
                              
                              <span className="text-lg">{optionText}</span>
                              
                              {isSelected && (
                                <motion.div
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  className="ml-auto"
                                >
                                  <CheckCircle className="w-6 h-6" style={{ color: colors.success }} />
                                </motion.div>
                              )}
                            </div>
                          </motion.div>
                        )
                      })}
                    </div>
                  </GlassCard>
                </Card3D>
              </motion.div>

              {/* Navigation */}
              <motion.div
                className="flex justify-between"
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                <NeonButton
                  variant="secondary"
                  onClick={handlePreviousQuestion}
                  disabled={currentQuestionIndex === 0}
                  className="flex items-center space-x-2"
                >
                  <ChevronLeft className="w-5 h-5" />
                  <span>Câu trước</span>
                </NeonButton>
                
                <div className="flex space-x-4">
                  <NeonButton
                    variant="accent"
                    onClick={() => setShowExplanation(!showExplanation)}
                    className="flex items-center space-x-2"
                  >
                    <Info className="w-5 h-5" />
                    <span>{showExplanation ? 'Ẩn' : 'Hiện'} gợi ý</span>
                  </NeonButton>
                  
                  {currentQuestionIndex === questions.length - 1 ? (
                    <NeonButton
                      variant="primary"
                      onClick={handleSubmitQuiz}
                      className="flex items-center space-x-2"
                    >
                      <CheckCircle className="w-5 h-5" />
                      <span>Nộp bài</span>
                    </NeonButton>
                  ) : (
                    <NeonButton
                      variant="primary"
                      onClick={handleNextQuestion}
                      className="flex items-center space-x-2"
                    >
                      <span>Câu tiếp</span>
                      <ChevronRight className="w-5 h-5" />
                    </NeonButton>
                  )}
                </div>
              </motion.div>

              {/* Explanation */}
              <AnimatePresence>
                {showExplanation && currentQuestion.Explanation && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="mt-6"
                  >
                    <GlassCard className="p-6 border-2" style={{ borderColor: colors.info }}>
                      <div className="flex items-start space-x-3">
                        <Info className="w-6 h-6 mt-1" style={{ color: colors.info }} />
                        <div>
                          <h3 className="text-lg font-bold mb-2" style={{ color: colors.info }}>
                            Gợi ý
                          </h3>
                          <p className="opacity-80" style={{ color: colors.textSecondary }}>
                            {currentQuestion.Explanation}
                          </p>
                        </div>
                      </div>
                    </GlassCard>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </ParticleBackground>
        </div>
      </PageTransition>
    )
  }

  // Quiz Results
  if (showResults && quizResult) {
    return (
      <PageTransition>
        <div className="min-h-screen pt-20" style={{ background: colors.background }}>
          <ParticleBackground>
            <div className="max-w-4xl mx-auto p-4">
              {/* Results Header */}
              <motion.div
                className="text-center mb-12"
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8 }}
              >
                <div className="flex items-center justify-center mb-6">
                  {getScoreIcon(quizResult.score)}
                  <h1 className="text-5xl font-bold ml-4" style={{ color: colors.text }}>
                    Kết quả Quiz
                  </h1>
                </div>
                
                <motion.div
                  className="text-6xl font-bold mb-4"
                  style={{ color: getScoreColor(quizResult.score) }}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 200, delay: 0.5 }}
                >
                  <CountUp end={quizResult.score} suffix="%" />
                </motion.div>
                
                <p className="text-xl opacity-80" style={{ color: colors.textSecondary }}>
                  {quizResult.score >= 80 ? 'Xuất sắc!' : 
                   quizResult.score >= 60 ? 'Tốt!' : 'Cần cải thiện!'}
                </p>
              </motion.div>

              {/* Results Stats */}
              <motion.div
                className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <GlassCard className="p-6 text-center">
                  <CheckCircle className="w-12 h-12 mx-auto mb-4" style={{ color: colors.success }} />
                  <div className="text-3xl font-bold mb-2" style={{ color: colors.success }}>
                    <CountUp end={quizResult.correctCount} />
                  </div>
                  <p className="opacity-80" style={{ color: colors.textSecondary }}>
                    Câu đúng
                  </p>
                </GlassCard>
                
                <GlassCard className="p-6 text-center">
                  <XCircle className="w-12 h-12 mx-auto mb-4" style={{ color: colors.error }} />
                  <div className="text-3xl font-bold mb-2" style={{ color: colors.error }}>
                    <CountUp end={quizResult.totalQuestions - quizResult.correctCount} />
                  </div>
                  <p className="opacity-80" style={{ color: colors.textSecondary }}>
                    Câu sai
                  </p>
                </GlassCard>
                
                <GlassCard className="p-6 text-center">
                  <Clock className="w-12 h-12 mx-auto mb-4" style={{ color: colors.info }} />
                  <div className="text-3xl font-bold mb-2" style={{ color: colors.info }}>
                    {formatTime(quizResult.timeSpent)}
                  </div>
                  <p className="opacity-80" style={{ color: colors.textSecondary }}>
                    Thời gian làm bài
                  </p>
                </GlassCard>
              </motion.div>

              {/* Actions */}
              <motion.div
                className="flex justify-center space-x-4"
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                <NeonButton
                  variant="primary"
                  onClick={handleBackToQuizzes}
                  className="flex items-center space-x-2"
                >
                  <ChevronLeft className="w-5 h-5" />
                  <span>Quay lại danh sách</span>
                </NeonButton>
                
                <NeonButton
                  variant="secondary"
                  onClick={() => handleStartQuiz(selectedQuiz!)}
                  className="flex items-center space-x-2"
                >
                  <RotateCcw className="w-5 h-5" />
                  <span>Làm lại</span>
                </NeonButton>
                
                <NeonButton
                  variant="accent"
                  className="flex items-center space-x-2"
                >
                  <Share2 className="w-5 h-5" />
                  <span>Chia sẻ kết quả</span>
                </NeonButton>
              </motion.div>
            </div>
          </ParticleBackground>
        </div>
      </PageTransition>
    )
  }

  // Main Quizzes List
  return (
    <PageTransition>
      <div className="min-h-screen pt-20" style={{ background: colors.background }}>
        <ParticleBackground>
          <div className="max-w-7xl mx-auto p-4">
            {/* Header */}
            <motion.div 
              className="text-center mb-12"
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
            >
              <div className="flex items-center justify-center mb-4">
                <Brain className="w-8 h-8 mr-3" style={{ color: colors.accent }} />
                <h1 className="text-5xl font-bold" style={{ color: colors.text }}>
                  <TypingText text="Smart Quizzes" speed={150} />
                </h1>
                <Brain className="w-8 h-8 ml-3" style={{ color: colors.accent }} />
              </div>
              <motion.p 
                className="text-xl opacity-80"
                style={{ color: colors.textSecondary }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.8 }}
                transition={{ delay: 1 }}
              >
                Kiểm tra kiến thức với các bài quiz đa dạng và phản hồi tức thì
              </motion.p>
            </motion.div>

            {/* Search and Filters */}
            <motion.div
              className="mb-8"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <GlassCard className="p-6">
                <form onSubmit={handleSearch} className="flex flex-col lg:flex-row gap-4">
                  {/* Search Input */}
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Tìm kiếm quiz..."
                      className="w-full pl-10 pr-4 py-3 rounded-xl border-2 focus:ring-2 focus:ring-opacity-50 transition-all duration-300"
                      style={{
                        background: colors.surface,
                        borderColor: colors.border,
                        color: colors.text
                      }}
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>

                  {/* Level Filter */}
                  <select
                    className="px-4 py-3 rounded-xl border-2 focus:ring-2 focus:ring-opacity-50 transition-all duration-300"
                    style={{
                      background: colors.surface,
                      borderColor: colors.border,
                      color: colors.text
                    }}
                    value={selectedLevel}
                    onChange={(e) => handleFilterChange('level', e.target.value)}
                  >
                    <option value="">Tất cả trình độ</option>
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>

                  {/* Type Filter */}
                  <select
                    className="px-4 py-3 rounded-xl border-2 focus:ring-2 focus:ring-opacity-50 transition-all duration-300"
                    style={{
                      background: colors.surface,
                      borderColor: colors.border,
                      color: colors.text
                    }}
                    value={selectedType}
                    onChange={(e) => handleFilterChange('type', e.target.value)}
                  >
                    {types.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>

                  {/* Sort */}
                  <select
                    className="px-4 py-3 rounded-xl border-2 focus:ring-2 focus:ring-opacity-50 transition-all duration-300"
                    style={{
                      background: colors.surface,
                      borderColor: colors.border,
                      color: colors.text
                    }}
                    value={sortBy}
                    onChange={(e) => handleFilterChange('sort', e.target.value)}
                  >
                    <option value="newest">Mới nhất</option>
                    <option value="oldest">Cũ nhất</option>
                    <option value="popular">Phổ biến</option>
                    <option value="difficulty">Độ khó</option>
                    <option value="duration">Thời lượng</option>
                  </select>

                  {/* View Mode */}
                  <div className="flex space-x-2">
                    <NeonButton
                      variant={viewMode === 'grid' ? 'primary' : 'secondary'}
                      onClick={() => handleFilterChange('viewMode', 'grid')}
                    >
                      <Target className="w-5 h-5" />
                    </NeonButton>
                    <NeonButton
                      variant={viewMode === 'list' ? 'primary' : 'secondary'}
                      onClick={() => handleFilterChange('viewMode', 'list')}
                    >
                      <List className="w-5 h-5" />
                    </NeonButton>
                  </div>

                  {/* Advanced Filters */}
                  <NeonButton
                    variant="accent"
                    onClick={() => setShowAdvancedSearch(!showAdvancedSearch)}
                  >
                    <Filter className="w-5 h-5 mr-2" />
                    Bộ lọc
                  </NeonButton>
                </form>

                {/* Advanced Search */}
                <AnimatePresence>
                  {showAdvancedSearch && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="mt-6 pt-6 border-t"
                      style={{ borderColor: colors.border }}
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {/* Duration Range */}
                        <div>
                          <label className="block text-sm font-medium mb-2" style={{ color: colors.text }}>
                            Thời lượng (phút)
                          </label>
                          <div className="flex space-x-2">
                            <input
                              type="number"
                              placeholder="Min"
                              className="w-full px-3 py-2 rounded-lg border-2"
                              style={{
                                background: colors.surface,
                                borderColor: colors.border,
                                color: colors.text
                              }}
                              value={minDuration}
                              onChange={(e) => setMinDuration(Number(e.target.value))}
                            />
                            <input
                              type="number"
                              placeholder="Max"
                              className="w-full px-3 py-2 rounded-lg border-2"
                              style={{
                                background: colors.surface,
                                borderColor: colors.border,
                                color: colors.text
                              }}
                              value={maxDuration}
                              onChange={(e) => setMaxDuration(Number(e.target.value))}
                            />
                          </div>
                        </div>

                        {/* Questions Range */}
                        <div>
                          <label className="block text-sm font-medium mb-2" style={{ color: colors.text }}>
                            Số câu hỏi
                          </label>
                          <div className="flex space-x-2">
                            <input
                              type="number"
                              placeholder="Min"
                              className="w-full px-3 py-2 rounded-lg border-2"
                              style={{
                                background: colors.surface,
                                borderColor: colors.border,
                                color: colors.text
                              }}
                              value={minQuestions}
                              onChange={(e) => setMinQuestions(Number(e.target.value))}
                            />
                            <input
                              type="number"
                              placeholder="Max"
                              className="w-full px-3 py-2 rounded-lg border-2"
                              style={{
                                background: colors.surface,
                                borderColor: colors.border,
                                color: colors.text
                              }}
                              value={maxQuestions}
                              onChange={(e) => setMaxQuestions(Number(e.target.value))}
                            />
                          </div>
                        </div>

                        {/* Tags */}
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium mb-2" style={{ color: colors.text }}>
                            Tags
                          </label>
                          <div className="flex flex-wrap gap-2">
                            {tags.slice(0, 8).map(tag => (
                              <button
                                key={tag}
                                onClick={() => handleFilterChange('tag', tag)}
                                className={`px-3 py-1 rounded-full text-sm transition-all duration-300 ${
                                  selectedTags.includes(tag) ? 'text-white' : 'opacity-70'
                                }`}
                                style={{
                                  background: selectedTags.includes(tag) 
                                    ? colors.primary 
                                    : 'transparent',
                                  border: `1px solid ${colors.border}`,
                                  color: selectedTags.includes(tag) 
                                    ? 'white' 
                                    : colors.text
                                }}
                              >
                                {tag}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-end mt-4 space-x-2">
                        <NeonButton variant="secondary" onClick={clearFilters}>
                          Xóa bộ lọc
                        </NeonButton>
                        <NeonButton variant="primary" onClick={fetchQuizzes}>
                          Áp dụng
                        </NeonButton>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </GlassCard>
            </motion.div>

            {/* Results Count */}
            <motion.div
              className="mb-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <div className="flex items-center justify-between">
                <p className="text-lg" style={{ color: colors.textSecondary }}>
                  Tìm thấy <CountUp end={filteredQuizzes.length} /> quiz
                </p>
                
                <div className="flex items-center space-x-4">
                  <span className="text-sm" style={{ color: colors.textSecondary }}>
                    Trang {currentPage} / {totalPages}
                  </span>
                  
                  <div className="flex space-x-2">
                    <NeonButton
                      variant="secondary"
                      size="sm"
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </NeonButton>
                    
                    <NeonButton
                      variant="secondary"
                      size="sm"
                      onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                      disabled={currentPage === totalPages}
                    >
                      <ChevronRight className="w-4 h-4" />
                    </NeonButton>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Quiz Grid */}
            {paginatedQuizzes.length === 0 ? (
              <motion.div
                className="text-center py-20"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
              >
                <Brain className="w-24 h-24 mx-auto mb-6 opacity-50" />
                <h3 className="text-2xl font-bold mb-4" style={{ color: colors.text }}>
                  Không tìm thấy quiz nào
                </h3>
                <p className="opacity-60 mb-6" style={{ color: colors.textSecondary }}>
                  Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm
                </p>
                <NeonButton variant="primary" onClick={clearFilters}>
                  Xóa bộ lọc
                </NeonButton>
              </motion.div>
            ) : (
              <motion.div
                className={`grid gap-6 ${
                  viewMode === 'grid' 
                    ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
                    : 'grid-cols-1'
                }`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
              >
                {paginatedQuizzes.map((quiz, index) => (
                  <motion.div
                    key={quiz.QuizID}
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <TiltCard intensity={0.05}>
                      <Card3D intensity={0.1}>
                        <GlassCard 
                          className={`overflow-hidden cursor-pointer transition-all duration-300 ${
                            viewMode === 'list' ? 'flex' : ''
                          }`}
                        >
                          {viewMode === 'grid' ? (
                            <>
                              <div className="p-6">
                                <div className="flex items-start justify-between mb-4">
                                  <div className="flex items-center space-x-3">
                                    {getTypeIcon(quiz.Type)}
                                    <div>
                                      <h3 className="text-lg font-semibold mb-1" style={{ color: colors.text }}>
                                        {quiz.Title}
                                      </h3>
                                      <p className="text-sm opacity-60" style={{ color: colors.textSecondary }}>
                                        {quiz.Type}
                                      </p>
                                    </div>
                                  </div>
                                  
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      toggleFavorite(quiz.QuizID)
                                    }}
                                    className={`p-2 rounded-full transition-all duration-300 ${
                                      favorites.includes(quiz.QuizID) 
                                        ? 'text-red-500 bg-red-500 bg-opacity-20' 
                                        : 'text-gray-500 hover:text-red-500'
                                    }`}
                                  >
                                    <Heart className="w-4 h-4" />
                                  </button>
                                </div>
                                
                                <p className="text-sm opacity-80 mb-4 line-clamp-2" style={{ color: colors.textSecondary }}>
                                  {quiz.Description || 'Không có mô tả'}
                                </p>
                                
                                <div className="flex items-center justify-between mb-4">
                                  <div className="flex items-center space-x-2">
                                    {getDifficultyIcon(quiz.Level)}
                                    <span 
                                      className="px-2 py-1 rounded-full text-xs font-medium"
                                      style={{ 
                                        background: `${getLevelColor(quiz.Level)}20`,
                                        color: getLevelColor(quiz.Level)
                                      }}
                                    >
                                      {quiz.Level}
                                    </span>
                                  </div>
                                  
                                  <div className="flex items-center space-x-1 text-xs opacity-60">
                                    <Clock className="w-3 h-3" />
                                    <span>{quiz.Duration} phút</span>
                                  </div>
                                </div>
                                
                                <div className="flex items-center justify-between text-sm">
                                  <div className="flex items-center space-x-1 text-xs opacity-60">
                                    <Target className="w-3 h-3" />
                                    <span>{quiz.QuestionsCount || 0} câu</span>
                                  </div>
                                  
                                  <div className="flex items-center space-x-1 text-xs opacity-60">
                                    <Users className="w-3 h-3" />
                                    <span>{quiz.Attempts || 0} lượt</span>
                                  </div>
                                </div>
                              </div>
                              
                              <div className="p-4 border-t" style={{ borderColor: colors.border }}>
                                <NeonButton
                                  variant="primary"
                                  className="w-full"
                                  onClick={() => handleStartQuiz(quiz)}
                                >
                                  <Play className="w-4 h-4 mr-2" />
                                  Bắt đầu quiz
                                </NeonButton>
                              </div>
                            </>
                          ) : (
                            <div className="flex w-full">
                              <div className="flex-1 p-6">
                                <div className="flex items-start justify-between mb-4">
                                  <div className="flex items-center space-x-4">
                                    {getTypeIcon(quiz.Type)}
                                    <div>
                                      <h3 className="text-xl font-semibold mb-1" style={{ color: colors.text }}>
                                        {quiz.Title}
                                      </h3>
                                      <p className="text-sm opacity-60" style={{ color: colors.textSecondary }}>
                                        {quiz.Type} • {quiz.Level}
                                      </p>
                                    </div>
                                  </div>
                                  
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      toggleFavorite(quiz.QuizID)
                                    }}
                                    className={`p-2 rounded-full transition-all duration-300 ${
                                      favorites.includes(quiz.QuizID) 
                                        ? 'text-red-500 bg-red-500 bg-opacity-20' 
                                        : 'text-gray-500 hover:text-red-500'
                                    }`}
                                  >
                                    <Heart className="w-4 h-4" />
                                  </button>
                                </div>
                                
                                <p className="opacity-80 mb-4" style={{ color: colors.textSecondary }}>
                                  {quiz.Description || 'Không có mô tả'}
                                </p>
                                
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center space-x-6 text-sm">
                                    <div className="flex items-center space-x-2">
                                      <Clock className="w-4 h-4" />
                                      <span>{quiz.Duration} phút</span>
                                    </div>
                                    
                                    <div className="flex items-center space-x-2">
                                      <Target className="w-4 h-4" />
                                      <span>{quiz.QuestionsCount || 0} câu hỏi</span>
                                    </div>
                                    
                                    <div className="flex items-center space-x-2">
                                      <Users className="w-4 h-4" />
                                      <span>{quiz.Attempts || 0} lượt thử</span>
                                    </div>
                                    
                                    {quiz.AverageScore && (
                                      <div className="flex items-center space-x-2">
                                        <TrendingUp className="w-4 h-4" />
                                        <span>{quiz.AverageScore}% điểm TB</span>
                                      </div>
                                    )}
                                  </div>
                                  
                                  <NeonButton
                                    variant="primary"
                                    onClick={() => handleStartQuiz(quiz)}
                                    className="flex items-center space-x-2"
                                  >
                                    <Play className="w-4 h-4" />
                                    <span>Bắt đầu</span>
                                  </NeonButton>
                                </div>
                              </div>
                            </div>
                          )}
                        </GlassCard>
                      </Card3D>
                    </TiltCard>
                  </motion.div>
                ))}
              </motion.div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <motion.div
                className="mt-12 flex justify-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
              >
                <div className="flex items-center space-x-2">
                  <NeonButton
                    variant="secondary"
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </NeonButton>
                  
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const page = i + 1
                    return (
                      <NeonButton
                        key={page}
                        variant={currentPage === page ? 'primary' : 'secondary'}
                        onClick={() => setCurrentPage(page)}
                      >
                        {page}
                      </NeonButton>
                    )
                  })}
                  
                  <NeonButton
                    variant="secondary"
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                  >
                    <ChevronRight className="w-4 h-4" />
                  </NeonButton>
                </div>
              </motion.div>
            )}
          </div>
        </ParticleBackground>
      </div>
    </PageTransition>
  )
}

export default QuizzesPage