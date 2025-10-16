import React, { useState, useEffect } from 'react'
import { BookOpen, Search, Filter, Star, Clock, ArrowRight } from 'lucide-react'

interface GrammarRule {
  RuleID: number
  Title: string
  Explanation: string
  Examples: string
  Level: string
  Category: string
}

const GrammarPage: React.FC = () => {
  const [grammarRules, setGrammarRules] = useState<GrammarRule[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedLevel, setSelectedLevel] = useState('')
  const [selectedRule, setSelectedRule] = useState<GrammarRule | null>(null)

  useEffect(() => {
    fetchGrammarRules()
  }, [searchTerm, selectedLevel])

  const fetchGrammarRules = async () => {
    try {
      const params = new URLSearchParams()
      if (selectedLevel) params.append('level', selectedLevel)
      if (searchTerm) params.append('search', searchTerm)

      const response = await fetch(`http://localhost:8000/api/grammar?${params.toString()}`)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const result = await response.json()
      if (result.success) {
        setGrammarRules(result.data)
      } else {
        setError(result.message || 'Failed to fetch grammar rules')
      }
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Beginner': return '#10b981'
      case 'Intermediate': return '#3b82f6'
      case 'Advanced': return '#ef4444'
      default: return '#6b7280'
    }
  }

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '50px',
            height: '50px',
            border: '5px solid rgba(255,255,255,0.3)',
            borderTop: '5px solid white',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 20px'
          }}></div>
          <p style={{ fontSize: '1.2rem' }}>Đang tải ngữ pháp...</p>
        </div>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    )
  }

  if (error) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        padding: '20px'
      }}>
        <div style={{
          background: 'rgba(239, 68, 68, 0.2)',
          padding: '30px',
          borderRadius: '20px',
          textAlign: 'center',
          border: '2px solid #ef4444'
        }}>
          <h2 style={{ color: '#ef4444', marginBottom: '20px' }}>❌ Lỗi tải dữ liệu</h2>
          <p style={{ marginBottom: '20px' }}>{error}</p>
          <button
            onClick={fetchGrammarRules}
            style={{
              background: 'rgba(255, 255, 255, 0.2)',
              padding: '12px 24px',
              borderRadius: '25px',
              border: '2px solid white',
              color: 'white',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            Thử lại
          </button>
        </div>
      </div>
    )
  }

  if (selectedRule) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        fontFamily: 'Arial, sans-serif',
        padding: '100px 20px 20px'
      }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <button
            onClick={() => setSelectedRule(null)}
            style={{
              marginBottom: '30px',
              background: 'rgba(255, 255, 255, 0.2)',
              padding: '12px 24px',
              borderRadius: '25px',
              border: '2px solid rgba(255, 255, 255, 0.3)',
              color: 'white',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            ← Quay lại
          </button>

          <div style={{
            background: 'rgba(255, 255, 255, 0.1)',
            padding: '40px',
            borderRadius: '20px',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
          }}>
            <h1 style={{ fontSize: '2.5rem', marginBottom: '20px', color: '#00ff88' }}>
              {selectedRule.Title}
            </h1>
            
            <div style={{
              background: `rgba(${getLevelColor(selectedRule.Level).replace('#', '')}, 0.2)`,
              padding: '8px 16px',
              borderRadius: '20px',
              border: `2px solid ${getLevelColor(selectedRule.Level)}`,
              fontWeight: 'bold',
              display: 'inline-block',
              marginBottom: '30px'
            }}>
              {selectedRule.Level}
            </div>

            <div style={{ marginBottom: '30px' }}>
              <h2 style={{ fontSize: '1.8rem', marginBottom: '15px', color: '#00ff88' }}>
                Giải thích
              </h2>
              <p style={{ fontSize: '1.2rem', lineHeight: 1.6, opacity: 0.9 }}>
                {selectedRule.Explanation}
              </p>
            </div>

            <div>
              <h2 style={{ fontSize: '1.8rem', marginBottom: '15px', color: '#00ff88' }}>
                Ví dụ
              </h2>
              <div style={{
                background: 'rgba(255, 255, 255, 0.05)',
                padding: '20px',
                borderRadius: '15px',
                border: '1px solid rgba(255, 255, 255, 0.1)'
              }}>
                <p style={{ fontSize: '1.1rem', lineHeight: 1.6, fontStyle: 'italic' }}>
                  {selectedRule.Examples}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      fontFamily: 'Arial, sans-serif',
      padding: '100px 20px 20px'
    }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h1 style={{ fontSize: '3rem', marginBottom: '10px', textShadow: '2px 2px 4px rgba(0, 0, 0, 0.3)' }}>
            📖 Grammar Rules
          </h1>
          <p style={{ fontSize: '1.2rem', opacity: 0.9 }}>
            Học ngữ pháp với giải thích chi tiết và ví dụ thực tế
          </p>
        </div>

        {/* Search and Filter */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.1)',
          padding: '30px',
          borderRadius: '20px',
          backdropFilter: 'blur(10px)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
          marginBottom: '30px'
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '20px'
          }}>
            <div style={{ position: 'relative' }}>
              <Search size={20} style={{
                position: 'absolute',
                left: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'rgba(255, 255, 255, 0.6)'
              }} />
              <input
                type="text"
                placeholder="Tìm kiếm ngữ pháp..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 12px 12px 45px',
                  borderRadius: '10px',
                  border: '2px solid rgba(255, 255, 255, 0.2)',
                  background: 'rgba(255, 255, 255, 0.1)',
                  color: 'white',
                  fontSize: '1rem'
                }}
              />
            </div>

            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '10px',
                border: '2px solid rgba(255, 255, 255, 0.2)',
                background: 'rgba(255, 255, 255, 0.1)',
                color: 'white',
                fontSize: '1rem'
              }}
            >
              <option value="">Tất cả trình độ</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>

          <div style={{ textAlign: 'center', marginTop: '20px', opacity: 0.8 }}>
            <p>Tìm thấy {grammarRules.length} quy tắc ngữ pháp</p>
          </div>
        </div>

        {/* Grammar Rules Grid */}
        {grammarRules.length === 0 && !loading && (
          <div style={{
            textAlign: 'center',
            padding: '60px 20px',
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '20px',
            backdropFilter: 'blur(10px)'
          }}>
            <BookOpen size={60} style={{ marginBottom: '20px', opacity: 0.5 }} />
            <h3 style={{ fontSize: '1.5rem', marginBottom: '10px' }}>Không tìm thấy quy tắc ngữ pháp</h3>
            <p style={{ opacity: 0.8 }}>Hãy thử thay đổi bộ lọc hoặc thêm quy tắc mới</p>
          </div>
        )}

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
          gap: '30px'
        }}>
          {grammarRules.map((rule) => (
            <div
              key={rule.RuleID}
              onClick={() => setSelectedRule(rule)}
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                padding: '30px',
                borderRadius: '20px',
                backdropFilter: 'blur(10px)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                border: '1px solid rgba(255, 255, 255, 0.1)'
              }}
            >
              <div style={{ marginBottom: '20px' }}>
                <h3 style={{
                  fontSize: '1.5rem',
                  marginBottom: '10px',
                  color: '#00ff88',
                  lineHeight: 1.3
                }}>
                  {rule.Title}
                </h3>
                <p style={{
                  fontSize: '0.95rem',
                  opacity: 0.8,
                  marginBottom: '15px',
                  lineHeight: 1.4,
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden'
                }}>
                  {rule.Explanation}
                </p>
              </div>

              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '20px'
              }}>
                <div style={{
                  background: `rgba(${getLevelColor(rule.Level).replace('#', '')}, 0.2)`,
                  padding: '6px 12px',
                  borderRadius: '15px',
                  border: `1px solid ${getLevelColor(rule.Level)}`,
                  fontSize: '0.8rem',
                  fontWeight: 'bold'
                }}>
                  {rule.Level}
                </div>

                <div style={{
                  background: 'rgba(168, 85, 247, 0.2)',
                  padding: '6px 12px',
                  borderRadius: '15px',
                  border: '1px solid #a855f7',
                  fontSize: '0.8rem',
                  fontWeight: 'bold'
                }}>
                  {rule.Category}
                </div>
              </div>

              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#00ff88',
                fontWeight: 'bold',
                fontSize: '0.9rem'
              }}>
                Đọc thêm
                <ArrowRight size={16} style={{ marginLeft: '8px' }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default GrammarPage