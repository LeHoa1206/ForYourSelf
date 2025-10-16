import React from 'react'
import { motion, AnimatePresence, useSpring, useTransform, useMotionValue } from 'framer-motion'
import { useTheme } from '../../contexts/ThemeContext'

// 3D Card Component với hiệu ứng hover
export const Card3D: React.FC<{
  children: React.ReactNode
  className?: string
  intensity?: number
  perspective?: number
}> = ({ children, className = '', intensity = 0.1, perspective = 1000 }) => {
  const { colors } = useTheme()
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  
  const rotateX = useTransform(y, [-300, 300], [intensity * 10, -intensity * 10])
  const rotateY = useTransform(x, [-300, 300], [-intensity * 10, intensity * 10])

  return (
    <motion.div
      className={`relative ${className}`}
      style={{
        perspective,
        transformStyle: 'preserve-3d'
      }}
      onMouseMove={(event) => {
        const rect = event.currentTarget.getBoundingClientRect()
        const centerX = rect.left + rect.width / 2
        const centerY = rect.top + rect.height / 2
        x.set(event.clientX - centerX)
        y.set(event.clientY - centerY)
      }}
      onMouseLeave={() => {
        x.set(0)
        y.set(0)
      }}
    >
      <motion.div
        style={{
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d'
        }}
        className="w-full h-full"
      >
        {children}
      </motion.div>
    </motion.div>
  )
}

