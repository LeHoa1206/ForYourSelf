-- News Reading System Database Schema
-- Hệ thống đọc báo với dịch thuật

-- Bảng lưu trữ các nguồn tin tức
CREATE TABLE NewsSources (
    SourceID INT PRIMARY KEY AUTO_INCREMENT,
    SourceName VARCHAR(255) NOT NULL,
    SourceURL VARCHAR(500) NOT NULL,
    LanguageID INT NOT NULL,
    Category VARCHAR(100),
    IsActive BOOLEAN DEFAULT TRUE,
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UpdatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (LanguageID) REFERENCES Languages(LanguageID)
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Bảng lưu trữ các bài báo
CREATE TABLE NewsArticles (
    ArticleID INT PRIMARY KEY AUTO_INCREMENT,
    Title VARCHAR(500) NOT NULL,
    Content LONGTEXT NOT NULL,
    Summary TEXT,
    SourceID INT NOT NULL,
    LanguageID INT NOT NULL,
    Category VARCHAR(100),
    DifficultyLevel ENUM('Beginner', 'Intermediate', 'Advanced') DEFAULT 'Intermediate',
    ReadingTime INT, -- thời gian đọc tính bằng phút
    WordCount INT,
    IsActive BOOLEAN DEFAULT TRUE,
    PublishedAt TIMESTAMP,
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UpdatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (SourceID) REFERENCES NewsSources(SourceID),
    FOREIGN KEY (LanguageID) REFERENCES Languages(LanguageID)
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Bảng lưu trữ từ vựng trong bài báo
CREATE TABLE ArticleVocabulary (
    ArticleVocabID INT PRIMARY KEY AUTO_INCREMENT,
    ArticleID INT NOT NULL,
    Word VARCHAR(255) NOT NULL,
    Position INT, -- vị trí từ trong bài
    Context TEXT, -- ngữ cảnh xung quanh từ
    Difficulty ENUM('Easy', 'Medium', 'Hard') DEFAULT 'Medium',
    IsImportant BOOLEAN DEFAULT FALSE, -- từ quan trọng cần học
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (ArticleID) REFERENCES NewsArticles(ArticleID) ON DELETE CASCADE
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Bảng lưu trữ bản dịch của từ vựng
CREATE TABLE VocabularyTranslations (
    TranslationID INT PRIMARY KEY AUTO_INCREMENT,
    ArticleVocabID INT NOT NULL,
    TargetLanguageID INT NOT NULL,
    Translation VARCHAR(500) NOT NULL,
    Pronunciation VARCHAR(255),
    PartOfSpeech VARCHAR(50),
    ExampleSentence TEXT,
    IsVerified BOOLEAN DEFAULT FALSE,
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UpdatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (ArticleVocabID) REFERENCES ArticleVocabulary(ArticleVocabID) ON DELETE CASCADE,
    FOREIGN KEY (TargetLanguageID) REFERENCES Languages(LanguageID)
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Bảng lưu trữ lịch sử đọc của người dùng
CREATE TABLE ReadingHistory (
    HistoryID INT PRIMARY KEY AUTO_INCREMENT,
    UserID INT, -- có thể null nếu không đăng nhập
    ArticleID INT NOT NULL,
    LanguageID INT NOT NULL,
    ReadingProgress DECIMAL(5,2) DEFAULT 0.00, -- phần trăm đã đọc
    TimeSpent INT DEFAULT 0, -- thời gian đọc tính bằng giây
    WordsLookedUp INT DEFAULT 0, -- số từ đã tra
    CompletedAt TIMESTAMP NULL,
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (ArticleID) REFERENCES NewsArticles(ArticleID),
    FOREIGN KEY (LanguageID) REFERENCES Languages(LanguageID)
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Bảng lưu trữ từ vựng đã tra của người dùng
CREATE TABLE UserLookupHistory (
    LookupID INT PRIMARY KEY AUTO_INCREMENT,
    UserID INT, -- có thể null nếu không đăng nhập
    ArticleID INT NOT NULL,
    Word VARCHAR(255) NOT NULL,
    Translation VARCHAR(500) NOT NULL,
    LookupCount INT DEFAULT 1,
    LastLookedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (ArticleID) REFERENCES NewsArticles(ArticleID)
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Bảng lưu trữ bookmark bài báo
CREATE TABLE ArticleBookmarks (
    BookmarkID INT PRIMARY KEY AUTO_INCREMENT,
    UserID INT, -- có thể null nếu không đăng nhập
    ArticleID INT NOT NULL,
    Notes TEXT,
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (ArticleID) REFERENCES NewsArticles(ArticleID) ON DELETE CASCADE
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Bảng lưu trữ từ vựng yêu thích
CREATE TABLE FavoriteWords (
    FavoriteID INT PRIMARY KEY AUTO_INCREMENT,
    UserID INT, -- có thể null nếu không đăng nhập
    Word VARCHAR(255) NOT NULL,
    Translation VARCHAR(500) NOT NULL,
    LanguageID INT NOT NULL,
    Notes TEXT,
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (LanguageID) REFERENCES Languages(LanguageID)
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Thêm dữ liệu mẫu
INSERT INTO NewsSources (SourceName, SourceURL, LanguageID, Category) VALUES
('BBC News', 'https://www.bbc.com/news', 1, 'General'),
('CNN', 'https://www.cnn.com', 1, 'General'),
('Reuters', 'https://www.reuters.com', 1, 'General'),
('The Guardian', 'https://www.theguardian.com', 1, 'General'),
('Le Monde', 'https://www.lemonde.fr', 2, 'General'),
('El País', 'https://www.elpais.com', 3, 'General'),
('NHK News', 'https://www3.nhk.or.jp/news', 4, 'General'),
('People\'s Daily', 'http://en.people.cn', 5, 'General');

-- Thêm một số bài báo mẫu
INSERT INTO NewsArticles (Title, Content, Summary, SourceID, LanguageID, Category, DifficultyLevel, ReadingTime, WordCount) VALUES
('Climate Change Impact on Global Economy', 
'Climate change is having a profound impact on the global economy. Rising temperatures, extreme weather events, and sea level rise are causing significant economic losses worldwide. Governments and businesses are increasingly recognizing the need for sustainable practices and green investments. The transition to renewable energy sources is accelerating, creating new job opportunities while phasing out traditional industries. International cooperation is crucial to address these challenges effectively.',
'Climate change affects global economy through extreme weather and rising costs, requiring sustainable solutions.',
1, 1, 'Environment', 'Intermediate', 3, 85),

('New Technology Revolutionizes Healthcare', 
'Artificial intelligence and machine learning are transforming healthcare delivery. Medical professionals can now diagnose diseases more accurately using AI-powered tools. Telemedicine has become mainstream, allowing patients to receive care remotely. These innovations improve patient outcomes while reducing healthcare costs. However, challenges remain in data privacy and ensuring equitable access to technology.',
'AI and telemedicine are changing healthcare, improving diagnosis and access to care.',
1, 1, 'Technology', 'Advanced', 4, 78),

('Sustainable Agriculture Practices Gain Momentum', 
'Farmers worldwide are adopting sustainable agriculture practices to protect the environment. Organic farming, crop rotation, and reduced pesticide use are becoming more common. These methods help preserve soil health and biodiversity. Consumers are increasingly demanding sustainably produced food. Government policies are supporting this transition through subsidies and regulations.',
'Farmers adopt eco-friendly methods like organic farming and crop rotation for better sustainability.',
1, 1, 'Agriculture', 'Intermediate', 3, 72);

-- Thêm từ vựng mẫu cho bài báo đầu tiên
INSERT INTO ArticleVocabulary (ArticleID, Word, Position, Context, Difficulty, IsImportant) VALUES
(1, 'profound', 3, 'Climate change is having a profound impact', 'Hard', TRUE),
(1, 'extreme', 7, 'extreme weather events', 'Medium', TRUE),
(1, 'sustainable', 12, 'sustainable practices', 'Medium', TRUE),
(1, 'renewable', 15, 'renewable energy sources', 'Medium', TRUE),
(1, 'accelerating', 16, 'is accelerating', 'Hard', FALSE),
(1, 'crucial', 20, 'is crucial to address', 'Medium', TRUE);

-- Thêm bản dịch mẫu
INSERT INTO VocabularyTranslations (ArticleVocabID, TargetLanguageID, Translation, Pronunciation, PartOfSpeech, ExampleSentence) VALUES
(1, 2, 'profond', 'pro-fond', 'adjective', 'Un impact profond sur l\'économie'),
(1, 3, 'profundo', 'pro-fun-do', 'adjective', 'Un impacto profundo en la economía'),
(1, 4, '深い', 'fu-kai', 'adjective', '経済への深い影響'),
(1, 5, '深刻的', 'shēn kè de', 'adjective', '对经济的深刻影响'),
(2, 2, 'extrême', 'ex-trême', 'adjective', 'Événements météorologiques extrêmes'),
(2, 3, 'extremo', 'ex-tre-mo', 'adjective', 'Eventos meteorológicos extremos'),
(2, 4, '極端な', 'kyoku-tan na', 'adjective', '極端な気象現象'),
(2, 5, '极端的', 'jí duān de', 'adjective', '极端天气事件');
