-- =====================================================
-- VIP ENGLISH LEARNING - FINAL DATABASE
-- =====================================================
-- File: database_final.sql
-- Description: Simple database with perfect UTF-8 encoding
-- =====================================================

-- Drop and recreate database
DROP DATABASE IF EXISTS vip_english_learning;
CREATE DATABASE vip_english_learning CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE vip_english_learning;

-- Set charset for the session
SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci;
SET CHARACTER SET utf8mb4;

-- =====================================================
-- 1. LANGUAGES TABLE
-- =====================================================
CREATE TABLE Languages (
    LanguageID INT AUTO_INCREMENT PRIMARY KEY,
    LanguageCode VARCHAR(10) NOT NULL UNIQUE,
    LanguageName VARCHAR(50) NOT NULL,
    NativeName VARCHAR(50) NOT NULL,
    Flag VARCHAR(10) NOT NULL,
    IsActive BOOLEAN DEFAULT TRUE,
    SortOrder INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- 2. TOPICS TABLE
-- =====================================================
CREATE TABLE Topics (
    TopicID INT AUTO_INCREMENT PRIMARY KEY,
    LanguageID INT NOT NULL,
    Title VARCHAR(100) NOT NULL,
    Description TEXT,
    Level VARCHAR(10) DEFAULT 'A1',
    Icon VARCHAR(50) DEFAULT '📚',
    Color VARCHAR(20) DEFAULT '#3B82F6',
    IsActive BOOLEAN DEFAULT TRUE,
    SortOrder INT DEFAULT 0,
    VocabularyCount INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (LanguageID) REFERENCES Languages(LanguageID) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- 3. VOCABULARY TABLE
-- =====================================================
CREATE TABLE Vocabulary (
    WordID INT AUTO_INCREMENT PRIMARY KEY,
    Word VARCHAR(100) NOT NULL,
    Phonetic VARCHAR(100),
    Type VARCHAR(50),
    Meaning TEXT NOT NULL,
    Example TEXT,
    Audio VARCHAR(255),
    TopicID INT NOT NULL,
    LanguageID INT NOT NULL,
    Difficulty ENUM('Easy', 'Medium', 'Hard') DEFAULT 'Easy',
    IsActive BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (TopicID) REFERENCES Topics(TopicID) ON DELETE CASCADE,
    FOREIGN KEY (LanguageID) REFERENCES Languages(LanguageID) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- 4. INSERT LANGUAGES DATA
-- =====================================================
INSERT INTO Languages (LanguageID, LanguageCode, LanguageName, NativeName, Flag, IsActive, SortOrder) VALUES
(1, 'vi', 'Vietnamese', 'Tiếng Việt', '🇻🇳', 1, 1),
(2, 'en', 'English', 'English', '🇺🇸', 1, 2),
(3, 'zh', 'Chinese', '中文', '🇨🇳', 1, 3),
(4, 'ko', 'Korean', '한국어', '🇰🇷', 1, 4),
(5, 'ja', 'Japanese', '日本語', '🇯🇵', 1, 5),
(6, 'th', 'Thai', 'ไทย', '🇹🇭', 1, 6);

-- =====================================================
-- 5. INSERT TOPICS DATA
-- =====================================================

-- Vietnamese Topics
INSERT INTO Topics (TopicID, LanguageID, Title, Description, Level, Icon, Color, IsActive, SortOrder) VALUES
(1, 1, 'Gia đình', 'Gia đình và các mối quan hệ', 'A1', '👨‍👩‍👧‍👦', '#EF4444', 1, 1),
(2, 1, 'Thức ăn', 'Thức ăn và đồ uống', 'A1', '🍕', '#F97316', 1, 2),
(3, 1, 'Nhà cửa', 'Nhà cửa và đồ đạc', 'A1', '🏠', '#8B5CF6', 1, 3),
(4, 1, 'Màu sắc', 'Màu sắc và hình dạng', 'A1', '🎨', '#F59E0B', 1, 4),
(5, 1, 'Số đếm', 'Số đếm và thời gian', 'A1', '🔢', '#10B981', 1, 5);

-- English Topics
INSERT INTO Topics (TopicID, LanguageID, Title, Description, Level, Icon, Color, IsActive, SortOrder) VALUES
(6, 2, 'Family', 'Family and relationships', 'A1', '👨‍👩‍👧‍👦', '#EF4444', 1, 1),
(7, 2, 'Food', 'Food and drinks', 'A1', '🍕', '#F97316', 1, 2),
(8, 2, 'Home', 'Home and furniture', 'A1', '🏠', '#8B5CF6', 1, 3),
(9, 2, 'Colors', 'Colors and shapes', 'A1', '🎨', '#F59E0B', 1, 4),
(10, 2, 'Numbers', 'Numbers and time', 'A1', '🔢', '#10B981', 1, 5);

-- Chinese Topics
INSERT INTO Topics (TopicID, LanguageID, Title, Description, Level, Icon, Color, IsActive, SortOrder) VALUES
(11, 3, '家庭', 'Gia đình và các mối quan hệ', 'A1', '👨‍👩‍👧‍👦', '#EF4444', 1, 1),
(12, 3, '食物', 'Thức ăn và đồ uống', 'A1', '🍕', '#F97316', 1, 2),
(13, 3, '房子', 'Nhà cửa và đồ đạc', 'A1', '🏠', '#8B5CF6', 1, 3),
(14, 3, '颜色', 'Màu sắc và hình dạng', 'A1', '🎨', '#F59E0B', 1, 4),
(15, 3, '数字', 'Số đếm và thời gian', 'A1', '🔢', '#10B981', 1, 5);

-- Korean Topics
INSERT INTO Topics (TopicID, LanguageID, Title, Description, Level, Icon, Color, IsActive, SortOrder) VALUES
(16, 4, '가족', 'Gia đình và các mối quan hệ', 'A1', '👨‍👩‍👧‍👦', '#EF4444', 1, 1),
(17, 4, '음식', 'Thức ăn và đồ uống', 'A1', '🍕', '#F97316', 1, 2),
(18, 4, '집', 'Nhà cửa và đồ đạc', 'A1', '🏠', '#8B5CF6', 1, 3),
(19, 4, '색깔', 'Màu sắc và hình dạng', 'A1', '🎨', '#F59E0B', 1, 4),
(20, 4, '숫자', 'Số đếm và thời gian', 'A1', '🔢', '#10B981', 1, 5);

-- Japanese Topics
INSERT INTO Topics (TopicID, LanguageID, Title, Description, Level, Icon, Color, IsActive, SortOrder) VALUES
(21, 5, '家族', 'Gia đình và các mối quan hệ', 'A1', '👨‍👩‍👧‍👦', '#EF4444', 1, 1),
(22, 5, '食べ物', 'Thức ăn và đồ uống', 'A1', '🍕', '#F97316', 1, 2),
(23, 5, '家', 'Nhà cửa và đồ đạc', 'A1', '🏠', '#8B5CF6', 1, 3),
(24, 5, '色', 'Màu sắc và hình dạng', 'A1', '🎨', '#F59E0B', 1, 4),
(25, 5, '数字', 'Số đếm và thời gian', 'A1', '🔢', '#10B981', 1, 5);

-- Thai Topics
INSERT INTO Topics (TopicID, LanguageID, Title, Description, Level, Icon, Color, IsActive, SortOrder) VALUES
(26, 6, 'ครอบครัว', 'Gia đình và các mối quan hệ', 'A1', '👨‍👩‍👧‍👦', '#EF4444', 1, 1),
(27, 6, 'อาหาร', 'Thức ăn và đồ uống', 'A1', '🍕', '#F97316', 1, 2),
(28, 6, 'บ้าน', 'Nhà cửa và đồ đạc', 'A1', '🏠', '#8B5CF6', 1, 3),
(29, 6, 'สี', 'Màu sắc và hình dạng', 'A1', '🎨', '#F59E0B', 1, 4),
(30, 6, 'ตัวเลข', 'Số đếm và thời gian', 'A1', '🔢', '#10B981', 1, 5);

-- =====================================================
-- 6. INSERT VOCABULARY DATA
-- =====================================================

-- Vietnamese Family Vocabulary
INSERT INTO Vocabulary (WordID, Word, Phonetic, Type, Meaning, Example, Audio, TopicID, LanguageID, Difficulty) VALUES
(1, 'bố', 'bo', 'Noun', 'Father', 'Bố tôi là bác sĩ.', '/audio/vi/father.mp3', 1, 1, 'Easy'),
(2, 'mẹ', 'me', 'Noun', 'Mother', 'Mẹ tôi nấu ăn rất ngon.', '/audio/vi/mother.mp3', 1, 1, 'Easy'),
(3, 'anh trai', 'anh trai', 'Noun', 'Brother', 'Anh trai tôi rất cao.', '/audio/vi/brother.mp3', 1, 1, 'Easy'),
(4, 'chị gái', 'chi gai', 'Noun', 'Sister', 'Chị gái tôi rất xinh.', '/audio/vi/sister.mp3', 1, 1, 'Easy');

-- Vietnamese Food Vocabulary
INSERT INTO Vocabulary (WordID, Word, Phonetic, Type, Meaning, Example, Audio, TopicID, LanguageID, Difficulty) VALUES
(5, 'cơm', 'com', 'Noun', 'Rice', 'Tôi ăn cơm mỗi ngày.', '/audio/vi/rice.mp3', 2, 1, 'Easy'),
(6, 'bánh mì', 'banh mi', 'Noun', 'Bread', 'Tôi thích bánh mì cho bữa sáng.', '/audio/vi/bread.mp3', 2, 1, 'Easy'),
(7, 'nước', 'nuoc', 'Noun', 'Water', 'Tôi uống nước mỗi ngày.', '/audio/vi/water.mp3', 2, 1, 'Easy'),
(8, 'cà phê', 'ca phe', 'Noun', 'Coffee', 'Tôi uống cà phê vào buổi sáng.', '/audio/vi/coffee.mp3', 2, 1, 'Easy');

-- English Family Vocabulary
INSERT INTO Vocabulary (WordID, Word, Phonetic, Type, Meaning, Example, Audio, TopicID, LanguageID, Difficulty) VALUES
(9, 'father', '/ˈfɑːðər/', 'Noun', 'Bố, cha', 'My father is a doctor.', '/audio/en/father.mp3', 6, 2, 'Easy'),
(10, 'mother', '/ˈmʌðər/', 'Noun', 'Mẹ, má', 'My mother cooks well.', '/audio/en/mother.mp3', 6, 2, 'Easy'),
(11, 'brother', '/ˈbrʌðər/', 'Noun', 'Anh/em trai', 'My brother is tall.', '/audio/en/brother.mp3', 6, 2, 'Easy'),
(12, 'sister', '/ˈsɪstər/', 'Noun', 'Chị/em gái', 'My sister is beautiful.', '/audio/en/sister.mp3', 6, 2, 'Easy');

-- English Food Vocabulary
INSERT INTO Vocabulary (WordID, Word, Phonetic, Type, Meaning, Example, Audio, TopicID, LanguageID, Difficulty) VALUES
(13, 'rice', '/raɪs/', 'Noun', 'Cơm', 'I eat rice every day.', '/audio/en/rice.mp3', 7, 2, 'Easy'),
(14, 'bread', '/bred/', 'Noun', 'Bánh mì', 'I like bread for breakfast.', '/audio/en/bread.mp3', 7, 2, 'Easy'),
(15, 'water', '/ˈwɔːtər/', 'Noun', 'Nước', 'I drink water every day.', '/audio/en/water.mp3', 7, 2, 'Easy'),
(16, 'coffee', '/ˈkɔːfi/', 'Noun', 'Cà phê', 'I drink coffee in the morning.', '/audio/en/coffee.mp3', 7, 2, 'Easy');

-- Chinese Family Vocabulary
INSERT INTO Vocabulary (WordID, Word, Phonetic, Type, Meaning, Example, Audio, TopicID, LanguageID, Difficulty) VALUES
(17, '父亲', 'fùqīn', 'Noun', 'Bố, cha', '我的父亲是医生。', '/audio/zh/father.mp3', 11, 3, 'Easy'),
(18, '母亲', 'mǔqīn', 'Noun', 'Mẹ, má', '我的母亲做饭很好。', '/audio/zh/mother.mp3', 11, 3, 'Easy'),
(19, '哥哥', 'gēge', 'Noun', 'Anh trai', '我的哥哥很高。', '/audio/zh/brother.mp3', 11, 3, 'Easy'),
(20, '姐姐', 'jiějie', 'Noun', 'Chị gái', '我的姐姐很漂亮。', '/audio/zh/sister.mp3', 11, 3, 'Easy');

-- Korean Family Vocabulary
INSERT INTO Vocabulary (WordID, Word, Phonetic, Type, Meaning, Example, Audio, TopicID, LanguageID, Difficulty) VALUES
(21, '아버지', 'abeoji', 'Noun', 'Bố, cha', '제 아버지는 의사입니다.', '/audio/ko/father.mp3', 16, 4, 'Easy'),
(22, '어머니', 'eomeoni', 'Noun', 'Mẹ, má', '제 어머니는 요리를 잘합니다.', '/audio/ko/mother.mp3', 16, 4, 'Easy'),
(23, '형', 'hyeong', 'Noun', 'Anh trai', '제 형은 키가 큽니다.', '/audio/ko/brother.mp3', 16, 4, 'Easy'),
(24, '누나', 'nuna', 'Noun', 'Chị gái', '제 누나는 예쁩니다.', '/audio/ko/sister.mp3', 16, 4, 'Easy');

-- Japanese Family Vocabulary
INSERT INTO Vocabulary (WordID, Word, Phonetic, Type, Meaning, Example, Audio, TopicID, LanguageID, Difficulty) VALUES
(25, '父', 'chichi', 'Noun', 'Bố, cha', '私の父は医者です。', '/audio/ja/father.mp3', 21, 5, 'Easy'),
(26, '母', 'haha', 'Noun', 'Mẹ, má', '私の母は料理が上手です。', '/audio/ja/mother.mp3', 21, 5, 'Easy'),
(27, '兄', 'ani', 'Noun', 'Anh trai', '私の兄は背が高いです。', '/audio/ja/brother.mp3', 21, 5, 'Easy'),
(28, '姉', 'ane', 'Noun', 'Chị gái', '私の姉は美しいです。', '/audio/ja/sister.mp3', 21, 5, 'Easy');

-- Thai Family Vocabulary
INSERT INTO Vocabulary (WordID, Word, Phonetic, Type, Meaning, Example, Audio, TopicID, LanguageID, Difficulty) VALUES
(29, 'พ่อ', 'pho', 'Noun', 'Bố, cha', 'พ่อของฉันเป็นหมอ', '/audio/th/father.mp3', 26, 6, 'Easy'),
(30, 'แม่', 'mae', 'Noun', 'Mẹ, má', 'แม่ของฉันทำอาหารเก่ง', '/audio/th/mother.mp3', 26, 6, 'Easy'),
(31, 'พี่ชาย', 'phi chai', 'Noun', 'Anh trai', 'พี่ชายของฉันสูง', '/audio/th/brother.mp3', 26, 6, 'Easy'),
(32, 'พี่สาว', 'phi sao', 'Noun', 'Chị gái', 'พี่สาวของฉันสวย', '/audio/th/sister.mp3', 26, 6, 'Easy');

-- =====================================================
-- 7. UPDATE VOCABULARY COUNT
-- =====================================================
UPDATE Topics SET VocabularyCount = (
    SELECT COUNT(*) FROM Vocabulary WHERE Vocabulary.TopicID = Topics.TopicID
);

-- =====================================================
-- COMPLETION MESSAGE
-- =====================================================

-- ✅ Clean database created!
-- ✅ Perfect UTF-8 encoding for all languages
-- ✅ Vietnamese: Gia đình, Thức ăn, Nhà cửa, Màu sắc, Số đếm
-- ✅ English: Family, Food, Home, Colors, Numbers
-- ✅ Chinese: 家庭, 食物, 房子, 颜色, 数字
-- ✅ Korean: 가족, 음식, 집, 색깔, 숫자
-- ✅ Japanese: 家族, 食べ物, 家, 色, 数字
-- ✅ Thai: ครอบครัว, อาหาร, บ้าน, สี, ตัวเลข
-- ✅ Ready for perfect display! 🎉