// Glassmorphism Card với hiệu ứng blur
export const GlassCard: React.FC<{
  children: React.ReactNode
  className?: string
  intensity?: number
}> = ({ children, className = '', intensity = 0.1 }) => {
  const { colors } = useTheme()
  
  return (
    <motion.div
      className={`relative overflow-hidden ${className}`}
      style={{
        background: colors.surface,
        backdropFilter: 'blur(20px)',
        border: `1px solid ${colors.border}`,
        borderRadius: '20px',
        boxShadow: `0 8px 32px rgba(0, 0, 0, 0.3)`
      }}
      whileHover={{
        scale: 1.02,
        boxShadow: `0 20px 60px rgba(0, 0, 0, 0.4)`
      }}
      transition={{
        type: 'spring',
        stiffness: 300,
        damping: 30
      }}
    >
      {/* Animated gradient overlay */}
      <motion.div
        className="absolute inset-0 opacity-0"
        style={{
          background: `linear-gradient(45deg, ${colors.primary}20, ${colors.secondary}20)`
        }}
        whileHover={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      />
      
      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  )
}

// Neon Button với hiệu ứng glow
export const NeonButton: React.FC<{
  children: React.ReactNode
  onClick?: () => void
  variant?: 'primary' | 'secondary' | 'accent'
  size?: 'sm' | 'md' | 'lg'
  className?: string
  disabled?: boolean
}> = ({ 
  children, 
  onClick, 
  variant = 'primary', 
  size = 'md', 
  className = '',
  disabled = false 
}) => {
  const { colors } = useTheme()
  
  const getVariantColor = () => {
    switch (variant) {
      case 'primary': return colors.primary
      case 'secondary': return colors.secondary
      case 'accent': return colors.accent
      default: return colors.primary
    }
  }
  
  const getSizeClasses = () => {
    switch (size) {
      case 'sm': return 'px-4 py-2 text-sm'
      case 'md': return 'px-6 py-3 text-base'
      case 'lg': return 'px-8 py-4 text-lg'
      default: return 'px-6 py-3 text-base'
    }
  }
  
  const color = getVariantColor()
  
  return (
    <motion.button
      className={`relative overflow-hidden rounded-xl font-bold transition-all duration-300 ${getSizeClasses()} ${className}`}
      style={{
        background: `linear-gradient(45deg, ${color}20, ${color}40)`,
        border: `2px solid ${color}`,
        color: color,
        boxShadow: `0 0 20px ${color}40`
      }}
      onClick={onClick}
      disabled={disabled}
      whileHover={{
        scale: 1.05,
        boxShadow: `0 0 30px ${color}60`
      }}
      whileTap={{
        scale: 0.95
      }}
      animate={{
        boxShadow: [
          `0 0 20px ${color}40`,
          `0 0 30px ${color}60`,
          `0 0 20px ${color}40`
        ]
      }}
      transition={{
        boxShadow: {
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut'
        }
      }}
    >
      {/* Animated background */}
      <motion.div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(45deg, transparent, ${color}20, transparent)`
        }}
        animate={{
          x: ['-100%', '100%']
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'linear'
        }}
      />
      
      <span className="relative z-10">
        {children}
      </span>
    </motion.button>
  )
}

// Floating Particles Background
export const ParticleBackground: React.FC<{
  children: React.ReactNode
  particleCount?: number
}> = ({ children, particleCount = 50 }) => {
  const { colors } = useTheme()
  
  return (
    <div className="relative w-full h-full overflow-hidden">
      {/* Particles */}
      {Array.from({ length: particleCount }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: Math.random() * 4 + 2,
            height: Math.random() * 4 + 2,
            background: colors.primary,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            opacity: Math.random() * 0.5 + 0.1
          }}
          animate={{
            y: [0, -100, 0],
            x: [0, Math.random() * 50 - 25, 0],
            scale: [1, 1.5, 1],
            opacity: [0.1, 0.8, 0.1]
          }}
          transition={{
            duration: Math.random() * 10 + 10,
            repeat: Infinity,
            ease: 'linear'
          }}
        />
      ))}
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  )
}

// Typing Animation
export const TypingText: React.FC<{
  text: string
  speed?: number
  className?: string
}> = ({ text, speed = 100, className = '' }) => {
  const [displayText, setDisplayText] = React.useState('')
  const [currentIndex, setCurrentIndex] = React.useState(0)
  
  React.useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayText(prev => prev + text[currentIndex])
        setCurrentIndex(prev => prev + 1)
      }, speed)
      
      return () => clearTimeout(timeout)
    }
  }, [currentIndex, text, speed])
  
  return (
    <span className={className}>
      {displayText}
      <motion.span
        animate={{ opacity: [1, 0, 1] }}
        transition={{ duration: 0.8, repeat: Infinity }}
        className="ml-1"
      >
        |
      </motion.span>
    </span>
  )
}

// CountUp Animation
export const CountUp: React.FC<{
  end: number
  duration?: number
  className?: string
  prefix?: string
  suffix?: string
}> = ({ end, duration = 2, className = '', prefix = '', suffix = '' }) => {
  const { colors } = useTheme()
  const [count, setCount] = React.useState(0)
  
  React.useEffect(() => {
    let startTime: number
    let animationFrame: number
    
    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime
      const progress = Math.min((currentTime - startTime) / (duration * 1000), 1)
      
      setCount(Math.floor(progress * end))
      
      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate)
      }
    }
    
    animationFrame = requestAnimationFrame(animate)
    
    return () => cancelAnimationFrame(animationFrame)
  }, [end, duration])
  
  return (
    <motion.span
      className={className}
      style={{ color: colors.primary }}
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: 'spring', stiffness: 200 }}
    >
      {prefix}{count.toLocaleString()}{suffix}
    </motion.span>
  )
}

// Loading Spinner với 3D effect
export const LoadingSpinner3D: React.FC<{
  size?: number
  className?: string
}> = ({ size = 40, className = '' }) => {
  const { colors } = useTheme()
  
  return (
    <div className={`relative ${className}`} style={{ width: size, height: size }}>
      <motion.div
        className="absolute inset-0 rounded-full border-4 border-transparent"
        style={{
          borderTopColor: colors.primary,
          borderRightColor: colors.secondary,
          borderBottomColor: colors.accent,
          borderLeftColor: colors.primary
        }}
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
      />
      <motion.div
        className="absolute inset-2 rounded-full border-2 border-transparent"
        style={{
          borderTopColor: colors.secondary,
          borderRightColor: colors.accent,
          borderBottomColor: colors.primary,
          borderLeftColor: colors.secondary
        }}
        animate={{ rotate: -360 }}
        transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
      />
    </div>
  )
}

// Page Transition
export const PageTransition: React.FC<{
  children: React.ReactNode
}> = ({ children }) => {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}

// Hover Tilt Effect
export const TiltCard: React.FC<{
  children: React.ReactNode
  intensity?: number
  className?: string
}> = ({ children, intensity = 0.1, className = '' }) => {
  const [rotateX, setRotateX] = React.useState(0)
  const [rotateY, setRotateY] = React.useState(0)
  
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    const mouseX = e.clientX - centerX
    const mouseY = e.clientY - centerY
    
    setRotateY(mouseX * intensity)
    setRotateX(-mouseY * intensity)
  }
  
  const handleMouseLeave = () => {
    setRotateX(0)
    setRotateY(0)
  }
  
  return (
    <motion.div
      className={className}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transformStyle: 'preserve-3d',
        perspective: 1000
      }}
      animate={{
        rotateX,
        rotateY
      }}
      transition={{
        type: 'spring',
        stiffness: 300,
        damping: 30
      }}
    >
      {children}
    </motion.div>
  )
}
