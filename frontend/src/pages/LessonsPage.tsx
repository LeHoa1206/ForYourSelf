import React, { useState, useEffect } from 'react'
import { ArrowLeft, BookOpen, Volume2, Star } from 'lucide-react'

interface Lesson {
  LessonID: number
  Title: string
  Description: string
  Type: string
  Level: string
  VideoLink: string
  Audio: string
  TextContent: string
  TopicTitle: string
  Duration: number
}

const LessonsPage: React.FC = () => {
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedType, setSelectedType] = useState<string>('')
  const [selectedLevel, setSelectedLevel] = useState<string>('')

  useEffect(() => {
    fetchLessons()
  }, [selectedType, selectedLevel])

  const fetchLessons = async () => {
    try {
      const params = new URLSearchParams()
      if (selectedType) params.append('type', selectedType)
      if (selectedLevel) params.append('level', selectedLevel)
      
      const response = await fetch(`http://localhost:8000/api/lessons?${params}`)
      const data = await response.json()
      
      if (data.success) {
        setLessons(data.data)
      } else {
        setError('Failed to fetch lessons')
      }
    } catch (err) {
      setError('Error fetching lessons')
    } finally {
      setLoading(false)
    }
  }

  const getTypeColor = (type: string) => {
    const colors: { [key: string]: string } = {
      'Listening': 'bg-blue-500',
      'Speaking': 'bg-green-500',
      'Reading': 'bg-purple-500',
      'Writing': 'bg-orange-500',
      'Grammar': 'bg-red-500',
      'Vocabulary': 'bg-indigo-500'
    }
    return colors[type] || 'bg-gray-500'
  }

  const getLevelColor = (level: string) => {
    const colors: { [key: string]: string } = {
      'A1': 'bg-green-100 text-green-800',
      'A2': 'bg-blue-100 text-blue-800',
      'B1': 'bg-yellow-100 text-yellow-800',
      'B2': 'bg-orange-100 text-orange-800',
      'C1': 'bg-red-100 text-red-800',
      'C2': 'bg-purple-100 text-purple-800'
    }
    return colors[level] || 'bg-gray-100 text-gray-800'
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading lessons...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-500 text-lg">{error}</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center py-6">
            <a href="/dashboard" className="mr-4">
              <ArrowLeft className="w-6 h-6 text-gray-600 hover:text-gray-900" />
            </a>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Lessons</h1>
              <p className="text-gray-600">Practice your English with interactive lessons</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="flex flex-wrap gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm"
              >
                <option value="">All Types</option>
                <option value="Listening">Listening</option>
                <option value="Speaking">Speaking</option>
                <option value="Reading">Reading</option>
                <option value="Writing">Writing</option>
                <option value="Grammar">Grammar</option>
                <option value="Vocabulary">Vocabulary</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Level</label>
              <select
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm"
              >
                <option value="">All Levels</option>
                <option value="A1">A1</option>
                <option value="A2">A2</option>
                <option value="B1">B1</option>
                <option value="B2">B2</option>
                <option value="C1">C1</option>
                <option value="C2">C2</option>
              </select>
            </div>
          </div>
        </div>

        {/* Lessons Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {lessons.map((lesson) => (
            <div
              key={lesson.LessonID}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`px-3 py-1 rounded-full text-xs font-medium text-white ${getTypeColor(lesson.Type)}`}>
                    {lesson.Type}
                  </div>
                  <div className={`px-2 py-1 rounded text-xs font-medium ${getLevelColor(lesson.Level)}`}>
                    {lesson.Level}
                  </div>
                </div>

                <h3 className="text-lg font-semibold text-gray-900 mb-2">{lesson.Title}</h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{lesson.Description}</p>

                {lesson.TopicTitle && (
                  <div className="text-xs text-gray-500 mb-4">
                    Topic: {lesson.TopicTitle}
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <div className="flex items-center text-sm text-gray-500">
                    <BookOpen className="w-4 h-4 mr-1" />
                    {lesson.Duration} min
                  </div>
                  <div className="flex items-center">
                    {lesson.VideoLink && (
                      <div className="flex items-center text-sm text-gray-500 mr-3">
                        <Volume2 className="w-4 h-4 mr-1" />
                        Video
                      </div>
                    )}
                    <Star className="w-4 h-4 text-yellow-400" />
                  </div>
                </div>
              </div>

              <div className="px-6 py-3 bg-gray-50 border-t">
                <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors text-sm font-medium">
                  Start Lesson
                </button>
              </div>
            </div>
          ))}
        </div>

        {lessons.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No lessons found</h3>
            <p className="text-gray-600">Try adjusting your filters to see more lessons.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default LessonsPage
