import React, { useState, useEffect, useRef } from 'react'

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

interface StudySession {
  SessionID: number
  UserID: number
  LanguageID: number
  TopicID: number
  MethodID: number
  StartTime: string
  EndTime?: string
  WordsStudied: number
  CorrectAnswers: number
  TotalAnswers: number
  Score: number
}

interface StudyStats {
  correct: number
  studied: number
  time: number
  streak: number
  accuracy: number
}

// Flashcards Component
export const FlashcardsStudy: React.FC<{
  vocabulary: Vocabulary[]
  onComplete: (stats: StudyStats) => void
  onNext: () => void
  onPrev: () => void
  currentIndex: number
}> = ({ vocabulary, onComplete, onNext, onPrev, currentIndex }) => {
  const [isFlipped, setIsFlipped] = useState(false)
  const [studyStats, setStudyStats] = useState<StudyStats>({
    correct: 0,
    studied: 0,
    time: 0,
    streak: 0,
    accuracy: 0
  })
  const [startTime] = useState(Date.now())
  const [isPlaying, setIsPlaying] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const currentWord = vocabulary[currentIndex]

  useEffect(() => {
    setIsFlipped(false)
  }, [currentIndex])

  useEffect(() => {
    const timer = setInterval(() => {
      setStudyStats(prev => ({
        ...prev,
        time: Math.floor((Date.now() - startTime) / 1000)
      }))
    }, 1000)

    return () => clearInterval(timer)
  }, [startTime])

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

  const flipCard = () => {
    setIsFlipped(!isFlipped)
    if (!isFlipped) {
      setStudyStats(prev => ({
        ...prev,
        studied: prev.studied + 1,
        accuracy: prev.studied > 0 ? (prev.correct / prev.studied) * 100 : 0
      }))
    }
  }

  const markCorrect = () => {
    setStudyStats(prev => ({
      ...prev,
      correct: prev.correct + 1,
      streak: prev.streak + 1,
      accuracy: ((prev.correct + 1) / (prev.studied + 1)) * 100
    }))
    setTimeout(() => {
      if (currentIndex === vocabulary.length - 1) {
        onComplete(studyStats)
      } else {
        onNext()
      }
    }, 1000)
  }

  const markIncorrect = () => {
    setStudyStats(prev => ({
      ...prev,
      streak: 0,
      accuracy: (prev.correct / (prev.studied + 1)) * 100
    }))
    setTimeout(() => {
      if (currentIndex === vocabulary.length - 1) {
        onComplete(studyStats)
      } else {
        onNext()
      }
    }, 1000)
  }

  if (!currentWord) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-800 text-white p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">🃏 Flashcards Study</h1>
          <div className="flex justify-center items-center space-x-4 mb-4">
            <div className="bg-white/20 rounded-full px-4 py-2">
              <span className="text-sm">Từ {currentIndex + 1} / {vocabulary.length}</span>
            </div>
            <div className="bg-white/20 rounded-full px-4 py-2">
              <span className="text-sm">Đúng: {studyStats.correct}</span>
            </div>
            <div className="bg-white/20 rounded-full px-4 py-2">
              <span className="text-sm">Streak: {studyStats.streak}</span>
            </div>
            <div className="bg-white/20 rounded-full px-4 py-2">
              <span className="text-sm">{Math.round(studyStats.accuracy)}%</span>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-white/20 rounded-full h-3 mb-8">
          <div 
            className="bg-gradient-to-r from-green-400 to-blue-500 h-3 rounded-full transition-all duration-500"
            style={{ width: `${((currentIndex + 1) / vocabulary.length) * 100}%` }}
          />
        </div>

        {/* Flashcard */}
        <div className="flex justify-center mb-8">
          <div className="perspective-1000">
            <div className={`relative w-96 h-64 transition-transform duration-700 transform-style-preserve-3d ${isFlipped ? 'rotate-y-180' : ''}`}>
              {/* Front */}
              <div className="absolute inset-0 w-full h-full backface-hidden">
                <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-8 h-full flex flex-col justify-center items-center text-center">
                  <button
                    onClick={() => playAudio(currentWord.Audio || '')}
                    className="mb-4 p-3 bg-white/20 rounded-full hover:bg-white/30 transition-all duration-300"
                  >
                    {isPlaying ? '⏸️' : '🔊'}
                  </button>
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
                      onClick={markCorrect}
                      className="px-6 py-3 bg-green-500 rounded-full font-bold hover:bg-green-600 transition-all duration-300 transform hover:scale-105"
                    >
                      ✅ Đúng
                    </button>
                    <button
                      onClick={markIncorrect}
                      className="px-6 py-3 bg-red-500 rounded-full font-bold hover:bg-red-600 transition-all duration-300 transform hover:scale-105"
                    >
                      ❌ Sai
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex justify-center space-x-4">
          <button
            onClick={flipCard}
            className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full font-bold text-lg hover:from-blue-600 hover:to-purple-600 transform hover:scale-105 transition-all duration-300 shadow-lg"
          >
            {isFlipped ? '🔄 Xem từ' : '👁️ Xem nghĩa'}
          </button>
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center mt-8">
          <button
            onClick={onPrev}
            disabled={currentIndex === 0}
            className="px-6 py-3 bg-white/20 rounded-full font-bold hover:bg-white/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ← Trước
          </button>
          
          <div className="text-center">
            <p className="text-sm opacity-70">Thời gian: {Math.floor(studyStats.time / 60)}:{(studyStats.time % 60).toString().padStart(2, '0')}</p>
          </div>
          
          <button
            onClick={onNext}
            disabled={currentIndex === vocabulary.length - 1}
            className="px-6 py-3 bg-white/20 rounded-full font-bold hover:bg-white/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Sau →
          </button>
        </div>
      </div>
      <audio ref={audioRef} />
    </div>
  )
}

