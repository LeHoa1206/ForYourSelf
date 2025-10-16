import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Volume2, RotateCcw, Check, X, PenTool, Target, Award } from 'lucide-react';

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

const WritingPage: React.FC = () => {
  const { topicId } = useParams<{ topicId: string }>();
  const navigate = useNavigate();
  const [vocabulary, setVocabulary] = useState<Vocabulary[]>([]);
  const [topic, setTopic] = useState<Topic | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [isRevealed, setIsRevealed] = useState(false);
  const [autoPlay, setAutoPlay] = useState(false);
  const [showKeyboardShortcuts, setShowKeyboardShortcuts] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sessionStats, setSessionStats] = useState({
    correct: 0,
    incorrect: 0,
    total: 0,
    accuracy: 0
  });
  const [writingHistory, setWritingHistory] = useState<{ [key: number]: string[] }>({});
  const [studyProgress, setStudyProgress] = useState<{ [key: number]: 'mastered' | 'learning' | 'new' }>({});
  const [sessionProgress, setSessionProgress] = useState<{ [key: number]: number }>({});
  const [savedProgress, setSavedProgress] = useState<{ [key: number]: { level: string, lastStudied: string, repetitions: number } }>({});
  const [studySession, setStudySession] = useState({
    startTime: new Date(),
    totalWords: 0,
    completedWords: 0,
    masteredWords: 0,
    learningWords: 0,
    newWords: 0,
    averageResponseTime: 0,
    streak: 0,
    maxStreak: 0,
    typingSpeed: 0,
    totalKeystrokes: 0,
    correctKeystrokes: 0
  });

  useEffect(() => {
    if (topicId) {
      fetchVocabulary();
      fetchTopic();
      loadWritingHistory();
      loadSavedProgress();
    }
  }, [topicId]);

  // Initialize study session when vocabulary is loaded
  useEffect(() => {
    if (vocabulary.length > 0) {
      setStudySession(prev => ({
        ...prev,
        totalWords: vocabulary.length,
        startTime: new Date()
      }));
    }
  }, [vocabulary]);

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

  const loadWritingHistory = () => {
    const saved = localStorage.getItem(`writing_${topicId}`);
    if (saved) {
      setWritingHistory(JSON.parse(saved));
    }
  };

  const loadSavedProgress = () => {
    const saved = localStorage.getItem(`writing_progress_${topicId}`);
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
    localStorage.setItem(`writing_progress_${topicId}`, JSON.stringify(progressData));
    setSavedProgress(progressData);
    alert('Tiến độ học tập đã được lưu!');
  };

  const saveWritingHistory = (history: { [key: number]: string[] }) => {
    localStorage.setItem(`writing_${topicId}`, JSON.stringify(history));
    setWritingHistory(history);
  };

  const addToHistory = (wordId: number, attempt: string) => {
    const newHistory = {
      ...writingHistory,
      [wordId]: [...(writingHistory[wordId] || []), attempt]
    };
    saveWritingHistory(newHistory);
  };

  const checkAnswer = () => {
    const currentWord = vocabulary[currentIndex];
    if (currentWord) {
      const isCorrect = userInput.toLowerCase().trim() === currentWord.Word.toLowerCase().trim();
      
      addToHistory(currentWord.WordID, userInput);
      
      setSessionStats(prev => {
        const newStats = {
          ...prev,
          correct: isCorrect ? prev.correct + 1 : prev.correct,
          incorrect: !isCorrect ? prev.incorrect + 1 : prev.incorrect,
          total: prev.total + 1,
          accuracy: Math.round(((isCorrect ? prev.correct + 1 : prev.correct) / (prev.total + 1)) * 100)
        };
        return newStats;
      });

      // Set study progress based on correctness
      const level = isCorrect ? 'mastered' : 'new';
      setStudyProgress(prev => ({
        ...prev,
        [currentWord.WordID]: level
      }));

      // Update session progress
      setSessionProgress(prev => ({
        ...prev,
        [currentWord.WordID]: (prev[currentWord.WordID] || 0) + 1
      }));

      // Update study session statistics
      setStudySession(prev => {
        const newStreak = isCorrect ? prev.streak + 1 : 0;
        const newMaxStreak = Math.max(prev.maxStreak, newStreak);
        const typingTime = Date.now() - prev.startTime.getTime();
        const typingSpeed = (userInput.length / (typingTime / 1000)) * 60; // WPM
        
        return {
          ...prev,
          completedWords: prev.completedWords + 1,
          masteredWords: isCorrect ? prev.masteredWords + 1 : prev.masteredWords,
          learningWords: !isCorrect ? prev.learningWords + 1 : prev.learningWords,
          newWords: !isCorrect ? prev.newWords + 1 : prev.newWords,
          streak: newStreak,
          maxStreak: newMaxStreak,
          typingSpeed: typingSpeed,
          totalKeystrokes: prev.totalKeystrokes + userInput.length,
          correctKeystrokes: isCorrect ? prev.correctKeystrokes + userInput.length : prev.correctKeystrokes
        };
      });

      setIsRevealed(true);
      
      // Check if this is the last word and all are mastered
      if (currentIndex === vocabulary.length - 1) {
        setTimeout(() => {
          const updatedProgress = {
            ...studyProgress,
            [currentWord.WordID]: level
          };
          
          const allMastered = vocabulary.every(word => {
            const progress = updatedProgress[word.WordID];
            return progress === 'mastered';
          });
          
          // Calculate session statistics
          const sessionDuration = Math.round((Date.now() - studySession.startTime.getTime()) / 1000 / 60); // minutes
          const accuracy = Math.round((sessionStats.correct / sessionStats.total) * 100);
          const typingAccuracy = Math.round((studySession.correctKeystrokes / studySession.totalKeystrokes) * 100);
          
          if (allMastered) {
            // Auto save and exit
            saveProgress();
            alert(
              `🎉 Chúc mừng! Bạn đã thuộc hết tất cả từ vựng trong chủ đề này!\n\n` +
              `📊 Thống kê phiên học:\n` +
              `• Thời gian: ${sessionDuration} phút\n` +
              `• Độ chính xác: ${accuracy}%\n` +
              `• Tốc độ gõ: ${Math.round(studySession.typingSpeed)} WPM\n` +
              `• Độ chính xác gõ: ${typingAccuracy}%\n` +
              `• Chuỗi dài nhất: ${studySession.maxStreak} từ liên tiếp\n` +
              `• Từ đã thuộc: ${studySession.masteredWords}/${studySession.totalWords}`
            );
            setTimeout(() => {
              navigate('/vocabulary');
            }, 3000);
          } else {
            // Show completion message with detailed statistics
            alert(
              `✅ Hoàn thành phiên học!\n\n` +
              `📊 Thống kê chi tiết:\n` +
              `• Thời gian: ${sessionDuration} phút\n` +
              `• Độ chính xác: ${accuracy}%\n` +
              `• Tốc độ gõ: ${Math.round(studySession.typingSpeed)} WPM\n` +
              `• Độ chính xác gõ: ${typingAccuracy}%\n` +
              `• Từ đã thuộc: ${studySession.masteredWords}/${studySession.totalWords}\n` +
              `• Từ đang học: ${studySession.learningWords}\n` +
              `• Từ chưa thuộc: ${studySession.newWords}\n\n` +
              `Hãy lưu tiến độ để tiếp tục lần sau!`
            );
          }
        }, 2000);
      }
    }
  };

  const handleNext = () => {
    if (currentIndex < vocabulary.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setUserInput('');
      setIsRevealed(false);
    } else {
      // Check if all are mastered
      const allMastered = vocabulary.every(word => {
        const progress = studyProgress[word.WordID];
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
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setUserInput('');
      setIsRevealed(false);
      setShowHint(false);
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setUserInput('');
    setIsRevealed(false);
    setSessionStats({ correct: 0, incorrect: 0, total: 0, accuracy: 0 });
  };

  // Tự động phát âm mỗi 3 giây
  useEffect(() => {
    if (autoPlay && vocabulary.length > 0 && vocabulary[currentIndex]) {
      const interval = setInterval(() => {
        playAudio();
        // Tự động chuyển sang từ tiếp theo sau 3 giây
        setTimeout(() => {
          if (currentIndex < vocabulary.length - 1) {
            setCurrentIndex(currentIndex + 1);
            setUserInput('');
            setIsRevealed(false);
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
      if (e.key === 'Enter' && userInput.trim()) {
        e.preventDefault();
        checkAnswer();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        if (currentIndex > 0) {
          handlePrevious();
        } else {
          // Go to last if at first
          setCurrentIndex(vocabulary.length - 1);
          setUserInput('');
          setIsRevealed(false);
          setShowHint(false);
        }
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        if (currentIndex < vocabulary.length - 1) {
          setCurrentIndex(currentIndex + 1);
        } else {
          setCurrentIndex(0); // Go to first if at last
        }
        setUserInput('');
        setIsRevealed(false);
        setShowHint(false);
      } else if (e.key === '1' && isRevealed) {
        e.preventDefault();
        handleAnswer('new');
      } else if (e.key === '2' && isRevealed) {
        e.preventDefault();
        handleAnswer('learning');
      } else if (e.key === '3' && isRevealed) {
        e.preventDefault();
        handleAnswer('mastered');
      } else if (e.key === 'h' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        setShowKeyboardShortcuts(!showKeyboardShortcuts);
      } else if (e.key === 'g' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        toggleHint();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [userInput, currentIndex, vocabulary.length, isRevealed]);

  // Tạo gợi ý từ vựng
  const getWordHint = (word: string) => {
    if (word.length <= 2) {
      return word.charAt(0) + '_'.repeat(word.length - 1);
    } else if (word.length <= 4) {
      return word.substring(0, 2) + '_'.repeat(word.length - 2);
    } else {
      return word.substring(0, 3) + '_'.repeat(word.length - 3);
    }
  };

  // Toggle gợi ý
  const toggleHint = () => {
    setShowHint(!showHint);
  };

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

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isRevealed) {
      checkAnswer();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-600 to-red-600 flex items-center justify-center">
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
      <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-600 to-red-600 flex items-center justify-center">
        <div className="text-white text-2xl">Không có từ vựng nào trong chủ đề này.</div>
      </div>
    );
  }

  const currentWord = vocabulary[currentIndex];
  const progress = ((currentIndex + 1) / vocabulary.length) * 100;
  const isCorrect = userInput.toLowerCase().trim() === currentWord.Word.toLowerCase().trim();
  const wordHistory = writingHistory[currentWord.WordID] || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-600 to-red-600">
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
          
          <div className="text-center">
            <h1 className="text-2xl font-bold text-white">{topic?.Title}</h1>
            <p className="text-white/80">Luyện Viết</p>
          </div>
          
          {/* Keyboard Shortcuts Help Button */}
          <button
            onClick={() => setShowKeyboardShortcuts(!showKeyboardShortcuts)}
            className="px-3 py-2 bg-white/10 backdrop-blur-lg border border-white/20 text-white rounded-lg hover:bg-white/20 transition-all duration-300 text-sm"
          >
            ⌨️
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
        </div>
        
        {/* Progress Bar */}
        <div className="max-w-6xl mx-auto mt-4">
          <div className="w-full bg-white/20 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-purple-400 to-pink-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="flex justify-center space-x-4 mb-6 mt-6">
        <button
          onClick={handlePrevious}
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
              setUserInput('');
              setIsRevealed(false);
              setShowHint(false);
            }
          }}
          disabled={currentIndex === vocabulary.length - 1}
          className="flex items-center space-x-2 bg-purple-500/20 backdrop-blur-lg border border-purple-400 text-white px-6 py-3 rounded-full hover:bg-purple-500/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span>Sau</span>
          <span>→</span>
        </button>
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
                <span>Kiểm tra:</span>
                <kbd className="px-2 py-1 bg-white/20 rounded text-xs">Enter</kbd>
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
                <span>Gợi ý:</span>
                <kbd className="px-2 py-1 bg-white/20 rounded text-xs">Ctrl+G</kbd>
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

        {/* Progress Info */}
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 mb-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-white">
            <div className="text-center">
              <div className="w-8 h-8 mx-auto mb-2 flex items-center justify-center">
                <span className="text-2xl">✍️</span>
              </div>
              <div className="text-sm">Còn lại</div>
              <div className="text-2xl font-bold">{vocabulary.length - currentIndex}</div>
            </div>
            <div className="text-center">
              <div className="w-8 h-8 mx-auto mb-2 flex items-center justify-center">
                <span className="text-2xl">✅</span>
              </div>
              <div className="text-sm">Đã viết</div>
              <div className="text-2xl font-bold">{sessionStats.correct}</div>
            </div>
            <div className="text-center">
              <div className="w-8 h-8 mx-auto mb-2 flex items-center justify-center">
                <span className="text-2xl">❌</span>
              </div>
              <div className="text-sm">Sai</div>
              <div className="text-2xl font-bold">{sessionStats.incorrect}</div>
            </div>
            <div className="text-center">
              <div className="w-8 h-8 mx-auto mb-2 flex items-center justify-center">
                <span className="text-2xl">🎯</span>
              </div>
              <div className="text-sm">Độ chính xác</div>
              <div className="text-2xl font-bold">{Math.round(sessionStats.accuracy)}%</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto p-6">
        {/* Writing Practice Card */}
        <div className="flex justify-center mb-8">
          <motion.div
            className="relative w-full max-w-2xl h-96"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-white to-purple-50 rounded-2xl shadow-2xl border border-white/20 flex flex-col items-center justify-center p-8">
              {!isRevealed ? (
                <div className="text-center w-full">
                  <h2 className="text-3xl font-bold text-gray-800 mb-4">Viết từ này:</h2>
                  <p className="text-xl text-gray-600 mb-2">{currentWord.Meaning}</p>
                  <p className="text-lg text-gray-500 mb-8 italic">"{currentWord.Example}"</p>
                  
                  <div className="w-full max-w-md mx-auto">
                    <input
                      type="text"
                      value={userInput}
                      onChange={(e) => setUserInput(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Nhập từ vựng..."
                      className="w-full px-6 py-4 text-xl text-center text-gray-800 bg-white border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:outline-none transition-colors placeholder-gray-400"
                      autoFocus
                    />
                    
                    {/* Gợi ý hiển thị khi nhấn nút */}
                    {showHint && (
                      <div className="mt-4 p-4 bg-yellow-100 border-2 border-yellow-300 rounded-xl">
                        <div className="text-center">
                          <p className="text-sm text-yellow-700 mb-2">💡 Gợi ý:</p>
                          <p className="text-2xl font-bold text-yellow-800 font-mono">
                            {getWordHint(currentWord.Word)}
                          </p>
                        </div>
                      </div>
                    )}
                    
                    <div className="flex space-x-4 mt-4">
                      <button
                        onClick={toggleHint}
                        className="flex-1 px-6 py-3 bg-yellow-500/80 backdrop-blur-lg border border-yellow-400 text-white rounded-xl hover:bg-yellow-600 transition-all duration-300"
                      >
                        <span className="font-bold">💡 {showHint ? 'Ẩn gợi ý' : 'Gợi ý'}</span>
                      </button>
                      
                      <button
                        onClick={checkAnswer}
                        className="flex-1 px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-bold hover:from-purple-600 hover:to-pink-600 transform hover:scale-105 transition-all duration-300"
                      >
                        Kiểm tra
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center">
                  <div className={`text-4xl font-bold mb-4 ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                    {isCorrect ? '✓ Đúng!' : '✗ Sai!'}
                  </div>
                  <h3 className="text-3xl font-bold text-gray-800 mb-4">{currentWord.Word}</h3>
                  <p className="text-xl text-gray-600 mb-2">{currentWord.Phonetic}</p>
                  <p className="text-lg text-gray-500 mb-4">{currentWord.Type}</p>
                  <p className="text-lg text-gray-600 italic">"{currentWord.Example}"</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Controls */}
        <div className="flex justify-center space-x-4 mb-8">
          <button
            onClick={playAudio}
            className="flex items-center space-x-2 bg-white/20 backdrop-blur-lg border border-white/30 text-white px-6 py-3 rounded-full hover:bg-white/30 transition-all duration-300"
          >
            <Volume2 className="w-5 h-5" />
            <span>Phát âm</span>
          </button>
          
          <button
            onClick={handleRestart}
            className="flex items-center space-x-2 bg-white/20 backdrop-blur-lg border border-white/30 text-white px-6 py-3 rounded-full hover:bg-white/30 transition-all duration-300"
          >
            <RotateCcw className="w-5 h-5" />
            <span>Bắt đầu lại</span>
          </button>
        </div>


        {/* Writing History */}
        {wordHistory.length > 0 && (
          <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 mb-8">
            <h3 className="text-xl font-bold text-white mb-4">Lịch sử viết từ này</h3>
            <div className="space-y-2">
              {wordHistory.map((attempt, index) => (
                <div key={index} className="flex items-center space-x-2 text-white">
                  <span className="text-sm text-white/60">#{index + 1}:</span>
                  <span className={`px-3 py-1 rounded-full text-sm ${
                    attempt.toLowerCase().trim() === currentWord.Word.toLowerCase().trim()
                      ? 'bg-green-500/80 text-white'
                      : 'bg-red-500/80 text-white'
                  }`}>
                    {attempt}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Session Stats */}
        <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6">
          <h3 className="text-xl font-bold text-white mb-4">Thống kê phiên học</h3>
          <div className="grid grid-cols-4 gap-4 text-center text-white">
            <div>
              <div className="text-2xl font-bold text-green-400">{sessionStats.correct}</div>
              <div className="text-sm">Đúng</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-red-400">{sessionStats.incorrect}</div>
              <div className="text-sm">Sai</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-400">{sessionStats.total}</div>
              <div className="text-sm">Tổng</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-400">{sessionStats.accuracy}%</div>
              <div className="text-sm">Chính xác</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WritingPage;
