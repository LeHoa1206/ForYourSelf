import React, { createContext, useContext, useState, useEffect } from 'react'

interface ThemeContextType {
  theme: 'light' | 'dark' | 'neon' | 'cyber'
  setTheme: (theme: 'light' | 'dark' | 'neon' | 'cyber') => void
  colors: {
    primary: string
    secondary: string
    accent: string
    background: string
    surface: string
    text: string
    textSecondary: string
    border: string
    success: string
    warning: string
    error: string
    info: string
  }
  animations: {
    duration: number
    easing: string
    spring: {
      tension: number
      friction: number
    }
  }
}

const themes = {
  light: {
    primary: '#3b82f6',
    secondary: '#8b5cf6',
    accent: '#06b6d4',
    background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
    surface: 'rgba(255, 255, 255, 0.8)',
    text: '#1e293b',
    textSecondary: '#64748b',
    border: 'rgba(148, 163, 184, 0.3)',
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#3b82f6'
  },
  dark: {
    primary: '#6366f1',
    secondary: '#a855f7',
    accent: '#06b6d4',
    background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
    surface: 'rgba(30, 41, 59, 0.8)',
    text: '#f1f5f9',
    textSecondary: '#94a3b8',
    border: 'rgba(71, 85, 105, 0.3)',
    success: '#22c55e',
    warning: '#fbbf24',
    error: '#f87171',
    info: '#60a5fa'
  },
  neon: {
    primary: '#00ff88',
    secondary: '#ff0080',
    accent: '#00ffff',
    background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%)',
    surface: 'rgba(0, 0, 0, 0.6)',
    text: '#ffffff',
    textSecondary: '#b0b0b0',
    border: 'rgba(0, 255, 136, 0.3)',
    success: '#00ff88',
    warning: '#ffaa00',
    error: '#ff0080',
    info: '#00ffff'
  },
  cyber: {
    primary: '#00d4ff',
    secondary: '#ff006e',
    accent: '#8338ec',
    background: 'linear-gradient(135deg, #0c0c0c 0%, #1a1a2e 25%, #16213e 50%, #0f3460 100%)',
    surface: 'rgba(0, 0, 0, 0.7)',
    text: '#ffffff',
    textSecondary: '#a0a0a0',
    border: 'rgba(0, 212, 255, 0.3)',
    success: '#00ff88',
    warning: '#ffaa00',
    error: '#ff006e',
    info: '#00d4ff'
  }
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<'light' | 'dark' | 'neon' | 'cyber'>('cyber')

  const colors = themes[theme]
  
  const animations = {
    duration: 0.3,
    easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
    spring: {
      tension: 300,
      friction: 30
    }
  }

  useEffect(() => {
    // Apply theme to document
    const root = document.documentElement
    root.style.setProperty('--color-primary', colors.primary)
    root.style.setProperty('--color-secondary', colors.secondary)
    root.style.setProperty('--color-accent', colors.accent)
    root.style.setProperty('--color-background', colors.background)
    root.style.setProperty('--color-surface', colors.surface)
    root.style.setProperty('--color-text', colors.text)
    root.style.setProperty('--color-text-secondary', colors.textSecondary)
    root.style.setProperty('--color-border', colors.border)
    root.style.setProperty('--color-success', colors.success)
    root.style.setProperty('--color-warning', colors.warning)
    root.style.setProperty('--color-error', colors.error)
    root.style.setProperty('--color-info', colors.info)
  }, [colors])

  return (
    <ThemeContext.Provider value={{ theme, setTheme, colors, animations }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}
