import React, { useState } from 'react'

const TranslationTestPage: React.FC = () => {
  const [word, setWord] = useState('climate')
  const [language, setLanguage] = useState('vi')
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)

  const translateWord = async () => {
    setLoading(true)
    try {
      const response = await fetch('http://localhost:8000/simple_translate.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          word: word,
          target_language: language
        })
      })
      
      const data = await response.json()
      console.log('Translation result:', data)
      setResult(data)
    } catch (error) {
      console.error('Translation error:', error)
      setResult({ error: 'Translation failed' })
    } finally {
      setLoading(false)
    }
  }

  const speakWord = (text: string) => {
    if (isSpeaking) {
      window.speechSynthesis.cancel()
      setIsSpeaking(false)
      return
    }
    
    setIsSpeaking(true)
    
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = 'en-US'
    utterance.rate = 0.8
    utterance.pitch = 1
    utterance.volume = 0.8
    
    utterance.onend = () => {
      setIsSpeaking(false)
    }
    
    utterance.onerror = () => {
      setIsSpeaking(false)
    }
    
    window.speechSynthesis.speak(utterance)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8 text-center">🔊 Translation & Speech Test</h1>
        
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-white mb-2">Word to translate:</label>
              <input
                type="text"
                value={word}
                onChange={(e) => setWord(e.target.value)}
                className="w-full p-3 rounded-lg bg-white/20 text-white border border-white/30"
                placeholder="Enter a word..."
              />
            </div>
            
            <div>
              <label className="block text-white mb-2">Target language:</label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full p-3 rounded-lg bg-white/20 text-white border border-white/30"
              >
                <option value="vi">🇻🇳 Tiếng Việt</option>
                <option value="fr">🇫🇷 Français</option>
                <option value="es">🇪🇸 Español</option>
                <option value="ja">🇯🇵 日本語</option>
                <option value="zh">🇨🇳 中文</option>
                <option value="ko">🇰🇷 한국어</option>
                <option value="de">🇩🇪 Deutsch</option>
              </select>
            </div>
          </div>
          
          <div className="mt-6 text-center">
            <button
              onClick={translateWord}
              disabled={loading}
              className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
            >
              {loading ? 'Translating...' : '🔍 Translate'}
            </button>
          </div>
        </div>

        {result && (
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6">
            <h2 className="text-xl font-bold text-white mb-4">Translation Result:</h2>
            
            {result.error ? (
              <div className="text-red-400">
                Error: {result.error}
                {result.input && <div className="text-sm mt-2">Input: {JSON.stringify(result.input)}</div>}
              </div>
            ) : result.data ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-white/70">Word:</div>
                    <div className="text-white text-lg font-semibold">{result.data.word}</div>
                  </div>
                  <button
                    onClick={() => speakWord(result.data.word)}
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      isSpeaking 
                        ? 'bg-red-500 text-white' 
                        : 'bg-green-500 text-white hover:bg-green-600'
                    }`}
                  >
                    {isSpeaking ? '⏹️' : '🔊'}
                  </button>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-white/70">Translation:</div>
                    <div className="text-blue-300 text-lg font-semibold">{result.data.translation}</div>
                  </div>
                  <button
                    onClick={() => speakWord(result.data.translation)}
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      isSpeaking 
                        ? 'bg-red-500 text-white' 
                        : 'bg-green-500 text-white hover:bg-green-600'
                    }`}
                  >
                    {isSpeaking ? '⏹️' : '🔊'}
                  </button>
                </div>
                
                {result.data.example && (
                  <div>
                    <div className="text-white/70">Example:</div>
                    <div className="text-white/80 italic">"{result.data.example.original}"</div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-white/70">No translation data received</div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default TranslationTestPage
