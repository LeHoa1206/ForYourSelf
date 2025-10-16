import React, { useState, useEffect } from 'react'
import { MessageCircle, Send, Mic, MicOff, Volume2, VolumeX, Star, Clock } from 'lucide-react'

interface Conversation {
  ConversationID: number
  Title: string
  Script: string
  Level: string
  Duration: number
}

interface ChatMessage {
  UserMessage: string
  AIResponse: string
  PronunciationScore: number
  GrammarScore: number
  Date: string
}

const ConversationsPage: React.FC = () => {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [currentMessage, setCurrentMessage] = useState('')
  const [isRecording, setIsRecording] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isTyping, setIsTyping] = useState(false)

  useEffect(() => {
    fetchConversations()
  }, [])

  const fetchConversations = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/conversations')
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const result = await response.json()
      if (result.success) {
        setConversations(result.data)
      } else {
        setError(result.message || 'Failed to fetch conversations')
      }
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  const sendMessage = async () => {
    if (!currentMessage.trim()) return

    const userMessage = currentMessage.trim()
    setCurrentMessage('')
    setIsTyping(true)

    try {
      const response = await fetch('http://localhost:8000/api/ai-chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          UserID: 2, // Hardcoded for demo
          UserMessage: userMessage
        })
      })
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const result = await response.json()
      if (result.success) {
        const newMessage: ChatMessage = {
          UserMessage: userMessage,
          AIResponse: result.data.AIResponse,
          PronunciationScore: result.data.PronunciationScore,
          GrammarScore: result.data.GrammarScore,
          Date: new Date().toISOString()
        }
        setMessages(prev => [...prev, newMessage])
      } else {
        setError(result.message || 'Failed to send message')
      }
    } catch (e: any) {
      setError(e.message)
    } finally {
      setIsTyping(false)
    }
  }

  const startRecording = () => {
    setIsRecording(true)
    // Simulate recording
    setTimeout(() => {
      setIsRecording(false)
      setCurrentMessage("Hello, how are you today?") // Simulated speech-to-text
    }, 3000)
  }

  const stopRecording = () => {
    setIsRecording(false)
  }

  const playAudio = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = 'en-US'
      utterance.rate = 0.8
      speechSynthesis.speak(utterance)
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return '#10b981'
    if (score >= 60) return '#f59e0b'
    return '#ef4444'
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
          <p style={{ fontSize: '1.2rem' }}>Đang tải cuộc trò chuyện...</p>
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
            onClick={fetchConversations}
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

  if (selectedConversation) {
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
            onClick={() => setSelectedConversation(null)}
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
            padding: '30px',
            borderRadius: '20px',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
            marginBottom: '30px'
          }}>
            <h1 style={{ fontSize: '2.5rem', marginBottom: '20px', color: '#00ff88' }}>
              {selectedConversation.Title}
            </h1>
            
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '20px',
              marginBottom: '20px'
            }}>
              <div style={{
                background: `rgba(${getLevelColor(selectedConversation.Level).replace('#', '')}, 0.2)`,
                padding: '8px 16px',
                borderRadius: '20px',
                border: `2px solid ${getLevelColor(selectedConversation.Level)}`,
                fontWeight: 'bold'
              }}>
                {selectedConversation.Level}
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                opacity: 0.8
              }}>
                <Clock size={16} />
                {selectedConversation.Duration} phút
              </div>
            </div>

            <div style={{
              background: 'rgba(255, 255, 255, 0.05)',
              padding: '20px',
              borderRadius: '15px',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
              <h3 style={{ marginBottom: '15px', color: '#00ff88' }}>Script mẫu:</h3>
              <p style={{ lineHeight: 1.6, opacity: 0.9 }}>
                {selectedConversation.Script}
              </p>
            </div>
          </div>

          {/* Chat Interface */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '20px',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
            height: '600px',
            display: 'flex',
            flexDirection: 'column'
          }}>
            {/* Messages */}
            <div style={{
              flex: 1,
              padding: '20px',
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: '15px'
            }}>
              {messages.map((message, index) => (
                <div key={index}>
                  {/* User Message */}
                  <div style={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    marginBottom: '10px'
                  }}>
                    <div style={{
                      background: 'rgba(16, 185, 129, 0.2)',
                      padding: '15px 20px',
                      borderRadius: '20px 20px 5px 20px',
                      border: '2px solid #10b981',
                      maxWidth: '70%'
                    }}>
                      <p style={{ marginBottom: '5px' }}>{message.UserMessage}</p>
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        fontSize: '0.8rem',
                        opacity: 0.7
                      }}>
                        <span>Pronunciation: {message.PronunciationScore}%</span>
                        <span>Grammar: {message.GrammarScore}%</span>
                      </div>
                    </div>
                  </div>

                  {/* AI Response */}
                  <div style={{
                    display: 'flex',
                    justifyContent: 'flex-start',
                    alignItems: 'flex-start',
                    gap: '10px'
                  }}>
                    <div style={{
                      background: 'rgba(59, 130, 246, 0.2)',
                      padding: '15px 20px',
                      borderRadius: '20px 20px 20px 5px',
                      border: '2px solid #3b82f6',
                      maxWidth: '70%',
                      flex: 1
                    }}>
                      <p>{message.AIResponse}</p>
                    </div>
                    <button
                      onClick={() => playAudio(message.AIResponse)}
                      style={{
                        background: 'rgba(168, 85, 247, 0.2)',
                        padding: '8px',
                        borderRadius: '50%',
                        border: '1px solid #a855f7',
                        color: '#a855f7',
                        cursor: 'pointer',
                        flexShrink: 0
                      }}
                    >
                      <Volume2 size={16} />
                    </button>
                  </div>
                </div>
              ))}

              {isTyping && (
                <div style={{
                  display: 'flex',
                  justifyContent: 'flex-start',
                  alignItems: 'center',
                  gap: '10px'
                }}>
                  <div style={{
                    background: 'rgba(59, 130, 246, 0.2)',
                    padding: '15px 20px',
                    borderRadius: '20px 20px 20px 5px',
                    border: '2px solid #3b82f6'
                  }}>
                    <div style={{
                      display: 'flex',
                      gap: '4px',
                      alignItems: 'center'
                    }}>
                      <div style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        background: '#3b82f6',
                        animation: 'typing 1.4s infinite ease-in-out'
                      }}></div>
                      <div style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        background: '#3b82f6',
                        animation: 'typing 1.4s infinite ease-in-out 0.2s'
                      }}></div>
                      <div style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        background: '#3b82f6',
                        animation: 'typing 1.4s infinite ease-in-out 0.4s'
                      }}></div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div style={{
              padding: '20px',
              borderTop: '1px solid rgba(255, 255, 255, 0.1)',
              display: 'flex',
              gap: '10px',
              alignItems: 'center'
            }}>
              <div style={{ flex: 1, position: 'relative' }}>
                <input
                  type="text"
                  value={currentMessage}
                  onChange={(e) => setCurrentMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  placeholder="Nhập tin nhắn của bạn..."
                  style={{
                    width: '100%',
                    padding: '15px 50px 15px 15px',
                    borderRadius: '25px',
                    border: '2px solid rgba(255, 255, 255, 0.2)',
                    background: 'rgba(255, 255, 255, 0.1)',
                    color: 'white',
                    fontSize: '1rem'
                  }}
                />
                <button
                  onClick={isRecording ? stopRecording : startRecording}
                  style={{
                    position: 'absolute',
                    right: '8px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: isRecording 
                      ? 'rgba(239, 68, 68, 0.2)' 
                      : 'rgba(168, 85, 247, 0.2)',
                    padding: '8px',
                    borderRadius: '50%',
                    border: `1px solid ${isRecording ? '#ef4444' : '#a855f7'}`,
                    color: isRecording ? '#ef4444' : '#a855f7',
                    cursor: 'pointer'
                  }}
                >
                  {isRecording ? <MicOff size={16} /> : <Mic size={16} />}
                </button>
              </div>
              <button
                onClick={sendMessage}
                disabled={!currentMessage.trim()}
                style={{
                  background: currentMessage.trim() 
                    ? 'rgba(16, 185, 129, 0.2)' 
                    : 'rgba(107, 114, 128, 0.2)',
                  padding: '15px',
                  borderRadius: '50%',
                  border: `2px solid ${currentMessage.trim() ? '#10b981' : '#6b7280'}`,
                  color: 'white',
                  cursor: currentMessage.trim() ? 'pointer' : 'not-allowed',
                  opacity: currentMessage.trim() ? 1 : 0.5
                }}
              >
                <Send size={20} />
              </button>
            </div>
          </div>
        </div>

        <style>{`
          @keyframes typing {
            0%, 60%, 100% {
              transform: translateY(0);
            }
            30% {
              transform: translateY(-10px);
            }
          }
        `}</style>
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
            💬 AI Conversations
          </h1>
          <p style={{ fontSize: '1.2rem', opacity: 0.9 }}>
            Luyện nói với AI chatbot và nhận đánh giá pronunciation, grammar
          </p>
        </div>

        {/* Conversations Grid */}
        {conversations.length === 0 && !loading && (
          <div style={{
            textAlign: 'center',
            padding: '60px 20px',
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '20px',
            backdropFilter: 'blur(10px)'
          }}>
            <MessageCircle size={60} style={{ marginBottom: '20px', opacity: 0.5 }} />
            <h3 style={{ fontSize: '1.5rem', marginBottom: '10px' }}>Không có cuộc trò chuyện</h3>
            <p style={{ opacity: 0.8 }}>Hãy thêm cuộc trò chuyện mới để bắt đầu</p>
          </div>
        )}

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
          gap: '30px'
        }}>
          {conversations.map((conversation) => (
            <div
              key={conversation.ConversationID}
              onClick={() => setSelectedConversation(conversation)}
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
                  {conversation.Title}
                </h3>
                <p style={{
                  fontSize: '0.95rem',
                  opacity: 0.8,
                  marginBottom: '15px',
                  lineHeight: 1.4,
                  display: '-webkit-box',
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden'
                }}>
                  {conversation.Script}
                </p>
              </div>

              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '20px'
              }}>
                <div style={{
                  background: `rgba(${getLevelColor(conversation.Level).replace('#', '')}, 0.2)`,
                  padding: '6px 12px',
                  borderRadius: '15px',
                  border: `1px solid ${getLevelColor(conversation.Level)}`,
                  fontSize: '0.8rem',
                  fontWeight: 'bold'
                }}>
                  {conversation.Level}
                </div>

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  opacity: 0.8,
                  fontSize: '0.9rem'
                }}>
                  <Clock size={16} />
                  {conversation.Duration} phút
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
                Bắt đầu trò chuyện
                <MessageCircle size={16} style={{ marginLeft: '8px' }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ConversationsPage