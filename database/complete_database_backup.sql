-- =====================================================
-- VIP ENGLISH LEARNING - COMPLETE DATABASE BACKUP
-- Generated: 2025-10-16
-- Database: vip_english_learning
-- =====================================================

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- =====================================================
-- 1. LANGUAGES TABLE
-- =====================================================
DROP TABLE IF EXISTS `Languages`;
CREATE TABLE `Languages` (
  `LanguageID` int NOT NULL AUTO_INCREMENT,
  `LanguageCode` varchar(10) COLLATE utf8mb4_unicode_ci NOT NULL,
  `LanguageName` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `NativeName` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `Flag` varchar(10) COLLATE utf8mb4_unicode_ci NOT NULL,
  `IsActive` tinyint(1) DEFAULT '1',
  `SortOrder` int DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`LanguageID`),
  UNIQUE KEY `LanguageCode` (`LanguageCode`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- 2. NEWS SOURCES TABLE
-- =====================================================
DROP TABLE IF EXISTS `NewsSources`;
CREATE TABLE `NewsSources` (
  `SourceID` int NOT NULL AUTO_INCREMENT,
  `SourceName` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `SourceURL` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `Description` text COLLATE utf8mb4_unicode_ci,
  `IsActive` tinyint(1) DEFAULT '1',
  `CreatedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`SourceID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- 3. NEWS ARTICLES TABLE
-- =====================================================
DROP TABLE IF EXISTS `NewsArticles`;
CREATE TABLE `NewsArticles` (
  `ArticleID` int NOT NULL AUTO_INCREMENT,
  `Title` varchar(500) COLLATE utf8mb4_unicode_ci NOT NULL,
  `Content` longtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `Summary` text COLLATE utf8mb4_unicode_ci,
  `SourceID` int NOT NULL,
  `LanguageID` int NOT NULL,
  `Category` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `DifficultyLevel` enum('Beginner','Intermediate','Advanced') DEFAULT 'Intermediate',
  `ReadingTime` int DEFAULT NULL,
  `WordCount` int DEFAULT NULL,
  `IsActive` tinyint(1) DEFAULT '1',
  `PublishedAt` timestamp NULL DEFAULT NULL,
  `CreatedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `UpdatedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`ArticleID`),
  KEY `SourceID` (`SourceID`),
  KEY `LanguageID` (`LanguageID`),
  CONSTRAINT `NewsArticles_ibfk_1` FOREIGN KEY (`SourceID`) REFERENCES `NewsSources` (`SourceID`),
  CONSTRAINT `NewsArticles_ibfk_2` FOREIGN KEY (`LanguageID`) REFERENCES `Languages` (`LanguageID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- 4. TOPICS TABLE
-- =====================================================
DROP TABLE IF EXISTS `Topics`;
CREATE TABLE `Topics` (
  `TopicID` int NOT NULL AUTO_INCREMENT,
  `Title` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `Description` text COLLATE utf8mb4_unicode_ci,
  `Level` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `Icon` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `Color` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `SortOrder` int DEFAULT '0',
  `LanguageID` int NOT NULL,
  `IsActive` tinyint(1) DEFAULT '1',
  `VocabularyCount` int DEFAULT '0',
  `CreatedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `UpdatedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`TopicID`),
  KEY `LanguageID` (`LanguageID`),
  CONSTRAINT `Topics_ibfk_1` FOREIGN KEY (`LanguageID`) REFERENCES `Languages` (`LanguageID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- 5. VOCABULARY TABLE
-- =====================================================
DROP TABLE IF EXISTS `Vocabulary`;
CREATE TABLE `Vocabulary` (
  `VocabularyID` int NOT NULL AUTO_INCREMENT,
  `Word` varchar(200) COLLATE utf8mb4_unicode_ci NOT NULL,
  `Phonetic` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `Type` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `Meaning` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `Example` text COLLATE utf8mb4_unicode_ci,
  `Audio` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `TopicID` int NOT NULL,
  `LanguageID` int NOT NULL,
  `Difficulty` enum('Easy','Medium','Hard') DEFAULT 'Medium',
  `IsActive` tinyint(1) DEFAULT '1',
  `CreatedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `UpdatedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`VocabularyID`),
  KEY `TopicID` (`TopicID`),
  KEY `LanguageID` (`LanguageID`),
  CONSTRAINT `Vocabulary_ibfk_1` FOREIGN KEY (`TopicID`) REFERENCES `Topics` (`TopicID`),
  CONSTRAINT `Vocabulary_ibfk_2` FOREIGN KEY (`LanguageID`) REFERENCES `Languages` (`LanguageID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- INSERT SAMPLE DATA
-- =====================================================

-- Insert Languages
INSERT INTO `Languages` (`LanguageCode`, `LanguageName`, `NativeName`, `Flag`, `IsActive`, `SortOrder`) VALUES
('vi', 'Vietnamese', 'Tiếng Việt', '🇻🇳', 1, 1),
('en', 'English', 'English', '🇺🇸', 1, 2),
('zh', 'Chinese', '中文', '🇨🇳', 1, 3),
('ko', 'Korean', '한국어', '🇰🇷', 1, 4),
('ja', 'Japanese', '日本語', '🇯🇵', 1, 5),
('th', 'Thai', 'ไทย', '🇹🇭', 1, 6);

-- Insert News Sources
INSERT INTO `NewsSources` (`SourceName`, `SourceURL`, `Description`, `IsActive`) VALUES
('Climate News', 'https://climate-news.com', 'Environmental and climate change news', 1),
('Health Tech', 'https://health-tech.com', 'Healthcare technology and innovation', 1),
('Agri News', 'https://agri-news.com', 'Agriculture and farming news', 1);

-- Insert News Articles
INSERT INTO `NewsArticles` (`Title`, `Content`, `Summary`, `SourceID`, `LanguageID`, `Category`, `DifficultyLevel`, `ReadingTime`, `WordCount`, `IsActive`) VALUES
('Climate Change Impact on Global Economy', 'Climate change is having a profound impact on the global economy. Rising temperatures, extreme weather events, and environmental degradation are creating significant challenges for businesses, governments, and communities worldwide. The economic costs of climate change are already substantial and are expected to increase dramatically in the coming decades.', 'This article explores how climate change affects the global economy and what can be done to mitigate its impact.', 1, 2, 'Environment', 'Intermediate', 5, 150, 1),
('New Technology Revolutionizes Healthcare', 'Artificial intelligence and machine learning are revolutionizing healthcare delivery. From diagnostic tools to treatment recommendations, technology is transforming how medical professionals provide care to patients. These innovations promise to improve outcomes while reducing costs.', 'An overview of how AI and technology are changing healthcare for the better.', 2, 2, 'Technology', 'Advanced', 4, 120, 1),
('Sustainable Agriculture Practices Gain Momentum', 'Sustainable agriculture is essential for feeding the world\'s growing population while protecting the environment. Farmers are adopting innovative techniques such as precision farming, organic methods, and renewable energy to create more efficient and environmentally friendly food production systems.', 'Learn about modern sustainable farming practices that benefit both farmers and the environment.', 3, 2, 'Agriculture', 'Beginner', 6, 180, 1);

-- Insert Topics (sample data)
INSERT INTO `Topics` (`Title`, `Description`, `Level`, `Icon`, `Color`, `SortOrder`, `LanguageID`, `IsActive`, `VocabularyCount`) VALUES
('Basic Greetings', 'Common greeting phrases and expressions', 'Beginner', '👋', '#4CAF50', 1, 1, 1, 10),
('Family Members', 'Vocabulary related to family relationships', 'Beginner', '👨‍👩‍👧‍👦', '#2196F3', 2, 1, 1, 15),
('Food and Drinks', 'Common food and beverage vocabulary', 'Intermediate', '🍎', '#FF9800', 3, 1, 1, 25),
('Travel and Transportation', 'Transportation and travel-related vocabulary', 'Intermediate', '✈️', '#9C27B0', 4, 1, 1, 20),
('Business English', 'Professional and business vocabulary', 'Advanced', '💼', '#607D8B', 5, 1, 1, 30);

-- Insert Vocabulary (sample data)
INSERT INTO `Vocabulary` (`Word`, `Phonetic`, `Type`, `Meaning`, `Example`, `TopicID`, `LanguageID`, `Difficulty`, `IsActive`) VALUES
('Hello', '/həˈloʊ/', 'Interjection', 'A greeting used when meeting someone', 'Hello, how are you today?', 1, 1, 'Easy', 1),
('Goodbye', '/ɡʊdˈbaɪ/', 'Interjection', 'A farewell when leaving', 'Goodbye, see you tomorrow!', 1, 1, 'Easy', 1),
('Mother', '/ˈmʌðər/', 'Noun', 'A female parent', 'My mother is a teacher.', 2, 1, 'Easy', 1),
('Father', '/ˈfɑːðər/', 'Noun', 'A male parent', 'My father works in an office.', 2, 1, 'Easy', 1),
('Apple', '/ˈæpəl/', 'Noun', 'A red or green fruit', 'I eat an apple every day.', 3, 1, 'Easy', 1);

SET FOREIGN_KEY_CHECKS = 1;

-- =====================================================
-- END OF DATABASE BACKUP
-- =====================================================
