import React from 'react'

// Glass Card Component với hiệu ứng glassmorphism
export const GlassCard: React.FC<{
  children: React.ReactNode
  className?: string
  intensity?: number
}> = ({ children, className = '', intensity = 0.1 }) => {
  return (
    <div
      className={`bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 hover:bg-white/20 hover:shadow-2xl transition-all duration-300 ${className}`}
      style={{
        background: `rgba(255, 255, 255, ${intensity})`,
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
      }}
    >
      {children}
    </div>
  )
}

// Neon Button Component với hiệu ứng neon
export const NeonButton: React.FC<{
  children: React.ReactNode
  onClick?: () => void
  className?: string
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
}> = ({ 
  children, 
  onClick, 
  className = '', 
  variant = 'primary', 
  size = 'md',
  disabled = false 
}) => {
  const baseClasses = 'font-bold rounded-full transition-all duration-300 transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100'
  
  const variantClasses = {
    primary: 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white shadow-lg hover:shadow-blue-500/25',
    secondary: 'bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white shadow-lg hover:shadow-gray-500/25',
    success: 'bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white shadow-lg hover:shadow-green-500/25',
    warning: 'bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white shadow-lg hover:shadow-yellow-500/25',
    danger: 'bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white shadow-lg hover:shadow-red-500/25'
  }
  
  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg'
  }
  
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      style={{
        boxShadow: `0 0 20px ${variant === 'primary' ? 'rgba(59, 130, 246, 0.5)' : 
                   variant === 'success' ? 'rgba(34, 197, 94, 0.5)' :
                   variant === 'warning' ? 'rgba(245, 158, 11, 0.5)' :
                   variant === 'danger' ? 'rgba(239, 68, 68, 0.5)' :
                   'rgba(107, 114, 128, 0.5)'}`
      }}
    >
      {children}
    </button>
  )
}

// Particle Background Component
export const ParticleBackground: React.FC<{
  children: React.ReactNode
  particleCount?: number
  className?: string
}> = ({ children, particleCount = 50, className = '' }) => {
  const particles = Array.from({ length: particleCount }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 4 + 1,
    speed: Math.random() * 2 + 0.5,
    opacity: Math.random() * 0.5 + 0.1
  }))

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Floating Particles */}
      <div className="absolute inset-0 pointer-events-none">
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="absolute rounded-full bg-white animate-pulse"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              opacity: particle.opacity,
              animation: `float ${particle.speed}s ease-in-out infinite alternate`
            }}
          />
        ))}
      </div>
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
      
      {/* CSS Animation */}
      <style jsx>{`
        @keyframes float {
          0% { transform: translateY(0px) rotate(0deg); }
          100% { transform: translateY(-20px) rotate(360deg); }
        }
      `}</style>
    </div>
  )
}

// Shimmer Effect Component
export const ShimmerCard: React.FC<{
  children: React.ReactNode
  className?: string
  shimmer?: boolean
}> = ({ children, className = '', shimmer = true }) => {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      {children}
      {shimmer && (
        <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      )}
    </div>
  )
}

// Gradient Text Component
export const GradientText: React.FC<{
  children: React.ReactNode
  className?: string
  gradient?: string
}> = ({ children, className = '', gradient = 'from-yellow-400 to-pink-400' }) => {
  return (
    <span className={`bg-gradient-to-r ${gradient} bg-clip-text text-transparent ${className}`}>
      {children}
    </span>
  )
}

// Floating Action Button
export const FloatingActionButton: React.FC<{
  children: React.ReactNode
  onClick?: () => void
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left'
  className?: string
}> = ({ children, onClick, position = 'bottom-right', className = '' }) => {
  const positionClasses = {
    'bottom-right': 'bottom-6 right-6',
    'bottom-left': 'bottom-6 left-6',
    'top-right': 'top-6 right-6',
    'top-left': 'top-6 left-6'
  }
  
  return (
    <button
      onClick={onClick}
      className={`fixed ${positionClasses[position]} w-14 h-14 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-300 flex items-center justify-center text-white text-xl z-50 ${className}`}
    >
      {children}
    </button>
  )
}

// Progress Bar Component
export const ProgressBar: React.FC<{
  progress: number
  className?: string
  showPercentage?: boolean
  color?: string
}> = ({ progress, className = '', showPercentage = true, color = 'from-green-400 to-blue-500' }) => {
  return (
    <div className={`w-full ${className}`}>
      <div className="w-full bg-white/20 rounded-full h-3 mb-2">
        <div 
          className={`bg-gradient-to-r ${color} h-3 rounded-full transition-all duration-500 ease-out`}
          style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
        />
      </div>
      {showPercentage && (
        <div className="text-right text-sm opacity-80">
          {Math.round(progress)}%
        </div>
      )}
    </div>
  )
}

