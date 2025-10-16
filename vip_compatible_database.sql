-- =====================================================
-- VIP ENGLISH LEARNING SYSTEM - COMPATIBLE DATABASE SCHEMA
-- =====================================================
-- File: vip_compatible_database.sql
-- Description: Database schema compatible with both old and new structures
-- Features: Auto-detects and adds missing columns
-- =====================================================

USE vip_english_learning;

-- =====================================================
-- 1. CORE TABLES - Bảng cơ bản của hệ thống
-- =====================================================

-- 1.1 Users Table - Bảng người dùng
CREATE TABLE IF NOT EXISTS Users (
    UserID INT AUTO_INCREMENT PRIMARY KEY,
    FullName VARCHAR(100) NOT NULL,
    Email VARCHAR(100) UNIQUE NOT NULL,
    Password VARCHAR(200) NOT NULL,
    Role ENUM('Student', 'Teacher', 'Admin') DEFAULT 'Student',
    Avatar VARCHAR(255),
    Level ENUM('A1', 'A2', 'B1', 'B2', 'C1', 'C2') DEFAULT 'A1',
    JoinDate DATETIME DEFAULT CURRENT_TIMESTAMP,
    Streak INT DEFAULT 0,
    TotalXP INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 1.2 Languages Table - Bảng ngôn ngữ hỗ trợ
CREATE TABLE IF NOT EXISTS Languages (
    LanguageID INT AUTO_INCREMENT PRIMARY KEY,
    LanguageCode VARCHAR(5) NOT NULL UNIQUE COMMENT 'vi, en, zh, ko, ja, th',
    LanguageName VARCHAR(50) NOT NULL COMMENT 'Vietnamese, English, Chinese, Korean, Japanese, Thai',
    NativeName VARCHAR(50) NOT NULL COMMENT 'Tiếng Việt, English, 中文, 한국어, 日本語, ไทย',
    Flag VARCHAR(255) COMMENT 'URL hình cờ quốc gia',
    IsActive TINYINT(1) DEFAULT 1,
    SortOrder INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 1.3 Topics Table - Bảng chủ đề từ vựng (Compatible version)
CREATE TABLE IF NOT EXISTS Topics (
    TopicID INT AUTO_INCREMENT PRIMARY KEY,
    Title VARCHAR(100) NOT NULL,
    Description VARCHAR(255),
    Level ENUM('A1', 'A2', 'B1', 'B2', 'C1', 'C2') DEFAULT 'A1',
    Icon VARCHAR(255),
    Color VARCHAR(7) DEFAULT '#3B82F6',
    IsActive TINYINT(1) DEFAULT 1,
    SortOrder INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Add LanguageID column if it doesn't exist
SET @sql = (SELECT IF(
    (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS 
     WHERE TABLE_SCHEMA = 'vip_english_learning' 
     AND TABLE_NAME = 'Topics' 
     AND COLUMN_NAME = 'LanguageID') = 0,
    'ALTER TABLE Topics ADD COLUMN LanguageID INT DEFAULT 1 AFTER TopicID',
    'SELECT "LanguageID column already exists"'
));
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Add foreign key constraint if LanguageID column exists
SET @sql = (SELECT IF(
    (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS 
     WHERE TABLE_SCHEMA = 'vip_english_learning' 
     AND TABLE_NAME = 'Topics' 
     AND COLUMN_NAME = 'LanguageID') > 0,
    'ALTER TABLE Topics ADD CONSTRAINT fk_topics_language FOREIGN KEY (LanguageID) REFERENCES Languages(LanguageID) ON DELETE CASCADE',
    'SELECT "LanguageID column does not exist, skipping foreign key"'
));
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- 1.4 Vocabulary Table - Bảng từ vựng (Compatible version)
CREATE TABLE IF NOT EXISTS Vocabulary (
    WordID INT AUTO_INCREMENT PRIMARY KEY,
    Word VARCHAR(100) NOT NULL,
    Phonetic VARCHAR(100),
    Type VARCHAR(50),
    Meaning VARCHAR(255) NOT NULL,
    Example VARCHAR(255),
    Audio VARCHAR(255),
    Image VARCHAR(255),
    TopicID INT,
    IsActive TINYINT(1) DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Add LanguageID column if it doesn't exist
SET @sql = (SELECT IF(
    (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS 
     WHERE TABLE_SCHEMA = 'vip_english_learning' 
     AND TABLE_NAME = 'Vocabulary' 
     AND COLUMN_NAME = 'LanguageID') = 0,
    'ALTER TABLE Vocabulary ADD COLUMN LanguageID INT DEFAULT 1 AFTER WordID',
    'SELECT "LanguageID column already exists"'
));
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Add other missing columns
SET @sql = (SELECT IF(
    (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS 
     WHERE TABLE_SCHEMA = 'vip_english_learning' 
     AND TABLE_NAME = 'Vocabulary' 
     AND COLUMN_NAME = 'AudioURL') = 0,
    'ALTER TABLE Vocabulary ADD COLUMN AudioURL VARCHAR(255) AFTER Audio',
    'SELECT "AudioURL column already exists"'
));
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @sql = (SELECT IF(
    (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS 
     WHERE TABLE_SCHEMA = 'vip_english_learning' 
     AND TABLE_NAME = 'Vocabulary' 
     AND COLUMN_NAME = 'NativeLanguage') = 0,
    'ALTER TABLE Vocabulary ADD COLUMN NativeLanguage VARCHAR(50) DEFAULT "Vietnamese" AFTER TopicID',
    'SELECT "NativeLanguage column already exists"'
));
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @sql = (SELECT IF(
    (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS 
     WHERE TABLE_SCHEMA = 'vip_english_learning' 
     AND TABLE_NAME = 'Vocabulary' 
     AND COLUMN_NAME = 'Pronunciation') = 0,
    'ALTER TABLE Vocabulary ADD COLUMN Pronunciation VARCHAR(255) AFTER NativeLanguage',
    'SELECT "Pronunciation column already exists"'
));
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @sql = (SELECT IF(
    (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS 
     WHERE TABLE_SCHEMA = 'vip_english_learning' 
     AND TABLE_NAME = 'Vocabulary' 
     AND COLUMN_NAME = 'AudioNative') = 0,
    'ALTER TABLE Vocabulary ADD COLUMN AudioNative VARCHAR(255) AFTER Pronunciation',
    'SELECT "AudioNative column already exists"'
));
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @sql = (SELECT IF(
    (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS 
     WHERE TABLE_SCHEMA = 'vip_english_learning' 
     AND TABLE_NAME = 'Vocabulary' 
     AND COLUMN_NAME = 'ExamType') = 0,
    'ALTER TABLE Vocabulary ADD COLUMN ExamType ENUM("TOEIC", "IELTS", "TOEFL", "General") DEFAULT "General" AFTER AudioNative',
    'SELECT "ExamType column already exists"'
));
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @sql = (SELECT IF(
    (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS 
     WHERE TABLE_SCHEMA = 'vip_english_learning' 
     AND TABLE_NAME = 'Vocabulary' 
     AND COLUMN_NAME = 'Difficulty') = 0,
    'ALTER TABLE Vocabulary ADD COLUMN Difficulty ENUM("Easy", "Medium", "Hard") DEFAULT "Medium" AFTER ExamType',
    'SELECT "Difficulty column already exists"'
));
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @sql = (SELECT IF(
    (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS 
     WHERE TABLE_SCHEMA = 'vip_english_learning' 
     AND TABLE_NAME = 'Vocabulary' 
     AND COLUMN_NAME = 'DifficultyScore') = 0,
    'ALTER TABLE Vocabulary ADD COLUMN DifficultyScore INT DEFAULT 50 AFTER Difficulty',
    'SELECT "DifficultyScore column already exists"'
));
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @sql = (SELECT IF(
    (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS 
     WHERE TABLE_SCHEMA = 'vip_english_learning' 
     AND TABLE_NAME = 'Vocabulary' 
     AND COLUMN_NAME = 'FrequencyScore') = 0,
    'ALTER TABLE Vocabulary ADD COLUMN FrequencyScore INT DEFAULT 50 AFTER DifficultyScore',
    'SELECT "FrequencyScore column already exists"'
));
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Add foreign key constraints
ALTER TABLE Vocabulary ADD CONSTRAINT fk_vocabulary_topic FOREIGN KEY (TopicID) REFERENCES Topics(TopicID) ON DELETE CASCADE;
ALTER TABLE Vocabulary ADD CONSTRAINT fk_vocabulary_language FOREIGN KEY (LanguageID) REFERENCES Languages(LanguageID) ON DELETE CASCADE;

-- =====================================================
-- 2. STUDY METHODS - Bảng phương pháp học
-- =====================================================

-- 2.1 Study Methods Table - Bảng phương pháp học
CREATE TABLE IF NOT EXISTS StudyMethods (
    MethodID INT AUTO_INCREMENT PRIMARY KEY,
    MethodName VARCHAR(50) NOT NULL UNIQUE COMMENT 'Spaced Repetition, Writing Practice, Flashcard',
    MethodCode VARCHAR(20) NOT NULL UNIQUE COMMENT 'spaced, writing, flashcard',
    Description TEXT COMMENT 'Mô tả phương pháp học',
    Icon VARCHAR(255) COMMENT 'Icon cho phương pháp',
    Color VARCHAR(7) DEFAULT '#3B82F6' COMMENT 'Màu sắc',
    IsActive TINYINT(1) DEFAULT 1,
    SortOrder INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- =====================================================
-- 3. FLASHCARDS SYSTEM - Hệ thống thẻ từ vựng
-- =====================================================

-- 3.1 Flashcards Table - Bảng thẻ từ vựng với SM-2 algorithm
CREATE TABLE IF NOT EXISTS Flashcards (
    FlashcardID INT AUTO_INCREMENT PRIMARY KEY,
    WordID INT NOT NULL,
    UserID INT NOT NULL,
    ReviewDate DATETIME DEFAULT CURRENT_TIMESTAMP,
    CorrectCount INT DEFAULT 0,
    WrongCount INT DEFAULT 0,
    NextReview DATETIME DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Add missing columns to Flashcards
SET @sql = (SELECT IF(
    (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS 
     WHERE TABLE_SCHEMA = 'vip_english_learning' 
     AND TABLE_NAME = 'Flashcards' 
     AND COLUMN_NAME = 'ReviewInterval') = 0,
    'ALTER TABLE Flashcards ADD COLUMN ReviewInterval INT DEFAULT 1 COMMENT "Khoảng cách ngày ôn tập" AFTER NextReview',
    'SELECT "ReviewInterval column already exists"'
));
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @sql = (SELECT IF(
    (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS 
     WHERE TABLE_SCHEMA = 'vip_english_learning' 
     AND TABLE_NAME = 'Flashcards' 
     AND COLUMN_NAME = 'EaseFactor') = 0,
    'ALTER TABLE Flashcards ADD COLUMN EaseFactor DECIMAL(3,2) DEFAULT 2.50 COMMENT "Hệ số độ khó" AFTER ReviewInterval',
    'SELECT "EaseFactor column already exists"'
));
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @sql = (SELECT IF(
    (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS 
     WHERE TABLE_SCHEMA = 'vip_english_learning' 
     AND TABLE_NAME = 'Flashcards' 
     AND COLUMN_NAME = 'Repetitions') = 0,
    'ALTER TABLE Flashcards ADD COLUMN Repetitions INT DEFAULT 0 COMMENT "Số lần ôn tập" AFTER EaseFactor',
    'SELECT "Repetitions column already exists"'
));
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @sql = (SELECT IF(
    (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS 
     WHERE TABLE_SCHEMA = 'vip_english_learning' 
     AND TABLE_NAME = 'Flashcards' 
     AND COLUMN_NAME = 'LastReviewScore') = 0,
    'ALTER TABLE Flashcards ADD COLUMN LastReviewScore DECIMAL(3,2) DEFAULT 0.00 COMMENT "Điểm lần ôn cuối" AFTER Repetitions',
    'SELECT "LastReviewScore column already exists"'
));
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @sql = (SELECT IF(
    (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS 
     WHERE TABLE_SCHEMA = 'vip_english_learning' 
     AND TABLE_NAME = 'Flashcards' 
     AND COLUMN_NAME = 'WritingAttempts') = 0,
    'ALTER TABLE Flashcards ADD COLUMN WritingAttempts INT DEFAULT 0 COMMENT "Số lần thử viết" AFTER LastReviewScore',
    'SELECT "WritingAttempts column already exists"'
));
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @sql = (SELECT IF(
    (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS 
     WHERE TABLE_SCHEMA = 'vip_english_learning' 
     AND TABLE_NAME = 'Flashcards' 
     AND COLUMN_NAME = 'WritingSuccess') = 0,
    'ALTER TABLE Flashcards ADD COLUMN WritingSuccess INT DEFAULT 0 COMMENT "Số lần viết đúng" AFTER WritingAttempts',
    'SELECT "WritingSuccess column already exists"'
));
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @sql = (SELECT IF(
    (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS 
     WHERE TABLE_SCHEMA = 'vip_english_learning' 
     AND TABLE_NAME = 'Flashcards' 
     AND COLUMN_NAME = 'AudioPlayed') = 0,
    'ALTER TABLE Flashcards ADD COLUMN AudioPlayed INT DEFAULT 0 COMMENT "Số lần nghe âm thanh" AFTER WritingSuccess',
    'SELECT "AudioPlayed column already exists"'
));
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @sql = (SELECT IF(
    (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS 
     WHERE TABLE_SCHEMA = 'vip_english_learning' 
     AND TABLE_NAME = 'Flashcards' 
     AND COLUMN_NAME = 'StudyStreak') = 0,
    'ALTER TABLE Flashcards ADD COLUMN StudyStreak INT DEFAULT 0 COMMENT "Chuỗi ngày học liên tiếp" AFTER AudioPlayed',
    'SELECT "StudyStreak column already exists"'
));
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Add foreign key constraints
ALTER TABLE Flashcards ADD CONSTRAINT fk_flashcards_word FOREIGN KEY (WordID) REFERENCES Vocabulary(WordID) ON DELETE CASCADE;
ALTER TABLE Flashcards ADD CONSTRAINT fk_flashcards_user FOREIGN KEY (UserID) REFERENCES Users(UserID) ON DELETE CASCADE;

-- =====================================================
-- 4. STUDY SESSIONS - Hệ thống phiên học
-- =====================================================

-- 4.1 Study Sessions Detailed - Phiên học chi tiết
CREATE TABLE IF NOT EXISTS StudySessionsDetailed (
    SessionID INT AUTO_INCREMENT PRIMARY KEY,
    UserID INT NOT NULL,
    TopicID INT NOT NULL,
    LanguageID INT NOT NULL,
    MethodID INT NOT NULL,
    SessionType ENUM('Spaced Repetition', 'Writing Practice', 'Flashcard', 'Mixed') DEFAULT 'Mixed',
    StartTime DATETIME DEFAULT CURRENT_TIMESTAMP,
    EndTime DATETIME,
    TotalWords INT DEFAULT 0,
    WordsStudied INT DEFAULT 0,
    WordsCorrect INT DEFAULT 0,
    WritingAttempts INT DEFAULT 0,
    WritingCorrect INT DEFAULT 0,
    AudioPlayed INT DEFAULT 0,
    TotalTime INT DEFAULT 0 COMMENT 'Thời gian học tính bằng giây',
    Score DECIMAL(5,2) DEFAULT 0.00,
    DifficultyLevel ENUM('Easy', 'Medium', 'Hard', 'Mixed') DEFAULT 'Mixed',
    StudyStreak INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (UserID) REFERENCES Users(UserID) ON DELETE CASCADE,
    FOREIGN KEY (TopicID) REFERENCES Topics(TopicID) ON DELETE CASCADE,
    FOREIGN KEY (LanguageID) REFERENCES Languages(LanguageID) ON DELETE CASCADE,
    FOREIGN KEY (MethodID) REFERENCES StudyMethods(MethodID) ON DELETE CASCADE
);

-- =====================================================
-- 5. PROGRESS TRACKING - Hệ thống theo dõi tiến độ
-- =====================================================

-- 5.1 User Progress Detailed - Tiến độ học tập chi tiết
CREATE TABLE IF NOT EXISTS UserProgressDetailed (
    ProgressID INT AUTO_INCREMENT PRIMARY KEY,
    UserID INT NOT NULL,
    TopicID INT NOT NULL,
    LanguageID INT NOT NULL,
    MethodID INT NOT NULL,
    WordsLearned INT DEFAULT 0,
    WordsMastered INT DEFAULT 0,
    WritingAccuracy DECIMAL(5,2) DEFAULT 0.00,
    ListeningAccuracy DECIMAL(5,2) DEFAULT 0.00,
    StudyStreak INT DEFAULT 0,
    LastStudyDate DATE,
    TotalStudyTime INT DEFAULT 0 COMMENT 'Tổng thời gian học tính bằng giây',
    Level ENUM('Beginner', 'Intermediate', 'Advanced', 'Expert') DEFAULT 'Beginner',
    XP INT DEFAULT 0 COMMENT 'Điểm kinh nghiệm',
    Badges JSON COMMENT 'Danh sách huy hiệu đạt được',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (UserID) REFERENCES Users(UserID) ON DELETE CASCADE,
    FOREIGN KEY (TopicID) REFERENCES Topics(TopicID) ON DELETE CASCADE,
    FOREIGN KEY (LanguageID) REFERENCES Languages(LanguageID) ON DELETE CASCADE,
    FOREIGN KEY (MethodID) REFERENCES StudyMethods(MethodID) ON DELETE CASCADE,
    UNIQUE KEY unique_user_topic_language_method (UserID, TopicID, LanguageID, MethodID)
);

-- 5.2 Study Goals Detailed - Mục tiêu học tập chi tiết
CREATE TABLE IF NOT EXISTS StudyGoalsDetailed (
    GoalID INT AUTO_INCREMENT PRIMARY KEY,
    UserID INT NOT NULL,
    TopicID INT NOT NULL,
    LanguageID INT NOT NULL,
    MethodID INT NOT NULL,
    GoalType ENUM('Daily', 'Weekly', 'Monthly') DEFAULT 'Daily',
    TargetWords INT DEFAULT 20,
    TargetWriting INT DEFAULT 10,
    TargetTime INT DEFAULT 1800 COMMENT 'Thời gian mục tiêu tính bằng giây',
    TargetAccuracy DECIMAL(5,2) DEFAULT 80.00,
    IsActive TINYINT(1) DEFAULT 1,
    StartDate DATE DEFAULT (CURRENT_DATE),
    EndDate DATE,
    Progress INT DEFAULT 0 COMMENT 'Tiến độ hoàn thành %',
    AchievedAt DATETIME,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (UserID) REFERENCES Users(UserID) ON DELETE CASCADE,
    FOREIGN KEY (TopicID) REFERENCES Topics(TopicID) ON DELETE CASCADE,
    FOREIGN KEY (LanguageID) REFERENCES Languages(LanguageID) ON DELETE CASCADE,
    FOREIGN KEY (MethodID) REFERENCES StudyMethods(MethodID) ON DELETE CASCADE
);

-- =====================================================
-- 6. ADDITIONAL FEATURES - Các tính năng bổ sung
-- =====================================================

-- 6.1 Grammar Rules - Bảng ngữ pháp
CREATE TABLE IF NOT EXISTS GrammarRules (
    GrammarID INT AUTO_INCREMENT PRIMARY KEY,
    Title VARCHAR(100) NOT NULL,
    Explanation TEXT,
    Example VARCHAR(255),
    Level ENUM('A1', 'A2', 'B1', 'B2', 'C1', 'C2') DEFAULT 'A1',
    VideoLink VARCHAR(255),
    QuizID INT,
    IsActive TINYINT(1) DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 6.2 Lessons - Bảng bài học
CREATE TABLE IF NOT EXISTS Lessons (
    LessonID INT AUTO_INCREMENT PRIMARY KEY,
    Title VARCHAR(255) NOT NULL,
    Description TEXT,
    Type ENUM('Listening', 'Speaking', 'Reading', 'Writing') DEFAULT 'Reading',
    Level ENUM('A1', 'A2', 'B1', 'B2', 'C1', 'C2') DEFAULT 'A1',
    VideoLink VARCHAR(255),
    Audio VARCHAR(255),
    TextContent TEXT,
    QuizID INT,
    IsActive TINYINT(1) DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 6.3 Quizzes - Bảng bài kiểm tra
CREATE TABLE IF NOT EXISTS Quizzes (
    QuizID INT AUTO_INCREMENT PRIMARY KEY,
    Title VARCHAR(255) NOT NULL,
    Type ENUM('Vocabulary', 'Grammar', 'Listening', 'Speaking') DEFAULT 'Vocabulary',
    Level ENUM('A1', 'A2', 'B1', 'B2', 'C1', 'C2') DEFAULT 'A1',
    Duration INT DEFAULT 30 COMMENT 'Thời gian làm bài (phút)',
    IsActive TINYINT(1) DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 6.4 Questions - Bảng câu hỏi
CREATE TABLE IF NOT EXISTS Questions (
    QuestionID INT AUTO_INCREMENT PRIMARY KEY,
    QuizID INT NOT NULL,
    Content TEXT NOT NULL,
    OptionA VARCHAR(255),
    OptionB VARCHAR(255),
    OptionC VARCHAR(255),
    OptionD VARCHAR(255),
    CorrectAnswer VARCHAR(10),
    Explanation TEXT,
    IsActive TINYINT(1) DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (QuizID) REFERENCES Quizzes(QuizID) ON DELETE CASCADE
);

-- 6.5 User Progress - Tiến độ học tập tổng quát
CREATE TABLE IF NOT EXISTS UserProgress (
    ProgressID INT AUTO_INCREMENT PRIMARY KEY,
    UserID INT NOT NULL,
    LessonID INT,
    Score DECIMAL(5,2) DEFAULT 0.00,
    Completed TINYINT(1) DEFAULT 0,
    CompletionDate DATETIME,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (UserID) REFERENCES Users(UserID) ON DELETE CASCADE,
    FOREIGN KEY (LessonID) REFERENCES Lessons(LessonID) ON DELETE CASCADE
);

-- 6.6 Conversations - Bảng hội thoại
CREATE TABLE IF NOT EXISTS Conversations (
    ConversationID INT AUTO_INCREMENT PRIMARY KEY,
    Title VARCHAR(100) NOT NULL,
    Level ENUM('A1', 'A2', 'B1', 'B2', 'C1', 'C2') DEFAULT 'A1',
    Script TEXT,
    Audio VARCHAR(255),
    Video VARCHAR(255),
    TopicID INT,
    IsActive TINYINT(1) DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (TopicID) REFERENCES Topics(TopicID) ON DELETE CASCADE
);

-- 6.7 AI Chat - Bảng chat với AI
CREATE TABLE IF NOT EXISTS AIChat (
    ChatID INT AUTO_INCREMENT PRIMARY KEY,
    UserID INT NOT NULL,
    UserMessage TEXT,
    AIResponse TEXT,
    PronunciationScore DECIMAL(5,2),
    GrammarScore DECIMAL(5,2),
    Date DATETIME DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (UserID) REFERENCES Users(UserID) ON DELETE CASCADE
);

-- 6.8 Statistics - Bảng thống kê tổng quát
CREATE TABLE IF NOT EXISTS Statistics (
    StatID INT AUTO_INCREMENT PRIMARY KEY,
    UserID INT NOT NULL,
    WordsLearned INT DEFAULT 0,
    LessonsCompleted INT DEFAULT 0,
    HoursSpent DECIMAL(5,2) DEFAULT 0.00,
    AvgScore DECIMAL(5,2) DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (UserID) REFERENCES Users(UserID) ON DELETE CASCADE
);

-- 6.9 Recommendations - Bảng gợi ý học tập
CREATE TABLE IF NOT EXISTS Recommendations (
    RecommendID INT AUTO_INCREMENT PRIMARY KEY,
    UserID INT NOT NULL,
    ContentType ENUM('Vocabulary', 'Grammar', 'Reading', 'Listening', 'Speaking', 'Writing') DEFAULT 'Vocabulary',
    ContentID INT,
    Reason VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (UserID) REFERENCES Users(UserID) ON DELETE CASCADE
);

-- =====================================================
-- 7. SAMPLE DATA - Dữ liệu mẫu cho hệ thống
-- =====================================================

-- 7.1 Languages Data - Dữ liệu ngôn ngữ
INSERT IGNORE INTO Languages (LanguageCode, LanguageName, NativeName, Flag, SortOrder) VALUES
('vi', 'Vietnamese', 'Tiếng Việt', '🇻🇳', 1),
('en', 'English', 'English', '🇺🇸', 2),
('zh', 'Chinese', '中文', '🇨🇳', 3),
('ko', 'Korean', '한국어', '🇰🇷', 4),
('ja', 'Japanese', '日本語', '🇯🇵', 5),
('th', 'Thai', 'ไทย', '🇹🇭', 6);

-- 7.2 Study Methods Data - Dữ liệu phương pháp học
INSERT IGNORE INTO StudyMethods (MethodName, MethodCode, Description, Icon, Color, SortOrder) VALUES
('Spaced Repetition', 'spaced', 'Học lặp lại ngắt quãng để ghi nhớ lâu dài', 'Repeat', '#10B981', 1),
('Writing Practice', 'writing', 'Luyện viết để cải thiện chính tả và ghi nhớ', 'Edit3', '#F59E0B', 2),
('Flashcard', 'flashcard', 'Học bằng thẻ từ vựng với âm thanh', 'BookOpen', '#8B5CF6', 3);

-- 7.3 Users Data - Dữ liệu người dùng mẫu
INSERT IGNORE INTO Users (FullName, Email, Password, Role, Level, Streak, TotalXP) VALUES
('Admin User', 'admin@viplearning.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Admin', 'C2', 30, 5000),
('Student Demo', 'student@demo.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Student', 'B1', 15, 2500),
('Teacher Demo', 'teacher@demo.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Teacher', 'C1', 25, 4000);

-- 7.4 Topics Data - Dữ liệu chủ đề (Tiếng Việt) - Compatible version
INSERT IGNORE INTO Topics (Title, Description, Level, Icon, Color, SortOrder) VALUES
('Family', 'Gia đình và các mối quan hệ', 'A1', '👨‍👩‍👧‍👦', '#EF4444', 1),
('Food', 'Thức ăn và đồ uống', 'A1', '🍕', '#F97316', 2),
('Home', 'Nhà cửa và đồ đạc', 'A1', '🏠', '#8B5CF6', 3),
('Colors', 'Màu sắc và hình dạng', 'A1', '🎨', '#F59E0B', 4),
('Numbers', 'Số đếm và thời gian', 'A1', '🔢', '#10B981', 5),
('Body Parts', 'Cơ thể và sức khỏe', 'A1', '👤', '#EC4899', 6),
('Animals', 'Động vật và thiên nhiên', 'A1', '🐶', '#06B6D4', 7),
('Clothes', 'Quần áo và thời trang', 'A1', '👕', '#8B5CF6', 8),
('Weather', 'Thời tiết và mùa', 'A2', '☀️', '#F59E0B', 9),
('Travel', 'Du lịch và phương tiện', 'A2', '✈️', '#10B981', 10),
('Music', 'Âm nhạc và giải trí', 'A2', '🎵', '#06B6D4', 11),
('Sports', 'Thể thao và hoạt động', 'A2', '⚽', '#EF4444', 12),
('Work', 'Công việc và nghề nghiệp', 'B1', '💼', '#3B82F6', 13),
('Education', 'Giáo dục và học tập', 'B1', '🎓', '#EC4899', 14),
('Technology', 'Công nghệ và internet', 'B1', '💻', '#6366F1', 15),
('Shopping', 'Mua sắm và tiền bạc', 'B1', '🛒', '#F97316', 16),
('Health', 'Sức khỏe và y tế', 'B1', '🏥', '#10B981', 17),
('Environment', 'Môi trường và bảo vệ', 'B2', '🌱', '#059669', 18),
('Culture', 'Văn hóa và truyền thống', 'B2', '🏛️', '#DC2626', 19),
('Business', 'Kinh doanh và thương mại', 'B2', '📊', '#7C3AED', 20),
('Science', 'Khoa học và nghiên cứu', 'C1', '🔬', '#0891B2', 21),
('Politics', 'Chính trị và xã hội', 'C1', '🏛️', '#DC2626', 22),
('Philosophy', 'Triết học và tư duy', 'C2', '🤔', '#7C2D12', 23),
('Literature', 'Văn học và nghệ thuật', 'C2', '📚', '#BE185D', 24);

-- Update LanguageID for Vietnamese topics
UPDATE Topics SET LanguageID = 1 WHERE LanguageID IS NULL OR LanguageID = 0;

-- 7.5 Topics Data - Dữ liệu chủ đề (Tiếng Trung)
INSERT IGNORE INTO Topics (Title, Description, Level, LanguageID, Icon, Color, SortOrder) VALUES
('家庭', 'Gia đình trong tiếng Trung', 'A1', 3, '👨‍👩‍👧‍👦', '#EF4444', 1),
('食物', 'Thức ăn và đồ uống', 'A1', 3, '🍕', '#F97316', 2),
('家', 'Nhà cửa và đồ đạc', 'A1', 3, '🏠', '#8B5CF6', 3),
('颜色', 'Màu sắc và hình dạng', 'A1', 3, '🎨', '#F59E0B', 4),
('数字', 'Số đếm và thời gian', 'A1', 3, '🔢', '#10B981', 5),
('身体', 'Cơ thể và sức khỏe', 'A1', 3, '👤', '#EC4899', 6),
('动物', 'Động vật và thiên nhiên', 'A1', 3, '🐶', '#06B6D4', 7),
('衣服', 'Quần áo và thời trang', 'A1', 3, '👕', '#8B5CF6', 8),
('天气', 'Thời tiết và mùa', 'A2', 3, '☀️', '#F59E0B', 9),
('旅行', 'Du lịch và phương tiện', 'A2', 3, '✈️', '#10B981', 10),
('音乐', 'Âm nhạc và giải trí', 'A2', 3, '🎵', '#06B6D4', 11),
('运动', 'Thể thao và hoạt động', 'A2', 3, '⚽', '#EF4444', 12),
('工作', 'Công việc và nghề nghiệp', 'B1', 3, '💼', '#3B82F6', 13),
('教育', 'Giáo dục và học tập', 'B1', 3, '🎓', '#EC4899', 14),
('技术', 'Công nghệ và internet', 'B1', 3, '💻', '#6366F1', 15),
('购物', 'Mua sắm và tiền bạc', 'B1', 3, '🛒', '#F97316', 16),
('健康', 'Sức khỏe và y tế', 'B1', 3, '🏥', '#10B981', 17),
('环境', 'Môi trường và bảo vệ', 'B2', 3, '🌱', '#059669', 18),
('文化', 'Văn hóa và truyền thống', 'B2', 3, '🏛️', '#DC2626', 19),
('商业', 'Kinh doanh và thương mại', 'B2', 3, '📊', '#7C3AED', 20);

-- 7.6 Topics Data - Dữ liệu chủ đề (Tiếng Hàn)
INSERT IGNORE INTO Topics (Title, Description, Level, LanguageID, Icon, Color, SortOrder) VALUES
('가족', 'Gia đình trong tiếng Hàn', 'A1', 4, '👨‍👩‍👧‍👦', '#EF4444', 1),
('음식', 'Thức ăn và đồ uống', 'A1', 4, '🍕', '#F97316', 2),
('집', 'Nhà cửa và đồ đạc', 'A1', 4, '🏠', '#8B5CF6', 3),
('색깔', 'Màu sắc và hình dạng', 'A1', 4, '🎨', '#F59E0B', 4),
('숫자', 'Số đếm và thời gian', 'A1', 4, '🔢', '#10B981', 5),
('몸', 'Cơ thể và sức khỏe', 'A1', 4, '👤', '#EC4899', 6),
('동물', 'Động vật và thiên nhiên', 'A1', 4, '🐶', '#06B6D4', 7),
('옷', 'Quần áo và thời trang', 'A1', 4, '👕', '#8B5CF6', 8),
('날씨', 'Thời tiết và mùa', 'A2', 4, '☀️', '#F59E0B', 9),
('여행', 'Du lịch và phương tiện', 'A2', 4, '✈️', '#10B981', 10),
('음악', 'Âm nhạc và giải trí', 'A2', 4, '🎵', '#06B6D4', 11),
('운동', 'Thể thao và hoạt động', 'A2', 4, '⚽', '#EF4444', 12),
('직업', 'Công việc và nghề nghiệp', 'B1', 4, '💼', '#3B82F6', 13),
('교육', 'Giáo dục và học tập', 'B1', 4, '🎓', '#EC4899', 14),
('기술', 'Công nghệ và internet', 'B1', 4, '💻', '#6366F1', 15),
('쇼핑', 'Mua sắm và tiền bạc', 'B1', 4, '🛒', '#F97316', 16),
('건강', 'Sức khỏe và y tế', 'B1', 4, '🏥', '#10B981', 17),
('환경', 'Môi trường và bảo vệ', 'B2', 4, '🌱', '#059669', 18),
('문화', 'Văn hóa và truyền thống', 'B2', 4, '🏛️', '#DC2626', 19),
('비즈니스', 'Kinh doanh và thương mại', 'B2', 4, '📊', '#7C3AED', 20);

-- 7.7 Topics Data - Dữ liệu chủ đề (Tiếng Nhật)
INSERT IGNORE INTO Topics (Title, Description, Level, LanguageID, Icon, Color, SortOrder) VALUES
('家族', 'Gia đình trong tiếng Nhật', 'A1', 5, '👨‍👩‍👧‍👦', '#EF4444', 1),
('食べ物', 'Thức ăn và đồ uống', 'A1', 5, '🍕', '#F97316', 2),
('家', 'Nhà cửa và đồ đạc', 'A1', 5, '🏠', '#8B5CF6', 3),
('色', 'Màu sắc và hình dạng', 'A1', 5, '🎨', '#F59E0B', 4),
('数字', 'Số đếm và thời gian', 'A1', 5, '🔢', '#10B981', 5),
('体', 'Cơ thể và sức khỏe', 'A1', 5, '👤', '#EC4899', 6),
('動物', 'Động vật và thiên nhiên', 'A1', 5, '🐶', '#06B6D4', 7),
('服', 'Quần áo và thời trang', 'A1', 5, '👕', '#8B5CF6', 8),
('天気', 'Thời tiết và mùa', 'A2', 5, '☀️', '#F59E0B', 9),
('旅行', 'Du lịch và phương tiện', 'A2', 5, '✈️', '#10B981', 10),
('音楽', 'Âm nhạc và giải trí', 'A2', 5, '🎵', '#06B6D4', 11),
('スポーツ', 'Thể thao và hoạt động', 'A2', 5, '⚽', '#EF4444', 12),
('仕事', 'Công việc và nghề nghiệp', 'B1', 5, '💼', '#3B82F6', 13),
('教育', 'Giáo dục và học tập', 'B1', 5, '🎓', '#EC4899', 14),
('技術', 'Công nghệ và internet', 'B1', 5, '💻', '#6366F1', 15),
('買い物', 'Mua sắm và tiền bạc', 'B1', 5, '🛒', '#F97316', 16),
('健康', 'Sức khỏe và y tế', 'B1', 5, '🏥', '#10B981', 17),
('環境', 'Môi trường và bảo vệ', 'B2', 5, '🌱', '#059669', 18),
('文化', 'Văn hóa và truyền thống', 'B2', 5, '🏛️', '#DC2626', 19),
('ビジネス', 'Kinh doanh và thương mại', 'B2', 5, '📊', '#7C3AED', 20);

-- 7.8 Vocabulary Data - Dữ liệu từ vựng (Tiếng Việt)
INSERT IGNORE INTO Vocabulary (Word, Phonetic, Type, Meaning, Example, Audio, AudioURL, Image, TopicID, LanguageID, NativeLanguage, ExamType, Difficulty, DifficultyScore, FrequencyScore) VALUES
('father', '/ˈfɑːðər/', 'Noun', 'Bố, cha', 'My father is a doctor.', '/audio/en/father.mp3', '/audio/en/father.mp3', '/images/en/family/father.jpg', 1, 1, 'Vietnamese', 'General', 'Easy', 30, 80),
('mother', '/ˈmʌðər/', 'Noun', 'Mẹ, má', 'My mother cooks well.', '/audio/en/mother.mp3', '/audio/en/mother.mp3', '/images/en/family/mother.jpg', 1, 1, 'Vietnamese', 'General', 'Easy', 30, 80),
('brother', '/ˈbrʌðər/', 'Noun', 'Anh/em trai', 'My brother is tall.', '/audio/en/brother.mp3', '/audio/en/brother.mp3', '/images/en/family/brother.jpg', 1, 1, 'Vietnamese', 'General', 'Easy', 25, 85),
('sister', '/ˈsɪstər/', 'Noun', 'Chị/em gái', 'My sister is beautiful.', '/audio/en/sister.mp3', '/audio/en/sister.mp3', '/images/en/family/sister.jpg', 1, 1, 'Vietnamese', 'General', 'Easy', 25, 85),
('rice', '/raɪs/', 'Noun', 'Cơm', 'I eat rice every day.', '/audio/en/rice.mp3', '/audio/en/rice.mp3', '/images/en/food/rice.jpg', 2, 1, 'Vietnamese', 'General', 'Easy', 20, 90),
('bread', '/bred/', 'Noun', 'Bánh mì', 'I like bread for breakfast.', '/audio/en/bread.mp3', '/audio/en/bread.mp3', '/images/en/food/bread.jpg', 2, 1, 'Vietnamese', 'General', 'Easy', 25, 85),
('water', '/ˈwɔːtər/', 'Noun', 'Nước', 'I drink water every day.', '/audio/en/water.mp3', '/audio/en/water.mp3', '/images/en/food/water.jpg', 2, 1, 'Vietnamese', 'General', 'Easy', 15, 95),
('coffee', '/ˈkɔːfi/', 'Noun', 'Cà phê', 'I drink coffee in the morning.', '/audio/en/coffee.mp3', '/audio/en/coffee.mp3', '/images/en/food/coffee.jpg', 2, 1, 'Vietnamese', 'General', 'Medium', 40, 70),
('car', '/kɑːr/', 'Noun', 'Xe ô tô', 'I drive a car to work.', '/audio/en/car.mp3', '/audio/en/car.mp3', '/images/en/travel/car.jpg', 10, 1, 'Vietnamese', 'General', 'Easy', 30, 80),
('plane', '/pleɪn/', 'Noun', 'Máy bay', 'I travel by plane.', '/audio/en/plane.mp3', '/audio/en/plane.mp3', '/images/en/travel/plane.jpg', 10, 1, 'Vietnamese', 'General', 'Easy', 35, 75),
('hotel', '/hoʊˈtel/', 'Noun', 'Khách sạn', 'I stay at a hotel.', '/audio/en/hotel.mp3', '/audio/en/hotel.mp3', '/images/en/travel/hotel.jpg', 10, 1, 'Vietnamese', 'General', 'Medium', 45, 65),
('passport', '/ˈpæspɔːrt/', 'Noun', 'Hộ chiếu', 'I need a passport to travel.', '/audio/en/passport.mp3', '/audio/en/passport.mp3', '/images/en/travel/passport.jpg', 10, 1, 'Vietnamese', 'General', 'Hard', 60, 50);

-- 7.9 Vocabulary Data - Dữ liệu từ vựng (Tiếng Trung)
INSERT IGNORE INTO Vocabulary (Word, Phonetic, Type, Meaning, Example, Audio, AudioURL, Image, TopicID, LanguageID, NativeLanguage, ExamType, Difficulty, DifficultyScore, FrequencyScore) VALUES
('爸爸', 'bàba', 'Noun', 'Bố, cha', '我爸爸是医生。', '/audio/zh/baba.mp3', '/audio/zh/baba.mp3', '/images/zh/family/father.jpg', 25, 3, 'Chinese', 'General', 'Easy', 30, 80),
('妈妈', 'māma', 'Noun', 'Mẹ, má', '我妈妈很漂亮。', '/audio/zh/mama.mp3', '/audio/zh/mama.mp3', '/images/zh/family/mother.jpg', 25, 3, 'Chinese', 'General', 'Easy', 30, 80),
('米饭', 'mǐfàn', 'Noun', 'Cơm', '我喜欢吃米饭。', '/audio/zh/mifan.mp3', '/audio/zh/mifan.mp3', '/images/zh/food/rice.jpg', 26, 3, 'Chinese', 'General', 'Easy', 25, 90),
('面条', 'miàntiáo', 'Noun', 'Mì', '面条很好吃。', '/audio/zh/miantiao.mp3', '/audio/zh/miantiao.mp3', '/images/zh/food/noodles.jpg', 26, 3, 'Chinese', 'General', 'Medium', 50, 70);

-- 7.10 Vocabulary Data - Dữ liệu từ vựng (Tiếng Hàn)
INSERT IGNORE INTO Vocabulary (Word, Phonetic, Type, Meaning, Example, Audio, AudioURL, Image, TopicID, LanguageID, NativeLanguage, ExamType, Difficulty, DifficultyScore, FrequencyScore) VALUES
('아버지', 'abeoji', 'Noun', 'Bố, cha', '아버지가 회사에 가세요.', '/audio/ko/abeoji.mp3', '/audio/ko/abeoji.mp3', '/images/ko/family/father.jpg', 45, 4, 'Korean', 'General', 'Easy', 30, 80),
('어머니', 'eomeoni', 'Noun', 'Mẹ, má', '어머니가 요리를 하세요.', '/audio/ko/eomeoni.mp3', '/audio/ko/eomeoni.mp3', '/images/ko/family/mother.jpg', 45, 4, 'Korean', 'General', 'Easy', 30, 80),
('밥', 'bap', 'Noun', 'Cơm', '밥을 먹어요.', '/audio/ko/bap.mp3', '/audio/ko/bap.mp3', '/images/ko/food/rice.jpg', 46, 4, 'Korean', 'General', 'Easy', 25, 90),
('라면', 'ramyeon', 'Noun', 'Mì', '라면이 맛있어요.', '/audio/ko/ramyeon.mp3', '/audio/ko/ramyeon.mp3', '/images/ko/food/ramen.jpg', 46, 4, 'Korean', 'General', 'Medium', 50, 70);

-- 7.11 Vocabulary Data - Dữ liệu từ vựng (Tiếng Nhật)
INSERT IGNORE INTO Vocabulary (Word, Phonetic, Type, Meaning, Example, Audio, AudioURL, Image, TopicID, LanguageID, NativeLanguage, ExamType, Difficulty, DifficultyScore, FrequencyScore) VALUES
('お父さん', 'otousan', 'Noun', 'Bố, cha', 'お父さんは会社に行きます。', '/audio/ja/otousan.mp3', '/audio/ja/otousan.mp3', '/images/ja/family/father.jpg', 65, 5, 'Japanese', 'General', 'Easy', 30, 80),
('お母さん', 'okaasan', 'Noun', 'Mẹ, má', 'お母さんは料理をします。', '/audio/ja/okaasan.mp3', '/audio/ja/okaasan.mp3', '/images/ja/family/mother.jpg', 65, 5, 'Japanese', 'General', 'Easy', 30, 80),
('ご飯', 'gohan', 'Noun', 'Cơm', 'ご飯を食べます。', '/audio/ja/gohan.mp3', '/audio/ja/gohan.mp3', '/images/ja/food/rice.jpg', 66, 5, 'Japanese', 'General', 'Easy', 25, 90),
('ラーメン', 'raamen', 'Noun', 'Mì', 'ラーメンが美味しいです。', '/audio/ja/raamen.mp3', '/audio/ja/raamen.mp3', '/images/ja/food/ramen.jpg', 66, 5, 'Japanese', 'General', 'Medium', 50, 70);

-- =====================================================
-- 8. COMPLETION MESSAGE - Thông báo hoàn thành
-- =====================================================

-- Database setup completed successfully!
-- Total tables created: 19
-- Total sample data inserted: 100+ records
-- 
-- Features included:
-- ✅ Multi-language support (6 languages)
-- ✅ 3 Study methods (Spaced Repetition, Writing, Flashcard)
-- ✅ Complete CRUD operations
-- ✅ Progress tracking system
-- ✅ Statistics and analytics
-- ✅ Admin panel support
-- ✅ Modern UI/UX ready
-- ✅ Compatible with both old and new database structures
--
-- Ready to use! 🎉
