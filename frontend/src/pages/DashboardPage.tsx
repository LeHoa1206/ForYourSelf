import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  BarChart3, 
  BookOpen, 
  PlayCircle, 
  Brain, 
  MessageCircle, 
  Award, 
  TrendingUp, 
  Clock, 
  Target, 
  Zap,
  Users,
  Star,
  ChevronRight,
  Sparkles,
  Rocket,
  Crown,
  Gem
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

interface DashboardStats {
  stats: {
    WordsLearned: number
    LessonsCompleted: number
    QuizzesCompleted: number
    HoursSpent: string
    AvgScore: string
    StreakDays: number
    TotalXP: number
    LastActive: string
  }
  dueFlashcards: number
  recommendations: number
  recentProgress: Array<{
    Title: string
    CompletionDate: string
    Score: number
  }>
}

const DashboardPage: React.FC = () => {
  const { colors, theme } = useTheme()
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeCard, setActiveCard] = useState<number | null>(null)
  const [showConfetti, setShowConfetti] = useState(false)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/dashboard')
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const result = await response.json()
      if (result.success) {
        setStats(result.data)
        // Show confetti for achievements
        if (result.data.stats.StreakDays > 0) {
          setShowConfetti(true)
          setTimeout(() => setShowConfetti(false), 3000)
        }
      } else {
        setError(result.message || 'Failed to fetch dashboard data')
      }
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN')
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return colors.success
    if (score >= 60) return colors.warning
    return colors.error
  }

  const getAchievementLevel = (xp: number) => {
    if (xp >= 10000) return { level: 'Master', icon: Crown, color: colors.accent }
    if (xp >= 5000) return { level: 'Expert', icon: Gem, color: colors.secondary }
    if (xp >= 1000) return { level: 'Advanced', icon: Star, color: colors.primary }
    return { level: 'Beginner', icon: Rocket, color: colors.info }
  }

  const achievement = getAchievementLevel(stats?.stats.TotalXP || 0)

  if (loading) {
    return (
      <PageTransition>
        <div className="min-h-screen flex items-center justify-center" style={{ background: colors.background }}>
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
                <TypingText text="Đang tải dữ liệu..." speed={100} />
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
        <div className="min-h-screen flex items-center justify-center p-4" style={{ background: colors.background }}>
          <GlassCard className="max-w-md text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200 }}
            >
              <div className="text-6xl mb-4">❌</div>
              <h2 className="text-2xl font-bold mb-4" style={{ color: colors.error }}>
                Lỗi tải dữ liệu
              </h2>
              <p className="mb-6 opacity-80">{error}</p>
              <NeonButton onClick={fetchDashboardData} variant="primary">
                Thử lại
              </NeonButton>
            </motion.div>
          </GlassCard>
        </div>
      </PageTransition>
    )
  }

  return (
    <PageTransition>
      <div className="min-h-screen p-4" style={{ background: colors.background }}>
        <ParticleBackground>
          <div className="max-w-7xl mx-auto">
            {/* Header với Typing Animation */}
            <motion.div 
              className="text-center mb-12"
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
            >
              <div className="flex items-center justify-center mb-4">
                <Sparkles className="w-8 h-8 mr-3" style={{ color: colors.accent }} />
                <h1 className="text-5xl font-bold" style={{ color: colors.text }}>
                  <TypingText text="VIP Dashboard" speed={150} />
                </h1>
                <Sparkles className="w-8 h-8 ml-3" style={{ color: colors.accent }} />
              </div>
              <motion.p 
                className="text-xl opacity-80"
                style={{ color: colors.textSecondary }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.8 }}
                transition={{ delay: 1 }}
              >
                Theo dõi tiến độ học tập của bạn
              </motion.p>
            </motion.div>

            {/* Achievement Banner */}
            <motion.div
              initial={{ scale: 0, rotate: -10 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 200, delay: 0.5 }}
              className="mb-8"
            >
              <GlassCard className="relative overflow-hidden">
                <div className="flex items-center justify-between p-6">
                  <div className="flex items-center">
                    <motion.div
                      animate={{ rotate: [0, 10, -10, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <achievement.icon className="w-12 h-12 mr-4" style={{ color: achievement.color }} />
                    </motion.div>
                    <div>
                      <h3 className="text-2xl font-bold" style={{ color: colors.text }}>
                        {achievement.level} Learner
                      </h3>
                      <p className="opacity-80" style={{ color: colors.textSecondary }}>
                        Tổng XP: <CountUp end={stats?.stats.TotalXP || 0} suffix=" XP" />
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold" style={{ color: achievement.color }}>
                      <CountUp end={stats?.stats.StreakDays || 0} suffix=" ngày" />
                    </div>
                    <p className="opacity-80" style={{ color: colors.textSecondary }}>
                      Streak hiện tại
                    </p>
                  </div>
                </div>
                
                {/* Animated background gradient */}
                <motion.div
                  className="absolute inset-0 opacity-20"
                  style={{
                    background: `linear-gradient(45deg, ${achievement.color}20, ${colors.accent}20)`
                  }}
                  animate={{
                    background: [
                      `linear-gradient(45deg, ${achievement.color}20, ${colors.accent}20)`,
                      `linear-gradient(45deg, ${colors.accent}20, ${achievement.color}20)`,
                      `linear-gradient(45deg, ${achievement.color}20, ${colors.accent}20)`
                    ]
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                />
              </GlassCard>
            </motion.div>

            {/* Stats Grid với 3D Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
              {[
                { 
                  icon: BookOpen, 
                  label: 'Từ vựng đã học', 
                  value: stats?.stats.WordsLearned || 0,
                  color: colors.success,
                  suffix: ' từ'
                },
                { 
                  icon: PlayCircle, 
                  label: 'Bài học hoàn thành', 
                  value: stats?.stats.LessonsCompleted || 0,
                  color: colors.info,
                  suffix: ' bài'
                },
                { 
                  icon: Brain, 
                  label: 'Quiz hoàn thành', 
                  value: stats?.stats.QuizzesCompleted || 0,
                  color: colors.secondary,
                  suffix: ' quiz'
                },
                { 
                  icon: Clock, 
                  label: 'Thời gian học', 
                  value: parseFloat(stats?.stats.HoursSpent || '0'),
                  color: colors.warning,
                  suffix: ' giờ'
                },
                { 
                  icon: Target, 
                  label: 'Điểm trung bình', 
                  value: parseFloat(stats?.stats.AvgScore || '0'),
                  color: colors.error,
                  suffix: '%'
                },
                { 
                  icon: Zap, 
                  label: 'Ngày liên tiếp', 
                  value: stats?.stats.StreakDays || 0,
                  color: colors.accent,
                  suffix: ' ngày'
                }
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ y: 50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <TiltCard intensity={0.05}>
                    <Card3D intensity={0.1}>
                      <GlassCard 
                        className={`p-6 text-center cursor-pointer transition-all duration-300 ${
                          activeCard === index ? 'scale-105' : ''
                        }`}
                        onClick={() => setActiveCard(activeCard === index ? null : index)}
                      >
                        <motion.div
                          whileHover={{ scale: 1.1 }}
                          className="mb-4 flex justify-center"
                        >
                          <stat.icon 
                            className="w-12 h-12" 
                            style={{ color: stat.color }}
                          />
                        </motion.div>
                        
                        <motion.div
                          className="text-3xl font-bold mb-2"
                          style={{ color: stat.color }}
                        >
                          <CountUp 
                            end={stat.value} 
                            suffix={stat.suffix}
                            duration={1.5}
                          />
                        </motion.div>
                        
                        <p className="opacity-80" style={{ color: colors.textSecondary }}>
                          {stat.label}
                        </p>

                        <AnimatePresence>
                          {activeCard === index && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              className="mt-4 pt-4 border-t"
                              style={{ borderColor: colors.border }}
                            >
                              <p className="text-sm opacity-60">
                                Nhấn để xem chi tiết
                              </p>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </GlassCard>
                    </Card3D>
                  </TiltCard>
                </motion.div>
              ))}
            </div>

            {/* Quick Actions với Neon Buttons */}
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="mb-12"
            >
              <GlassCard className="p-8">
                <h2 className="text-3xl font-bold mb-8 text-center" style={{ color: colors.text }}>
                  🚀 Hành động nhanh
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[
                    { 
                      icon: BookOpen, 
                      label: 'Học từ vựng', 
                      href: '/vocabulary',
                      color: colors.success
                    },
                    { 
                      icon: PlayCircle, 
                      label: 'Video học', 
                      href: '/video-learning',
                      color: colors.info
                    },
                    { 
                      icon: Brain, 
                      label: 'Làm quiz', 
                      href: '/quizzes',
                      color: colors.secondary
                    },
                    { 
                      icon: Award, 
                      label: 'Flashcards', 
                      href: '/flashcards',
                      color: colors.warning
                    },
                    { 
                      icon: MessageCircle, 
                      label: 'AI Chat', 
                      href: '/conversations',
                      color: colors.error
                    },
                    { 
                      icon: BarChart3, 
                      label: 'Admin Panel', 
                      href: '/admin',
                      color: colors.accent
                    }
                  ].map((action, index) => (
                    <motion.div
                      key={index}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <NeonButton
                        variant="primary"
                        size="lg"
                        className="w-full h-20 flex flex-col items-center justify-center"
                        onClick={() => window.location.href = action.href}
                      >
                        <action.icon className="w-8 h-8 mb-2" />
                        <span className="text-lg font-bold">{action.label}</span>
                      </NeonButton>
                    </motion.div>
                  ))}
                </div>
              </GlassCard>
            </motion.div>

            {/* Recent Progress */}
            {stats?.recentProgress && stats.recentProgress.length > 0 && (
              <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 1 }}
                className="mb-12"
              >
                <GlassCard className="p-8">
                  <h2 className="text-3xl font-bold mb-8 text-center" style={{ color: colors.text }}>
                    📈 Tiến độ gần đây
                  </h2>
                  
                  <div className="space-y-4">
                    {stats.recentProgress.map((progress, index) => (
                      <motion.div
                        key={index}
                        initial={{ x: -50, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center justify-between p-4 rounded-xl"
                        style={{
                          background: 'rgba(255, 255, 255, 0.05)',
                          border: `1px solid ${colors.border}`
                        }}
                      >
                        <div>
                          <h3 className="text-xl font-semibold mb-2" style={{ color: colors.text }}>
                            {progress.Title}
                          </h3>
                          <p className="opacity-70" style={{ color: colors.textSecondary }}>
                            Hoàn thành: {formatDate(progress.CompletionDate)}
                          </p>
                        </div>
                        
                        <motion.div
                          className="px-6 py-3 rounded-full font-bold text-xl"
                          style={{
                            background: `${getScoreColor(progress.Score)}20`,
                            border: `2px solid ${getScoreColor(progress.Score)}`,
                            color: getScoreColor(progress.Score)
                          }}
                          whileHover={{ scale: 1.1 }}
                        >
                          <CountUp end={progress.Score} suffix="%" />
                        </motion.div>
                      </motion.div>
                    ))}
                  </div>
                </GlassCard>
              </motion.div>
            )}

            {/* Due Flashcards Alert */}
            {stats && stats.dueFlashcards > 0 && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200 }}
                className="mb-8"
              >
                <GlassCard className="p-6 text-center border-2" style={{ borderColor: colors.warning }}>
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="text-4xl mb-4"
                  >
                    ⏰
                  </motion.div>
                  <h3 className="text-2xl font-bold mb-4" style={{ color: colors.warning }}>
                    Có <CountUp end={stats.dueFlashcards} /> flashcards cần ôn tập!
                  </h3>
                  <NeonButton
                    variant="primary"
                    onClick={() => window.location.href = '/flashcards'}
                  >
                    Ôn tập ngay
                  </NeonButton>
                </GlassCard>
              </motion.div>
            )}
          </div>
        </ParticleBackground>
      </div>
    </PageTransition>
  )
}

export default DashboardPage