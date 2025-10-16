import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'

interface User {
  id: number
  name: string
  email: string
  role: string
  avatar?: string
  created_at: string
  updated_at: string
}

interface AuthState {
  user: User | null
  token: string | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  register: (data: { name: string; email: string; password: string; password_confirmation: string }) => Promise<void>
  logout: () => void
  initializeAuth: () => void
  updateProfile: (data: Partial<User>) => Promise<void>
  refreshToken: () => Promise<void>
}

export const useAuthStore = create<AuthState>()(
  persist(
    immer((set, get) => ({
      user: null,
      token: localStorage.getItem('token'),
      isLoading: false,
      isAuthenticated: false,

      login: async (email: string, password: string) => {
        set((state) => {
          state.isLoading = true
        })

        try {
          const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
            },
            body: JSON.stringify({ email, password }),
          })

          if (!response.ok) {
            throw new Error('Login failed')
          }

          const data = await response.json()

          set((state) => {
            state.user = data.user
            state.token = data.token
            state.isAuthenticated = true
            state.isLoading = false
          })

          localStorage.setItem('token', data.token)
        } catch (error) {
          set((state) => {
            state.isLoading = false
          })
          throw error
        }
      },

      register: async (data) => {
        set((state) => {
          state.isLoading = true
        })

        try {
          const response = await fetch('/api/auth/register', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
            },
            body: JSON.stringify(data),
          })

          if (!response.ok) {
            throw new Error('Registration failed')
          }

          const responseData = await response.json()

          set((state) => {
            state.user = responseData.user
            state.token = responseData.token
            state.isAuthenticated = true
            state.isLoading = false
          })

          localStorage.setItem('token', responseData.token)
        } catch (error) {
          set((state) => {
            state.isLoading = false
          })
          throw error
        }
      },

      logout: () => {
        set((state) => {
          state.user = null
          state.token = null
          state.isAuthenticated = false
        })

        localStorage.removeItem('token')
      },

      initializeAuth: async () => {
        const token = localStorage.getItem('token')
        
        if (!token) {
          set((state) => {
            state.isAuthenticated = false
            state.isLoading = false
          })
          return
        }

        set((state) => {
          state.isLoading = true
        })

        try {
          const response = await fetch('/api/auth/me', {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Accept': 'application/json',
            },
          })

          if (response.ok) {
            const data = await response.json()
            set((state) => {
              state.user = data.user
              state.token = token
              state.isAuthenticated = true
              state.isLoading = false
            })
          } else {
            throw new Error('Token invalid')
          }
        } catch (error) {
          set((state) => {
            state.user = null
            state.token = null
            state.isAuthenticated = false
            state.isLoading = false
          })
          localStorage.removeItem('token')
        }
      },

      updateProfile: async (data) => {
        const { token } = get()
        
        if (!token) throw new Error('Not authenticated')

        set((state) => {
          state.isLoading = true
        })

        try {
          const response = await fetch('/api/auth/profile', {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(data),
          })

          if (!response.ok) {
            throw new Error('Profile update failed')
          }

          const responseData = await response.json()

          set((state) => {
            state.user = responseData.user
            state.isLoading = false
          })
        } catch (error) {
          set((state) => {
            state.isLoading = false
          })
          throw error
        }
      },

      refreshToken: async () => {
        const { token } = get()
        
        if (!token) return

        try {
          const response = await fetch('/api/auth/refresh', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Accept': 'application/json',
            },
          })

          if (response.ok) {
            const data = await response.json()
            set((state) => {
              state.token = data.token
            })
            localStorage.setItem('token', data.token)
          }
        } catch (error) {
          // Token refresh failed, logout user
          get().logout()
        }
      },
    })),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        token: state.token,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
)
