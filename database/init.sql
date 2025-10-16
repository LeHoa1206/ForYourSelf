-- VIP English Learning Database Schema
-- For Render.com MySQL

-- Create database (if not exists)
-- CREATE DATABASE vip_english_learning;

-- Create tables
CREATE TABLE IF NOT EXISTS Languages (
    LanguageID INT AUTO_INCREMENT PRIMARY KEY,
    LanguageName VARCHAR(50) NOT NULL,
    LanguageCode VARCHAR(10) NOT NULL,
    IsActive BOOLEAN DEFAULT TRUE,
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS Topics (
    TopicID INT AUTO_INCREMENT PRIMARY KEY,
    Title VARCHAR(255) NOT NULL,
    Description TEXT,
    Level VARCHAR(50),
    Icon VARCHAR(100),
    Color VARCHAR(20),
    SortOrder INT DEFAULT 0,
    LanguageID INT,
    IsActive BOOLEAN DEFAULT TRUE,
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (LanguageID) REFERENCES Languages(LanguageID)
);

CREATE TABLE IF NOT EXISTS Vocabulary (
    VocabularyID INT AUTO_INCREMENT PRIMARY KEY,
    Word VARCHAR(255) NOT NULL,
    Phonetic VARCHAR(255),
    Type VARCHAR(100),
    Meaning TEXT,
    Example TEXT,
    Audio VARCHAR(255),
    TopicID INT,
    LanguageID INT,
    Difficulty VARCHAR(20),
    IsActive BOOLEAN DEFAULT TRUE,
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (TopicID) REFERENCES Topics(TopicID),
    FOREIGN KEY (LanguageID) REFERENCES Languages(LanguageID)
);

CREATE TABLE IF NOT EXISTS NewsSources (
    SourceID INT AUTO_INCREMENT PRIMARY KEY,
    SourceName VARCHAR(255) NOT NULL,
    SourceURL VARCHAR(500),
    LanguageID INT,
    IsActive BOOLEAN DEFAULT TRUE,
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (LanguageID) REFERENCES Languages(LanguageID)
);

CREATE TABLE IF NOT EXISTS NewsArticles (
    ArticleID INT AUTO_INCREMENT PRIMARY KEY,
    Title VARCHAR(500) NOT NULL,
    Content TEXT,
    SourceID INT,
    LanguageID INT,
    PublishedAt TIMESTAMP,
    IsActive BOOLEAN DEFAULT TRUE,
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (SourceID) REFERENCES NewsSources(SourceID),
    FOREIGN KEY (LanguageID) REFERENCES Languages(LanguageID)
);

-- Insert sample data
INSERT INTO Languages (LanguageName, LanguageCode) VALUES
('English', 'en'),
('Chinese', 'zh'),
('Japanese', 'ja'),
('Korean', 'ko'),
('Thai', 'th'),
('Vietnamese', 'vi')
ON CONFLICT (LanguageName) DO NOTHING;

INSERT INTO Topics (Title, Description, Level, LanguageID) VALUES
('Basic Vocabulary', 'Basic English words for beginners', 'Beginner', 1),
('Business English', 'Business related vocabulary', 'Intermediate', 1),
('HSK1 Chinese', 'HSK Level 1 Chinese vocabulary', 'Beginner', 2),
('HSK2 Chinese', 'HSK Level 2 Chinese vocabulary', 'Beginner', 2),
('HSK3 Chinese', 'HSK Level 3 Chinese vocabulary', 'Intermediate', 2)
ON CONFLICT (Title) DO NOTHING;

INSERT INTO Vocabulary (Word, Phonetic, Type, Meaning, Example, TopicID, LanguageID, Difficulty) VALUES
('Hello', '/həˈloʊ/', 'Greeting', 'A greeting used when meeting someone', 'Hello, how are you?', 1, 1, 'Easy'),
('World', '/wɜːrld/', 'Noun', 'The earth, together with all of its countries and peoples', 'The world is beautiful', 1, 1, 'Easy'),
('你好', 'nǐ hǎo', 'Greeting', 'Hello in Chinese', '你好，你好吗？', 3, 2, 'Easy'),
('世界', 'shì jiè', 'Noun', 'World in Chinese', '世界很美丽', 3, 2, 'Easy')
ON CONFLICT (Word) DO NOTHING;

INSERT INTO NewsSources (SourceName, SourceURL, LanguageID) VALUES
('BBC News', 'https://www.bbc.com/news', 1),
('CNN', 'https://www.cnn.com', 1),
('人民网', 'https://www.people.com.cn', 2),
('新华网', 'https://www.xinhuanet.com', 2)
ON CONFLICT (SourceName) DO NOTHING;

INSERT INTO NewsArticles (Title, Content, SourceID, LanguageID, PublishedAt) VALUES
('Technology News', 'With the rapid development of technology, artificial intelligence has become an indispensable part of our daily lives.', 1, 1, NOW()),
('Business Update', 'The global economy continues to show signs of recovery as markets respond positively to recent policy changes.', 2, 1, NOW()),
('科技新闻', '随着科技的迅速发展，人工智能已经成为我们日常生活中不可或缺的一部分。', 3, 2, NOW()),
('经济新闻', '全球经济继续显示出复苏的迹象，市场对最近的政策变化反应积极。', 4, 2, NOW())
ON CONFLICT (Title) DO NOTHING;
