import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'

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

interface Subtitle {
  id: number
  video_id: number
  start_time: number
  end_time: number
  english_text: string
  vietnamese_text?: string
  language: string
  formatted_start_time?: string
  formatted_end_time?: string
  duration?: number
}

interface Vocabulary {
  id: number
  video_id: number
  word: string
  definition: string
  pronunciation?: string
  example_sentence?: string
  difficulty_level: string
  is_active: boolean
}

interface Exercise {
  id: number
  video_id: number
  type: string
  question: string
  options?: string[]
  correct_answer: string
  explanation?: string
  difficulty_level: string
  is_active: boolean
}

interface UserProgress {
  id: number
  user_id: number
  video_id: number
  progress_percentage: number
  time_watched: number
  completed: boolean
  last_watched_at: string
  created_at: string
  updated_at: string
}

interface VideoState {
  // Current video data
  currentVideo: Video | null
  subtitles: Subtitle[]
  vocabulary: Vocabulary[]
  exercises: Exercise[]
  userProgress: UserProgress | null
  
  // Video list
  videos: Video[]
  categories: any[]
  
  // UI state
  isLoading: boolean
  error: string | null
  
  // Player state
  isPlaying: boolean
  currentTime: number
  duration: number
  volume: number
  isMuted: boolean
  playbackRate: number
  
  // Subtitle state
  showSubtitles: boolean
  showVietnamese: boolean
  currentSubtitleIndex: number
  
  // Actions
  setCurrentVideo: (video: Video | null) => void
  setSubtitles: (subtitles: Subtitle[]) => void
  setVocabulary: (vocabulary: Vocabulary[]) => void
  setExercises: (exercises: Exercise[]) => void
  setUserProgress: (progress: UserProgress | null) => void
  setVideos: (videos: Video[]) => void
  setCategories: (categories: any[]) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  
  // Player actions
  setPlaying: (playing: boolean) => void
  setCurrentTime: (time: number) => void
  setDuration: (duration: number) => void
  setVolume: (volume: number) => void
  setMuted: (muted: boolean) => void
  setPlaybackRate: (rate: number) => void
  
  // Subtitle actions
  setShowSubtitles: (show: boolean) => void
  setShowVietnamese: (show: boolean) => void
  setCurrentSubtitleIndex: (index: number) => void
  
  // Utility actions
  reset: () => void
  updateProgress: (progress: Partial<UserProgress>) => void
}

const initialState = {
  currentVideo: null,
  subtitles: [],
  vocabulary: [],
  exercises: [],
  userProgress: null,
  videos: [],
  categories: [],
  isLoading: false,
  error: null,
  isPlaying: false,
  currentTime: 0,
  duration: 0,
  volume: 1,
  isMuted: false,
  playbackRate: 1,
  showSubtitles: true,
  showVietnamese: false,
  currentSubtitleIndex: -1,
}

export const useVideoStore = create<VideoState>()(
  immer((set) => ({
    ...initialState,

    setCurrentVideo: (video) => {
      set((state) => {
        state.currentVideo = video
      })
    },

    setSubtitles: (subtitles) => {
      set((state) => {
        state.subtitles = subtitles
      })
    },

    setVocabulary: (vocabulary) => {
      set((state) => {
        state.vocabulary = vocabulary
      })
    },

    setExercises: (exercises) => {
      set((state) => {
        state.exercises = exercises
      })
    },

    setUserProgress: (progress) => {
      set((state) => {
        state.userProgress = progress
      })
    },

    setVideos: (videos) => {
      set((state) => {
        state.videos = videos
      })
    },

    setCategories: (categories) => {
      set((state) => {
        state.categories = categories
      })
    },

    setLoading: (loading) => {
      set((state) => {
        state.isLoading = loading
      })
    },

    setError: (error) => {
      set((state) => {
        state.error = error
      })
    },

    setPlaying: (playing) => {
      set((state) => {
        state.isPlaying = playing
      })
    },

    setCurrentTime: (time) => {
      set((state) => {
        state.currentTime = time
      })
    },

    setDuration: (duration) => {
      set((state) => {
        state.duration = duration
      })
    },

    setVolume: (volume) => {
      set((state) => {
        state.volume = volume
      })
    },

    setMuted: (muted) => {
      set((state) => {
        state.isMuted = muted
      })
    },

    setPlaybackRate: (rate) => {
      set((state) => {
        state.playbackRate = rate
      })
    },

    setShowSubtitles: (show) => {
      set((state) => {
        state.showSubtitles = show
      })
    },

    setShowVietnamese: (show) => {
      set((state) => {
        state.showVietnamese = show
      })
    },

    setCurrentSubtitleIndex: (index) => {
      set((state) => {
        state.currentSubtitleIndex = index
      })
    },

    reset: () => {
      set((state) => {
        Object.assign(state, initialState)
      })
    },

    updateProgress: (progress) => {
      set((state) => {
        if (state.userProgress) {
          Object.assign(state.userProgress, progress)
        } else {
          state.userProgress = progress as UserProgress
        }
      })
    },
  }))
)