// Loading Spinner Component
export const LoadingSpinner: React.FC<{
  size?: 'sm' | 'md' | 'lg'
  className?: string
}> = ({ size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-12 w-12',
    lg: 'h-16 w-16'
  }
  
  return (
    <div className={`animate-spin rounded-full border-b-2 border-white ${sizeClasses[size]} ${className}`} />
  )
}

// Modal Component
export const Modal: React.FC<{
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
  title?: string
  className?: string
}> = ({ isOpen, onClose, children, title, className = '' }) => {
  if (!isOpen) return null
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className={`relative bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto ${className}`}>
        {title && (
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-white">{title}</h2>
            <button
              onClick={onClose}
              className="text-white/70 hover:text-white transition-colors"
            >
              ✕
            </button>
          </div>
        )}
        {children}
      </div>
    </div>
  )
}

// Toast Notification Component
export const Toast: React.FC<{
  message: string
  type?: 'success' | 'error' | 'warning' | 'info'
  isVisible: boolean
  onClose: () => void
  duration?: number
}> = ({ message, type = 'info', isVisible, onClose, duration = 3000 }) => {
  React.useEffect(() => {
    if (isVisible && duration > 0) {
      const timer = setTimeout(onClose, duration)
      return () => clearTimeout(timer)
    }
  }, [isVisible, duration, onClose])
  
  if (!isVisible) return null
  
  const typeClasses = {
    success: 'bg-green-500/90 border-green-400',
    error: 'bg-red-500/90 border-red-400',
    warning: 'bg-yellow-500/90 border-yellow-400',
    info: 'bg-blue-500/90 border-blue-400'
  }
  
  const icons = {
    success: '✅',
    error: '❌',
    warning: '⚠️',
    info: 'ℹ️'
  }
  
  return (
    <div className="fixed top-4 right-4 z-50 animate-slide-in">
      <div className={`${typeClasses[type]} border rounded-lg p-4 shadow-lg backdrop-blur-sm`}>
        <div className="flex items-center">
          <span className="text-lg mr-2">{icons[type]}</span>
          <span className="text-white font-medium">{message}</span>
          <button
            onClick={onClose}
            className="ml-4 text-white/70 hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  )
}

// Card Flip Component
export const CardFlip: React.FC<{
  isFlipped: boolean
  front: React.ReactNode
  back: React.ReactNode
  className?: string
}> = ({ isFlipped, front, back, className = '' }) => {
  return (
    <div className={`perspective-1000 ${className}`}>
      <div className={`relative w-full h-64 transition-transform duration-700 transform-style-preserve-3d ${isFlipped ? 'rotate-y-180' : ''}`}>
        {/* Front */}
        <div className="absolute inset-0 w-full h-full backface-hidden">
          {front}
        </div>
        
        {/* Back */}
        <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180">
          {back}
        </div>
      </div>
    </div>
  )
}

// Animated Counter Component
export const AnimatedCounter: React.FC<{
  value: number
  duration?: number
  className?: string
}> = ({ value, duration = 1000, className = '' }) => {
  const [count, setCount] = React.useState(0)
  
  React.useEffect(() => {
    let startTime: number
    let animationFrame: number
    
    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime
      const progress = Math.min((currentTime - startTime) / duration, 1)
      
      setCount(Math.floor(progress * value))
      
      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate)
      }
    }
    
    animationFrame = requestAnimationFrame(animate)
    
    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame)
      }
    }
  }, [value, duration])
  
  return (
    <span className={className}>
      {count}
    </span>
  )
}

// CSS Animations
export const animations = {
  fadeIn: 'animate-fade-in',
  slideIn: 'animate-slide-in',
  slideUp: 'animate-slide-up',
  slideDown: 'animate-slide-down',
  scaleIn: 'animate-scale-in',
  bounce: 'animate-bounce',
  pulse: 'animate-pulse',
  spin: 'animate-spin',
  ping: 'animate-ping',
  wiggle: 'animate-wiggle'
}

// Export all components
export default {
  GlassCard,
  NeonButton,
  ParticleBackground,
  ShimmerCard,
  GradientText,
  FloatingActionButton,
  ProgressBar,
  LoadingSpinner,
  Modal,
  Toast,
  CardFlip,
  AnimatedCounter,
  animations
}
