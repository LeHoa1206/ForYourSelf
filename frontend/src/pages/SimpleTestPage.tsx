import React, { useState } from 'react'

const SimpleTestPage: React.FC = () => {
  const [isSpeaking, setIsSpeaking] = useState(false)

  const speakWord = (text: string) => {
    console.log('Speaking:', text)
    
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
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center">
      <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8 text-center">
        <h1 className="text-3xl font-bold text-white mb-6">🔊 Speech Test Page</h1>
        
        <div className="space-y-4">
          <button
            onClick={() => speakWord('Hello, this is a test')}
            className={`px-6 py-3 rounded-lg transition-colors ${
              isSpeaking 
                ? 'bg-red-500 text-white' 
                : 'bg-green-500 text-white hover:bg-green-600'
            }`}
          >
            {isSpeaking ? '⏹️ Stop Speaking' : '🔊 Test Speech'}
          </button>
          
          <div className="text-white/70">
            {isSpeaking ? 'Speaking...' : 'Click to test speech synthesis'}
          </div>
          
          <div className="text-white/50 text-sm">
            If you can hear the speech, the feature is working!
          </div>
        </div>
      </div>
    </div>
  )
}

export default SimpleTestPage
