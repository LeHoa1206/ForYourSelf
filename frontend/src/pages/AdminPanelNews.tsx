import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Plus, Edit, Trash2, Save, X, Search, Filter, Upload, Download,
  BookOpen, FileText, Database, Settings, Users, BarChart3,
  ChevronDown, ChevronUp, Eye, EyeOff, Globe, Shield,
  AlertCircle, CheckCircle, Info, Zap, Star, Crown,
  Newspaper, Calendar, Clock, Hash, Tag, ExternalLink
} from 'lucide-react'

// Interfaces
interface NewsArticle {
  ArticleID: number
  Title: string
  Content: string
  Summary?: string
  Category?: string
  DifficultyLevel: string
  ReadingTime?: number
  WordCount?: number
  IsActive: number
  PublishedAt?: string
  CreatedAt: string
  UpdatedAt: string
  SourceName?: string
  LanguageName?: string
  LanguageCode?: string
}

interface NewsSource {
  SourceID: number
  SourceName: string
  SourceURL?: string
  LanguageID?: number
  Category?: string
  IsActive: number
  CreatedAt: string
}

interface Language {
  LanguageID: number
  LanguageName: string
  NativeName: string
  Flag: string
  LanguageCode: string
}

const AdminPanelNews: React.FC = () => {
  // States
  const [articles, setArticles] = useState<NewsArticle[]>([])
  const [sources, setSources] = useState<NewsSource[]>([])
  const [languages, setLanguages] = useState<Language[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'articles' | 'sources'>('articles')
  const [searchTerm, setSearchTerm] = useState('')
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showBulkDeleteModal, setShowBulkDeleteModal] = useState(false)
  const [editingItem, setEditingItem] = useState<any>(null)
  const [newItem, setNewItem] = useState<any>({})
  const [selectedItems, setSelectedItems] = useState<number[]>([])
  const [selectAll, setSelectAll] = useState(false)

  // Load data
  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      console.log('🔄 Loading news admin data...')
      
      // Load languages
      await loadLanguages()
      
      // Load articles
      await loadArticles()
      
      // Load sources
      await loadSources()
      
      setLoading(false)
      console.log('✅ News admin data loaded successfully')
    } catch (err) {
      console.error('❌ Error loading news admin data:', err)
      setError('Không thể tải dữ liệu')
      setLoading(false)
    }
  }

  const loadLanguages = async () => {
    try {
      const response = await fetch('http://localhost:8000/news_admin_api.php/api/news/languages')
      if (response.ok) {
        const data = await response.json()
        if (data.success && Array.isArray(data.data)) {
          setLanguages(data.data)
          console.log('✅ Languages loaded:', data.data.length)
        }
      }
    } catch (err) {
      console.warn('⚠️ Languages API error:', err)
    }
  }

  const loadArticles = async () => {
    try {
      const response = await fetch('http://localhost:8000/news_admin_api.php/api/news/articles')
      if (response.ok) {
        const data = await response.json()
        if (data.success && Array.isArray(data.data)) {
          setArticles(data.data)
          console.log('✅ Articles loaded:', data.data.length)
        }
      }
    } catch (err) {
      console.warn('⚠️ Articles API error:', err)
    }
  }

  const loadSources = async () => {
    try {
      const response = await fetch('http://localhost:8000/news_admin_api.php/api/news/sources')
      if (response.ok) {
        const data = await response.json()
        if (data.success && Array.isArray(data.data)) {
          setSources(data.data)
          console.log('✅ Sources loaded:', data.data.length)
        }
      }
    } catch (err) {
      console.warn('⚠️ Sources API error:', err)
    }
  }

  // CRUD Operations
  const handleAdd = async () => {
    try {
      const endpoint = activeTab === 'articles' 
        ? 'http://localhost:8000/news_admin_api.php/api/news/articles/create'
        : 'http://localhost:8000/news_admin_api.php/api/news/sources/create'
      
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newItem)
      })
      
      if (response.ok) {
        const result = await response.json()
        console.log('✅ Item created:', result)
        alert(`${activeTab === 'articles' ? 'Bài báo' : 'Nguồn tin'} đã được tạo thành công!`)
        setShowAddModal(false)
        setNewItem({})
        loadData()
      } else {
        const error = await response.json()
        alert(`Lỗi: ${error.error}`)
      }
    } catch (err) {
      console.error('❌ Error creating item:', err)
      alert('Lỗi khi tạo item')
    }
  }

  const handleEdit = async () => {
    try {
      const endpoint = activeTab === 'articles' 
        ? 'http://localhost:8000/news_admin_api.php/api/news/articles/update'
        : 'http://localhost:8000/news_admin_api.php/api/news/sources/update'
      
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editingItem)
      })
      
      if (response.ok) {
        const result = await response.json()
        console.log('✅ Item updated:', result)
        alert(`${activeTab === 'articles' ? 'Bài báo' : 'Nguồn tin'} đã được cập nhật thành công!`)
        setShowEditModal(false)
        setEditingItem(null)
        loadData()
      } else {
        const error = await response.json()
        alert(`Lỗi: ${error.error}`)
      }
    } catch (err) {
      console.error('❌ Error updating item:', err)
      alert('Lỗi khi cập nhật item')
    }
  }

  const handleDelete = async () => {
    try {
      const endpoint = activeTab === 'articles' 
        ? 'http://localhost:8000/news_admin_api.php/api/news/articles/delete'
        : 'http://localhost:8000/news_admin_api.php/api/news/sources/delete'
      
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editingItem)
      })
      
      if (response.ok) {
        const result = await response.json()
        console.log('✅ Item deleted:', result)
        alert(`${activeTab === 'articles' ? 'Bài báo' : 'Nguồn tin'} đã được xóa thành công!`)
        setShowDeleteModal(false)
        setEditingItem(null)
        loadData()
      } else {
        const error = await response.json()
        alert(`Lỗi: ${error.error}`)
      }
    } catch (err) {
      console.error('❌ Error deleting item:', err)
      alert('Lỗi khi xóa item')
    }
  }

  // Bulk operations
  const handleSelectItem = (id: number) => {
    setSelectedItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    )
  }

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedItems([])
      setSelectAll(false)
    } else {
      const currentData = activeTab === 'articles' ? articles : sources
      const filteredData = currentData.filter(item => 
        activeTab === 'articles' 
          ? item.Title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (item.Summary && item.Summary.toLowerCase().includes(searchTerm.toLowerCase()))
          : item.SourceName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (item.Category && item.Category.toLowerCase().includes(searchTerm.toLowerCase()))
      )
      setSelectedItems(filteredData.map(item => 
        activeTab === 'articles' ? item.ArticleID : item.SourceID
      ))
      setSelectAll(true)
    }
  }

  const handleBulkDelete = async () => {
    try {
      const endpoint = activeTab === 'articles' 
        ? 'http://localhost:8000/news_admin_api.php/api/news/articles/delete'
        : 'http://localhost:8000/news_admin_api.php/api/news/sources/delete'
      
      const deletePromises = selectedItems.map(id => 
        fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            [activeTab === 'articles' ? 'ArticleID' : 'SourceID']: id
          })
        })
      )

      await Promise.all(deletePromises)
      
      // Reload data
      await loadData()
      
      // Clear selections
      setSelectedItems([])
      setSelectAll(false)
      setShowBulkDeleteModal(false)
      
      alert(`Đã xóa thành công ${selectedItems.length} mục`)
    } catch (err) {
      console.error('❌ Bulk delete error:', err)
      alert('Lỗi khi xóa hàng loạt')
    }
  }

  // Filter data
  const filteredArticles = articles.filter(article => 
    article.Title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (article.Summary && article.Summary.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (article.Category && article.Category.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  const filteredSources = sources.filter(source => 
    source.SourceName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (source.Category && source.Category.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white mx-auto"></div>
          <p className="text-white text-xl mt-4">Đang tải dữ liệu...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <div className="bg-white/10 backdrop-blur-md border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl">
                <Newspaper className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">News Admin Panel</h1>
                <p className="text-blue-200">Quản lý bài báo và nguồn tin</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowAddModal(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg hover:from-blue-600 hover:to-cyan-600 transition-all duration-200"
              >
                <Plus className="h-4 w-4" />
                <span>Thêm mới</span>
              </button>

              {selectedItems.length > 0 && (
                <button
                  onClick={() => setShowBulkDeleteModal(true)}
                  className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-lg hover:from-red-600 hover:to-pink-600 transition-all duration-200"
                >
                  <Trash2 className="h-4 w-4" />
                  <span>Xóa ({selectedItems.length})</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="flex space-x-1 mb-8">
          <button
            onClick={() => setActiveTab('articles')}
            className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
              activeTab === 'articles'
                ? 'bg-white text-blue-900 shadow-lg'
                : 'text-white hover:bg-white/10'
            }`}
          >
            <Newspaper className="h-5 w-5 inline mr-2" />
            Bài báo ({articles.length})
          </button>
          <button
            onClick={() => setActiveTab('sources')}
            className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
              activeTab === 'sources'
                ? 'bg-white text-blue-900 shadow-lg'
                : 'text-white hover:bg-white/10'
            }`}
          >
            <Globe className="h-5 w-5 inline mr-2" />
            Nguồn tin ({sources.length})
          </button>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder={`Tìm kiếm ${activeTab === 'articles' ? 'bài báo' : 'nguồn tin'}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Data Table */}
        <div className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20 overflow-hidden">
          {activeTab === 'articles' ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-white/5">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-medium text-white">
                      <input
                        type="checkbox"
                        checked={selectAll}
                        onChange={handleSelectAll}
                        className="w-4 h-4 rounded border-2 border-gray-300 text-blue-600 focus:ring-blue-500 bg-white"
                        style={{ accentColor: '#3b82f6' }}
                      />
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-white">ID</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-white">Tiêu đề</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-white">Tóm tắt</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-white">Nguồn</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-white">Ngôn ngữ</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-white">Độ khó</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-white">Thời gian</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-white">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {filteredArticles.map((article) => (
                    <tr key={article.ArticleID} className="hover:bg-white/5">
                      <td className="px-6 py-4 text-sm text-white">
                        <input
                          type="checkbox"
                          checked={selectedItems.includes(article.ArticleID)}
                          onChange={() => handleSelectItem(article.ArticleID)}
                          className="w-4 h-4 rounded border-2 border-gray-300 text-blue-600 focus:ring-blue-500 bg-white"
                          style={{ accentColor: '#3b82f6' }}
                        />
                      </td>
                      <td className="px-6 py-4 text-sm text-white">{article.ArticleID}</td>
                      <td className="px-6 py-4 text-sm text-white font-medium max-w-xs truncate">
                        {article.Title}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-300 max-w-xs truncate">
                        {article.Summary || 'Không có tóm tắt'}
                      </td>
                      <td className="px-6 py-4 text-sm text-white">{article.SourceName}</td>
                      <td className="px-6 py-4 text-sm text-white">{article.LanguageName}</td>
                      <td className="px-6 py-4 text-sm text-white">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          article.DifficultyLevel === 'Beginner' ? 'bg-green-100 text-green-800' :
                          article.DifficultyLevel === 'Intermediate' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {article.DifficultyLevel}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-white">
                        {article.ReadingTime ? `${article.ReadingTime} phút` : 'N/A'}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => {
                              setEditingItem(article)
                              setShowEditModal(true)
                            }}
                            className="p-2 text-blue-400 hover:text-blue-300 hover:bg-blue-500/20 rounded-lg transition-all duration-200"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => {
                              setEditingItem(article)
                              setShowDeleteModal(true)
                            }}
                            className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/20 rounded-lg transition-all duration-200"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-white/5">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-medium text-white">
                      <input
                        type="checkbox"
                        checked={selectAll}
                        onChange={handleSelectAll}
                        className="w-4 h-4 rounded border-2 border-gray-300 text-blue-600 focus:ring-blue-500 bg-white"
                        style={{ accentColor: '#3b82f6' }}
                      />
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-white">ID</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-white">Tên nguồn</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-white">URL</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-white">Danh mục</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-white">Trạng thái</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-white">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {filteredSources.map((source) => (
                    <tr key={source.SourceID} className="hover:bg-white/5">
                      <td className="px-6 py-4 text-sm text-white">
                        <input
                          type="checkbox"
                          checked={selectedItems.includes(source.SourceID)}
                          onChange={() => handleSelectItem(source.SourceID)}
                          className="w-4 h-4 rounded border-2 border-gray-300 text-blue-600 focus:ring-blue-500 bg-white"
                          style={{ accentColor: '#3b82f6' }}
                        />
                      </td>
                      <td className="px-6 py-4 text-sm text-white">{source.SourceID}</td>
                      <td className="px-6 py-4 text-sm text-white font-medium">{source.SourceName}</td>
                      <td className="px-6 py-4 text-sm text-gray-300 max-w-xs truncate">
                        {source.SourceURL ? (
                          <a href={source.SourceURL} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300">
                            {source.SourceURL}
                          </a>
                        ) : 'N/A'}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-300">
                        {source.Category || 'N/A'}
                      </td>
                      <td className="px-6 py-4 text-sm text-white">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          source.IsActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {source.IsActive ? 'Hoạt động' : 'Không hoạt động'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => {
                              setEditingItem(source)
                              setShowEditModal(true)
                            }}
                            className="p-2 text-blue-400 hover:text-blue-300 hover:bg-blue-500/20 rounded-lg transition-all duration-200"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => {
                              setEditingItem(source)
                              setShowDeleteModal(true)
                            }}
                            className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/20 rounded-lg transition-all duration-200"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Add Modal */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto"
            >
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Thêm {activeTab === 'articles' ? 'bài báo' : 'nguồn tin'} mới
              </h3>
              
              {activeTab === 'articles' ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Tiêu đề *</label>
                    <input
                      type="text"
                      value={newItem.Title || ''}
                      onChange={(e) => setNewItem({...newItem, Title: e.target.value})}
                      className="w-full p-3 border rounded-lg"
                      placeholder="Nhập tiêu đề bài báo"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Nội dung *</label>
                    <textarea
                      value={newItem.Content || ''}
                      onChange={(e) => setNewItem({...newItem, Content: e.target.value})}
                      className="w-full p-3 border rounded-lg"
                      rows={6}
                      placeholder="Nhập nội dung bài báo"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Tóm tắt</label>
                    <textarea
                      value={newItem.Summary || ''}
                      onChange={(e) => setNewItem({...newItem, Summary: e.target.value})}
                      className="w-full p-3 border rounded-lg"
                      rows={3}
                      placeholder="Nhập tóm tắt bài báo"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Nguồn tin *</label>
                      <select
                        value={newItem.SourceID || ''}
                        onChange={(e) => setNewItem({...newItem, SourceID: parseInt(e.target.value)})}
                        className="w-full p-3 border rounded-lg"
                      >
                        <option value="">Chọn nguồn tin</option>
                        {sources.map(source => (
                          <option key={source.SourceID} value={source.SourceID}>
                            {source.SourceName}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Ngôn ngữ *</label>
                      <select
                        value={newItem.LanguageID || ''}
                        onChange={(e) => setNewItem({...newItem, LanguageID: parseInt(e.target.value)})}
                        className="w-full p-3 border rounded-lg"
                      >
                        <option value="">Chọn ngôn ngữ</option>
                        {languages.map(lang => (
                          <option key={lang.LanguageID} value={lang.LanguageID}>
                            {lang.LanguageName}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Danh mục</label>
                      <input
                        type="text"
                        value={newItem.Category || ''}
                        onChange={(e) => setNewItem({...newItem, Category: e.target.value})}
                        className="w-full p-3 border rounded-lg"
                        placeholder="Ví dụ: Technology, Sports, Politics"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Độ khó</label>
                      <select
                        value={newItem.DifficultyLevel || 'Intermediate'}
                        onChange={(e) => setNewItem({...newItem, DifficultyLevel: e.target.value})}
                        className="w-full p-3 border rounded-lg"
                      >
                        <option value="Beginner">Beginner</option>
                        <option value="Intermediate">Intermediate</option>
                        <option value="Advanced">Advanced</option>
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Thời gian đọc (phút)</label>
                      <input
                        type="number"
                        value={newItem.ReadingTime || ''}
                        onChange={(e) => setNewItem({...newItem, ReadingTime: parseInt(e.target.value)})}
                        className="w-full p-3 border rounded-lg"
                        placeholder="5"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Số từ</label>
                      <input
                        type="number"
                        value={newItem.WordCount || ''}
                        onChange={(e) => setNewItem({...newItem, WordCount: parseInt(e.target.value)})}
                        className="w-full p-3 border rounded-lg"
                        placeholder="500"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Tên nguồn *</label>
                    <input
                      type="text"
                      value={newItem.SourceName || ''}
                      onChange={(e) => setNewItem({...newItem, SourceName: e.target.value})}
                      className="w-full p-3 border rounded-lg"
                      placeholder="Ví dụ: BBC News, CNN, VnExpress"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">URL</label>
                    <input
                      type="url"
                      value={newItem.SourceURL || ''}
                      onChange={(e) => setNewItem({...newItem, SourceURL: e.target.value})}
                      className="w-full p-3 border rounded-lg"
                      placeholder="https://example.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Danh mục</label>
                    <input
                      type="text"
                      value={newItem.Category || ''}
                      onChange={(e) => setNewItem({...newItem, Category: e.target.value})}
                      className="w-full p-3 border rounded-lg"
                      placeholder="Ví dụ: International, Local, Technology"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Ngôn ngữ</label>
                    <select
                      value={newItem.LanguageID || ''}
                      onChange={(e) => setNewItem({...newItem, LanguageID: parseInt(e.target.value)})}
                      className="w-full p-3 border rounded-lg"
                    >
                      <option value="">Chọn ngôn ngữ</option>
                      {languages.map(lang => (
                        <option key={lang.LanguageID} value={lang.LanguageID}>
                          {lang.LanguageName}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Trạng thái</label>
                    <select
                      value={newItem.IsActive ?? 1}
                      onChange={(e) => setNewItem({...newItem, IsActive: parseInt(e.target.value)})}
                      className="w-full p-3 border rounded-lg"
                    >
                      <option value={1}>Hoạt động</option>
                      <option value={0}>Không hoạt động</option>
                    </select>
                  </div>
                </div>
              )}
              
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Hủy
                </button>
                <button
                  onClick={handleAdd}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Thêm
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit Modal */}
      <AnimatePresence>
        {showEditModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto"
            >
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Chỉnh sửa {activeTab === 'articles' ? 'bài báo' : 'nguồn tin'}
              </h3>
              
              {activeTab === 'articles' ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Tiêu đề *</label>
                    <input
                      type="text"
                      value={editingItem?.Title || ''}
                      onChange={(e) => setEditingItem({...editingItem, Title: e.target.value})}
                      className="w-full p-3 border rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Nội dung *</label>
                    <textarea
                      value={editingItem?.Content || ''}
                      onChange={(e) => setEditingItem({...editingItem, Content: e.target.value})}
                      className="w-full p-3 border rounded-lg"
                      rows={6}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Tóm tắt</label>
                    <textarea
                      value={editingItem?.Summary || ''}
                      onChange={(e) => setEditingItem({...editingItem, Summary: e.target.value})}
                      className="w-full p-3 border rounded-lg"
                      rows={3}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Nguồn tin *</label>
                      <select
                        value={editingItem?.SourceID || ''}
                        onChange={(e) => setEditingItem({...editingItem, SourceID: parseInt(e.target.value)})}
                        className="w-full p-3 border rounded-lg"
                      >
                        {sources.map(source => (
                          <option key={source.SourceID} value={source.SourceID}>
                            {source.SourceName}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Ngôn ngữ *</label>
                      <select
                        value={editingItem?.LanguageID || ''}
                        onChange={(e) => setEditingItem({...editingItem, LanguageID: parseInt(e.target.value)})}
                        className="w-full p-3 border rounded-lg"
                      >
                        {languages.map(lang => (
                          <option key={lang.LanguageID} value={lang.LanguageID}>
                            {lang.LanguageName}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Danh mục</label>
                      <input
                        type="text"
                        value={editingItem?.Category || ''}
                        onChange={(e) => setEditingItem({...editingItem, Category: e.target.value})}
                        className="w-full p-3 border rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Độ khó</label>
                      <select
                        value={editingItem?.DifficultyLevel || 'Intermediate'}
                        onChange={(e) => setEditingItem({...editingItem, DifficultyLevel: e.target.value})}
                        className="w-full p-3 border rounded-lg"
                      >
                        <option value="Beginner">Beginner</option>
                        <option value="Intermediate">Intermediate</option>
                        <option value="Advanced">Advanced</option>
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Thời gian đọc (phút)</label>
                      <input
                        type="number"
                        value={editingItem?.ReadingTime || ''}
                        onChange={(e) => setEditingItem({...editingItem, ReadingTime: parseInt(e.target.value)})}
                        className="w-full p-3 border rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Số từ</label>
                      <input
                        type="number"
                        value={editingItem?.WordCount || ''}
                        onChange={(e) => setEditingItem({...editingItem, WordCount: parseInt(e.target.value)})}
                        className="w-full p-3 border rounded-lg"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Tên nguồn *</label>
                    <input
                      type="text"
                      value={editingItem?.SourceName || ''}
                      onChange={(e) => setEditingItem({...editingItem, SourceName: e.target.value})}
                      className="w-full p-3 border rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">URL</label>
                    <input
                      type="url"
                      value={editingItem?.SourceURL || ''}
                      onChange={(e) => setEditingItem({...editingItem, SourceURL: e.target.value})}
                      className="w-full p-3 border rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Danh mục</label>
                    <input
                      type="text"
                      value={editingItem?.Category || ''}
                      onChange={(e) => setEditingItem({...editingItem, Category: e.target.value})}
                      className="w-full p-3 border rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Ngôn ngữ</label>
                    <select
                      value={editingItem?.LanguageID || ''}
                      onChange={(e) => setEditingItem({...editingItem, LanguageID: parseInt(e.target.value)})}
                      className="w-full p-3 border rounded-lg"
                    >
                      {languages.map(lang => (
                        <option key={lang.LanguageID} value={lang.LanguageID}>
                          {lang.LanguageName}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Trạng thái</label>
                    <select
                      value={editingItem?.IsActive ?? 1}
                      onChange={(e) => setEditingItem({...editingItem, IsActive: parseInt(e.target.value)})}
                      className="w-full p-3 border rounded-lg"
                    >
                      <option value={1}>Hoạt động</option>
                      <option value={0}>Không hoạt động</option>
                    </select>
                  </div>
                </div>
              )}
              
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Hủy
                </button>
                <button
                  onClick={handleEdit}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Cập nhật
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Modal */}
      <AnimatePresence>
        {showDeleteModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl p-6 w-full max-w-md mx-4"
            >
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Xác nhận xóa
              </h3>
              <p className="text-gray-600 mb-6">
                Bạn có chắc chắn muốn xóa {activeTab === 'articles' ? 'bài báo' : 'nguồn tin'} này không?
              </p>
              
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Hủy
                </button>
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                >
                  Xóa
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bulk Delete Modal */}
      {showBulkDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-red-100 rounded-full">
                <Trash2 className="w-5 h-5 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">
                Xác nhận xóa hàng loạt
              </h3>
            </div>
            
            <p className="text-gray-600 mb-6">
              Bạn có chắc chắn muốn xóa <span className="font-semibold text-red-600">{selectedItems.length}</span> mục đã chọn không? 
              Hành động này không thể hoàn tác.
            </p>
            
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowBulkDeleteModal(false)}
                className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={handleBulkDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Xóa {selectedItems.length} mục
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminPanelNews
