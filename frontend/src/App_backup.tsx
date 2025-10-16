import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ThemeProvider } from './contexts/ThemeContext'
import DashboardPage from './pages/DashboardPage'
import VocabularyPage from './pages/VocabularyPage'
import VideoLearningPage from './pages/VideoLearningPage'
import QuizzesPage from './pages/QuizzesPage'
import VocabularyLearningPage from './pages/VocabularyLearningPage'
import GrammarPage from './pages/GrammarPage'
import ConversationsPage from './pages/ConversationsPage'
import AdminPanel from './pages/AdminPanel'
import { motion } from 'framer-motion'
import { 
  BarChart3, 
  BookOpen, 
  PlayCircle, 
  Brain, 
  MessageCircle, 
  Award, 
  Settings,
  GraduationCap,
  Sparkles,
  Crown
} from 'lucide-react'
import { useTheme } from './contexts/ThemeContext'
import { NeonButton, GlassCard, ParticleBackground } from './components/Animations'

// Navigation Component với hiệu ứng hiện đại
const Navigation: React.FC = () => {
  const { colors, theme, setTheme } = useTheme()
  const [isMenuOpen, setIsMenuOpen] = React.useState(false)

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: BarChart3 },
    { path: '/vocabulary', label: 'Vocabulary', icon: BookOpen },
    { path: '/vocabulary-learning', label: 'Learn', icon: GraduationCap },
    { path: '/video-learning', label: 'Video Learning', icon: PlayCircle },
    { path: '/quizzes', label: 'Quizzes', icon: Brain },
    { path: '/flashcards', label: 'Flashcards', icon: Award },
    { path: '/grammar', label: 'Grammar', icon: BookOpen },
    { path: '/conversations', label: 'AI Chat', icon: MessageCircle },
    { path: '/admin', label: 'Admin', icon: Settings }
  ]

  const themes = [
    { name: 'light', label: '☀️ Light' },
    { name: 'dark', label: '🌙 Dark' },
    { name: 'neon', label: '💫 Neon' },
    { name: 'cyber', label: '🤖 Cyber' }
  ] as const

  return (
    <motion.nav
      className="fixed top-0 left-0 right-0 z-50"
      style={{
        background: `${colors.surface}80`,
        backdropFilter: 'blur(20px)',
        borderBottom: `1px solid ${colors.border}`
      }}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 200 }}
    >
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <motion.div
            className="flex items-center space-x-3"
            whileHover={{ scale: 1.05 }}
          >
            <Crown className="w-8 h-8" style={{ color: colors.accent }} />
            <span className="text-2xl font-bold" style={{ color: colors.text }}>
              VIP English Learning
            </span>
            <Sparkles className="w-5 h-5" style={{ color: colors.accent }} />
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-2">
            {navItems.map((item) => (
              <motion.a
                key={item.path}
                href={item.path}
                className={`px-4 py-2 rounded-xl font-medium transition-all duration-300 flex items-center space-x-2 ${
                  window.location.pathname === item.path 
                    ? 'text-white' 
                    : 'opacity-80 hover:opacity-100'
                }`}
                style={{
                  background: window.location.pathname === item.path 
                    ? `linear-gradient(45deg, ${colors.primary}, ${colors.secondary})`
                    : 'transparent',
                  color: window.location.pathname === item.path 
                    ? 'white' 
                    : colors.text
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <item.icon className="w-4 h-4" />
                <span>{item.label}</span>
              </motion.a>
            ))}
          </div>

          {/* Theme Selector */}
          <div className="hidden md:flex items-center space-x-2">
            {themes.map((themeOption) => (
              <motion.button
                key={themeOption.name}
                onClick={() => setTheme(themeOption.name)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                  theme === themeOption.name 
                    ? 'text-white' 
                    : 'opacity-70 hover:opacity-100'
                }`}
                style={{
                  background: theme === themeOption.name 
                    ? colors.primary
                    : 'transparent',
                  color: theme === themeOption.name 
                    ? 'white' 
                    : colors.text
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {themeOption.label}
              </motion.button>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            className="lg:hidden p-2 rounded-lg"
            style={{ color: colors.text }}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            whileTap={{ scale: 0.95 }}
          >
            <div className="w-6 h-6 flex flex-col justify-center space-y-1">
              <motion.div
                className="w-full h-0.5 rounded"
                style={{ background: colors.text }}
                animate={{ rotate: isMenuOpen ? 45 : 0, y: isMenuOpen ? 6 : 0 }}
              />
              <motion.div
                className="w-full h-0.5 rounded"
                style={{ background: colors.text }}
                animate={{ opacity: isMenuOpen ? 0 : 1 }}
              />
              <motion.div
                className="w-full h-0.5 rounded"
                style={{ background: colors.text }}
                animate={{ rotate: isMenuOpen ? -45 : 0, y: isMenuOpen ? -6 : 0 }}
              />
            </div>
          </motion.button>
        </div>

        {/* Mobile Menu */}
        <motion.div
          className="lg:hidden mt-4"
          initial={{ height: 0, opacity: 0 }}
          animate={{ 
            height: isMenuOpen ? 'auto' : 0, 
            opacity: isMenuOpen ? 1 : 0 
          }}
          transition={{ duration: 0.3 }}
        >
          <div className="space-y-2 pb-4">
            {navItems.map((item) => (
              <motion.a
                key={item.path}
                href={item.path}
                className={`block px-4 py-3 rounded-xl font-medium transition-all duration-300 flex items-center space-x-3 ${
                  window.location.pathname === item.path 
                    ? 'text-white' 
                    : 'opacity-80 hover:opacity-100'
                }`}
                style={{
                  background: window.location.pathname === item.path 
                    ? `linear-gradient(45deg, ${colors.primary}, ${colors.secondary})`
                    : 'transparent',
                  color: window.location.pathname === item.path 
                    ? 'white' 
                    : colors.text
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
              </motion.a>
            ))}
            
            {/* Mobile Theme Selector */}
            <div className="flex flex-wrap gap-2 pt-4">
              {themes.map((themeOption) => (
                <motion.button
                  key={themeOption.name}
                  onClick={() => setTheme(themeOption.name)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                    theme === themeOption.name 
                      ? 'text-white' 
                      : 'opacity-70 hover:opacity-100'
                  }`}
                  style={{
                    background: theme === themeOption.name 
                      ? colors.primary
                      : 'transparent',
                    color: theme === themeOption.name 
                      ? 'white' 
                      : colors.text
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {themeOption.label}
                </motion.button>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </motion.nav>
  )
}

// Home Page Component với hiệu ứng 3D
const HomePage: React.FC = () => {
  const { colors } = useTheme()

  return (
    <div className="min-h-screen pt-20" style={{ background: colors.background }}>
      <ParticleBackground>
        <div className="max-w-6xl mx-auto px-4 py-12">
          {/* Hero Section */}
          <motion.div
            className="text-center mb-16"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              className="text-6xl font-bold mb-6"
              style={{ color: colors.text }}
              animate={{ 
                textShadow: [
                  `0 0 20px ${colors.accent}40`,
                  `0 0 40px ${colors.accent}60`,
                  `0 0 20px ${colors.accent}40`
                ]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              🎉 VIP English Learning Platform
            </motion.div>
            
            <motion.p
              className="text-2xl opacity-90 mb-8"
              style={{ color: colors.textSecondary }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.9 }}
              transition={{ delay: 0.5 }}
            >
              Hệ thống học tiếng Anh đỉnh cao với công nghệ AI tiên tiến
            </motion.p>

            <motion.div
              className="flex justify-center space-x-4"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              <NeonButton
                variant="primary"
                size="lg"
                onClick={() => window.location.href = '/dashboard'}
              >
                Bắt đầu học ngay
              </NeonButton>
              <NeonButton
                variant="secondary"
                size="lg"
                onClick={() => window.location.href = '/admin'}
              >
                Admin Panel
              </NeonButton>
            </motion.div>
          </motion.div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: BookOpen,
                title: 'Vocabulary Learning',
                description: 'Học từ vựng với flashcards thông minh và hệ thống Spaced Repetition Algorithm',
                href: '/vocabulary',
                color: colors.success
              },
              {
                icon: PlayCircle,
                title: 'Video Lessons',
                description: 'Học tiếng Anh qua video với phụ đề song ngữ và tính năng tương tác',
                href: '/video-learning',
                color: colors.info
              },
              {
                icon: Brain,
                title: 'Smart Quizzes',
                description: 'Kiểm tra kiến thức với các bài quiz đa dạng và phản hồi tức thì',
                href: '/quizzes',
                color: colors.secondary
              },
              {
                icon: Award,
                title: 'Flashcards',
                description: 'Ôn tập với hệ thống flashcards thông minh và spaced repetition',
                href: '/flashcards',
                color: colors.warning
              },
              {
                icon: MessageCircle,
                title: 'AI Conversations',
                description: 'Luyện nói với AI chatbot và nhận đánh giá pronunciation, grammar',
                href: '/conversations',
                color: colors.error
              },
              {
                icon: BarChart3,
                title: 'Progress Tracking',
                description: 'Theo dõi tiến độ học tập và nhận gợi ý cá nhân hóa',
                href: '/dashboard',
                color: colors.accent
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -10 }}
              >
                <GlassCard className="p-8 text-center h-full cursor-pointer">
                  <motion.div
                    className="mb-6"
                    whileHover={{ scale: 1.2, rotate: 10 }}
                    transition={{ type: 'spring', stiffness: 200 }}
                  >
                    <feature.icon className="w-16 h-16 mx-auto" style={{ color: feature.color }} />
                  </motion.div>
                  
                  <h3 className="text-2xl font-bold mb-4" style={{ color: colors.text }}>
                    {feature.title}
                  </h3>
                  
                  <p className="opacity-80 mb-6" style={{ color: colors.textSecondary }}>
                    {feature.description}
                  </p>
                  
                  <NeonButton
                    variant="primary"
                    onClick={() => window.location.href = feature.href}
                  >
                    Khám phá
                  </NeonButton>
                </GlassCard>
              </motion.div>
            ))}
          </div>

          {/* Admin Section */}
          <motion.div
            className="mt-16"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1 }}
          >
            <GlassCard className="p-8 text-center border-2" style={{ borderColor: colors.error }}>
              <h2 className="text-3xl font-bold mb-4" style={{ color: colors.error }}>
                👨‍💼 Admin Panel
              </h2>
              <p className="mb-6 opacity-80" style={{ color: colors.textSecondary }}>
                Quản lý toàn bộ hệ thống và nội dung học tập
              </p>
              <NeonButton
                variant="primary"
                onClick={() => window.location.href = '/admin'}
              >
                Truy cập Admin Panel
              </NeonButton>
              
              <div className="mt-8 p-6 rounded-xl" style={{ background: 'rgba(0, 0, 0, 0.2)' }}>
                <h3 className="text-xl font-bold mb-4" style={{ color: colors.accent }}>
                  🔑 Tài khoản mặc định
                </h3>
                <div className="space-y-2 text-left">
                  <div className="flex justify-between">
                    <span className="font-bold" style={{ color: colors.success }}>Admin:</span>
                    <span style={{ color: colors.warning }}>admin@vipenglish.com / password</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-bold" style={{ color: colors.success }}>Student:</span>
                    <span style={{ color: colors.warning }}>student@example.com / password</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-bold" style={{ color: colors.success }}>Teacher:</span>
                    <span style={{ color: colors.warning }}>teacher@example.com / password</span>
                  </div>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        </div>
      </ParticleBackground>
    </div>
  )
}

function App() {
  return (
    <ThemeProvider>
      <Router>
        <Navigation />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/vocabulary" element={<VocabularyPage />} />
          <Route path="/vocabulary-learning" element={<VocabularyLearningPage />} />
          <Route path="/video-learning" element={<VideoLearningPage />} />
          <Route path="/quizzes" element={<QuizzesPage />} />
          <Route path="/flashcards" element={<VocabularyPage />} />
          <Route path="/grammar" element={<GrammarPage />} />
          <Route path="/conversations" element={<ConversationsPage />} />
          <Route path="/admin" element={<AdminPanel />} />
        </Routes>
      </Router>
    </ThemeProvider>
  )
}

export default App