import axios, { AxiosInstance, AxiosResponse } from 'axios'
import { toast } from 'react-hot-toast'

// Types
interface ApiResponse<T = any> {
  success: boolean
  data: T
  message?: string
  meta?: {
    total: number
    per_page: number
    current_page: number
    last_page: number
  }
}

interface Video {
  id: number
  title: string
  slug: string
  description: string
  youtube_id: string
  video_url: string
  thumbnail_url?: string
  duration: number
  category_id: number
  difficulty_level: string
  language: string
  view_count: number
  is_active: boolean
  created_by: number
  created_at: string
  updated_at: string
  category_name?: string
  category_color?: string
  formatted_duration?: string
  difficulty_badge_color?: string
}

interface VideoDetail {
  video: Video
  subtitles: any[]
  vocabulary: any[]
  exercises: any[]
  user_progress?: any
  related_videos: Video[]
}

interface VideoFilters {
  category_id?: number
  difficulty?: string
  language?: string
  search?: string
  duration_min?: number
  duration_max?: number
  per_page?: number
  page?: number
}

class ApiService {
  private api: AxiosInstance

  constructor() {
    this.api = axios.create({
      baseURL: '/api',
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    })

    // Request interceptor
    this.api.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('token')
        if (token) {
          config.headers.Authorization = `Bearer ${token}`
        }
        return config
      },
      (error) => {
        return Promise.reject(error)
      }
    )

    // Response interceptor
    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          localStorage.removeItem('token')
          window.location.href = '/login'
        }
        
        if (error.response?.status >= 500) {
          toast.error('Server error. Please try again later.')
        }
        
        return Promise.reject(error)
      }
    )
  }

  // Generic methods
  private async get<T>(url: string, params?: any): Promise<T> {
    const response: AxiosResponse<ApiResponse<T>> = await this.api.get(url, { params })
    return response.data.data
  }

  private async post<T>(url: string, data?: any): Promise<T> {
    const response: AxiosResponse<ApiResponse<T>> = await this.api.post(url, data)
    return response.data.data
  }

  private async put<T>(url: string, data?: any): Promise<T> {
    const response: AxiosResponse<ApiResponse<T>> = await this.api.put(url, data)
    return response.data.data
  }

  private async delete<T>(url: string): Promise<T> {
    const response: AxiosResponse<ApiResponse<T>> = await this.api.delete(url)
    return response.data.data
  }

  // Auth methods
  async login(email: string, password: string) {
    return this.post('/auth/login', { email, password })
  }

  async register(data: { name: string; email: string; password: string; password_confirmation: string }) {
    return this.post('/auth/register', data)
  }

  async logout() {
    return this.post('/auth/logout')
  }

  async getProfile() {
    return this.get('/auth/me')
  }

  async updateProfile(data: any) {
    return this.put('/auth/profile', data)
  }

  async refreshToken() {
    return this.post('/auth/refresh')
  }

  // Video methods
  async getVideos(filters?: VideoFilters) {
    return this.get<{ data: Video[]; meta: any }>('/videos', filters)
  }

  async getVideo(id: string | number) {
    return this.get<VideoDetail>(`/videos/${id}`)
  }

  async createVideo(data: any) {
    return this.post<Video>('/videos', data)
  }

  async updateVideo(id: string | number, data: any) {
    return this.put<Video>(`/videos/${id}`, data)
  }

  async deleteVideo(id: string | number) {
    return this.delete(`/videos/${id}`)
  }

  async searchVideos(query: string, filters?: any) {
    return this.get<{ data: Video[]; meta: any }>('/videos/search', { q: query, ...filters })
  }

  async getVideoSubtitles(videoId: string | number) {
    return this.get(`/videos/${videoId}/subtitles`)
  }

  async updateVideoProgress(videoId: string | number, progress: any) {
    return this.post(`/videos/${videoId}/progress`, progress)
  }

  // Category methods
  async getCategories() {
    return this.get('/categories')
  }

  async getCategory(id: string | number) {
    return this.get(`/categories/${id}`)
  }

  // News methods
  async getNews(filters?: any) {
    return this.get('/news', filters)
  }

  async getNewsArticle(id: string | number) {
    return this.get(`/news/${id}`)
  }

  // Dictation methods
  async getDictationExercises(filters?: any) {
    return this.get('/dictation', filters)
  }

  async getDictationExercise(id: string | number) {
    return this.get(`/dictation/${id}`)
  }

  // Progress methods
  async getUserProgress() {
    return this.get('/progress')
  }

  async getVideoProgress(videoId: string | number) {
    return this.get(`/progress/video/${videoId}`)
  }

  // Admin methods
  async getAdminStats() {
    return this.get('/admin/stats')
  }

  async getAdminUsers(filters?: any) {
    return this.get('/admin/users', filters)
  }

  async updateUserRole(userId: string | number, role: string) {
    return this.put(`/admin/users/${userId}/role`, { role })
  }

  async deleteUser(userId: string | number) {
    return this.delete(`/admin/users/${userId}`)
  }

  // File upload
  async uploadFile(file: File, type: 'image' | 'video' | 'audio' = 'image') {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('type', type)

    const response = await this.api.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })

    return response.data.data
  }

  // Analytics
  async getAnalytics(period: 'day' | 'week' | 'month' | 'year' = 'month') {
    return this.get('/analytics', { period })
  }

  async trackEvent(event: string, data?: any) {
    return this.post('/analytics/track', { event, data })
  }
}

// Create singleton instance
export const apiService = new ApiService()

// Video service (specialized)
export const videoService = {
  getVideos: (filters?: VideoFilters) => apiService.getVideos(filters),
  getVideo: (id: string | number) => apiService.getVideo(id),
  createVideo: (data: any) => apiService.createVideo(data),
  updateVideo: (id: string | number, data: any) => apiService.updateVideo(id, data),
  deleteVideo: (id: string | number) => apiService.deleteVideo(id),
  searchVideos: (query: string, filters?: any) => apiService.searchVideos(query, filters),
  getSubtitles: (videoId: string | number) => apiService.getVideoSubtitles(videoId),
  updateProgress: (videoId: string | number, progress: any) => apiService.updateVideoProgress(videoId, progress),
}

// Auth service (specialized)
export const authService = {
  login: (email: string, password: string) => apiService.login(email, password),
  register: (data: any) => apiService.register(data),
  logout: () => apiService.logout(),
  getProfile: () => apiService.getProfile(),
  updateProfile: (data: any) => apiService.updateProfile(data),
  refreshToken: () => apiService.refreshToken(),
}

// Admin service (specialized)
export const adminService = {
  getStats: () => apiService.getAdminStats(),
  getUsers: (filters?: any) => apiService.getAdminUsers(filters),
  updateUserRole: (userId: string | number, role: string) => apiService.updateUserRole(userId, role),
  deleteUser: (userId: string | number) => apiService.deleteUser(userId),
}

export default apiService
