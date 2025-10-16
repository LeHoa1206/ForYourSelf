import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Settings, 
  Maximize, 
  RotateCcw, 
  SkipBack, 
  SkipForward,
  Search,
  Filter,
  Star,
  Clock,
  Eye,
  BookOpen,
  Brain,
  ChevronRight,
  ChevronLeft,
  Download,
  Share2,
  Heart,
  Bookmark,
  MessageCircle,
  Zap,
  Target,
  Award,
  TrendingUp,
  Users,
  ThumbsUp,
  ThumbsDown,
  Flag,
  MoreHorizontal,
  X,
  CheckCircle,
  AlertCircle,
  Info,
  Lightbulb,
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
  Crown,
  Gem,
  Star as StarIcon,
  Rocket,
  Flame,
  Lightning,
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
  BarChart3,
  PieChart,
  LineChart,
  TrendingUp as TrendingUpIcon,
  TrendingDown,
  Minus,
  Plus,
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
  Rial,
  Dinar as DinarIcon,
  Dirham as DirhamIcon,
  Riyal as RiyalIcon,
  Rial as RialIcon,
  Dinar as DinarIcon2,
  Dirham as DirhamIcon2,
  Riyal as RiyalIcon2,
  Rial as RialIcon2
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

interface Video {
  id: number
  title: string
  description: string
  youtube_id: string
  thumbnail_url: string
  duration: string
  difficulty: string
  views: number
  created_at: string
  subtitles: Subtitle[]
  vocabulary: VocabularyItem[]
  exercises: ExerciseItem[]
}

interface Subtitle {
  start_time: number
  end_time: number
  english_text: string
  vietnamese_text: string
}

interface VocabularyItem {
  word: string
  meaning: string
  phonetic?: string
  example?: string
  difficulty?: string
}

interface ExerciseItem {
  type: string
  question: string
  answer: string
  options?: string[]
  explanation?: string
}

