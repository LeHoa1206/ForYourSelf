import React, { useState, useEffect, useRef } from 'react'

interface Language {
  LanguageID: number
  Name: string
  NativeName: string
  Flag: string
  Code: string
}

interface Topic {
  TopicID: number
  Title: string
  Description: string
  Level: string
  Icon: string
  VocabularyCount?: number
  LanguageID: number
}

interface Vocabulary {
  WordID: number
  Word: string
  Phonetic?: string
  Type: string
  Meaning: string
  Example?: string
  Audio?: string
  TopicID: number
  LanguageID: number
}

interface StudyMethod {
  MethodID: number
  MethodCode: string
  MethodName: string
  Description: string
  Icon: string
}

interface StudySession {
  SessionID: number
  UserID: number
  LanguageID: number
  TopicID: number
  MethodID: number
  StartTime: string
  EndTime?: string
  WordsStudied: number
  CorrectAnswers: number
  TotalAnswers: number
  Score: number
}

const VocabularyLearningPage: React.FC = () => {
  const [languages, setLanguages] = useState<Language[]>([])
  const [topics, setTopics] = useState<Topic[]>([])
  const [vocabulary, setVocabulary] = useState<Vocabulary[]>([])
  const [studyMethods, setStudyMethods] = useState<StudyMethod[]>([])
  
  const [selectedLanguage, setSelectedLanguage] = useState<Language | null>(null)
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null)
  const [selectedMethod, setSelectedMethod] = useState<StudyMethod | null>(null)
  
  const [currentWordIndex, setCurrentWordIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [writingInput, setWritingInput] = useState('')
  const [showAnswer, setShowAnswer] = useState(false)
  const [studySession, setStudySession] = useState<StudySession | null>(null)
  
  const [loading, setLoading] = useState(true)
  const [studyMode, setStudyMode] = useState(false)
  const [studyStats, setStudyStats] = useState({
    correct: 0,
    studied: 0,
    time: 0
  })
  
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const startTimeRef = useRef<number>(Date.now())

  // Sample data for fallback
  const sampleLanguages: Language[] = [
    { LanguageID: 1, Name: 'English', NativeName: 'English', Flag: '🇺🇸', Code: 'en' },
    { LanguageID: 2, Name: 'Chinese', NativeName: '中文', Flag: '🇨🇳', Code: 'zh' },
    { LanguageID: 3, Name: 'Korean', NativeName: '한국어', Flag: '🇰🇷', Code: 'ko' },
    { LanguageID: 4, Name: 'Japanese', NativeName: '日本語', Flag: '🇯🇵', Code: 'ja' },
    { LanguageID: 5, Name: 'Thai', NativeName: 'ไทย', Flag: '🇹🇭', Code: 'th' }
  ]

  const sampleStudyMethods: StudyMethod[] = [
    { MethodID: 1, MethodCode: 'flashcard', MethodName: 'Flashcards', Description: 'Học từ vựng với thẻ ghi nhớ', Icon: '🃏' },
    { MethodID: 2, MethodCode: 'writing', MethodName: 'Luyện Viết', Description: 'Luyện viết từ vựng chính xác', Icon: '✍️' },
    { MethodID: 3, MethodCode: 'spaced', MethodName: 'Lặp Lại Ngắt Quãng', Description: 'Lặp lại theo khoảng thời gian', Icon: '🔄' }
  ]

  const sampleTopicsByLanguage: { [key: number]: Topic[] } = {
    1: [ // English
      { TopicID: 1, Title: 'Family', Description: 'Gia đình và các mối quan hệ', Level: 'A1', Icon: '👨‍👩‍👧‍👦', VocabularyCount: 4, LanguageID: 1 },
      { TopicID: 2, Title: 'Food', Description: 'Thức ăn và đồ uống', Level: 'A1', Icon: '🍕', VocabularyCount: 4, LanguageID: 1 },
      { TopicID: 7, Title: 'Travel', Description: 'Du lịch và phương tiện', Level: 'A2', Icon: '✈️', VocabularyCount: 4, LanguageID: 1 }
    ],
    2: [ // Chinese
      { TopicID: 1, Title: '家庭', Description: 'Gia đình và các mối quan hệ', Level: 'A1', Icon: '👨‍👩‍👧‍👦', VocabularyCount: 4, LanguageID: 2 },
      { TopicID: 2, Title: '食物', Description: 'Thức ăn và đồ uống', Level: 'A1', Icon: '🍕', VocabularyCount: 4, LanguageID: 2 },
      { TopicID: 7, Title: '旅行', Description: 'Du lịch và phương tiện', Level: 'A2', Icon: '✈️', VocabularyCount: 4, LanguageID: 2 }
    ],
    3: [ // Korean
      { TopicID: 1, Title: '가족', Description: 'Gia đình và các mối quan hệ', Level: 'A1', Icon: '👨‍👩‍👧‍👦', VocabularyCount: 4, LanguageID: 3 },
      { TopicID: 2, Title: '음식', Description: 'Thức ăn và đồ uống', Level: 'A1', Icon: '🍕', VocabularyCount: 4, LanguageID: 3 },
      { TopicID: 7, Title: '여행', Description: 'Du lịch và phương tiện', Level: 'A2', Icon: '✈️', VocabularyCount: 4, LanguageID: 3 }
    ],
    4: [ // Japanese
      { TopicID: 1, Title: '家族', Description: 'Gia đình và các mối quan hệ', Level: 'A1', Icon: '👨‍👩‍👧‍👦', VocabularyCount: 4, LanguageID: 4 },
      { TopicID: 2, Title: '食べ物', Description: 'Thức ăn và đồ uống', Level: 'A1', Icon: '🍕', VocabularyCount: 4, LanguageID: 4 },
      { TopicID: 7, Title: '旅行', Description: 'Du lịch và phương tiện', Level: 'A2', Icon: '✈️', VocabularyCount: 4, LanguageID: 4 }
    ],
    5: [ // Thai
      { TopicID: 1, Title: 'ครอบครัว', Description: 'Gia đình và các mối quan hệ', Level: 'A1', Icon: '👨‍👩‍👧‍👦', VocabularyCount: 4, LanguageID: 5 },
      { TopicID: 2, Title: 'อาหาร', Description: 'Thức ăn và đồ uống', Level: 'A1', Icon: '🍕', VocabularyCount: 4, LanguageID: 5 },
      { TopicID: 7, Title: 'การเดินทาง', Description: 'Du lịch và phương tiện', Level: 'A2', Icon: '✈️', VocabularyCount: 4, LanguageID: 5 }
    ]
  }

  const sampleVocabularyByLanguage: { [key: number]: { [key: number]: Vocabulary[] } } = {
    1: { // English
      1: [
        { WordID: 1, Word: 'father', Phonetic: '/ˈfɑːðər/', Type: 'Noun', Meaning: 'Bố, cha', Example: 'My father is a doctor.', Audio: '/audio/father.mp3', TopicID: 1, LanguageID: 1 },
        { WordID: 2, Word: 'mother', Phonetic: '/ˈmʌðər/', Type: 'Noun', Meaning: 'Mẹ, má', Example: 'My mother cooks well.', Audio: '/audio/mother.mp3', TopicID: 1, LanguageID: 1 },
        { WordID: 3, Word: 'brother', Phonetic: '/ˈbrʌðər/', Type: 'Noun', Meaning: 'Anh/em trai', Example: 'My brother is tall.', Audio: '/audio/brother.mp3', TopicID: 1, LanguageID: 1 },
        { WordID: 4, Word: 'sister', Phonetic: '/ˈsɪstər/', Type: 'Noun', Meaning: 'Chị/em gái', Example: 'My sister is beautiful.', Audio: '/audio/sister.mp3', TopicID: 1, LanguageID: 1 }
      ],
      2: [
        { WordID: 5, Word: 'rice', Phonetic: '/raɪs/', Type: 'Noun', Meaning: 'Cơm', Example: 'I eat rice every day.', Audio: '/audio/rice.mp3', TopicID: 2, LanguageID: 1 },
        { WordID: 6, Word: 'bread', Phonetic: '/bred/', Type: 'Noun', Meaning: 'Bánh mì', Example: 'I like bread for breakfast.', Audio: '/audio/bread.mp3', TopicID: 2, LanguageID: 1 },
        { WordID: 7, Word: 'water', Phonetic: '/ˈwɔːtər/', Type: 'Noun', Meaning: 'Nước', Example: 'I drink water every day.', Audio: '/audio/water.mp3', TopicID: 2, LanguageID: 1 },
        { WordID: 8, Word: 'coffee', Phonetic: '/ˈkɔːfi/', Type: 'Noun', Meaning: 'Cà phê', Example: 'I drink coffee in the morning.', Audio: '/audio/coffee.mp3', TopicID: 2, LanguageID: 1 }
      ],
      7: [
        { WordID: 9, Word: 'car', Phonetic: '/kɑːr/', Type: 'Noun', Meaning: 'Xe ô tô', Example: 'I drive a car to work.', Audio: '/audio/car.mp3', TopicID: 7, LanguageID: 1 },
        { WordID: 10, Word: 'plane', Phonetic: '/pleɪn/', Type: 'Noun', Meaning: 'Máy bay', Example: 'I travel by plane.', Audio: '/audio/plane.mp3', TopicID: 7, LanguageID: 1 },
        { WordID: 11, Word: 'hotel', Phonetic: '/hoʊˈtel/', Type: 'Noun', Meaning: 'Khách sạn', Example: 'I stay at a hotel.', Audio: '/audio/hotel.mp3', TopicID: 7, LanguageID: 1 },
        { WordID: 12, Word: 'passport', Phonetic: '/ˈpæspɔːrt/', Type: 'Noun', Meaning: 'Hộ chiếu', Example: 'I need a passport to travel.', Audio: '/audio/passport.mp3', TopicID: 7, LanguageID: 1 }
      ]
    },
    2: { // Chinese
      1: [
        { WordID: 1, Word: '父亲', Phonetic: 'fùqīn', Type: 'Noun', Meaning: 'Bố, cha', Example: '我的父亲是医生。', Audio: '/audio/father_zh.mp3', TopicID: 1, LanguageID: 2 },
        { WordID: 2, Word: '母亲', Phonetic: 'mǔqīn', Type: 'Noun', Meaning: 'Mẹ, má', Example: '我的母亲做饭很好。', Audio: '/audio/mother_zh.mp3', TopicID: 1, LanguageID: 2 },
        { WordID: 3, Word: '兄弟', Phonetic: 'xiōngdì', Type: 'Noun', Meaning: 'Anh/em trai', Example: '我的兄弟很高。', Audio: '/audio/brother_zh.mp3', TopicID: 1, LanguageID: 2 },
        { WordID: 4, Word: '姐妹', Phonetic: 'jiěmèi', Type: 'Noun', Meaning: 'Chị/em gái', Example: '我的姐妹很漂亮。', Audio: '/audio/sister_zh.mp3', TopicID: 1, LanguageID: 2 }
      ],
      2: [
        { WordID: 5, Word: '米饭', Phonetic: 'mǐfàn', Type: 'Noun', Meaning: 'Cơm', Example: '我每天吃米饭。', Audio: '/audio/rice_zh.mp3', TopicID: 2, LanguageID: 2 },
        { WordID: 6, Word: '面包', Phonetic: 'miànbāo', Type: 'Noun', Meaning: 'Bánh mì', Example: '我喜欢早餐吃面包。', Audio: '/audio/bread_zh.mp3', TopicID: 2, LanguageID: 2 },
        { WordID: 7, Word: '水', Phonetic: 'shuǐ', Type: 'Noun', Meaning: 'Nước', Example: '我每天喝水。', Audio: '/audio/water_zh.mp3', TopicID: 2, LanguageID: 2 },
        { WordID: 8, Word: '咖啡', Phonetic: 'kāfēi', Type: 'Noun', Meaning: 'Cà phê', Example: '我早上喝咖啡。', Audio: '/audio/coffee_zh.mp3', TopicID: 2, LanguageID: 2 }
      ],
      7: [
        { WordID: 9, Word: '汽车', Phonetic: 'qìchē', Type: 'Noun', Meaning: 'Xe ô tô', Example: '我开车上班。', Audio: '/audio/car_zh.mp3', TopicID: 7, LanguageID: 2 },
        { WordID: 10, Word: '飞机', Phonetic: 'fēijī', Type: 'Noun', Meaning: 'Máy bay', Example: '我坐飞机旅行。', Audio: '/audio/plane_zh.mp3', TopicID: 7, LanguageID: 2 },
        { WordID: 11, Word: '酒店', Phonetic: 'jiǔdiàn', Type: 'Noun', Meaning: 'Khách sạn', Example: '我住在酒店。', Audio: '/audio/hotel_zh.mp3', TopicID: 7, LanguageID: 2 },
        { WordID: 12, Word: '护照', Phonetic: 'hùzhào', Type: 'Noun', Meaning: 'Hộ chiếu', Example: '我需要护照旅行。', Audio: '/audio/passport_zh.mp3', TopicID: 7, LanguageID: 2 }
      ]
    },
    3: { // Korean
      1: [
        { WordID: 1, Word: '아버지', Phonetic: 'abeoji', Type: 'Noun', Meaning: 'Bố, cha', Example: '제 아버지는 의사입니다.', Audio: '/audio/father_ko.mp3', TopicID: 1, LanguageID: 3 },
        { WordID: 2, Word: '어머니', Phonetic: 'eomeoni', Type: 'Noun', Meaning: 'Mẹ, má', Example: '제 어머니는 요리를 잘하세요.', Audio: '/audio/mother_ko.mp3', TopicID: 1, LanguageID: 3 },
        { WordID: 3, Word: '형제', Phonetic: 'hyeongje', Type: 'Noun', Meaning: 'Anh/em trai', Example: '제 형제는 키가 큽니다.', Audio: '/audio/brother_ko.mp3', TopicID: 1, LanguageID: 3 },
        { WordID: 4, Word: '자매', Phonetic: 'jamae', Type: 'Noun', Meaning: 'Chị/em gái', Example: '제 자매는 예쁩니다.', Audio: '/audio/sister_ko.mp3', TopicID: 1, LanguageID: 3 }
      ],
      2: [
        { WordID: 5, Word: '밥', Phonetic: 'bap', Type: 'Noun', Meaning: 'Cơm', Example: '저는 매일 밥을 먹습니다.', Audio: '/audio/rice_ko.mp3', TopicID: 2, LanguageID: 3 },
        { WordID: 6, Word: '빵', Phonetic: 'ppang', Type: 'Noun', Meaning: 'Bánh mì', Example: '저는 아침에 빵을 좋아합니다.', Audio: '/audio/bread_ko.mp3', TopicID: 2, LanguageID: 3 },
        { WordID: 7, Word: '물', Phonetic: 'mul', Type: 'Noun', Meaning: 'Nước', Example: '저는 매일 물을 마십니다.', Audio: '/audio/water_ko.mp3', TopicID: 2, LanguageID: 3 },
        { WordID: 8, Word: '커피', Phonetic: 'keopi', Type: 'Noun', Meaning: 'Cà phê', Example: '저는 아침에 커피를 마십니다.', Audio: '/audio/coffee_ko.mp3', TopicID: 2, LanguageID: 3 }
      ],
      7: [
        { WordID: 9, Word: '자동차', Phonetic: 'jadongcha', Type: 'Noun', Meaning: 'Xe ô tô', Example: '저는 자동차로 출근합니다.', Audio: '/audio/car_ko.mp3', TopicID: 7, LanguageID: 3 },
        { WordID: 10, Word: '비행기', Phonetic: 'bihaenggi', Type: 'Noun', Meaning: 'Máy bay', Example: '저는 비행기로 여행합니다.', Audio: '/audio/plane_ko.mp3', TopicID: 7, LanguageID: 3 },
        { WordID: 11, Word: '호텔', Phonetic: 'hotel', Type: 'Noun', Meaning: 'Khách sạn', Example: '저는 호텔에 머물러요.', Audio: '/audio/hotel_ko.mp3', TopicID: 7, LanguageID: 3 },
        { WordID: 12, Word: '여권', Phonetic: 'yeogwon', Type: 'Noun', Meaning: 'Hộ chiếu', Example: '여행하려면 여권이 필요해요.', Audio: '/audio/passport_ko.mp3', TopicID: 7, LanguageID: 3 }
      ]
    },
    4: { // Japanese
      1: [
        { WordID: 1, Word: '父', Phonetic: 'chichi', Type: 'Noun', Meaning: 'Bố, cha', Example: '私の父は医者です。', Audio: '/audio/father_ja.mp3', TopicID: 1, LanguageID: 4 },
        { WordID: 2, Word: '母', Phonetic: 'haha', Type: 'Noun', Meaning: 'Mẹ, má', Example: '私の母は料理が上手です。', Audio: '/audio/mother_ja.mp3', TopicID: 1, LanguageID: 4 },
        { WordID: 3, Word: '兄弟', Phonetic: 'kyōdai', Type: 'Noun', Meaning: 'Anh/em trai', Example: '私の兄弟は背が高いです。', Audio: '/audio/brother_ja.mp3', TopicID: 1, LanguageID: 4 },
        { WordID: 4, Word: '姉妹', Phonetic: 'shimai', Type: 'Noun', Meaning: 'Chị/em gái', Example: '私の姉妹は美しいです。', Audio: '/audio/sister_ja.mp3', TopicID: 1, LanguageID: 4 }
      ],
      2: [
        { WordID: 5, Word: 'ご飯', Phonetic: 'gohan', Type: 'Noun', Meaning: 'Cơm', Example: '私は毎日ご飯を食べます。', Audio: '/audio/rice_ja.mp3', TopicID: 2, LanguageID: 4 },
        { WordID: 6, Word: 'パン', Phonetic: 'pan', Type: 'Noun', Meaning: 'Bánh mì', Example: '私は朝食にパンが好きです。', Audio: '/audio/bread_ja.mp3', TopicID: 2, LanguageID: 4 },
        { WordID: 7, Word: '水', Phonetic: 'mizu', Type: 'Noun', Meaning: 'Nước', Example: '私は毎日水を飲みます。', Audio: '/audio/water_ja.mp3', TopicID: 2, LanguageID: 4 },
        { WordID: 8, Word: 'コーヒー', Phonetic: 'kōhī', Type: 'Noun', Meaning: 'Cà phê', Example: '私は朝にコーヒーを飲みます。', Audio: '/audio/coffee_ja.mp3', TopicID: 2, LanguageID: 4 }
      ],
      7: [
        { WordID: 9, Word: '車', Phonetic: 'kuruma', Type: 'Noun', Meaning: 'Xe ô tô', Example: '私は車で通勤します。', Audio: '/audio/car_ja.mp3', TopicID: 7, LanguageID: 4 },
        { WordID: 10, Word: '飛行機', Phonetic: 'hikōki', Type: 'Noun', Meaning: 'Máy bay', Example: '私は飛行機で旅行します。', Audio: '/audio/plane_ja.mp3', TopicID: 7, LanguageID: 4 },
        { WordID: 11, Word: 'ホテル', Phonetic: 'hoteru', Type: 'Noun', Meaning: 'Khách sạn', Example: '私はホテルに泊まります。', Audio: '/audio/hotel_ja.mp3', TopicID: 7, LanguageID: 4 },
        { WordID: 12, Word: 'パスポート', Phonetic: 'pasupōto', Type: 'Noun', Meaning: 'Hộ chiếu', Example: '旅行にはパスポートが必要です。', Audio: '/audio/passport_ja.mp3', TopicID: 7, LanguageID: 4 }
      ]
    },
    5: { // Thai
      1: [
        { WordID: 1, Word: 'พ่อ', Phonetic: 'pho', Type: 'Noun', Meaning: 'Bố, cha', Example: 'พ่อของฉันเป็นหมอ', Audio: '/audio/father_th.mp3', TopicID: 1, LanguageID: 5 },
        { WordID: 2, Word: 'แม่', Phonetic: 'mae', Type: 'Noun', Meaning: 'Mẹ, má', Example: 'แม่ของฉันทำอาหารเก่ง', Audio: '/audio/mother_th.mp3', TopicID: 1, LanguageID: 5 },
        { WordID: 3, Word: 'พี่ชาย', Phonetic: 'phi chai', Type: 'Noun', Meaning: 'Anh/em trai', Example: 'พี่ชายของฉันสูง', Audio: '/audio/brother_th.mp3', TopicID: 1, LanguageID: 5 },
        { WordID: 4, Word: 'พี่สาว', Phonetic: 'phi sao', Type: 'Noun', Meaning: 'Chị/em gái', Example: 'พี่สาวของฉันสวย', Audio: '/audio/sister_th.mp3', TopicID: 1, LanguageID: 5 }
      ],
      2: [
        { WordID: 5, Word: 'ข้าว', Phonetic: 'khao', Type: 'Noun', Meaning: 'Cơm', Example: 'ฉันกินข้าวทุกวัน', Audio: '/audio/rice_th.mp3', TopicID: 2, LanguageID: 5 },
        { WordID: 6, Word: 'ขนมปัง', Phonetic: 'khanom pang', Type: 'Noun', Meaning: 'Bánh mì', Example: 'ฉันชอบขนมปังตอนเช้า', Audio: '/audio/bread_th.mp3', TopicID: 2, LanguageID: 5 },
        { WordID: 7, Word: 'น้ำ', Phonetic: 'nam', Type: 'Noun', Meaning: 'Nước', Example: 'ฉันดื่มน้ำทุกวัน', Audio: '/audio/water_th.mp3', TopicID: 2, LanguageID: 5 },
        { WordID: 8, Word: 'กาแฟ', Phonetic: 'ka-fae', Type: 'Noun', Meaning: 'Cà phê', Example: 'ฉันดื่มกาแฟตอนเช้า', Audio: '/audio/coffee_th.mp3', TopicID: 2, LanguageID: 5 }
      ],
      7: [
        { WordID: 9, Word: 'รถ', Phonetic: 'rot', Type: 'Noun', Meaning: 'Xe ô tô', Example: 'ฉันขับรถไปทำงาน', Audio: '/audio/car_th.mp3', TopicID: 7, LanguageID: 5 },
        { WordID: 10, Word: 'เครื่องบิน', Phonetic: 'khrueang bin', Type: 'Noun', Meaning: 'Máy bay', Example: 'ฉันเดินทางด้วยเครื่องบิน', Audio: '/audio/plane_th.mp3', TopicID: 7, LanguageID: 5 },
        { WordID: 11, Word: 'โรงแรม', Phonetic: 'rong raem', Type: 'Noun', Meaning: 'Khách sạn', Example: 'ฉันพักที่โรงแรม', Audio: '/audio/hotel_th.mp3', TopicID: 7, LanguageID: 5 },
        { WordID: 12, Word: 'หนังสือเดินทาง', Phonetic: 'nang sue doen thang', Type: 'Noun', Meaning: 'Hộ chiếu', Example: 'ฉันต้องใช้หนังสือเดินทางเพื่อเดินทาง', Audio: '/audio/passport_th.mp3', TopicID: 7, LanguageID: 5 }
      ]
    }
  }

  useEffect(() => {
    fetchLanguages()
    fetchStudyMethods()
  }, [])

  useEffect(() => {
    if (selectedLanguage) {
      fetchTopics(selectedLanguage.LanguageID)
    }
  }, [selectedLanguage])

  useEffect(() => {
    if (selectedTopic) {
      fetchVocabulary(selectedTopic.TopicID)
    }
  }, [selectedTopic])

  const fetchLanguages = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/languages')
      if (response.ok) {
        const result = await response.json()
        if (result.success) {
          setLanguages(result.data)
        } else {
          setLanguages(sampleLanguages)
        }
      } else {
        setLanguages(sampleLanguages)
      }
    } catch (error) {
      console.error('Failed to fetch languages:', error)
      setLanguages(sampleLanguages)
    }
  }

  const fetchTopics = async (languageId: number) => {
    try {
      const response = await fetch(`http://localhost:8000/api/topics?languageId=${languageId}`)
      if (response.ok) {
        const result = await response.json()
        if (result.success) {
          setTopics(result.data)
        } else {
          setTopics(sampleTopicsByLanguage[languageId] || [])
        }
      } else {
        setTopics(sampleTopicsByLanguage[languageId] || [])
      }
    } catch (error) {
      console.error('Failed to fetch topics:', error)
      setTopics(sampleTopicsByLanguage[languageId] || [])
    }
  }

  const fetchVocabulary = async (topicId: number) => {
    try {
      const response = await fetch(`http://localhost:8000/api/vocabulary?topicId=${topicId}`)
      if (response.ok) {
        const result = await response.json()
        if (result.success) {
          setVocabulary(result.data)
        } else {
          const languageId = selectedLanguage?.LanguageID || 1
          setVocabulary(sampleVocabularyByLanguage[languageId]?.[topicId] || [])
        }
      } else {
        const languageId = selectedLanguage?.LanguageID || 1
        setVocabulary(sampleVocabularyByLanguage[languageId]?.[topicId] || [])
      }
    } catch (error) {
      console.error('Failed to fetch vocabulary:', error)
      const languageId = selectedLanguage?.LanguageID || 1
      setVocabulary(sampleVocabularyByLanguage[languageId]?.[topicId] || [])
    }
  }

  const fetchStudyMethods = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/study-methods')
      if (response.ok) {
        const result = await response.json()
        if (result.success) {
          setStudyMethods(result.data)
        } else {
          setStudyMethods(sampleStudyMethods)
        }
      } else {
        setStudyMethods(sampleStudyMethods)
      }
    } catch (error) {
      console.error('Failed to fetch study methods:', error)
      setStudyMethods(sampleStudyMethods)
    }
  }

  const startLearning = async () => {
    if (!selectedLanguage || !selectedTopic || !selectedMethod) return

    try {
      const response = await fetch('http://localhost:8000/api/study-sessions-detailed', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          UserID: 1,
          LanguageID: selectedLanguage.LanguageID,
          TopicID: selectedTopic.TopicID,
          MethodID: selectedMethod.MethodID,
          StartTime: new Date().toISOString()
        })
      })

      if (response.ok) {
        const result = await response.json()
        if (result.success) {
          setStudySession(result.data)
        }
      }
    } catch (error) {
      console.error('Failed to start learning session:', error)
    }

    setStudyMode(true)
    setCurrentWordIndex(0)
    setIsFlipped(false)
    setWritingInput('')
    setShowAnswer(false)
    setStudyStats({ correct: 0, studied: 0, time: 0 })
    startTimeRef.current = Date.now()
  }

  const playAudio = (audioUrl: string) => {
    if (audioRef.current) {
      audioRef.current.src = audioUrl
      audioRef.current.play()
      setIsPlaying(true)
      audioRef.current.onended = () => setIsPlaying(false)
      audioRef.current.onerror = () => {
        console.error('Error playing audio:', audioUrl)
        setIsPlaying(false)
      }
    }
  }

  const flipCard = () => {
    setIsFlipped(!isFlipped)
    setStudyStats(prev => ({ ...prev, studied: prev.studied + 1 }))
  }

  const nextWord = () => {
    if (currentWordIndex < vocabulary.length - 1) {
      setCurrentWordIndex(currentWordIndex + 1)
      setIsFlipped(false)
      setWritingInput('')
      setShowAnswer(false)
    }
  }

  const prevWord = () => {
    if (currentWordIndex > 0) {
      setCurrentWordIndex(currentWordIndex - 1)
      setIsFlipped(false)
      setWritingInput('')
      setShowAnswer(false)
    }
  }

  const checkWriting = () => {
    const currentWord = vocabulary[currentWordIndex]
    if (currentWord && writingInput.toLowerCase() === currentWord.Word.toLowerCase()) {
      setStudyStats(prev => ({ ...prev, correct: prev.correct + 1 }))
      setShowAnswer(true)
    } else {
      setShowAnswer(true)
    }
  }

  const reviewWord = (quality: number) => {
    // Spaced repetition logic
    setStudyStats(prev => ({ ...prev, correct: prev.correct + (quality >= 3 ? 1 : 0) }))
    nextWord()
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'A1': return 'bg-green-500'
      case 'A2': return 'bg-yellow-500'
      case 'B1': return 'bg-orange-500'
      case 'B2': return 'bg-red-500'
      case 'C1': return 'bg-purple-500'
      case 'C2': return 'bg-pink-500'
      default: return 'bg-gray-500'
    }
  }

  const getMethodIcon = (methodCode: string) => {
    switch (methodCode) {
      case 'flashcard': return '🃏'
      case 'writing': return '✍️'
      case 'spaced': return '🔄'
      default: return '📚'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-800 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold mb-2">Đang tải...</h2>
          <p className="text-lg opacity-80">Vui lòng chờ trong giây lát</p>
        </div>
      </div>
    )
  }

  if (studyMode && selectedLanguage && selectedTopic && selectedMethod) {
    const currentWord = vocabulary[currentWordIndex]
    const progress = ((currentWordIndex + 1) / vocabulary.length) * 100

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-800 text-white p-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <span className="text-2xl mr-3">{selectedLanguage.Flag}</span>
              <h1 className="text-3xl font-bold">{selectedMethod.MethodName}</h1>
              <span className="text-2xl ml-3">{selectedTopic.Icon}</span>
            </div>
            <p className="text-lg opacity-80 mb-4">{selectedTopic.Title}</p>
            
            {/* Progress Bar */}
            <div className="w-full bg-white/20 rounded-full h-3 mb-4">
              <div 
                className="bg-gradient-to-r from-green-400 to-blue-500 h-3 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            
            <p className="text-sm opacity-70">
              {currentWordIndex + 1} / {vocabulary.length} từ vựng
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-green-400">{studyStats.correct}</div>
              <div className="text-sm opacity-80">Đúng</div>
            </div>
            <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-blue-400">{studyStats.studied}</div>
              <div className="text-sm opacity-80">Đã học</div>
            </div>
            <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-purple-400">{Math.floor((Date.now() - startTimeRef.current) / 1000)}s</div>
              <div className="text-sm opacity-80">Thời gian</div>
            </div>
          </div>

          {/* Back Button */}
          <div className="text-center mb-6">
            <button
              onClick={() => setStudyMode(false)}
              className="px-6 py-3 bg-white/20 backdrop-blur-lg border border-white/30 rounded-full hover:bg-white/30 transition-all duration-300"
            >
              ← Quay lại
            </button>
          </div>

          {/* Word Card */}
          {currentWord && (
            <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-8 mb-8">
              <div className="text-center">
                {/* Word Info */}
                <div className="flex justify-center items-center mb-6">
                  <span className="text-2xl mr-3">{selectedLanguage.Flag}</span>
                  <span className="bg-white/20 rounded-full px-4 py-2 text-sm font-medium mr-3">
                    {selectedTopic.Title}
                  </span>
                  <span className={`rounded-full px-4 py-2 text-sm font-medium ${getDifficultyColor(selectedTopic.Level)}`}>
                    {selectedTopic.Level}
                  </span>
                </div>

                {/* Audio Button */}
                <button
                  onClick={() => playAudio(currentWord.Audio || '')}
                  className="mb-6 p-4 bg-white/20 rounded-full hover:bg-white/30 transition-all duration-300"
                >
                  {isPlaying ? '⏸️' : '🔊'}
                </button>

                {/* Flashcard */}
                {selectedMethod.MethodCode === 'flashcard' && (
                  <div className="mb-8">
                    <button
                      onClick={flipCard}
                      className="w-full h-64 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center text-white font-bold text-2xl hover:from-purple-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105"
                    >
                      {isFlipped ? (
                        <div className="text-center">
                          <div className="text-4xl mb-4">{currentWord.Meaning}</div>
                          <div className="text-lg opacity-80">"{currentWord.Example}"</div>
                        </div>
                      ) : (
                        <div className="text-center">
                          <div className="text-4xl mb-4">{currentWord.Word}</div>
                          <div className="text-lg opacity-80">/{currentWord.Phonetic}/</div>
                          <div className="text-sm opacity-60">{currentWord.Type}</div>
                        </div>
                      )}
                    </button>
                  </div>
                )}

                {/* Writing Practice */}
                {selectedMethod.MethodCode === 'writing' && (
                  <div className="mb-8">
                    <div className="text-center mb-6">
                      <h3 className="text-2xl font-bold mb-2">{currentWord.Meaning}</h3>
                      <p className="text-lg opacity-80 mb-4">"{currentWord.Example}"</p>
                      <p className="text-sm opacity-60">/{currentWord.Phonetic}/</p>
                    </div>
                    
                    <div className="max-w-md mx-auto">
                      <input
                        type="text"
                        value={writingInput}
                        onChange={(e) => setWritingInput(e.target.value)}
                        placeholder="Nhập từ vựng..."
                        className="w-full p-4 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50"
                        onKeyPress={(e) => e.key === 'Enter' && checkWriting()}
                      />
                      <button
                        onClick={checkWriting}
                        className="w-full mt-4 px-6 py-3 bg-gradient-to-r from-green-500 to-teal-500 rounded-lg font-bold hover:from-green-600 hover:to-teal-600 transition-all duration-300"
                      >
                        Kiểm tra
                      </button>
                      
                      {showAnswer && (
                        <div className="mt-4 p-4 bg-white/20 rounded-lg">
                          <p className="text-lg font-bold mb-2">Đáp án: {currentWord.Word}</p>
                          <p className={`text-sm ${writingInput.toLowerCase() === currentWord.Word.toLowerCase() ? 'text-green-400' : 'text-red-400'}`}>
                            {writingInput.toLowerCase() === currentWord.Word.toLowerCase() ? '✅ Đúng!' : '❌ Sai!'}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Spaced Repetition */}
                {selectedMethod.MethodCode === 'spaced' && (
                  <div className="mb-8">
                    <div className="text-center mb-6">
                      <h3 className="text-2xl font-bold mb-2">{currentWord.Word}</h3>
                      <p className="text-lg opacity-80 mb-4">/{currentWord.Phonetic}/</p>
                      <p className="text-sm opacity-60 mb-4">{currentWord.Type}</p>
                    </div>
                    
                    <button
                      onClick={flipCard}
                      className="w-full h-32 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center text-white font-bold text-xl hover:from-blue-600 hover:to-purple-600 transition-all duration-300 transform hover:scale-105 mb-6"
                    >
                      {isFlipped ? 'Ẩn nghĩa' : 'Xem nghĩa'}
                    </button>
                    
                    {isFlipped && (
                      <div className="text-center mb-6">
                        <div className="text-2xl font-bold mb-2">{currentWord.Meaning}</div>
                        <div className="text-lg opacity-80">"{currentWord.Example}"</div>
                      </div>
                    )}
                    
                    {isFlipped && (
                      <div className="grid grid-cols-2 gap-4">
                        <button
                          onClick={() => reviewWord(1)}
                          className="px-6 py-3 bg-red-500 rounded-lg font-bold hover:bg-red-600 transition-all duration-300"
                        >
                          😞 Khó
                        </button>
                        <button
                          onClick={() => reviewWord(2)}
                          className="px-6 py-3 bg-yellow-500 rounded-lg font-bold hover:bg-yellow-600 transition-all duration-300"
                        >
                          😐 Trung bình
                        </button>
                        <button
                          onClick={() => reviewWord(3)}
                          className="px-6 py-3 bg-green-500 rounded-lg font-bold hover:bg-green-600 transition-all duration-300"
                        >
                          😊 Dễ
                        </button>
                        <button
                          onClick={() => reviewWord(4)}
                          className="px-6 py-3 bg-blue-500 rounded-lg font-bold hover:bg-blue-600 transition-all duration-300"
                        >
                          🎉 Rất dễ
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* Navigation */}
                <div className="flex justify-between items-center">
                  <button
                    onClick={prevWord}
                    disabled={currentWordIndex === 0}
                    className="px-6 py-3 bg-white/20 rounded-lg font-bold hover:bg-white/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    ← Trước
                  </button>
                  
                  <span className="text-sm opacity-70">
                    {currentWordIndex + 1} / {vocabulary.length}
                  </span>
                  
                  <button
                    onClick={nextWord}
                    disabled={currentWordIndex === vocabulary.length - 1}
                    className="px-6 py-3 bg-white/20 rounded-lg font-bold hover:bg-white/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Sau →
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
        <audio ref={audioRef} />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-800 text-white p-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-yellow-400 to-pink-400 bg-clip-text text-transparent">
            🎓 Vocabulary Learning
          </h1>
          <p className="text-xl opacity-90">Chọn ngôn ngữ, chủ đề và phương pháp học</p>
        </div>

        {/* Language Selection */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 text-center">🌍 Chọn Ngôn Ngữ</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            {languages.map((language) => (
              <div
                key={language.LanguageID}
                onClick={() => setSelectedLanguage(language)}
                className={`cursor-pointer transform transition-all duration-300 hover:scale-105 hover:-translate-y-2 ${
                  selectedLanguage?.LanguageID === language.LanguageID ? 'ring-4 ring-yellow-400' : ''
                }`}
              >
                <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 text-center hover:bg-white/20 hover:shadow-2xl transition-all duration-300">
                  <div className="text-5xl mb-4">{language.Flag}</div>
                  <h3 className="text-xl font-bold mb-2">{language.NativeName}</h3>
                  <p className="text-lg opacity-80">{language.Name}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Topic Selection */}
        {selectedLanguage && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6 text-center">📚 Chọn Chủ Đề</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {topics.map((topic) => (
                <div
                  key={topic.TopicID}
                  onClick={() => setSelectedTopic(topic)}
                  className={`cursor-pointer transform transition-all duration-300 hover:scale-105 hover:-translate-y-2 ${
                    selectedTopic?.TopicID === topic.TopicID ? 'ring-4 ring-yellow-400' : ''
                  }`}
                >
                  <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 hover:bg-white/20 hover:shadow-2xl transition-all duration-300">
                    <div className="text-4xl mb-4">{topic.Icon}</div>
                    <h3 className="text-xl font-bold mb-2">{topic.Title}</h3>
                    <p className="text-sm opacity-80 mb-4">{topic.Description}</p>
                    <div className="flex justify-between items-center">
                      <span className="bg-white/20 rounded-full px-3 py-1 text-xs font-medium">
                        {topic.Level}
                      </span>
                      <span className="text-sm opacity-70">
                        {topic.VocabularyCount || 0} từ vựng
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Study Method Selection */}
        {selectedLanguage && selectedTopic && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6 text-center">🎯 Chọn Phương Pháp Học</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {studyMethods.map((method) => (
                <div
                  key={method.MethodID}
                  onClick={() => setSelectedMethod(method)}
                  className={`cursor-pointer transform transition-all duration-300 hover:scale-105 hover:-translate-y-2 ${
                    selectedMethod?.MethodID === method.MethodID ? 'ring-4 ring-yellow-400' : ''
                  }`}
                >
                  <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 hover:bg-white/20 hover:shadow-2xl transition-all duration-300">
                    <div className="text-4xl mb-4">{method.Icon}</div>
                    <h3 className="text-xl font-bold mb-2">{method.MethodName}</h3>
                    <p className="text-sm opacity-80">{method.Description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Start Learning Button */}
        {selectedLanguage && selectedTopic && selectedMethod && (
          <div className="text-center">
            <button
              onClick={startLearning}
              className="px-12 py-6 bg-gradient-to-r from-green-500 to-blue-500 rounded-full font-bold text-2xl hover:from-green-600 hover:to-blue-600 transform hover:scale-105 transition-all duration-300 shadow-2xl"
            >
              🚀 Bắt Đầu Học
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default VocabularyLearningPage
