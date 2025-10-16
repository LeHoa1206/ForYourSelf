import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Volume2, RotateCcw, Check, X, Clock, Target, Zap, Star } from 'lucide-react';

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

interface SpacedRepetitionData {
  wordId: number;
  interval: number;
  repetitions: number;
  easeFactor: number;
  nextReview: Date;
}

const SpacedRepetitionPage: React.FC = () => {
  const { topicId } = useParams<{ topicId: string }>();
  const navigate = useNavigate();
  const [vocabulary, setVocabulary] = useState<Vocabulary[]>([]);
  const [topic, setTopic] = useState<Topic | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isRevealed, setIsRevealed] = useState(false);
  const [autoPlay, setAutoPlay] = useState(false);
  const [showKeyboardShortcuts, setShowKeyboardShortcuts] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [spacedData, setSpacedData] = useState<{ [key: number]: SpacedRepetitionData }>({});
  const [sessionStats, setSessionStats] = useState({
    correct: 0,
    incorrect: 0,
    total: 0
  });
  const [studyProgress, setStudyProgress] = useState<{ [key: number]: 'mastered' | 'learning' | 'new' }>({});
  const [sessionProgress, setSessionProgress] = useState<{ [key: number]: number }>({});
  const [savedProgress, setSavedProgress] = useState<{ [key: number]: { level: string, lastStudied: string, repetitions: number } }>({});
  const [studyQueue, setStudyQueue] = useState<number[]>([]); // Hàng đợi học tập
  const [wordProgress, setWordProgress] = useState<{ [key: number]: { level: string, attempts: number, lastSeen: number } }>({}); // Tiến độ từng từ
  const [studySession, setStudySession] = useState({
    startTime: new Date(),
    totalWords: 0,
    completedWords: 0,
    masteredWords: 0,
    learningWords: 0,
    newWords: 0,
    averageResponseTime: 0,
    streak: 0,
    maxStreak: 0
  });

  useEffect(() => {
    if (topicId) {
      fetchVocabulary();
      fetchTopic();
      loadSpacedData();
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
      
      // Initialize study queue with all words
      const initialQueue = vocabulary.map(word => word.WordID);
      setStudyQueue(initialQueue);
      setCurrentIndex(0);
    }
  }, [vocabulary]);

  const loadSavedProgress = () => {
    const saved = localStorage.getItem(`spaced_progress_${topicId}`);
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
    localStorage.setItem(`spaced_progress_${topicId}`, JSON.stringify(progressData));
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

  const loadSpacedData = () => {
    const saved = localStorage.getItem(`spaced_${topicId}`);
    if (saved) {
      setSpacedData(JSON.parse(saved));
    }
  };

  const saveSpacedData = (data: { [key: number]: SpacedRepetitionData }) => {
    localStorage.setItem(`spaced_${topicId}`, JSON.stringify(data));
    setSpacedData(data);
  };

  const getSpacedData = (wordId: number): SpacedRepetitionData => {
    return spacedData[wordId] || {
      wordId,
      interval: 1,
      repetitions: 0,
      easeFactor: 2.5,
      nextReview: new Date()
    };
  };

  const updateSpacedData = (wordId: number, quality: number) => {
    const data = getSpacedData(wordId);
    let { interval, repetitions, easeFactor } = data;

    if (quality >= 3) {
      if (repetitions === 0) {
        interval = 1;
      } else if (repetitions === 1) {
        interval = 6;
      } else {
        interval = Math.round(interval * easeFactor);
      }
      repetitions += 1;
    } else {
      repetitions = 0;
      interval = 1;
    }

    easeFactor = Math.max(1.3, easeFactor + 0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));

    const nextReview = new Date();
    nextReview.setDate(nextReview.getDate() + interval);

    const newData = {
      ...spacedData,
      [wordId]: {
        wordId,
        interval,
        repetitions,
        easeFactor,
        nextReview
      }
    };

    saveSpacedData(newData);
  };

  const handleReveal = () => {
    console.log('=== HANDLE REVEAL ===');
    console.log('Before reveal - isRevealed:', isRevealed);
    console.log('Current word:', currentWord);
    console.log('Current index:', currentIndex);
    console.log('Vocabulary length:', vocabulary.length);
    setIsRevealed(true);
    console.log('After reveal - isRevealed should be true');
    console.log('===================');
  };

  // Logic học tập thông minh - đơn giản và mượt mà
  const moveToNextWord = () => {
    setStudyQueue(prev => {
      const newQueue = [...prev];
      newQueue.shift(); // Xóa từ đầu hàng đợi
      
      if (newQueue.length === 0) {
        // Hàng đợi trống -> hoàn thành phiên học
        checkSessionCompletion();
        return [];
      }
      
      // Tìm từ tiếp theo trong vocabulary
      const nextWordId = newQueue[0];
      const nextWordIndex = vocabulary.findIndex(word => word.WordID === nextWordId);
      
      if (nextWordIndex !== -1) {
        setCurrentIndex(nextWordIndex);
        setIsRevealed(false);
      }
      
      return newQueue;
    });
  };

  // Thêm từ vào hàng đợi với logic thông minh
  const addWordToQueue = (wordId: number, level: string) => {
    const currentProgress = wordProgress[wordId] || { level: 'new', attempts: 0, lastSeen: 0 };
    const newAttempts = currentProgress.attempts + 1;
    
    // Cập nhật tiến độ từ
    setWordProgress(prev => ({
      ...prev,
      [wordId]: {
        level: level,
        attempts: newAttempts,
        lastSeen: Date.now()
      }
    }));
    
    // Logic thêm vào hàng đợi dựa trên mức độ nhớ
    let shouldAddToQueue = false;
    let insertPosition = 0;
    
    if (level === 'new') {
      // Không nhớ -> thêm vào cuối hàng đợi (sẽ học sau)
      shouldAddToQueue = true;
      insertPosition = -1; // Cuối hàng đợi
    } else if (level === 'learning') {
      // Nhớ vừa -> thêm vào giữa hàng đợi (giảm 1 lượt so với "không nhớ")
      shouldAddToQueue = true;
      insertPosition = Math.floor(studyQueue.length / 2);
    } else if (level === 'mastered') {
      // Đã nhớ -> KHÔNG thêm vào hàng đợi nữa (giảm hết lượt)
      shouldAddToQueue = false;
      console.log(`Từ ${wordId} đã thuộc hoàn toàn, không cần lặp lại`);
    }
    
    if (shouldAddToQueue) {
      setStudyQueue(prev => {
        const newQueue = [...prev];
        if (insertPosition === -1) {
          newQueue.push(wordId);
        } else {
          newQueue.splice(insertPosition, 0, wordId);
        }
        console.log(`Từ ${wordId} (${level}) được thêm vào vị trí ${insertPosition === -1 ? 'cuối' : insertPosition} của hàng đợi`);
        return newQueue;
      });
    } else {
      console.log(`Từ ${wordId} đã hoàn thành, không thêm vào hàng đợi`);
    }
  };

  // Tự động phát âm và chuyển từ mỗi 3 giây
  useEffect(() => {
    if (autoPlay && vocabulary.length > 0 && vocabulary[currentIndex]) {
      const interval = setInterval(() => {
        playAudio();
        // Tự động chuyển sang từ tiếp theo sau 3 giây
        setTimeout(() => {
          moveToNextWord();
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
        setIsRevealed(!isRevealed); // Toggle reveal state
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        if (currentIndex > 0) {
          setCurrentIndex(currentIndex - 1);
        } else {
          setCurrentIndex(vocabulary.length - 1); // Go to last if at first
        }
        setIsRevealed(false);
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        if (currentIndex < vocabulary.length - 1) {
          setCurrentIndex(currentIndex + 1);
        } else {
          setCurrentIndex(0); // Go to first if at last
        }
        setIsRevealed(false);
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
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isRevealed, currentIndex, vocabulary.length]);

  const checkSessionCompletion = () => {
    // Kiểm tra xem tất cả từ đã hoàn thành chưa
    const sessionDuration = Math.round((Date.now() - studySession.startTime.getTime()) / 1000 / 60);
    const accuracy = Math.round((sessionStats.correct / sessionStats.total) * 100);
    
    // Tính toán từ đã thuộc
    const masteredCount = Object.values(studyProgress).filter(level => level === 'mastered').length;
    const allMastered = masteredCount === vocabulary.length;
    
    if (allMastered) {
      // Auto save and exit
      saveProgress();
      alert(
        `🎉 Chúc mừng! Bạn đã thuộc hết tất cả từ vựng trong chủ đề này!\n\n` +
        `📊 Thống kê phiên học:\n` +
        `• Thời gian: ${sessionDuration} phút\n` +
        `• Độ chính xác: ${accuracy}%\n` +
        `• Chuỗi dài nhất: ${studySession.maxStreak} từ liên tiếp\n` +
        `• Từ đã thuộc: ${masteredCount}/${vocabulary.length}`
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
        `• Từ đã thuộc: ${masteredCount}/${vocabulary.length}\n` +
        `• Từ đang học: ${studySession.learningWords}\n` +
        `• Từ chưa thuộc: ${studySession.newWords}\n\n` +
        `Hãy lưu tiến độ để tiếp tục lần sau!`
      );
    }
  };

  const handleAnswer = (level: 'mastered' | 'learning' | 'new') => {
    console.log('handleAnswer called with level:', level);
    const currentWord = vocabulary[currentIndex];
    if (currentWord) {
      console.log('Current word:', currentWord.Word);
      
      // Map level to quality for spaced repetition
      const quality = level === 'mastered' ? 4 : level === 'learning' ? 3 : 1;
      
      updateSpacedData(currentWord.WordID, quality);
      
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
      
      setSessionStats(prev => ({
        ...prev,
        correct: quality >= 3 ? prev.correct + 1 : prev.correct,
        incorrect: quality < 3 ? prev.incorrect + 1 : prev.incorrect,
        total: prev.total + 1
      }));

      // Update study session statistics
      setStudySession(prev => {
        const newStreak = quality >= 3 ? prev.streak + 1 : 0;
        const newMaxStreak = Math.max(prev.maxStreak, newStreak);
        
        return {
          ...prev,
          completedWords: prev.completedWords + 1,
          masteredWords: level === 'mastered' ? prev.masteredWords + 1 : prev.masteredWords,
          learningWords: level === 'learning' ? prev.learningWords + 1 : prev.learningWords,
          newWords: level === 'new' ? prev.newWords + 1 : prev.newWords,
          streak: newStreak,
          maxStreak: newMaxStreak,
          averageResponseTime: prev.averageResponseTime + (Date.now() - prev.startTime.getTime()) / prev.completedWords
        };
      });

      // Logic học tập thông minh - đơn giản và mượt mà
      addWordToQueue(currentWord.WordID, level);

      // Chuyển đến từ tiếp theo trong hàng đợi lặp lại
      setTimeout(() => {
        moveToNextWord();
      }, 1000);
    }
  };

  const handleNext = () => {
    if (currentIndex < vocabulary.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setIsRevealed(false);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setIsRevealed(false);
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setIsRevealed(false);
    setSessionStats({ correct: 0, incorrect: 0, total: 0 });
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-600 via-blue-600 to-purple-600 flex items-center justify-center">
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
      <div className="min-h-screen bg-gradient-to-br from-green-600 via-blue-600 to-purple-600 flex items-center justify-center">
        <div className="text-white text-2xl">Không có từ vựng nào trong chủ đề này.</div>
      </div>
    );
  }

  const currentWord = vocabulary[currentIndex];
  const progress = ((currentIndex + 1) / vocabulary.length) * 100;
  const spacedInfo = currentWord ? getSpacedData(currentWord.WordID) : { repetitions: 0, interval: 1, easeFactor: 2.5 };

  // Error boundary - nếu không có currentWord
  if (!currentWord) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-600 via-pink-600 to-purple-800 text-white p-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-8">
            <h1 className="text-4xl font-bold mb-4">⚠️ Lỗi Dữ Liệu</h1>
            <p className="text-xl mb-6">Không tìm thấy từ vựng tại vị trí {currentIndex}</p>
            <div className="space-y-4">
              <p className="text-lg">Debug Info:</p>
              <ul className="text-left max-w-md mx-auto space-y-2">
                <li>• Current Index: {currentIndex}</li>
                <li>• Vocabulary Length: {vocabulary.length}</li>
                <li>• Is Revealed: {isRevealed ? 'True' : 'False'}</li>
                <li>• Repetition Queue: {repetitionQueue.length}</li>
              </ul>
              <button
                onClick={() => window.location.reload()}
                className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full font-bold text-lg hover:from-blue-600 hover:to-purple-600 transform hover:scale-105 transition-all duration-300"
              >
                🔄 Thử Lại
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-600 via-blue-600 to-purple-600">
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
            <p className="text-white/80">Lặp Lại Ngắt Quãng</p>
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
        
        {/* Progress Bar */}
        <div className="max-w-6xl mx-auto mt-4">
          <div className="w-full bg-white/20 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-green-400 to-blue-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
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
                <span>Xem nghĩa:</span>
                <kbd className="px-2 py-1 bg-white/20 rounded text-xs">Space</kbd>
              </div>
              <div className="flex justify-between">
                <span>Ẩn nghĩa:</span>
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
              <span>Không nhớ:</span>
              <kbd className="px-2 py-1 bg-white/20 rounded text-xs">1</kbd>
            </div>
            <div className="flex justify-between">
              <span>Nhớ vừa:</span>
              <kbd className="px-2 py-1 bg-white/20 rounded text-xs">2</kbd>
            </div>
            <div className="flex justify-between">
              <span>Đã nhớ:</span>
              <kbd className="px-2 py-1 bg-white/20 rounded text-xs">3</kbd>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-4xl mx-auto p-6">
        {/* Study Progress Info */}
        <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 mb-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-white">
            <div className="text-center">
              <div className="w-8 h-8 mx-auto mb-2 flex items-center justify-center">
                <span className="text-2xl">📚</span>
              </div>
              <div className="text-sm">Còn lại</div>
              <div className="text-2xl font-bold">{studyQueue.length}</div>
            </div>
            <div className="text-center">
              <div className="w-8 h-8 mx-auto mb-2 flex items-center justify-center">
                <span className="text-2xl">✅</span>
              </div>
              <div className="text-sm">Đã thuộc</div>
              <div className="text-2xl font-bold">{studySession.masteredWords}</div>
            </div>
            <div className="text-center">
              <div className="w-8 h-8 mx-auto mb-2 flex items-center justify-center">
                <span className="text-2xl">🔄</span>
              </div>
              <div className="text-sm">Đang học</div>
              <div className="text-2xl font-bold">{studySession.learningWords}</div>
            </div>
            <div className="text-center">
              <div className="w-8 h-8 mx-auto mb-2 flex items-center justify-center">
                <span className="text-2xl">🎯</span>
              </div>
              <div className="text-sm">Tiến độ</div>
              <div className="text-2xl font-bold">{Math.round((studySession.completedWords / studySession.totalWords) * 100)}%</div>
            </div>
          </div>
        </div>


        {/* Navigation Controls */}
        <div className="flex justify-center space-x-4 mb-6">
          <button
            onClick={() => {
              if (currentIndex > 0) {
                setCurrentIndex(currentIndex - 1);
                setIsRevealed(false);
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
                setIsRevealed(false);
              }
            }}
            disabled={currentIndex === vocabulary.length - 1}
            className="flex items-center space-x-2 bg-purple-500/20 backdrop-blur-lg border border-purple-400 text-white px-6 py-3 rounded-full hover:bg-purple-500/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span>Sau</span>
            <span>→</span>
          </button>
        </div>

        {/* Control Buttons */}
        <div className="flex justify-center mb-6">
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

        {/* Study Card */}
        <div className="flex justify-center mb-8">
          <motion.div
            className="relative w-full max-w-2xl h-96"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-white to-green-50 rounded-2xl shadow-2xl border border-white/20 flex flex-col items-center justify-center p-8">
              {!isRevealed ? (
                <div className="text-center">
                  <div className="mb-6">
                    <div className="text-sm text-gray-500 mb-2">Bạn có nhớ nghĩa của từ này không?</div>
                    <h2 className="text-4xl font-bold text-gray-800 mb-4">{currentWord?.Word || 'Loading...'}</h2>
                    <p className="text-xl text-gray-600 mb-2">{currentWord?.Phonetic || ''}</p>
                    <p className="text-lg text-gray-500 mb-8">{currentWord?.Type || ''}</p>
                  </div>
                  <button
                    onClick={handleReveal}
                    className="px-8 py-4 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-full font-bold text-lg hover:from-green-600 hover:to-blue-600 transform hover:scale-105 transition-all duration-300"
                  >
                    🔍 Xem nghĩa
                  </button>
                </div>
              ) : (
                <div className="text-center">
                  <div className="mb-6">
                    <div className="text-sm text-gray-500 mb-2">Đây là nghĩa của từ:</div>
                    <h3 className="text-3xl font-bold text-gray-800 mb-4">{currentWord?.Meaning || 'Loading...'}</h3>
                    <p className="text-lg text-gray-600 mb-4 italic">"{currentWord?.Example || 'Loading...'}"</p>
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <span className="bg-gray-200 px-3 py-1 rounded-full">{currentWord?.Difficulty || ''}</span>
                    </div>
                  </div>
                  <div className="text-sm text-gray-500 mb-4">
                    Bạn đánh giá mức độ nhớ của mình như thế nào?
                  </div>
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

        {/* Answer Buttons - 3 Levels */}
        {isRevealed && vocabulary.length > 0 && (
          <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 mb-6">
            <div className="text-center mb-4">
              <h3 className="text-lg font-bold text-white mb-2">Đánh giá mức độ nhớ của bạn:</h3>
              <p className="text-sm text-white/80">Chọn mức độ phù hợp để hệ thống quyết định số lần lặp lại</p>
            </div>
            <div className="flex justify-center space-x-4">
              <button
                type="button"
                onClick={() => {
                  console.log('Không nhớ button clicked');
                  handleAnswer('new');
                }}
                className="flex flex-col items-center space-y-2 bg-red-500/80 backdrop-blur-lg border border-red-400 text-white px-6 py-4 rounded-2xl hover:bg-red-600 transition-all duration-300 transform hover:scale-105"
                style={{ pointerEvents: 'auto' }}
              >
                <X className="w-6 h-6" />
                <span className="font-bold">Không nhớ</span>
                <span className="text-xs text-red-200">Học lại nhiều</span>
              </button>
              
              <button
                type="button"
                onClick={() => {
                  console.log('Nhớ vừa button clicked');
                  handleAnswer('learning');
                }}
                className="flex flex-col items-center space-y-2 bg-yellow-500/80 backdrop-blur-lg border border-yellow-400 text-white px-6 py-4 rounded-2xl hover:bg-yellow-600 transition-all duration-300 transform hover:scale-105"
                style={{ pointerEvents: 'auto' }}
              >
                <Star className="w-6 h-6" />
                <span className="font-bold">Nhớ vừa</span>
                <span className="text-xs text-yellow-200">Học lại ít</span>
              </button>
              
              <button
                type="button"
                onClick={() => {
                  console.log('Đã nhớ button clicked');
                  handleAnswer('mastered');
                }}
                className="flex flex-col items-center space-y-2 bg-green-500/80 backdrop-blur-lg border border-green-400 text-white px-6 py-4 rounded-2xl hover:bg-green-600 transition-all duration-300 transform hover:scale-105"
                style={{ pointerEvents: 'auto' }}
              >
                <Check className="w-6 h-6" />
                <span className="font-bold">Đã nhớ</span>
                <span className="text-xs text-green-200">Hoàn thành</span>
              </button>
            </div>
          </div>
        )}

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


        {/* Session Stats */}
        <div className="mt-8 bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6">
          <h3 className="text-xl font-bold text-white mb-4">Thống kê phiên học</h3>
          <div className="grid grid-cols-3 gap-4 text-center text-white">
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpacedRepetitionPage;