// Writing Practice Component
export const WritingPractice: React.FC<{
  vocabulary: Vocabulary[]
  onComplete: (stats: StudyStats) => void
  onNext: () => void
  onPrev: () => void
  currentIndex: number
}> = ({ vocabulary, onComplete, onNext, onPrev, currentIndex }) => {
  const [writingInput, setWritingInput] = useState('')
  const [showAnswer, setShowAnswer] = useState(false)
  const [studyStats, setStudyStats] = useState<StudyStats>({
    correct: 0,
    studied: 0,
    time: 0,
    streak: 0,
    accuracy: 0
  })
  const [startTime] = useState(Date.now())
  const [isPlaying, setIsPlaying] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const currentWord = vocabulary[currentIndex]

  useEffect(() => {
    setWritingInput('')
    setShowAnswer(false)
  }, [currentIndex])

  useEffect(() => {
    const timer = setInterval(() => {
      setStudyStats(prev => ({
        ...prev,
        time: Math.floor((Date.now() - startTime) / 1000)
      }))
    }, 1000)

    return () => clearInterval(timer)
  }, [startTime])

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

  const checkWriting = () => {
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

  const handleNext = () => {
    if (currentIndex === vocabulary.length - 1) {
      onComplete(studyStats)
    } else {
      onNext()
    }
  }

  if (!currentWord) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-600 via-orange-600 to-red-600 text-white p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">✍️ Writing Practice</h1>
          <div className="flex justify-center items-center space-x-4 mb-4">
            <div className="bg-white/20 rounded-full px-4 py-2">
              <span className="text-sm">Từ {currentIndex + 1} / {vocabulary.length}</span>
            </div>
            <div className="bg-white/20 rounded-full px-4 py-2">
              <span className="text-sm">Đúng: {studyStats.correct}</span>
            </div>
            <div className="bg-white/20 rounded-full px-4 py-2">
              <span className="text-sm">Streak: {studyStats.streak}</span>
            </div>
            <div className="bg-white/20 rounded-full px-4 py-2">
              <span className="text-sm">{Math.round(studyStats.accuracy)}%</span>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-white/20 rounded-full h-3 mb-8">
          <div 
            className="bg-gradient-to-r from-green-400 to-blue-500 h-3 rounded-full transition-all duration-500"
            style={{ width: `${((currentIndex + 1) / vocabulary.length) * 100}%` }}
          />
        </div>

        {/* Word Card */}
        <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-8 mb-8">
          <div className="text-center">
            {/* Audio Button */}
            <button
              onClick={() => playAudio(currentWord.Audio || '')}
              className="mb-6 p-4 bg-white/20 rounded-full hover:bg-white/30 transition-all duration-300"
            >
              {isPlaying ? '⏸️' : '🔊'}
            </button>

            {/* Word Info */}
            <h2 className="text-3xl font-bold mb-2 text-yellow-300">{currentWord.Meaning}</h2>
            <p className="text-lg opacity-80 mb-4">"{currentWord.Example}"</p>
            <p className="text-sm opacity-60 mb-6">/{currentWord.Phonetic}/ • {currentWord.Type}</p>

            {/* Writing Input */}
            <div className="max-w-md mx-auto">
              <input
                type="text"
                value={writingInput}
                onChange={(e) => setWritingInput(e.target.value)}
                placeholder="Nhập từ vựng..."
                className="w-full p-4 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 text-center text-xl font-bold"
                onKeyPress={(e) => e.key === 'Enter' && !showAnswer && checkWriting()}
                disabled={showAnswer}
              />
              
              {!showAnswer && (
                <button
                  onClick={checkWriting}
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
                    onClick={handleNext}
                    className="w-full px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg font-bold hover:from-blue-600 hover:to-purple-600 transition-all duration-300"
                  >
                    {currentIndex === vocabulary.length - 1 ? 'Hoàn thành' : 'Tiếp theo'}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <button
            onClick={onPrev}
            disabled={currentIndex === 0}
            className="px-6 py-3 bg-white/20 rounded-full font-bold hover:bg-white/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ← Trước
          </button>
          
          <div className="text-center">
            <p className="text-sm opacity-70">Thời gian: {Math.floor(studyStats.time / 60)}:{(studyStats.time % 60).toString().padStart(2, '0')}</p>
          </div>
          
          <button
            onClick={onNext}
            disabled={currentIndex === vocabulary.length - 1}
            className="px-6 py-3 bg-white/20 rounded-full font-bold hover:bg-white/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Sau →
          </button>
        </div>
      </div>
      <audio ref={audioRef} />
    </div>
  )
}

// Spaced Repetition Component
export const SpacedRepetition: React.FC<{
  vocabulary: Vocabulary[]
  onComplete: (stats: StudyStats) => void
  onNext: () => void
  onPrev: () => void
  currentIndex: number
}> = ({ vocabulary, onComplete, onNext, onPrev, currentIndex }) => {
  const [isFlipped, setIsFlipped] = useState(false)
  const [studyStats, setStudyStats] = useState<StudyStats>({
    correct: 0,
    studied: 0,
    time: 0,
    streak: 0,
    accuracy: 0
  })
  const [startTime] = useState(Date.now())
  const [isPlaying, setIsPlaying] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const currentWord = vocabulary[currentIndex]

  useEffect(() => {
    setIsFlipped(false)
  }, [currentIndex])

  useEffect(() => {
    const timer = setInterval(() => {
      setStudyStats(prev => ({
        ...prev,
        time: Math.floor((Date.now() - startTime) / 1000)
      }))
    }, 1000)

    return () => clearInterval(timer)
  }, [startTime])

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

  const flipCard = () => {
    setIsFlipped(!isFlipped)
    if (!isFlipped) {
      setStudyStats(prev => ({
        ...prev,
        studied: prev.studied + 1,
        accuracy: prev.studied > 0 ? (prev.correct / prev.studied) * 100 : 0
      }))
    }
  }

  const reviewWord = (quality: number) => {
    const isCorrect = quality >= 3
    
    setStudyStats(prev => ({
      ...prev,
      correct: prev.correct + (isCorrect ? 1 : 0),
      streak: isCorrect ? prev.streak + 1 : 0,
      accuracy: ((prev.correct + (isCorrect ? 1 : 0)) / (prev.studied + 1)) * 100
    }))
    
    setTimeout(() => {
      if (currentIndex === vocabulary.length - 1) {
        onComplete(studyStats)
      } else {
        onNext()
      }
    }, 1000)
  }

  if (!currentWord) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-600 via-teal-600 to-blue-600 text-white p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">🔄 Spaced Repetition</h1>
          <div className="flex justify-center items-center space-x-4 mb-4">
            <div className="bg-white/20 rounded-full px-4 py-2">
              <span className="text-sm">Từ {currentIndex + 1} / {vocabulary.length}</span>
            </div>
            <div className="bg-white/20 rounded-full px-4 py-2">
              <span className="text-sm">Đúng: {studyStats.correct}</span>
            </div>
            <div className="bg-white/20 rounded-full px-4 py-2">
              <span className="text-sm">Streak: {studyStats.streak}</span>
            </div>
            <div className="bg-white/20 rounded-full px-4 py-2">
              <span className="text-sm">{Math.round(studyStats.accuracy)}%</span>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-white/20 rounded-full h-3 mb-8">
          <div 
            className="bg-gradient-to-r from-green-400 to-blue-500 h-3 rounded-full transition-all duration-500"
            style={{ width: `${((currentIndex + 1) / vocabulary.length) * 100}%` }}
          />
        </div>

        {/* Word Card */}
        <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-8 mb-8">
          <div className="text-center">
            {/* Audio Button */}
            <button
              onClick={() => playAudio(currentWord.Audio || '')}
              className="mb-6 p-4 bg-white/20 rounded-full hover:bg-white/30 transition-all duration-300"
            >
              {isPlaying ? '⏸️' : '🔊'}
            </button>

            {/* Word Display */}
            <div className="mb-6">
              <h2 className="text-3xl font-bold mb-2">{currentWord.Word}</h2>
              <p className="text-lg opacity-80 mb-2">/{currentWord.Phonetic}/</p>
              <p className="text-sm opacity-60">{currentWord.Type}</p>
            </div>

            {/* Flip Button */}
            <button
              onClick={flipCard}
              className="w-full h-32 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center text-white font-bold text-xl hover:from-blue-600 hover:to-purple-600 transition-all duration-300 transform hover:scale-105 mb-6"
            >
              {isFlipped ? '🔄 Ẩn nghĩa' : '👁️ Xem nghĩa'}
            </button>

            {/* Answer Display */}
            {isFlipped && (
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold mb-2 text-yellow-300">{currentWord.Meaning}</h3>
                <p className="text-lg opacity-80">"{currentWord.Example}"</p>
              </div>
            )}

            {/* Review Buttons */}
            {isFlipped && (
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => reviewWord(1)}
                  className="px-6 py-3 bg-red-500 rounded-lg font-bold hover:bg-red-600 transition-all duration-300 transform hover:scale-105"
                >
                  😞 Khó
                </button>
                <button
                  onClick={() => reviewWord(2)}
                  className="px-6 py-3 bg-yellow-500 rounded-lg font-bold hover:bg-yellow-600 transition-all duration-300 transform hover:scale-105"
                >
                  😐 Trung bình
                </button>
                <button
                  onClick={() => reviewWord(3)}
                  className="px-6 py-3 bg-green-500 rounded-lg font-bold hover:bg-green-600 transition-all duration-300 transform hover:scale-105"
                >
                  😊 Dễ
                </button>
                <button
                  onClick={() => reviewWord(4)}
                  className="px-6 py-3 bg-blue-500 rounded-lg font-bold hover:bg-blue-600 transition-all duration-300 transform hover:scale-105"
                >
                  🎉 Rất dễ
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <button
            onClick={onPrev}
            disabled={currentIndex === 0}
            className="px-6 py-3 bg-white/20 rounded-full font-bold hover:bg-white/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ← Trước
          </button>
          
          <div className="text-center">
            <p className="text-sm opacity-70">Thời gian: {Math.floor(studyStats.time / 60)}:{(studyStats.time % 60).toString().padStart(2, '0')}</p>
          </div>
          
          <button
            onClick={onNext}
            disabled={currentIndex === vocabulary.length - 1}
            className="px-6 py-3 bg-white/20 rounded-full font-bold hover:bg-white/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Sau →
          </button>
        </div>
      </div>
      <audio ref={audioRef} />
    </div>
  )
}

// Study Results Component
export const StudyResults: React.FC<{
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

export default {
  FlashcardsStudy,
  WritingPractice,
  SpacedRepetition,
  StudyResults
}
