import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Volume2, RotateCcw, Check, X, Star } from 'lucide-react';

interface Vocabulary {
  WordID: number;
  Word: string;
  Phonetic: string;
  Type: string;
  Meaning: string;
  Example: string;
  Audio: string;
  TopicID: number;
  LanguageID: number;
  Difficulty: string;
}

interface Topic {
  TopicID: number;
  Title: string;
  Description: string;
  Icon: string;
  Color: string;
}

const FlashcardPage: React.FC = () => {
  const { topicId } = useParams<{ topicId: string }>();
  const navigate = useNavigate();
  const [vocabulary, setVocabulary] = useState<Vocabulary[]>([]);
  const [topic, setTopic] = useState<Topic | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [autoPlay, setAutoPlay] = useState(false);
  const [showKeyboardShortcuts, setShowKeyboardShortcuts] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [studyProgress, setStudyProgress] = useState<{ [key: number]: 'mastered' | 'learning' | 'new' }>({});
  const [sessionProgress, setSessionProgress] = useState<{ [key: number]: number }>({}); // Số lần học trong session
  const [savedProgress, setSavedProgress] = useState<{ [key: number]: { level: string, lastStudied: string, repetitions: number } }>({});

  useEffect(() => {
    if (topicId) {
      fetchVocabulary();
      fetchTopic();
      loadSavedProgress();
    }
  }, [topicId]);

  const loadSavedProgress = () => {
    const saved = localStorage.getItem(`flashcard_progress_${topicId}`);
    if (saved) {
      setSavedProgress(JSON.parse(saved));
    }
  };

  const saveProgress = () => {
    const progressData = {
      ...savedProgress,
      ...Object.keys(studyProgress).reduce((acc, wordId) => {
        const wordIdNum = parseInt(wordId);
        acc[wordIdNum] = {
          level: studyProgress[wordIdNum],
          lastStudied: new Date().toISOString(),
          repetitions: (savedProgress[wordIdNum]?.repetitions || 0) + (sessionProgress[wordIdNum] || 0)
        };
        return acc;
      }, {} as { [key: number]: { level: string, lastStudied: string, repetitions: number } })
    };
    localStorage.setItem(`flashcard_progress_${topicId}`, JSON.stringify(progressData));
    setSavedProgress(progressData);
    alert('Tiến độ học tập đã được lưu!');
  };

  const fetchVocabulary = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`http://localhost:8000/api/vocabulary?topicId=${topicId}`);
      if (response.ok) {
        const result = await response.json();
        if (result.success && result.data.length > 0) {
          setVocabulary(result.data);
        } else {
          setError('No vocabulary found for this topic: ' + (result.message || 'API error'));
        }
      } else {
        setError(`Failed to fetch vocabulary: HTTP error! status: ${response.status}`);
      }
    } catch (error: any) {
      console.error('Failed to fetch vocabulary:', error);
      setError('Failed to fetch vocabulary: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchTopic = async () => {
    try {
      const response = await fetch(`http://localhost:8000/api/topics?languageId=1`);
      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          const foundTopic = result.data.find((t: Topic) => t.TopicID === parseInt(topicId || '0'));
          if (foundTopic) {
            setTopic(foundTopic);
          }
        }
      }
    } catch (error) {
      console.error('Failed to fetch topic:', error);
    }
  };

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleAnswer = (level: 'mastered' | 'learning' | 'new') => {
    console.log('handleAnswer called with level:', level);
    const currentWord = vocabulary[currentIndex];
    if (currentWord) {
      console.log('Current word:', currentWord.Word);
      
      setStudyProgress(prev => {
        const newProgress = {
          ...prev,
          [currentWord.WordID]: level
        };
        console.log('Updated study progress:', newProgress);
        return newProgress;
      });
      
      setSessionProgress(prev => {
        const newSession = {
          ...prev,
          [currentWord.WordID]: (prev[currentWord.WordID] || 0) + 1
        };
        console.log('Updated session progress:', newSession);
        return newSession;
      });
      
      // Check if this is the last word
      if (currentIndex === vocabulary.length - 1) {
        // This is the last word, check if all are mastered
        setTimeout(() => {
          // Create updated progress with current answer
          const updatedProgress = {
            ...studyProgress,
            [currentWord.WordID]: level
          };
          
          const allMastered = vocabulary.every(word => {
            const progress = updatedProgress[word.WordID];
            return progress === 'mastered';
          });
          
          if (allMastered) {
            // Auto save and exit
            saveProgress();
            alert('🎉 Chúc mừng! Bạn đã thuộc hết tất cả từ vựng trong chủ đề này!');
            setTimeout(() => {
              navigate('/vocabulary');
            }, 2000);
          } else {
            // Show completion message but don't exit
            alert('✅ Hoàn thành! Bạn đã học hết tất cả từ vựng. Hãy lưu tiến độ để tiếp tục lần sau.');
          }
        }, 1000);
      } else {
        // Auto move to next word after answering
        setTimeout(() => {
          setCurrentIndex(currentIndex + 1);
          setIsFlipped(false);
        }, 1000);
      }
    }
  };

  const handleNext = () => {
    if (currentIndex < vocabulary.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setIsFlipped(false);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setIsFlipped(false);
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setIsFlipped(false);
    setStudyProgress({});
    setSessionProgress({});
  };

  // Tự động phát âm và chuyển từ mỗi 3 giây
  useEffect(() => {
    if (autoPlay && vocabulary.length > 0 && vocabulary[currentIndex]) {
      const interval = setInterval(() => {
        playAudio();
        // Tự động chuyển sang từ tiếp theo sau 3 giây
        setTimeout(() => {
          if (currentIndex < vocabulary.length - 1) {
            setCurrentIndex(currentIndex + 1);
            setIsFlipped(false);
          } else {
            // Đã hết từ, dừng tự động phát
            setAutoPlay(false);
            alert('🎉 Đã học hết tất cả từ vựng!');
          }
        }, 1000); // Chờ 1 giây sau khi phát âm rồi chuyển từ
      }, 3000);
      
      return () => clearInterval(interval);
    }
  }, [autoPlay, currentIndex, vocabulary]);

  // Toggle tự động phát
  const toggleAutoPlay = () => {
    setAutoPlay(!autoPlay);
    console.log('Auto play toggled:', !autoPlay);
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        setIsFlipped(!isFlipped); // Toggle flip state
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        if (currentIndex > 0) {
          setCurrentIndex(currentIndex - 1);
        } else {
          setCurrentIndex(vocabulary.length - 1); // Go to last if at first
        }
        setIsFlipped(false);
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        if (currentIndex < vocabulary.length - 1) {
          setCurrentIndex(currentIndex + 1);
        } else {
          setCurrentIndex(0); // Go to first if at last
        }
        setIsFlipped(false);
      } else if (e.key === '1' && isFlipped) {
        e.preventDefault();
        handleAnswer('new');
      } else if (e.key === '2' && isFlipped) {
        e.preventDefault();
        handleAnswer('learning');
      } else if (e.key === '3' && isFlipped) {
        e.preventDefault();
        handleAnswer('mastered');
      } else if (e.key === 'h' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        setShowKeyboardShortcuts(!showKeyboardShortcuts);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isFlipped, currentIndex, vocabulary.length]);

  const playAudio = () => {
    const currentWord = vocabulary[currentIndex];
    if (currentWord) {
      console.log('Playing audio for word:', currentWord.Word);
      
      // Dừng bất kỳ audio nào đang phát
      if (speechSynthesis.speaking) {
        speechSynthesis.cancel();
      }
      
      // Sử dụng Web Speech API để phát âm
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(currentWord.Word);
        
        // Cài đặt ngôn ngữ dựa trên LanguageID
        switch (currentWord.LanguageID) {
          case 1: // Vietnamese
            utterance.lang = 'vi-VN';
            break;
          case 2: // English
            utterance.lang = 'en-US';
            break;
          case 3: // Chinese
            utterance.lang = 'zh-CN';
            break;
          case 4: // Korean
            utterance.lang = 'ko-KR';
            break;
          case 5: // Japanese
            utterance.lang = 'ja-JP';
            break;
          case 6: // Thai
            utterance.lang = 'th-TH';
            break;
          default:
            utterance.lang = 'en-US';
        }
        
        utterance.rate = 0.8;
        utterance.pitch = 1;
        utterance.volume = 1;
        
        utterance.onstart = () => {
          console.log('Started speaking:', currentWord.Word);
        };
        
        utterance.onend = () => {
          console.log('Finished speaking:', currentWord.Word);
        };
        
        utterance.onerror = (event) => {
          console.error('Speech synthesis error:', event.error);
        };
        
        speechSynthesis.speak(utterance);
      } else {
        console.log('Speech synthesis not supported');
        alert('Trình duyệt không hỗ trợ phát âm. Vui lòng sử dụng Chrome, Firefox hoặc Safari.');
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 flex items-center justify-center">
        <div className="text-white text-2xl">Đang tải từ vựng...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-600 via-pink-600 to-purple-800 text-white p-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-8">
            <h1 className="text-4xl font-bold mb-4">⚠️ Lỗi Kết Nối</h1>
            <p className="text-xl mb-6">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full font-bold text-lg hover:from-blue-600 hover:to-purple-600 transform hover:scale-105 transition-all duration-300"
            >
              🔄 Thử Lại
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (vocabulary.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 flex items-center justify-center">
        <div className="text-white text-2xl">Không có từ vựng nào trong chủ đề này.</div>
      </div>
    );
  }

  const currentWord = vocabulary[currentIndex];
  const progress = ((currentIndex + 1) / vocabulary.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600">
      {/* Header */}
      <div className="bg-white/10 backdrop-blur-lg border-b border-white/20 p-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <button
            onClick={() => navigate('/vocabulary')}
            className="flex items-center space-x-2 text-white hover:text-yellow-300 transition-colors"
          >
            <ChevronLeft className="w-6 h-6" />
            <span>Quay lại</span>
          </button>
          
          {/* Control Buttons */}
          <div className="flex space-x-4">
            <button
              onClick={playAudio}
              className="flex items-center space-x-2 bg-blue-500/80 backdrop-blur-lg border border-blue-400 text-white px-4 py-2 rounded-xl hover:bg-blue-600 transition-all duration-300"
            >
              <Volume2 className="w-5 h-5" />
              <span>Phát âm</span>
            </button>
            
            <button
              onClick={toggleAutoPlay}
              className={`flex items-center space-x-2 backdrop-blur-lg border text-white px-4 py-2 rounded-xl transition-all duration-300 ${
                autoPlay 
                  ? 'bg-green-500/80 border-green-400 hover:bg-green-600' 
                  : 'bg-gray-500/80 border-gray-400 hover:bg-gray-600'
              }`}
            >
              <div className="w-5 h-5 flex items-center justify-center">
                {autoPlay ? '⏸️' : '▶️'}
              </div>
              <span>{autoPlay ? 'Dừng tự động' : 'Tự động phát'}</span>
            </button>
          </div>
          
          <div className="text-center">
            <h1 className="text-2xl font-bold text-white">{topic?.Title}</h1>
            <p className="text-white/80">Flashcards</p>
          </div>
          
          {/* Keyboard Shortcuts Help Button */}
          <button
            onClick={() => setShowKeyboardShortcuts(!showKeyboardShortcuts)}
            className="px-3 py-2 bg-white/10 backdrop-blur-lg border border-white/20 text-white rounded-lg hover:bg-white/20 transition-all duration-300 text-sm"
          >
            ⌨️
          </button>
          
          <div className="text-white text-sm">
            {currentIndex + 1} / {vocabulary.length}
          </div>
        </div>
        
        {/* Keyboard Shortcuts Panel */}
        {showKeyboardShortcuts && (
          <div className="fixed top-4 right-4 bg-black/80 backdrop-blur-lg border border-white/20 rounded-xl p-4 text-white z-50 max-w-sm">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-bold">⌨️ Phím tắt</h3>
              <button
                onClick={() => setShowKeyboardShortcuts(false)}
                className="text-white/60 hover:text-white"
              >
                ✕
              </button>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Lật thẻ:</span>
                <kbd className="px-2 py-1 bg-white/20 rounded text-xs">Space</kbd>
              </div>
              <div className="flex justify-between">
                <span>Lật lại:</span>
                <kbd className="px-2 py-1 bg-white/20 rounded text-xs">Space</kbd>
              </div>
              <div className="flex justify-between">
                <span>Trước:</span>
                <kbd className="px-2 py-1 bg-white/20 rounded text-xs">←</kbd>
              </div>
              <div className="flex justify-between">
                <span>Sau:</span>
                <kbd className="px-2 py-1 bg-white/20 rounded text-xs">→</kbd>
              </div>
              <div className="flex justify-between">
                <span>Vòng lặp:</span>
                <kbd className="px-2 py-1 bg-white/20 rounded text-xs">←/→</kbd>
              </div>
              <div className="flex justify-between">
                <span>Chưa thuộc:</span>
                <kbd className="px-2 py-1 bg-white/20 rounded text-xs">1</kbd>
              </div>
              <div className="flex justify-between">
                <span>Nhớ:</span>
                <kbd className="px-2 py-1 bg-white/20 rounded text-xs">2</kbd>
              </div>
              <div className="flex justify-between">
                <span>Thuộc:</span>
                <kbd className="px-2 py-1 bg-white/20 rounded text-xs">3</kbd>
              </div>
            </div>
          </div>
        )}
        
        {/* Progress Bar */}
        <div className="max-w-6xl mx-auto mt-4">
          <div className="w-full bg-white/20 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-yellow-400 to-orange-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto p-6">
        <div className="flex justify-center mb-8">
          <motion.div
            className="relative w-full max-w-2xl h-96 cursor-pointer"
            onClick={handleFlip}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <motion.div
              className="absolute inset-0 w-full h-full"
              animate={{ rotateY: isFlipped ? 180 : 0 }}
              transition={{ duration: 0.6 }}
              style={{ transformStyle: 'preserve-3d' }}
            >
              {/* Front of card */}
              <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-white to-blue-50 rounded-2xl shadow-2xl border border-white/20 flex flex-col items-center justify-center p-8"
                   style={{ backfaceVisibility: 'hidden' }}>
                {/* Header với chữ "TRƯỚC" nằm ngang */}
                <div className="w-full flex justify-between items-center mb-6">
                  <div className="text-sm font-bold text-blue-600 bg-blue-100 px-3 py-1 rounded-full">
                    TRƯỚC
                  </div>
                  <div className="text-sm text-gray-500">
                    {currentIndex + 1}/{vocabulary.length}
                  </div>
                </div>
                
                <div className="text-center flex-1 flex flex-col justify-center">
                  <h2 className="text-4xl font-bold text-gray-800 mb-4">{currentWord.Word}</h2>
                  <p className="text-xl text-gray-600 mb-2">{currentWord.Phonetic}</p>
                  <p className="text-lg text-gray-500">{currentWord.Type}</p>
                </div>
                
                <div className="mt-8 text-gray-400 text-sm">
                  👆 Click để xem nghĩa
                </div>
              </div>

              {/* Back of card */}
              <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-green-400 to-blue-500 rounded-2xl shadow-2xl border border-white/20 flex flex-col items-center justify-center p-8"
                   style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}>
                {/* Header với chữ "SAU" nằm ngang */}
                <div className="w-full flex justify-between items-center mb-6">
                  <div className="text-sm font-bold text-white bg-white/20 px-3 py-1 rounded-full">
                    SAU
                  </div>
                  <div className="text-sm text-white/80">
                    {currentIndex + 1}/{vocabulary.length}
                  </div>
                </div>
                
                <div className="text-center text-white flex-1 flex flex-col justify-center">
                  <h3 className="text-3xl font-bold mb-4">{currentWord.Meaning}</h3>
                  <p className="text-lg mb-4 italic">"{currentWord.Example}"</p>
                  <div className="flex items-center space-x-2 text-sm">
                    <span className="bg-white/20 px-3 py-1 rounded-full">{currentWord.Difficulty}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Navigation Controls */}
        <div className="flex justify-center space-x-4 mb-6">
          <button
            onClick={() => {
              if (currentIndex > 0) {
                setCurrentIndex(currentIndex - 1);
                setIsFlipped(false);
              }
            }}
            disabled={currentIndex === 0}
            className="flex items-center space-x-2 bg-purple-500/20 backdrop-blur-lg border border-purple-400 text-white px-6 py-3 rounded-full hover:bg-purple-500/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span>←</span>
            <span>Trước</span>
          </button>
          
          <button
            onClick={() => {
              if (currentIndex < vocabulary.length - 1) {
                setCurrentIndex(currentIndex + 1);
                setIsFlipped(false);
              }
            }}
            disabled={currentIndex === vocabulary.length - 1}
            className="flex items-center space-x-2 bg-purple-500/20 backdrop-blur-lg border border-purple-400 text-white px-6 py-3 rounded-full hover:bg-purple-500/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span>Sau</span>
            <span>→</span>
          </button>
        </div>

        {/* Controls */}
        <div className="flex justify-center space-x-4 mb-8">
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              playAudio();
            }}
            className="flex items-center space-x-2 bg-white/20 backdrop-blur-lg border border-white/30 text-white px-6 py-3 rounded-full hover:bg-white/30 transition-all duration-300 cursor-pointer"
          >
            <Volume2 className="w-5 h-5" />
            <span>Phát âm</span>
          </button>
          
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleRestart();
            }}
            className="flex items-center space-x-2 bg-white/20 backdrop-blur-lg border border-white/30 text-white px-6 py-3 rounded-full hover:bg-white/30 transition-all duration-300 cursor-pointer"
          >
            <RotateCcw className="w-5 h-5" />
            <span>Bắt đầu lại</span>
          </button>
        </div>

        {/* Answer Buttons - 3 Levels */}
        <div className="flex justify-center space-x-4 mb-6">
          <button
            type="button"
            onClick={() => {
              console.log('Chưa thuộc button clicked');
              handleAnswer('new');
            }}
            className="flex items-center space-x-2 bg-red-500/80 backdrop-blur-lg border border-red-400 text-white px-6 py-3 rounded-full hover:bg-red-600 transition-all duration-300 transform hover:scale-105 cursor-pointer"
            style={{ pointerEvents: 'auto' }}
          >
            <X className="w-5 h-5" />
            <span className="font-bold">Chưa thuộc</span>
          </button>
          
          <button
            type="button"
            onClick={() => {
              console.log('Nhớ button clicked');
              handleAnswer('learning');
            }}
            className="flex items-center space-x-2 bg-yellow-500/80 backdrop-blur-lg border border-yellow-400 text-white px-6 py-3 rounded-full hover:bg-yellow-600 transition-all duration-300 transform hover:scale-105 cursor-pointer"
            style={{ pointerEvents: 'auto' }}
          >
            <Star className="w-5 h-5" />
            <span className="font-bold">Nhớ</span>
          </button>
          
          <button
            type="button"
            onClick={() => {
              console.log('Thuộc button clicked');
              handleAnswer('mastered');
            }}
            className="flex items-center space-x-2 bg-green-500/80 backdrop-blur-lg border border-green-400 text-white px-6 py-3 rounded-full hover:bg-green-600 transition-all duration-300 transform hover:scale-105 cursor-pointer"
            style={{ pointerEvents: 'auto' }}
          >
            <Check className="w-5 h-5" />
            <span className="font-bold">Thuộc</span>
          </button>
        </div>

        {/* Save Progress Button */}
        <div className="flex justify-center mb-6">
          <button
            type="button"
            onClick={() => {
              console.log('Save progress button clicked');
              saveProgress();
            }}
            className="flex items-center space-x-2 bg-purple-500/80 backdrop-blur-lg border border-purple-400 text-white px-8 py-3 rounded-full hover:bg-purple-600 transition-all duration-300 transform hover:scale-105 cursor-pointer"
            style={{ pointerEvents: 'auto' }}
          >
            <span className="font-bold">💾 Lưu tiến độ</span>
          </button>
        </div>


        {/* Study Progress */}
        <div className="mt-8 bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6">
          <h3 className="text-xl font-bold text-white mb-4">Tiến độ học tập</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {vocabulary.map((word, index) => {
              const progress = studyProgress[word.WordID];
              const sessionCount = sessionProgress[word.WordID] || 0;
              const savedData = savedProgress[word.WordID];
              
              return (
                <div
                  key={word.WordID}
                  className={`p-3 rounded-lg text-center transition-all duration-300 ${
                    index === currentIndex
                      ? 'bg-yellow-400/80 text-black font-bold'
                      : progress === 'mastered'
                      ? 'bg-green-500/80 text-white'
                      : progress === 'learning'
                      ? 'bg-yellow-500/80 text-white'
                      : progress === 'new'
                      ? 'bg-red-500/80 text-white'
                      : 'bg-white/20 text-white'
                  }`}
                >
                  <div className="font-bold">{word.Word}</div>
                  <div className="text-sm">
                    {index === currentIndex ? 'Hiện tại' : 
                     progress === 'mastered' ? '✅ Thuộc' :
                     progress === 'learning' ? '⭐ Nhớ' :
                     progress === 'new' ? '❌ Chưa thuộc' : 'Chưa học'}
                  </div>
                  {sessionCount > 0 && (
                    <div className="text-xs text-white/70">
                      {sessionCount} lần
                    </div>
                  )}
                  {savedData && (
                    <div className="text-xs text-white/50">
                      Tổng: {savedData.repetitions} lần
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlashcardPage;
