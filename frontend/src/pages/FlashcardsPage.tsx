import React, { useState, useEffect, useRef } from 'react'
import {
  PlayCircle, Volume2, VolumeX, RotateCcw, Repeat, FastForward, Rewind,
  BookOpen, Mic, MessageSquare, Settings, User, Plus, Edit, Trash2, Save, X, Check,
  Sun, Moon, Zap, Palette, Layers, LayoutDashboard, GraduationCap, Lightbulb,
  MessageSquareText, Book, FileText, Users, BarChart, TrendingUp, Bell, Gift,
  Sparkles, Loader2, Target, Clock, Award, Trophy, Crown, Gem, Star, Heart,
  ChevronLeft, ChevronRight, Filter, Sliders, Eye, Calendar, ArrowLeft, ArrowRight,
  RefreshCw, CheckCircle, XCircle, AlertCircle, Info, HelpCircle, Search,
  Grid, List, Maximize, Minimize, Pause, Play, SkipForward, SkipBack
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTheme } from '../contexts/ThemeContext'
import { Card3D, GlassCard, NeonButton, ParticleBackground } from '../components/Animations'
import { toast } from 'react-hot-toast'

// Define interfaces
interface Flashcard {
  FlashcardID: number
  WordID: number
  UserID: number
  Word: string
  Phonetic: string
  Type: string
  Meaning: string
  Example: string
  Audio: string
  AudioURL: string
  Image: string
  TopicTitle: string
  ExamType: 'TOEIC' | 'IELTS' | 'TOEFL' | 'General'
  Difficulty: 'Easy' | 'Medium' | 'Hard'
  CorrectCount: number
  WrongCount: number
  ReviewDate: string
  NextReview: string
  ReviewInterval: number
  EaseFactor: number
  Repetitions: number
  LastReviewScore: number
  WritingAttempts: number
  WritingSuccess: number
  AudioPlayed: number
  StudyStreak: number
}

interface StudySession {
  SessionID: number
  UserID: number
  SessionType: 'Flashcard' | 'Writing' | 'Listening' | 'Mixed'
  StartTime: string
  EndTime?: string
  CardsStudied: number
  CardsCorrect: number
  WritingAttempts: number
  WritingCorrect: number
  AudioPlayed: number
  TotalTime: number
  Score: number
}

interface StudyGoal {
  GoalID: number
  UserID: number
  GoalType: 'Daily' | 'Weekly' | 'Monthly'
  TargetCards: number
  TargetWriting: number
  TargetTime: number
  ExamType: 'TOEIC' | 'IELTS' | 'TOEFL' | 'General'
  Level: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2'
  IsActive: boolean
  StartDate: string
  EndDate?: string
  Progress: number
}

