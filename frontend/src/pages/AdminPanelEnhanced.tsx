import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Plus, Edit, Trash2, Save, X, Search, Filter, Upload, Download,
  BookOpen, FileText, Database, Settings, Users, BarChart3,
  ChevronDown, ChevronUp, Eye, EyeOff, Globe, Shield,
  AlertCircle, CheckCircle, Info, Zap, Star, Crown
} from 'lucide-react'

// Interfaces
interface Topic {
  TopicID: number
  Title: string
  Description: string
  Level: string
  Icon: string
  Color: string
  SortOrder: number
  LanguageID: number
  VocabularyCount: number
  LanguageName?: string
  LanguageCode?: string
}

interface Vocabulary {
  WordID: number
  Word: string
  Phonetic?: string
  Type?: string
  Meaning: string
  Example?: string
  Audio?: string
  TopicID: number
  LanguageID: number
  Difficulty: string
  TopicTitle?: string
  LanguageName?: string
  LanguageCode?: string
}

interface Language {
  LanguageID: number
  LanguageName: string
  NativeName: string
  Flag: string
  LanguageCode: string
}

const AdminPanelEnhanced: React.FC = () => {
  // States
  const [topics, setTopics] = useState<Topic[]>([])
  const [vocabulary, setVocabulary] = useState<Vocabulary[]>([])
  const [languages, setLanguages] = useState<Language[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'topics' | 'vocabulary'>('topics')
  const [searchTerm, setSearchTerm] = useState('')
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showImportModal, setShowImportModal] = useState(false)
  const [showBulkDeleteModal, setShowBulkDeleteModal] = useState(false)
  const [editingItem, setEditingItem] = useState<any>(null)
  const [newItem, setNewItem] = useState<any>({})
  const [importFile, setImportFile] = useState<File | null>(null)
  const [importType, setImportType] = useState<'topics' | 'vocabulary'>('vocabulary')
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
      
      console.log('🔄 Loading admin data...')
      
      // Load languages
      await loadLanguages()
      
      // Load topics
      await loadTopics()
      
      // Load vocabulary
      await loadVocabulary()
      
      setLoading(false)
      console.log('✅ Admin data loaded successfully')
    } catch (err) {
      console.error('❌ Error loading admin data:', err)
      setError('Không thể tải dữ liệu')
      setLoading(false)
    }
  }

  const loadLanguages = async () => {
    try {
      const response = await fetch('http://localhost:8000/complete_api.php/api/languages')
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

  const loadTopics = async () => {
    try {
      const response = await fetch('http://localhost:8000/complete_api.php/api/topics')
      if (response.ok) {
        const data = await response.json()
        if (data.success && Array.isArray(data.data)) {
          setTopics(data.data)
          console.log('✅ Topics loaded:', data.data.length)
        }
      }
    } catch (err) {
      console.warn('⚠️ Topics API error:', err)
    }
  }

  const loadVocabulary = async () => {
    try {
      const response = await fetch('http://localhost:8000/complete_api.php/api/vocabulary')
      if (response.ok) {
        const data = await response.json()
        if (data.success && Array.isArray(data.data)) {
          setVocabulary(data.data)
          console.log('✅ Vocabulary loaded:', data.data.length)
        }
      }
    } catch (err) {
      console.warn('⚠️ Vocabulary API error:', err)
    }
  }

  // CRUD Operations
  const handleAdd = async () => {
    try {
      const endpoint = activeTab === 'topics' 
        ? 'http://localhost:8000/complete_api.php/api/topics/create'
        : 'http://localhost:8000/complete_api.php/api/vocabulary/create'
      
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
        alert(`${activeTab === 'topics' ? 'Chủ đề' : 'Từ vựng'} đã được tạo thành công!`)
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
      const endpoint = activeTab === 'topics' 
        ? 'http://localhost:8000/complete_api.php/api/topics/update'
        : 'http://localhost:8000/complete_api.php/api/vocabulary/update'
      
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
        alert(`${activeTab === 'topics' ? 'Chủ đề' : 'Từ vựng'} đã được cập nhật thành công!`)
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
      const endpoint = activeTab === 'topics' 
        ? 'http://localhost:8000/complete_api.php/api/topics/delete'
        : 'http://localhost:8000/complete_api.php/api/vocabulary/delete'
      
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
        alert(`${activeTab === 'topics' ? 'Chủ đề' : 'Từ vựng'} đã được xóa thành công!`)
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

  const handleImport = async () => {
    if (!importFile) {
      alert('Vui lòng chọn file để import!')
      return
    }
    try {
      console.log('🔄 Starting import...', importFile.name, 'Type:', importType)
      const formData = new FormData()
      formData.append('file', importFile)
      
      const endpoint = importType === 'topics' 
        ? 'http://localhost:8000/complete_api.php/api/import/topics'
        : 'http://localhost:8000/complete_api.php/api/import/vocabulary'
      
      console.log('📤 Sending request to:', endpoint)
      const response = await fetch(endpoint, {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      })
      console.log('📥 Response status:', response.status)
      if (response.ok) {
        const result = await response.json()
        console.log('✅ Import successful:', result)
        alert(`Import thành công! Đã import ${result.imported || 0} ${importType === 'topics' ? 'chủ đề' : 'từ vựng'}.`)
        if (result.errors && result.errors.length > 0) {
          console.warn('⚠️ Import warnings:', result.errors)
          alert(`Có ${result.errors.length} dòng bị lỗi. Kiểm tra console để xem chi tiết.`)
        }
        setShowImportModal(false)
        setImportFile(null)
        loadData() // Reload data
      } else {
        const errorText = await response.text()
        console.error('❌ Import failed:', response.status, errorText)
        alert(`Import thất bại: ${response.status} - ${errorText}`)
      }
    } catch (err) {
      console.error('❌ Import error:', err)
      alert(`Lỗi kết nối: ${err.message}`)
    }
  }

  const downloadTemplate = () => {
    const template = importType === 'topics' 
      ? 'http://localhost:8000/templates/topics_template_excel.csv'
      : 'http://localhost:8000/templates/vocabulary_template_excel.csv'
    
    const link = document.createElement('a')
    link.href = template
    link.download = `${importType}_template.csv`
    link.click()
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
      const currentData = activeTab === 'topics' ? topics : vocabulary
      const filteredData = currentData.filter(item => 
        activeTab === 'topics' 
          ? item.Title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.Description.toLowerCase().includes(searchTerm.toLowerCase())
          : item.Word.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.Meaning.toLowerCase().includes(searchTerm.toLowerCase())
      )
      setSelectedItems(filteredData.map(item => 
        activeTab === 'topics' ? item.TopicID : item.WordID
      ))
      setSelectAll(true)
    }
  }

  const handleBulkDelete = async () => {
    try {
      const endpoint = activeTab === 'topics' 
        ? 'http://localhost:8000/complete_api.php/api/topics/delete'
        : 'http://localhost:8000/complete_api.php/api/vocabulary/delete'
      
      const deletePromises = selectedItems.map(id => 
        fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            [activeTab === 'topics' ? 'TopicID' : 'WordID']: id
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
  const filteredTopics = topics.filter(topic => 
    topic.Title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    topic.Description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const filteredVocabulary = vocabulary.filter(vocab => 
    vocab.Word.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vocab.Meaning.toLowerCase().includes(searchTerm.toLowerCase())
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
              <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl">
                <Database className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">Admin Panel</h1>
                <p className="text-purple-200">Quản lý từ vựng và chủ đề</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowImportModal(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg hover:from-green-600 hover:to-emerald-600 transition-all duration-200"
              >
                <Upload className="h-4 w-4" />
                <span>Import Excel</span>
              </button>
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
            onClick={() => setActiveTab('topics')}
            className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
              activeTab === 'topics'
                ? 'bg-white text-purple-900 shadow-lg'
                : 'text-white hover:bg-white/10'
            }`}
          >
            <BookOpen className="h-5 w-5 inline mr-2" />
            Chủ đề ({topics.length})
          </button>
          <button
            onClick={() => setActiveTab('vocabulary')}
            className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
              activeTab === 'vocabulary'
                ? 'bg-white text-purple-900 shadow-lg'
                : 'text-white hover:bg-white/10'
            }`}
          >
            <FileText className="h-5 w-5 inline mr-2" />
            Từ vựng ({vocabulary.length})
          </button>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder={`Tìm kiếm ${activeTab === 'topics' ? 'chủ đề' : 'từ vựng'}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
        </div>

        {/* Data Table */}
        <div className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20 overflow-hidden">
          {activeTab === 'topics' ? (
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
                    <th className="px-6 py-4 text-left text-sm font-medium text-white">Mô tả</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-white">Ngôn ngữ</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-white">Cấp độ</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-white">Số từ</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-white">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {filteredTopics.map((topic) => (
                    <tr key={topic.TopicID} className="hover:bg-white/5">
                      <td className="px-6 py-4 text-sm text-white">
                        <input
                          type="checkbox"
                          checked={selectedItems.includes(topic.TopicID)}
                          onChange={() => handleSelectItem(topic.TopicID)}
                          className="w-4 h-4 rounded border-2 border-gray-300 text-blue-600 focus:ring-blue-500 bg-white"
                        style={{ accentColor: '#3b82f6' }}
                        />
                      </td>
                      <td className="px-6 py-4 text-sm text-white">{topic.TopicID}</td>
                      <td className="px-6 py-4 text-sm text-white font-medium">{topic.Title}</td>
                      <td className="px-6 py-4 text-sm text-gray-300">{topic.Description}</td>
                      <td className="px-6 py-4 text-sm text-white">{topic.LanguageName}</td>
                      <td className="px-6 py-4 text-sm text-white">{topic.Level}</td>
                      <td className="px-6 py-4 text-sm text-white">{topic.VocabularyCount}</td>
                      <td className="px-6 py-4 text-sm">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => {
                              setEditingItem(topic)
                              setShowEditModal(true)
                            }}
                            className="p-2 text-blue-400 hover:text-blue-300 hover:bg-blue-500/20 rounded-lg transition-all duration-200"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => {
                              setEditingItem(topic)
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
                    <th className="px-6 py-4 text-left text-sm font-medium text-white">Từ</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-white">Nghĩa</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-white">Chủ đề</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-white">Ngôn ngữ</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-white">Độ khó</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-white">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {filteredVocabulary.map((vocab) => (
                    <tr key={vocab.WordID} className="hover:bg-white/5">
                      <td className="px-6 py-4 text-sm text-white">
                        <input
                          type="checkbox"
                          checked={selectedItems.includes(vocab.WordID)}
                          onChange={() => handleSelectItem(vocab.WordID)}
                          className="w-4 h-4 rounded border-2 border-gray-300 text-blue-600 focus:ring-blue-500 bg-white"
                        style={{ accentColor: '#3b82f6' }}
                        />
                      </td>
                      <td className="px-6 py-4 text-sm text-white">{vocab.WordID}</td>
                      <td className="px-6 py-4 text-sm text-white font-medium">{vocab.Word}</td>
                      <td className="px-6 py-4 text-sm text-gray-300">{vocab.Meaning}</td>
                      <td className="px-6 py-4 text-sm text-white">{vocab.TopicTitle}</td>
                      <td className="px-6 py-4 text-sm text-white">{vocab.LanguageName}</td>
                      <td className="px-6 py-4 text-sm text-white">{vocab.Difficulty}</td>
                      <td className="px-6 py-4 text-sm">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => {
                              setEditingItem(vocab)
                              setShowEditModal(true)
                            }}
                            className="p-2 text-blue-400 hover:text-blue-300 hover:bg-blue-500/20 rounded-lg transition-all duration-200"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => {
                              setEditingItem(vocab)
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
              className="bg-white rounded-xl p-6 w-full max-w-md mx-4"
            >
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Thêm {activeTab === 'topics' ? 'chủ đề' : 'từ vựng'} mới
              </h3>
              
              {activeTab === 'topics' ? (
                <div className="space-y-4">
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
                    <label className="block text-sm font-medium text-gray-700 mb-2">Tiêu đề</label>
                    <input
                      type="text"
                      value={newItem.Title || ''}
                      onChange={(e) => setNewItem({...newItem, Title: e.target.value})}
                      className="w-full p-3 border rounded-lg"
                      placeholder="Nhập tiêu đề chủ đề"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Mô tả</label>
                    <textarea
                      value={newItem.Description || ''}
                      onChange={(e) => setNewItem({...newItem, Description: e.target.value})}
                      className="w-full p-3 border rounded-lg"
                      rows={3}
                      placeholder="Nhập mô tả chủ đề"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Cấp độ</label>
                    <select
                      value={newItem.Level || 'A1'}
                      onChange={(e) => setNewItem({...newItem, Level: e.target.value})}
                      className="w-full p-3 border rounded-lg"
                    >
                      <option value="A1">A1</option>
                      <option value="A2">A2</option>
                      <option value="B1">B1</option>
                      <option value="B2">B2</option>
                      <option value="C1">C1</option>
                      <option value="C2">C2</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Icon</label>
                    <input
                      type="text"
                      value={newItem.Icon || '📚'}
                      onChange={(e) => setNewItem({...newItem, Icon: e.target.value})}
                      className="w-full p-3 border rounded-lg"
                      placeholder="📚"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Màu sắc</label>
                    <input
                      type="color"
                      value={newItem.Color || '#3B82F6'}
                      onChange={(e) => setNewItem({...newItem, Color: e.target.value})}
                      className="w-full p-3 border rounded-lg"
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Từ</label>
                    <input
                      type="text"
                      value={newItem.Word || ''}
                      onChange={(e) => setNewItem({...newItem, Word: e.target.value})}
                      className="w-full p-3 border rounded-lg"
                      placeholder="Nhập từ vựng"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Nghĩa</label>
                    <input
                      type="text"
                      value={newItem.Meaning || ''}
                      onChange={(e) => setNewItem({...newItem, Meaning: e.target.value})}
                      className="w-full p-3 border rounded-lg"
                      placeholder="Nhập nghĩa"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Chủ đề</label>
                    <select
                      value={newItem.TopicID || ''}
                      onChange={(e) => setNewItem({...newItem, TopicID: parseInt(e.target.value)})}
                      className="w-full p-3 border rounded-lg"
                    >
                      <option value="">Chọn chủ đề</option>
                      {topics.map(topic => (
                        <option key={topic.TopicID} value={topic.TopicID}>
                          {topic.Title} ({topic.LanguageName})
                        </option>
                      ))}
                    </select>
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
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phát âm</label>
                    <input
                      type="text"
                      value={newItem.Phonetic || ''}
                      onChange={(e) => setNewItem({...newItem, Phonetic: e.target.value})}
                      className="w-full p-3 border rounded-lg"
                      placeholder="Nhập phát âm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Loại từ</label>
                    <input
                      type="text"
                      value={newItem.Type || ''}
                      onChange={(e) => setNewItem({...newItem, Type: e.target.value})}
                      className="w-full p-3 border rounded-lg"
                      placeholder="Noun, Verb, Adjective..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Ví dụ</label>
                    <textarea
                      value={newItem.Example || ''}
                      onChange={(e) => setNewItem({...newItem, Example: e.target.value})}
                      className="w-full p-3 border rounded-lg"
                      rows={2}
                      placeholder="Nhập ví dụ"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Độ khó</label>
                    <select
                      value={newItem.Difficulty || 'Easy'}
                      onChange={(e) => setNewItem({...newItem, Difficulty: e.target.value})}
                      className="w-full p-3 border rounded-lg"
                    >
                      <option value="Easy">Dễ</option>
                      <option value="Medium">Trung bình</option>
                      <option value="Hard">Khó</option>
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
              className="bg-white rounded-xl p-6 w-full max-w-md mx-4"
            >
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Chỉnh sửa {activeTab === 'topics' ? 'chủ đề' : 'từ vựng'}
              </h3>
              
              {activeTab === 'topics' ? (
                <div className="space-y-4">
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
                    <label className="block text-sm font-medium text-gray-700 mb-2">Tiêu đề</label>
                    <input
                      type="text"
                      value={editingItem?.Title || ''}
                      onChange={(e) => setEditingItem({...editingItem, Title: e.target.value})}
                      className="w-full p-3 border rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Mô tả</label>
                    <textarea
                      value={editingItem?.Description || ''}
                      onChange={(e) => setEditingItem({...editingItem, Description: e.target.value})}
                      className="w-full p-3 border rounded-lg"
                      rows={3}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Cấp độ</label>
                    <select
                      value={editingItem?.Level || 'A1'}
                      onChange={(e) => setEditingItem({...editingItem, Level: e.target.value})}
                      className="w-full p-3 border rounded-lg"
                    >
                      <option value="A1">A1</option>
                      <option value="A2">A2</option>
                      <option value="B1">B1</option>
                      <option value="B2">B2</option>
                      <option value="C1">C1</option>
                      <option value="C2">C2</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Icon</label>
                    <input
                      type="text"
                      value={editingItem?.Icon || '📚'}
                      onChange={(e) => setEditingItem({...editingItem, Icon: e.target.value})}
                      className="w-full p-3 border rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Màu sắc</label>
                    <input
                      type="color"
                      value={editingItem?.Color || '#3B82F6'}
                      onChange={(e) => setEditingItem({...editingItem, Color: e.target.value})}
                      className="w-full p-3 border rounded-lg"
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Từ</label>
                    <input
                      type="text"
                      value={editingItem?.Word || ''}
                      onChange={(e) => setEditingItem({...editingItem, Word: e.target.value})}
                      className="w-full p-3 border rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Nghĩa</label>
                    <input
                      type="text"
                      value={editingItem?.Meaning || ''}
                      onChange={(e) => setEditingItem({...editingItem, Meaning: e.target.value})}
                      className="w-full p-3 border rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Chủ đề</label>
                    <select
                      value={editingItem?.TopicID || ''}
                      onChange={(e) => setEditingItem({...editingItem, TopicID: parseInt(e.target.value)})}
                      className="w-full p-3 border rounded-lg"
                    >
                      {topics.map(topic => (
                        <option key={topic.TopicID} value={topic.TopicID}>
                          {topic.Title} ({topic.LanguageName})
                        </option>
                      ))}
                    </select>
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
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phát âm</label>
                    <input
                      type="text"
                      value={editingItem?.Phonetic || ''}
                      onChange={(e) => setEditingItem({...editingItem, Phonetic: e.target.value})}
                      className="w-full p-3 border rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Loại từ</label>
                    <input
                      type="text"
                      value={editingItem?.Type || ''}
                      onChange={(e) => setEditingItem({...editingItem, Type: e.target.value})}
                      className="w-full p-3 border rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Ví dụ</label>
                    <textarea
                      value={editingItem?.Example || ''}
                      onChange={(e) => setEditingItem({...editingItem, Example: e.target.value})}
                      className="w-full p-3 border rounded-lg"
                      rows={2}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Độ khó</label>
                    <select
                      value={editingItem?.Difficulty || 'Easy'}
                      onChange={(e) => setEditingItem({...editingItem, Difficulty: e.target.value})}
                      className="w-full p-3 border rounded-lg"
                    >
                      <option value="Easy">Dễ</option>
                      <option value="Medium">Trung bình</option>
                      <option value="Hard">Khó</option>
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
                Bạn có chắc chắn muốn xóa {activeTab === 'topics' ? 'chủ đề' : 'từ vựng'} này không?
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

      {/* Import Modal */}
      <AnimatePresence>
        {showImportModal && (
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
                Import từ Excel
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Loại import</label>
                  <select
                    value={importType}
                    onChange={(e) => setImportType(e.target.value as 'topics' | 'vocabulary')}
                    className="w-full p-3 border rounded-lg"
                  >
                    <option value="topics">Chủ đề</option>
                    <option value="vocabulary">Từ vựng</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">File Excel/CSV</label>
                  <input
                    type="file"
                    accept=".csv,.xlsx,.xls"
                    onChange={(e) => setImportFile(e.target.files?.[0] || null)}
                    className="w-full p-3 border rounded-lg"
                  />
                </div>
                
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <strong>Lưu ý:</strong> File phải có định dạng CSV với header đúng. 
                    <button
                      onClick={downloadTemplate}
                      className="text-blue-600 hover:text-blue-800 underline ml-1"
                    >
                      Tải template mẫu
                    </button>
                  </p>
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowImportModal(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Hủy
                </button>
                <button
                  onClick={() => handleImport()}
                  className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                >
                  Import
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

export default AdminPanelEnhanced