const VideoLearningPage: React.FC = () => {
  const { colors, theme } = useTheme()
  const [videos, setVideos] = useState<Video[]>([])
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedLevel, setSelectedLevel] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [sortBy, setSortBy] = useState('newest')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [favorites, setFavorites] = useState<number[]>([])
  const [watchLater, setWatchLater] = useState<number[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [videosPerPage] = useState(12)
  const [showFilters, setShowFilters] = useState(false)
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false)
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [minDuration, setMinDuration] = useState(0)
  const [maxDuration, setMaxDuration] = useState(60)
  const [minViews, setMinViews] = useState(0)
  const [maxViews, setMaxViews] = useState(1000000)

  const categories = [
    'All', 'Grammar', 'Vocabulary', 'Pronunciation', 'Conversation', 
    'Business English', 'Academic English', 'Travel English', 'IELTS', 'TOEFL'
  ]

  const tags = [
    'Beginner', 'Intermediate', 'Advanced', 'Native Speaker', 'Accent Training',
    'Grammar Rules', 'Common Mistakes', 'Idioms', 'Phrasal Verbs', 'Business',
    'Academic', 'Travel', 'Daily Life', 'Work', 'School', 'Family', 'Friends',
    'Food', 'Shopping', 'Health', 'Technology', 'Environment', 'Culture'
  ]

  useEffect(() => {
    fetchVideos()
  }, [selectedLevel, searchTerm, selectedCategory, sortBy, currentPage])

  const fetchVideos = async () => {
    setLoading(true)
    setError(null)
    try {
      const params = new URLSearchParams()
      if (selectedLevel) params.append('level', selectedLevel)
      if (searchTerm) params.append('search', searchTerm)
      if (selectedCategory) params.append('category', selectedCategory)
      params.append('sort', sortBy)
      params.append('page', currentPage.toString())
      params.append('limit', videosPerPage.toString())

      const response = await fetch(`http://localhost:8000/api/videos?${params.toString()}`)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const result = await response.json()
      if (result.success) {
        setVideos(result.data)
      } else {
        setError(result.message || 'Failed to fetch videos')
      }
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  const fetchVideoDetails = async (videoId: number) => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(`http://localhost:8000/api/videos/${videoId}`)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const result = await response.json()
      if (result.success) {
        setSelectedVideo(result.data)
      } else {
        setError(result.message || 'Failed to fetch video details')
      }
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  const handleVideoSelect = (video: Video) => {
    fetchVideoDetails(video.id)
  }

  const handleBackToSelection = () => {
    setSelectedVideo(null)
  }

  const toggleFavorite = (videoId: number) => {
    setFavorites(prev => 
      prev.includes(videoId) 
        ? prev.filter(id => id !== videoId)
        : [...prev, videoId]
    )
  }

  const toggleWatchLater = (videoId: number) => {
    setWatchLater(prev => 
      prev.includes(videoId) 
        ? prev.filter(id => id !== videoId)
        : [...prev, videoId]
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

  const getDifficultyIcon = (level: string) => {
    switch (level) {
      case 'Beginner': return <Star className="w-4 h-4" />
      case 'Intermediate': return <Target className="w-4 h-4" />
      case 'Advanced': return <Crown className="w-4 h-4" />
      default: return <BookOpen className="w-4 h-4" />
    }
  }

  const formatDuration = (duration: string) => {
    return duration === 'N/A' ? 'Unknown' : duration
  }

  const formatViews = (views: number) => {
    if (views >= 1000000) return `${(views / 1000000).toFixed(1)}M`
    if (views >= 1000) return `${(views / 1000).toFixed(1)}K`
    return views.toString()
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN')
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    fetchVideos()
  }

  const handleFilterChange = (filterType: string, value: any) => {
    switch (filterType) {
      case 'level':
        setSelectedLevel(value)
        break
      case 'category':
        setSelectedCategory(value)
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
    setSelectedCategory('')
    setSearchTerm('')
    setSelectedTags([])
    setMinDuration(0)
    setMaxDuration(60)
    setMinViews(0)
    setMaxViews(1000000)
    setSortBy('newest')
  }

  const filteredVideos = videos.filter(video => {
    if (selectedTags.length > 0) {
      // This would need to be implemented based on actual video tags
      return true
    }
    if (minDuration > 0 || maxDuration < 60) {
      // This would need duration parsing
      return true
    }
    if (minViews > 0 || maxViews < 1000000) {
      return video.views >= minViews && video.views <= maxViews
    }
    return true
  })

  const paginatedVideos = filteredVideos.slice(
    (currentPage - 1) * videosPerPage,
    currentPage * videosPerPage
  )

  const totalPages = Math.ceil(filteredVideos.length / videosPerPage)

  if (loading && !selectedVideo) {
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
                <TypingText text="Đang tải video..." speed={100} />
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
                Lỗi tải video
              </h2>
              <p className="mb-6 opacity-80">{error}</p>
              <NeonButton onClick={fetchVideos} variant="primary">
                Thử lại
              </NeonButton>
            </motion.div>
          </GlassCard>
        </div>
      </PageTransition>
    )
  }

  if (selectedVideo) {
    return (
      <PageTransition>
        <div className="min-h-screen pt-20" style={{ background: colors.background }}>
          <ParticleBackground>
            <div className="max-w-7xl mx-auto p-4">
              {/* Header */}
              <motion.div 
                className="mb-8"
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8 }}
              >
                <div className="flex items-center justify-between mb-6">
                  <NeonButton
                    variant="secondary"
                    onClick={handleBackToSelection}
                    className="flex items-center space-x-2"
                  >
                    <ChevronLeft className="w-5 h-5" />
                    <span>Quay lại</span>
                  </NeonButton>
                  
                  <div className="flex items-center space-x-4">
                    <NeonButton
                      variant="primary"
                      onClick={() => toggleFavorite(selectedVideo.id)}
                      className={`flex items-center space-x-2 ${
                        favorites.includes(selectedVideo.id) ? 'text-red-500' : ''
                      }`}
                    >
                      <Heart className="w-5 h-5" />
                      <span>Yêu thích</span>
                    </NeonButton>
                    
                    <NeonButton
                      variant="accent"
                      onClick={() => toggleWatchLater(selectedVideo.id)}
                      className={`flex items-center space-x-2 ${
                        watchLater.includes(selectedVideo.id) ? 'text-blue-500' : ''
                      }`}
                    >
                      <Bookmark className="w-5 h-5" />
                      <span>Xem sau</span>
                    </NeonButton>
                    
                    <NeonButton
                      variant="secondary"
                      className="flex items-center space-x-2"
                    >
                      <Share2 className="w-5 h-5" />
                      <span>Chia sẻ</span>
                    </NeonButton>
                  </div>
                </div>

                <GlassCard className="p-8">
                  <div className="flex items-start space-x-6">
                    <div className="flex-shrink-0">
                      <img
                        src={selectedVideo.thumbnail_url}
                        alt={selectedVideo.title}
                        className="w-32 h-24 object-cover rounded-lg"
                      />
                    </div>
                    
                    <div className="flex-1">
                      <h1 className="text-3xl font-bold mb-4" style={{ color: colors.text }}>
                        {selectedVideo.title}
                      </h1>
                      
                      <p className="text-lg opacity-80 mb-6" style={{ color: colors.textSecondary }}>
                        {selectedVideo.description}
                      </p>
                      
                      <div className="flex items-center space-x-6 text-sm">
                        <div className="flex items-center space-x-2">
                          {getDifficultyIcon(selectedVideo.difficulty)}
                          <span 
                            className="font-semibold px-3 py-1 rounded-full"
                            style={{ 
                              background: `${getLevelColor(selectedVideo.difficulty)}20`,
                              color: getLevelColor(selectedVideo.difficulty)
                            }}
                          >
                            {selectedVideo.difficulty}
                          </span>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Eye className="w-4 h-4" />
                          <span>{formatViews(selectedVideo.views)} lượt xem</span>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Clock className="w-4 h-4" />
                          <span>{formatDuration(selectedVideo.duration)}</span>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Calendar className="w-4 h-4" />
                          <span>{formatDate(selectedVideo.created_at)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>

              {/* Video Player */}
              <motion.div
                className="mb-8"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <Card3D intensity={0.05}>
                  <GlassCard className="overflow-hidden">
                    <div className="aspect-w-16 aspect-h-9">
                      <iframe
                        className="w-full h-full"
                        src={`https://www.youtube.com/embed/${selectedVideo.youtube_id}?enablejsapi=1&controls=1&modestbranding=1&rel=0`}
                        title={selectedVideo.title}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                  </GlassCard>
                </Card3D>
              </motion.div>

              {/* Content Tabs */}
              <motion.div
                className="mb-8"
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                <GlassCard className="p-8">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Subtitles */}
                    <div>
                      <h3 className="text-2xl font-bold mb-6 flex items-center space-x-3" style={{ color: colors.text }}>
                        <MessageCircle className="w-8 h-8" style={{ color: colors.accent }} />
                        <span>Phụ đề song ngữ</span>
                      </h3>
                      
                      {selectedVideo.subtitles.length > 0 ? (
                        <div className="space-y-3 max-h-96 overflow-y-auto">
                          {selectedVideo.subtitles.map((subtitle, index) => (
                            <motion.div
                              key={index}
                              className="p-4 rounded-lg cursor-pointer transition-all duration-300 hover:scale-105"
                              style={{
                                background: 'rgba(255, 255, 255, 0.05)',
                                border: `1px solid ${colors.border}`
                              }}
                              whileHover={{ 
                                background: 'rgba(255, 255, 255, 0.1)',
                                boxShadow: `0 0 20px ${colors.primary}40`
                              }}
                            >
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-sm opacity-60">
                                  {Math.floor(subtitle.start_time)}s - {Math.floor(subtitle.end_time)}s
                                </span>
                                <NeonButton
                                  variant="primary"
                                  size="sm"
                                  onClick={() => {
                                    // Jump to video time
                                    const iframe = document.querySelector('iframe')
                                    if (iframe) {
                                      iframe.contentWindow?.postMessage({
                                        event: 'command',
                                        func: 'seekTo',
                                        args: [subtitle.start_time, true]
                                      }, '*')
                                    }
                                  }}
                                >
                                  <Play className="w-4 h-4" />
                                </NeonButton>
                              </div>
                              
                              <p className="font-semibold mb-2" style={{ color: colors.text }}>
                                {subtitle.english_text}
                              </p>
                              
                              <p className="opacity-80" style={{ color: colors.textSecondary }}>
                                {subtitle.vietnamese_text}
                              </p>
                            </motion.div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-12">
                          <MessageCircle className="w-16 h-16 mx-auto mb-4 opacity-50" />
                          <p className="opacity-60">Chưa có phụ đề cho video này</p>
                        </div>
                      )}
                    </div>

                    {/* Vocabulary */}
                    <div>
                      <h3 className="text-2xl font-bold mb-6 flex items-center space-x-3" style={{ color: colors.text }}>
                        <BookOpen className="w-8 h-8" style={{ color: colors.success }} />
                        <span>Từ vựng quan trọng</span>
                      </h3>
                      
                      {selectedVideo.vocabulary.length > 0 ? (
                        <div className="space-y-4">
                          {selectedVideo.vocabulary.map((vocab, index) => (
                            <motion.div
                              key={index}
                              className="p-4 rounded-lg"
                              style={{
                                background: 'rgba(255, 255, 255, 0.05)',
                                border: `1px solid ${colors.border}`
                              }}
                              whileHover={{ scale: 1.02 }}
                            >
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <h4 className="font-bold text-lg mb-2" style={{ color: colors.text }}>
                                    {vocab.word}
                                  </h4>
                                  {vocab.phonetic && (
                                    <p className="text-sm opacity-60 mb-2" style={{ color: colors.textSecondary }}>
                                      /{vocab.phonetic}/
                                    </p>
                                  )}
                                  <p className="opacity-80 mb-2" style={{ color: colors.textSecondary }}>
                                    {vocab.meaning}
                                  </p>
                                  {vocab.example && (
                                    <p className="text-sm italic opacity-70" style={{ color: colors.textSecondary }}>
                                      "{vocab.example}"
                                    </p>
                                  )}
                                </div>
                                
                                <div className="flex flex-col space-y-2">
                                  <NeonButton
                                    variant="primary"
                                    size="sm"
                                    className="flex items-center space-x-1"
                                  >
                                    <Volume2 className="w-4 h-4" />
                                    <span>Nghe</span>
                                  </NeonButton>
                                  
                                  <NeonButton
                                    variant="secondary"
                                    size="sm"
                                    className="flex items-center space-x-1"
                                  >
                                    <Bookmark className="w-4 h-4" />
                                    <span>Lưu</span>
                                  </NeonButton>
                                </div>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-12">
                          <BookOpen className="w-16 h-16 mx-auto mb-4 opacity-50" />
                          <p className="opacity-60">Chưa có từ vựng cho video này</p>
                        </div>
                      )}
                    </div>
                  </div>
                </GlassCard>
              </motion.div>

              {/* Exercises */}
              {selectedVideo.exercises.length > 0 && (
                <motion.div
                  className="mb-8"
                  initial={{ y: 50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.9 }}
                >
                  <GlassCard className="p-8">
                    <h3 className="text-2xl font-bold mb-6 flex items-center space-x-3" style={{ color: colors.text }}>
                      <Brain className="w-8 h-8" style={{ color: colors.warning }} />
                      <span>Bài tập thực hành</span>
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {selectedVideo.exercises.map((exercise, index) => (
                        <motion.div
                          key={index}
                          className="p-6 rounded-lg"
                          style={{
                            background: 'rgba(255, 255, 255, 0.05)',
                            border: `1px solid ${colors.border}`
                          }}
                          whileHover={{ scale: 1.02 }}
                        >
                          <div className="flex items-center justify-between mb-4">
                            <h4 className="font-bold text-lg" style={{ color: colors.text }}>
                              {exercise.type}
                            </h4>
                            <NeonButton variant="primary" size="sm">
                              Bắt đầu
                            </NeonButton>
                          </div>
                          
                          <p className="opacity-80 mb-4" style={{ color: colors.textSecondary }}>
                            {exercise.question}
                          </p>
                          
                          {exercise.options && (
                            <div className="space-y-2">
                              {exercise.options.map((option, optionIndex) => (
                                <div
                                  key={optionIndex}
                                  className="p-3 rounded-lg cursor-pointer transition-all duration-300 hover:scale-105"
                                  style={{
                                    background: 'rgba(255, 255, 255, 0.05)',
                                    border: `1px solid ${colors.border}`
                                  }}
                                >
                                  <span className="font-semibold mr-2" style={{ color: colors.primary }}>
                                    {String.fromCharCode(65 + optionIndex)}.
                                  </span>
                                  {option}
                                </div>
                              ))}
                            </div>
                          )}
                        </motion.div>
                      ))}
                    </div>
                  </GlassCard>
                </motion.div>
              )}
            </div>
          </ParticleBackground>
        </div>
      </PageTransition>
    )
  }

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
                <PlayCircle className="w-8 h-8 mr-3" style={{ color: colors.accent }} />
                <h1 className="text-5xl font-bold" style={{ color: colors.text }}>
                  <TypingText text="Video Learning" speed={150} />
                </h1>
                <PlayCircle className="w-8 h-8 ml-3" style={{ color: colors.accent }} />
              </div>
              <motion.p 
                className="text-xl opacity-80"
                style={{ color: colors.textSecondary }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.8 }}
                transition={{ delay: 1 }}
              >
                Học tiếng Anh qua video với phụ đề song ngữ và tính năng tương tác
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
                      placeholder="Tìm kiếm video..."
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

                  {/* Category Filter */}
                  <select
                    className="px-4 py-3 rounded-xl border-2 focus:ring-2 focus:ring-opacity-50 transition-all duration-300"
                    style={{
                      background: colors.surface,
                      borderColor: colors.border,
                      color: colors.text
                    }}
                    value={selectedCategory}
                    onChange={(e) => handleFilterChange('category', e.target.value)}
                  >
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
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
                    <option value="duration">Thời lượng</option>
                    <option value="difficulty">Độ khó</option>
                  </select>

                  {/* View Mode */}
                  <div className="flex space-x-2">
                    <NeonButton
                      variant={viewMode === 'grid' ? 'primary' : 'secondary'}
                      onClick={() => handleFilterChange('viewMode', 'grid')}
                    >
                      <Grid className="w-5 h-5" />
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

                        {/* Views Range */}
                        <div>
                          <label className="block text-sm font-medium mb-2" style={{ color: colors.text }}>
                            Lượt xem
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
                              value={minViews}
                              onChange={(e) => setMinViews(Number(e.target.value))}
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
                              value={maxViews}
                              onChange={(e) => setMaxViews(Number(e.target.value))}
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
                        <NeonButton variant="primary" onClick={fetchVideos}>
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
                  Tìm thấy <CountUp end={filteredVideos.length} /> video
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

            {/* Video Grid */}
            {paginatedVideos.length === 0 ? (
              <motion.div
                className="text-center py-20"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
              >
                <PlayCircle className="w-24 h-24 mx-auto mb-6 opacity-50" />
                <h3 className="text-2xl font-bold mb-4" style={{ color: colors.text }}>
                  Không tìm thấy video nào
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
                {paginatedVideos.map((video, index) => (
                  <motion.div
                    key={video.id}
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
                          onClick={() => handleVideoSelect(video)}
                        >
                          {viewMode === 'grid' ? (
                            <>
                              <div className="relative">
                                <img
                                  src={video.thumbnail_url}
                                  alt={video.title}
                                  className="w-full h-48 object-cover"
                                />
                                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                                  <PlayCircle className="w-16 h-16 text-white" />
                                </div>
                                <div className="absolute top-2 right-2 flex space-x-2">
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      toggleFavorite(video.id)
                                    }}
                                    className={`p-2 rounded-full transition-all duration-300 ${
                                      favorites.includes(video.id) 
                                        ? 'text-red-500 bg-red-500 bg-opacity-20' 
                                        : 'text-white bg-black bg-opacity-50'
                                    }`}
                                  >
                                    <Heart className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      toggleWatchLater(video.id)
                                    }}
                                    className={`p-2 rounded-full transition-all duration-300 ${
                                      watchLater.includes(video.id) 
                                        ? 'text-blue-500 bg-blue-500 bg-opacity-20' 
                                        : 'text-white bg-black bg-opacity-50'
                                    }`}
                                  >
                                    <Bookmark className="w-4 h-4" />
                                  </button>
                                </div>
                                <span className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
                                  {formatDuration(video.duration)}
                                </span>
                              </div>
                              
                              <div className="p-4">
                                <h3 className="text-lg font-semibold mb-2 line-clamp-2" style={{ color: colors.text }}>
                                  {video.title}
                                </h3>
                                <p className="text-sm opacity-80 mb-3 line-clamp-2" style={{ color: colors.textSecondary }}>
                                  {video.description}
                                </p>
                                
                                <div className="flex items-center justify-between text-sm">
                                  <div className="flex items-center space-x-2">
                                    {getDifficultyIcon(video.difficulty)}
                                    <span 
                                      className="px-2 py-1 rounded-full text-xs font-medium"
                                      style={{ 
                                        background: `${getLevelColor(video.difficulty)}20`,
                                        color: getLevelColor(video.difficulty)
                                      }}
                                    >
                                      {video.difficulty}
                                    </span>
                                  </div>
                                  
                                  <div className="flex items-center space-x-3 text-xs opacity-60">
                                    <div className="flex items-center space-x-1">
                                      <Eye className="w-3 h-3" />
                                      <span>{formatViews(video.views)}</span>
                                    </div>
                                    <div className="flex items-center space-x-1">
                                      <Clock className="w-3 h-3" />
                                      <span>{formatDate(video.created_at)}</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </>
                          ) : (
                            <div className="flex w-full">
                              <div className="relative w-48 h-32 flex-shrink-0">
                                <img
                                  src={video.thumbnail_url}
                                  alt={video.title}
                                  className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                                  <PlayCircle className="w-12 h-12 text-white" />
                                </div>
                                <span className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
                                  {formatDuration(video.duration)}
                                </span>
                              </div>
                              
                              <div className="flex-1 p-4">
                                <div className="flex items-start justify-between mb-2">
                                  <h3 className="text-xl font-semibold" style={{ color: colors.text }}>
                                    {video.title}
                                  </h3>
                                  <div className="flex space-x-2">
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation()
                                        toggleFavorite(video.id)
                                      }}
                                      className={`p-2 rounded-full transition-all duration-300 ${
                                        favorites.includes(video.id) 
                                          ? 'text-red-500 bg-red-500 bg-opacity-20' 
                                          : 'text-gray-500 hover:text-red-500'
                                      }`}
                                    >
                                      <Heart className="w-4 h-4" />
                                    </button>
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation()
                                        toggleWatchLater(video.id)
                                      }}
                                      className={`p-2 rounded-full transition-all duration-300 ${
                                        watchLater.includes(video.id) 
                                          ? 'text-blue-500 bg-blue-500 bg-opacity-20' 
                                          : 'text-gray-500 hover:text-blue-500'
                                      }`}
                                    >
                                      <Bookmark className="w-4 h-4" />
                                    </button>
                                  </div>
                                </div>
                                
                                <p className="opacity-80 mb-4" style={{ color: colors.textSecondary }}>
                                  {video.description}
                                </p>
                                
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center space-x-4">
                                    <div className="flex items-center space-x-2">
                                      {getDifficultyIcon(video.difficulty)}
                                      <span 
                                        className="px-3 py-1 rounded-full text-sm font-medium"
                                        style={{ 
                                          background: `${getLevelColor(video.difficulty)}20`,
                                          color: getLevelColor(video.difficulty)
                                        }}
                                      >
                                        {video.difficulty}
                                      </span>
                                    </div>
                                    
                                    <div className="flex items-center space-x-1 text-sm opacity-60">
                                      <Eye className="w-4 h-4" />
                                      <span>{formatViews(video.views)} lượt xem</span>
                                    </div>
                                    
                                    <div className="flex items-center space-x-1 text-sm opacity-60">
                                      <Clock className="w-4 h-4" />
                                      <span>{formatDate(video.created_at)}</span>
                                    </div>
                                  </div>
                                  
                                  <NeonButton variant="primary" size="sm">
                                    Xem ngay
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

export default VideoLearningPage