const FlashcardsPage: React.FC = () => {
  const { theme, toggleTheme } = useTheme()
  const [flashcards, setFlashcards] = useState<Flashcard[]>([])
  const [currentCardIndex, setCurrentCardIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [studyMode, setStudyMode] = useState<'flashcard' | 'writing' | 'listening' | 'mixed'>('mixed')
  const [examType, setExamType] = useState<'TOEIC' | 'IELTS' | 'TOEFL' | 'General'>('General')
  const [level, setLevel] = useState<'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2'>('A1')
  const [difficulty, setDifficulty] = useState<'Easy' | 'Medium' | 'Hard' | 'All'>('All')
  const [writingInput, setWritingInput] = useState('')
  const [showAnswer, setShowAnswer] = useState(false)
  const [studySession, setStudySession] = useState<StudySession | null>(null)
  const [studyGoals, setStudyGoals] = useState<StudyGoal[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [autoPlay, setAutoPlay] = useState(false)
  const [playbackSpeed, setPlaybackSpeed] = useState(1)
  const [showSettings, setShowSettings] = useState(false)
  const [studyStats, setStudyStats] = useState({
    cardsStudied: 0,
    cardsCorrect: 0,
    writingAttempts: 0,
    writingCorrect: 0,
    audioPlayed: 0,
    studyTime: 0,
    streakDays: 0
  })

  const audioRef = useRef<HTMLAudioElement>(null)
  const sessionStartTime = useRef<Date>(new Date())

  // Fetch flashcards from API
  useEffect(() => {
    fetchFlashcards()
    fetchStudyGoals()
    fetchStudyStats()
  }, [examType, level, difficulty])

  const fetchFlashcards = async () => {
    setLoading(true)
    setError(null)
    try {
      const params = new URLSearchParams()
      if (examType !== 'General') params.append('examType', examType)
      if (level !== 'A1') params.append('level', level)
      if (difficulty !== 'All') params.append('difficulty', difficulty)

      const response = await fetch(`http://localhost:8000/api/flashcards?${params.toString()}`)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const result = await response.json()
      if (result.success) {
        setFlashcards(result.data)
        if (result.data.length > 0) {
          startStudySession()
        }
      } else {
        setError(result.message || 'Failed to fetch flashcards')
      }
    } catch (e: any) {
      setError(e.message)
      toast.error(`Failed to fetch flashcards: ${e.message}`)
    } finally {
      setLoading(false)
    }
  }

  const fetchStudyGoals = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/study-goals')
      if (response.ok) {
        const result = await response.json()
        if (result.success) {
          setStudyGoals(result.data)
        }
      }
    } catch (e) {
      console.error('Failed to fetch study goals:', e)
    }
  }

  const fetchStudyStats = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/study-statistics')
      if (response.ok) {
        const result = await response.json()
        if (result.success) {
          setStudyStats(result.data)
        }
      }
    } catch (e) {
      console.error('Failed to fetch study stats:', e)
    }
  }

  const startStudySession = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/study-sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          SessionType: studyMode,
          ExamType: examType,
          Level: level
        })
      })
      if (response.ok) {
        const result = await response.json()
        if (result.success) {
          setStudySession(result.data)
          sessionStartTime.current = new Date()
        }
      }
    } catch (e) {
      console.error('Failed to start study session:', e)
    }
  }

  const endStudySession = async () => {
    if (!studySession) return

    const endTime = new Date()
    const totalTime = Math.floor((endTime.getTime() - sessionStartTime.current.getTime()) / 1000)

    try {
      const response = await fetch(`http://localhost:8000/api/study-sessions/${studySession.SessionID}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          EndTime: endTime.toISOString(),
          CardsStudied: studyStats.cardsStudied,
          CardsCorrect: studyStats.cardsCorrect,
          WritingAttempts: studyStats.writingAttempts,
          WritingCorrect: studyStats.writingCorrect,
          AudioPlayed: studyStats.audioPlayed,
          TotalTime: totalTime,
          Score: studyStats.cardsStudied > 0 ? (studyStats.cardsCorrect / studyStats.cardsStudied) * 100 : 0
        })
      })
      if (response.ok) {
        toast.success('Study session completed!')
      }
    } catch (e) {
      console.error('Failed to end study session:', e)
    }
  }

  const playAudio = async (audioUrl: string) => {
    if (!audioUrl) {
      toast.error('No audio available for this word')
      return
    }

    try {
      if (audioRef.current) {
        audioRef.current.src = audioUrl
        audioRef.current.playbackRate = playbackSpeed
        await audioRef.current.play()
        setIsPlaying(true)
        
        // Update audio played count
        setStudyStats(prev => ({ ...prev, audioPlayed: prev.audioPlayed + 1 }))
        
        audioRef.current.onended = () => setIsPlaying(false)
      }
    } catch (e) {
      toast.error('Failed to play audio')
    }
  }

  const flipCard = () => {
    setIsFlipped(!isFlipped)
    if (!isFlipped) {
      setStudyStats(prev => ({ ...prev, cardsStudied: prev.cardsStudied + 1 }))
    }
  }

  const nextCard = () => {
    if (currentCardIndex < flashcards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1)
      setIsFlipped(false)
      setShowAnswer(false)
      setWritingInput('')
    }
  }

  const prevCard = () => {
    if (currentCardIndex > 0) {
      setCurrentCardIndex(currentCardIndex - 1)
      setIsFlipped(false)
      setShowAnswer(false)
      setWritingInput('')
    }
  }

  const reviewCard = async (quality: number) => {
    const currentCard = flashcards[currentCardIndex]
    if (!currentCard) return

    try {
      const response = await fetch(`http://localhost:8000/api/flashcards/${currentCard.FlashcardID}/review`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          quality: quality,
          studyMode: studyMode,
          writingAttempt: studyMode === 'writing' ? writingInput : undefined
        })
      })

      if (response.ok) {
        const result = await response.json()
        if (result.success) {
          // Update local state
          setFlashcards(prev => prev.map(card => 
            card.FlashcardID === currentCard.FlashcardID 
              ? { ...card, ...result.data }
              : card
          ))

          if (quality >= 3) {
            setStudyStats(prev => ({ ...prev, cardsCorrect: prev.cardsCorrect + 1 }))
            toast.success('Great job!')
          } else {
            toast.info('Keep practicing!')
          }

          // Auto advance to next card
          setTimeout(() => {
            if (currentCardIndex < flashcards.length - 1) {
              nextCard()
            } else {
              toast.success('All cards reviewed!')
            }
          }, 1000)
        }
      }
    } catch (e) {
      toast.error('Failed to review card')
    }
  }

  const checkWriting = () => {
    const currentCard = flashcards[currentCardIndex]
    if (!currentCard) return

    const userInput = writingInput.toLowerCase().trim()
    const correctWord = currentCard.Word.toLowerCase().trim()
    
    setStudyStats(prev => ({ 
      ...prev, 
      writingAttempts: prev.writingAttempts + 1,
      writingCorrect: userInput === correctWord ? prev.writingCorrect + 1 : prev.writingCorrect
    }))

    if (userInput === correctWord) {
      toast.success('Correct!')
      setShowAnswer(true)
    } else {
      toast.error('Try again!')
      setShowAnswer(true)
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'text-green-400'
      case 'Medium': return 'text-yellow-400'
      case 'Hard': return 'text-red-400'
      default: return 'text-gray-400'
    }
  }

  const getExamTypeColor = (examType: string) => {
    switch (examType) {
      case 'TOEIC': return 'bg-blue-500'
      case 'IELTS': return 'bg-purple-500'
      case 'TOEFL': return 'bg-green-500'
      default: return 'bg-gray-500'
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center"
        >
          <Loader2 className="w-16 h-16 animate-spin text-blue-400" />
          <p className="mt-4 text-xl font-semibold">Loading Flashcards...</p>
        </motion.div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-red-900 to-black text-red-300 text-lg">
        <XCircle className="w-8 h-8 mr-2" />
        Error: {error}
        <NeonButton onClick={fetchFlashcards} className="ml-4">Retry</NeonButton>
      </div>
    )
  }

  if (flashcards.length === 0) {
    return (
      <div className="min-h-screen p-4 bg-gradient-to-br from-gray-900 to-black text-white">
        <ParticleBackground />
        <div className="max-w-4xl mx-auto">
          <GlassCard className="p-8 text-center">
            <BookOpen className="w-16 h-16 mx-auto mb-4 text-blue-400" />
            <h2 className="text-2xl font-bold mb-4">No Flashcards Available</h2>
            <p className="text-gray-300 mb-6">No flashcards match your current filters.</p>
            <NeonButton onClick={fetchFlashcards}>Refresh</NeonButton>
          </GlassCard>
        </div>
      </div>
    )
  }

  const currentCard = flashcards[currentCardIndex]

  return (
    <div className={`min-h-screen p-4 ${theme === 'dark' ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-900'} transition-colors duration-500`}>
      <ParticleBackground />
      
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-6xl mx-auto mb-8"
      >
        <GlassCard className="p-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">
                Smart Flashcards
              </h1>
              <p className="text-gray-300 mt-2">
                {currentCardIndex + 1} of {flashcards.length} cards
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              {/* Study Stats */}
              <div className="flex items-center gap-2 text-sm">
                <Target className="w-4 h-4 text-green-400" />
                <span>{studyStats.cardsCorrect}/{studyStats.cardsStudied}</span>
                <Clock className="w-4 h-4 text-blue-400 ml-2" />
                <span>{Math.floor(studyStats.studyTime / 60)}m</span>
              </div>
              
              {/* Settings */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setShowSettings(!showSettings)}
                className="p-2 rounded-full bg-gray-700 bg-opacity-50 hover:bg-opacity-100 transition-all"
              >
                <Settings className="w-5 h-5" />
              </motion.button>
            </div>
          </div>
        </GlassCard>
      </motion.div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Filters Sidebar */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-1"
        >
          <GlassCard className="p-6">
            <h3 className="text-lg font-semibold mb-4">Study Filters</h3>
            
            {/* Study Mode */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Study Mode</label>
              <select
                value={studyMode}
                onChange={(e) => setStudyMode(e.target.value as any)}
                className="w-full p-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:border-blue-500"
              >
                <option value="mixed">Mixed</option>
                <option value="flashcard">Flashcard Only</option>
                <option value="writing">Writing Practice</option>
                <option value="listening">Listening Only</option>
              </select>
            </div>

            {/* Exam Type */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Exam Type</label>
              <select
                value={examType}
                onChange={(e) => setExamType(e.target.value as any)}
                className="w-full p-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:border-blue-500"
              >
                <option value="General">General</option>
                <option value="TOEIC">TOEIC</option>
                <option value="IELTS">IELTS</option>
                <option value="TOEFL">TOEFL</option>
              </select>
            </div>

            {/* Level */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Level</label>
              <select
                value={level}
                onChange={(e) => setLevel(e.target.value as any)}
                className="w-full p-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:border-blue-500"
              >
                <option value="A1">A1</option>
                <option value="A2">A2</option>
                <option value="B1">B1</option>
                <option value="B2">B2</option>
                <option value="C1">C1</option>
                <option value="C2">C2</option>
              </select>
            </div>

            {/* Difficulty */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Difficulty</label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as any)}
                className="w-full p-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:border-blue-500"
              >
                <option value="All">All</option>
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>

            <NeonButton onClick={fetchFlashcards} className="w-full">
              Apply Filters
            </NeonButton>
          </GlassCard>
        </motion.div>

        {/* Main Flashcard Area */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="lg:col-span-3"
        >
          <GlassCard className="p-8">
            {/* Card Info */}
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getExamTypeColor(currentCard.ExamType)} text-white`}>
                  {currentCard.ExamType}
                </span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium bg-gray-600 text-white`}>
                  {currentCard.TopicTitle}
                </span>
                <span className={`text-sm ${getDifficultyColor(currentCard.Difficulty)}`}>
                  {currentCard.Difficulty}
                </span>
              </div>
              
              <div className="flex items-center gap-2">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => playAudio(currentCard.AudioURL || currentCard.Audio)}
                  className="p-2 rounded-full bg-blue-600 hover:bg-blue-700 transition-colors"
                >
                  {isPlaying ? <Pause className="w-5 h-5" /> : <PlayCircle className="w-5 h-5" />}
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={flipCard}
                  className="p-2 rounded-full bg-purple-600 hover:bg-purple-700 transition-colors"
                >
                  <RotateCcw className="w-5 h-5" />
                </motion.button>
              </div>
            </div>

            {/* Flashcard */}
            <motion.div
              className="relative h-96 mb-8"
              animate={{ rotateY: isFlipped ? 180 : 0 }}
              transition={{ duration: 0.6 }}
              style={{ transformStyle: 'preserve-3d' }}
            >
              {/* Front of card */}
              <motion.div
                className="absolute inset-0 w-full h-full bg-gradient-to-br from-blue-600 to-purple-700 rounded-xl shadow-2xl flex flex-col justify-center items-center text-white p-8"
                style={{ backfaceVisibility: 'hidden' }}
              >
                <h2 className="text-4xl font-bold mb-4">{currentCard.Word}</h2>
                <p className="text-xl text-blue-200 mb-2">{currentCard.Phonetic}</p>
                <p className="text-lg text-blue-100">{currentCard.Type}</p>
                <p className="text-sm text-blue-200 mt-4 text-center">
                  Click the flip button to see the meaning
                </p>
              </motion.div>

              {/* Back of card */}
              <motion.div
                className="absolute inset-0 w-full h-full bg-gradient-to-br from-purple-600 to-pink-700 rounded-xl shadow-2xl flex flex-col justify-center items-center text-white p-8"
                style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
              >
                <h3 className="text-2xl font-bold mb-4 text-center">{currentCard.Meaning}</h3>
                <p className="text-lg text-purple-200 mb-4 text-center italic">
                  "{currentCard.Example}"
                </p>
                <div className="text-sm text-purple-200 text-center">
                  <p>Topic: {currentCard.TopicTitle}</p>
                  <p>Difficulty: {currentCard.Difficulty}</p>
                </div>
              </motion.div>
            </motion.div>

            {/* Writing Practice */}
            {studyMode === 'writing' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6"
              >
                <h4 className="text-lg font-semibold mb-4">Write the word:</h4>
                <div className="flex gap-4">
                  <input
                    type="text"
                    value={writingInput}
                    onChange={(e) => setWritingInput(e.target.value)}
                    placeholder="Type the word here..."
                    className="flex-1 p-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:border-blue-500"
                    onKeyPress={(e) => e.key === 'Enter' && checkWriting()}
                  />
                  <NeonButton onClick={checkWriting}>
                    Check
                  </NeonButton>
                </div>
                {showAnswer && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-4 p-4 rounded-lg bg-gray-800"
                  >
                    <p className="text-sm text-gray-300">
                      Correct answer: <span className="font-bold text-green-400">{currentCard.Word}</span>
                    </p>
                  </motion.div>
                )}
              </motion.div>
            )}

            {/* Review Buttons */}
            <div className="flex justify-center gap-4 mb-6">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => reviewCard(1)}
                className="px-6 py-3 rounded-lg bg-red-600 hover:bg-red-700 text-white font-medium"
              >
                Again (1)
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => reviewCard(2)}
                className="px-6 py-3 rounded-lg bg-orange-600 hover:bg-orange-700 text-white font-medium"
              >
                Hard (2)
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => reviewCard(3)}
                className="px-6 py-3 rounded-lg bg-yellow-600 hover:bg-yellow-700 text-white font-medium"
              >
                Good (3)
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => reviewCard(4)}
                className="px-6 py-3 rounded-lg bg-green-600 hover:bg-green-700 text-white font-medium"
              >
                Easy (4)
              </motion.button>
            </div>

            {/* Navigation */}
            <div className="flex justify-between items-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={prevCard}
                disabled={currentCardIndex === 0}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-600 hover:bg-gray-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </motion.button>

              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-400">
                  {currentCardIndex + 1} / {flashcards.length}
                </span>
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={nextCard}
                disabled={currentCardIndex === flashcards.length - 1}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-600 hover:bg-gray-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </motion.button>
            </div>
          </GlassCard>
        </motion.div>
      </div>

      {/* Audio Element */}
      <audio ref={audioRef} />
    </div>
  )
}

export default FlashcardsPage