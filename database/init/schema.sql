-- VIP English Learning Platform - Smart Database Schema
-- Comprehensive design for professional English learning application

-- Drop existing tables if they exist (in correct order to handle foreign keys)
DROP TABLE IF EXISTS `recommendations`;
DROP TABLE IF EXISTS `statistics`;
DROP TABLE IF EXISTS `aichat`;
DROP TABLE IF EXISTS `conversations`;
DROP TABLE IF EXISTS `userprogress`;
DROP TABLE IF EXISTS `questions`;
DROP TABLE IF EXISTS `quizzes`;
DROP TABLE IF EXISTS `lessons`;
DROP TABLE IF EXISTS `flashcards`;
DROP TABLE IF EXISTS `grammarrules`;
DROP TABLE IF EXISTS `vocabulary`;
DROP TABLE IF EXISTS `topics`;
DROP TABLE IF EXISTS `users`;

-- 1. Users Table
CREATE TABLE `users` (
  `UserID` int(11) NOT NULL AUTO_INCREMENT,
  `FullName` varchar(100) NOT NULL,
  `Email` varchar(100) NOT NULL UNIQUE,
  `Password` varchar(200) NOT NULL,
  `Role` enum('Student','Teacher','Admin') DEFAULT 'Student',
  `Avatar` varchar(255) DEFAULT NULL,
  `Level` enum('A1','A2','B1','B2','C1','C2') DEFAULT 'A1',
  `JoinDate` datetime DEFAULT CURRENT_TIMESTAMP,
  `Streak` int(11) DEFAULT 0,
  `TotalXP` int(11) DEFAULT 0,
  `IsActive` tinyint(1) DEFAULT 1,
  `CreatedAt` timestamp DEFAULT CURRENT_TIMESTAMP,
  `UpdatedAt` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`UserID`),
  KEY `idx_email` (`Email`),
  KEY `idx_level` (`Level`),
  KEY `idx_role` (`Role`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Topics Table
CREATE TABLE `topics` (
  `TopicID` int(11) NOT NULL AUTO_INCREMENT,
  `Title` varchar(100) NOT NULL,
  `Description` varchar(255) DEFAULT NULL,
  `Level` enum('A1','A2','B1','B2','C1','C2') NOT NULL,
  `Image` varchar(255) DEFAULT NULL,
  `IsActive` tinyint(1) DEFAULT 1,
  `CreatedAt` timestamp DEFAULT CURRENT_TIMESTAMP,
  `UpdatedAt` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`TopicID`),
  KEY `idx_level` (`Level`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Vocabulary Table
CREATE TABLE `vocabulary` (
  `WordID` int(11) NOT NULL AUTO_INCREMENT,
  `Word` varchar(100) NOT NULL,
  `Phonetic` varchar(100) DEFAULT NULL,
  `Type` varchar(50) DEFAULT NULL,
  `Meaning` varchar(255) NOT NULL,
  `Example` varchar(255) DEFAULT NULL,
  `Audio` varchar(255) DEFAULT NULL,
  `Image` varchar(255) DEFAULT NULL,
  `TopicID` int(11) NOT NULL,
  `Difficulty` enum('Easy','Medium','Hard') DEFAULT 'Medium',
  `IsActive` tinyint(1) DEFAULT 1,
  `CreatedAt` timestamp DEFAULT CURRENT_TIMESTAMP,
  `UpdatedAt` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`WordID`),
  KEY `idx_word` (`Word`),
  KEY `idx_topic` (`TopicID`),
  KEY `idx_difficulty` (`Difficulty`),
  FOREIGN KEY (`TopicID`) REFERENCES `topics` (`TopicID`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Grammar Rules Table
CREATE TABLE `grammarrules` (
  `GrammarID` int(11) NOT NULL AUTO_INCREMENT,
  `Title` varchar(100) NOT NULL,
  `Explanation` text NOT NULL,
  `Example` varchar(255) DEFAULT NULL,
  `Level` enum('A1','A2','B1','B2','C1','C2') NOT NULL,
  `VideoLink` varchar(255) DEFAULT NULL,
  `QuizID` int(11) DEFAULT NULL,
  `IsActive` tinyint(1) DEFAULT 1,
  `CreatedAt` timestamp DEFAULT CURRENT_TIMESTAMP,
  `UpdatedAt` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`GrammarID`),
  KEY `idx_level` (`Level`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. Quizzes Table
CREATE TABLE `quizzes` (
  `QuizID` int(11) NOT NULL AUTO_INCREMENT,
  `Title` varchar(255) NOT NULL,
  `Type` enum('Vocabulary','Grammar','Listening','Speaking','Reading','Writing') NOT NULL,
  `Level` enum('A1','A2','B1','B2','C1','C2') NOT NULL,
  `Duration` int(11) DEFAULT 30,
  `Description` text DEFAULT NULL,
  `IsActive` tinyint(1) DEFAULT 1,
  `CreatedAt` timestamp DEFAULT CURRENT_TIMESTAMP,
  `UpdatedAt` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`QuizID`),
  KEY `idx_type` (`Type`),
  KEY `idx_level` (`Level`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. Questions Table
CREATE TABLE `questions` (
  `QuestionID` int(11) NOT NULL AUTO_INCREMENT,
  `QuizID` int(11) NOT NULL,
  `Content` text NOT NULL,
  `OptionA` varchar(255) DEFAULT NULL,
  `OptionB` varchar(255) DEFAULT NULL,
  `OptionC` varchar(255) DEFAULT NULL,
  `OptionD` varchar(255) DEFAULT NULL,
  `CorrectAnswer` varchar(10) NOT NULL,
  `Explanation` text DEFAULT NULL,
  `Audio` varchar(255) DEFAULT NULL,
  `Image` varchar(255) DEFAULT NULL,
  `IsActive` tinyint(1) DEFAULT 1,
  `CreatedAt` timestamp DEFAULT CURRENT_TIMESTAMP,
  `UpdatedAt` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`QuestionID`),
  KEY `idx_quiz` (`QuizID`),
  FOREIGN KEY (`QuizID`) REFERENCES `quizzes` (`QuizID`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. Lessons Table
CREATE TABLE `lessons` (
  `LessonID` int(11) NOT NULL AUTO_INCREMENT,
  `Title` varchar(255) NOT NULL,
  `Description` text DEFAULT NULL,
  `Type` enum('Listening','Speaking','Reading','Writing','Grammar','Vocabulary') NOT NULL,
  `Level` enum('A1','A2','B1','B2','C1','C2') NOT NULL,
  `VideoLink` varchar(255) DEFAULT NULL,
  `Audio` varchar(255) DEFAULT NULL,
  `TextContent` text DEFAULT NULL,
  `QuizID` int(11) DEFAULT NULL,
  `TopicID` int(11) DEFAULT NULL,
  `Duration` int(11) DEFAULT 0,
  `IsActive` tinyint(1) DEFAULT 1,
  `CreatedAt` timestamp DEFAULT CURRENT_TIMESTAMP,
  `UpdatedAt` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`LessonID`),
  KEY `idx_type` (`Type`),
  KEY `idx_level` (`Level`),
  KEY `idx_topic` (`TopicID`),
  FOREIGN KEY (`TopicID`) REFERENCES `topics` (`TopicID`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 8. Flashcards Table
CREATE TABLE `flashcards` (
  `FlashcardID` int(11) NOT NULL AUTO_INCREMENT,
  `WordID` int(11) NOT NULL,
  `UserID` int(11) NOT NULL,
  `ReviewDate` datetime DEFAULT CURRENT_TIMESTAMP,
  `CorrectCount` int(11) DEFAULT 0,
  `WrongCount` int(11) DEFAULT 0,
  `NextReview` datetime DEFAULT CURRENT_TIMESTAMP,
  `Difficulty` enum('Easy','Medium','Hard') DEFAULT 'Medium',
  `Interval` int(11) DEFAULT 1,
  `Repetitions` int(11) DEFAULT 0,
  `EaseFactor` decimal(3,2) DEFAULT 2.50,
  `CreatedAt` timestamp DEFAULT CURRENT_TIMESTAMP,
  `UpdatedAt` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`FlashcardID`),
  KEY `idx_user_word` (`UserID`, `WordID`),
  KEY `idx_next_review` (`NextReview`),
  FOREIGN KEY (`WordID`) REFERENCES `vocabulary` (`WordID`) ON DELETE CASCADE,
  FOREIGN KEY (`UserID`) REFERENCES `users` (`UserID`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 9. User Progress Table
CREATE TABLE `userprogress` (
  `ProgressID` int(11) NOT NULL AUTO_INCREMENT,
  `UserID` int(11) NOT NULL,
  `LessonID` int(11) DEFAULT NULL,
  `QuizID` int(11) DEFAULT NULL,
  `Score` decimal(5,2) DEFAULT 0.00,
  `Completed` tinyint(1) DEFAULT 0,
  `CompletionDate` datetime DEFAULT NULL,
  `TimeSpent` int(11) DEFAULT 0,
  `Attempts` int(11) DEFAULT 1,
  `CreatedAt` timestamp DEFAULT CURRENT_TIMESTAMP,
  `UpdatedAt` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`ProgressID`),
  KEY `idx_user` (`UserID`),
  KEY `idx_lesson` (`LessonID`),
  KEY `idx_quiz` (`QuizID`),
  FOREIGN KEY (`UserID`) REFERENCES `users` (`UserID`) ON DELETE CASCADE,
  FOREIGN KEY (`LessonID`) REFERENCES `lessons` (`LessonID`) ON DELETE CASCADE,
  FOREIGN KEY (`QuizID`) REFERENCES `quizzes` (`QuizID`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 10. Conversations Table
CREATE TABLE `conversations` (
  `ConversationID` int(11) NOT NULL AUTO_INCREMENT,
  `Title` varchar(100) NOT NULL,
  `Level` enum('A1','A2','B1','B2','C1','C2') NOT NULL,
  `Script` text NOT NULL,
  `Audio` varchar(255) DEFAULT NULL,
  `Video` varchar(255) DEFAULT NULL,
  `TopicID` int(11) DEFAULT NULL,
  `Duration` int(11) DEFAULT 0,
  `IsActive` tinyint(1) DEFAULT 1,
  `CreatedAt` timestamp DEFAULT CURRENT_TIMESTAMP,
  `UpdatedAt` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`ConversationID`),
  KEY `idx_level` (`Level`),
  KEY `idx_topic` (`TopicID`),
  FOREIGN KEY (`TopicID`) REFERENCES `topics` (`TopicID`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 11. AI Chat Table
CREATE TABLE `aichat` (
  `ChatID` int(11) NOT NULL AUTO_INCREMENT,
  `UserID` int(11) NOT NULL,
  `UserMessage` text NOT NULL,
  `AIResponse` text NOT NULL,
  `PronunciationScore` decimal(5,2) DEFAULT NULL,
  `GrammarScore` decimal(5,2) DEFAULT NULL,
  `FluencyScore` decimal(5,2) DEFAULT NULL,
  `OverallScore` decimal(5,2) DEFAULT NULL,
  `Feedback` text DEFAULT NULL,
  `Date` datetime DEFAULT CURRENT_TIMESTAMP,
  `SessionID` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`ChatID`),
  KEY `idx_user` (`UserID`),
  KEY `idx_date` (`Date`),
  KEY `idx_session` (`SessionID`),
  FOREIGN KEY (`UserID`) REFERENCES `users` (`UserID`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 12. Statistics Table
CREATE TABLE `statistics` (
  `StatID` int(11) NOT NULL AUTO_INCREMENT,
  `UserID` int(11) NOT NULL,
  `WordsLearned` int(11) DEFAULT 0,
  `LessonsCompleted` int(11) DEFAULT 0,
  `QuizzesCompleted` int(11) DEFAULT 0,
  `HoursSpent` decimal(5,2) DEFAULT 0.00,
  `AvgScore` decimal(5,2) DEFAULT 0.00,
  `StreakDays` int(11) DEFAULT 0,
  `TotalXP` int(11) DEFAULT 0,
  `LastActive` datetime DEFAULT CURRENT_TIMESTAMP,
  `CreatedAt` timestamp DEFAULT CURRENT_TIMESTAMP,
  `UpdatedAt` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`StatID`),
  UNIQUE KEY `idx_user_unique` (`UserID`),
  FOREIGN KEY (`UserID`) REFERENCES `users` (`UserID`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 13. Recommendations Table
CREATE TABLE `recommendations` (
  `RecommendID` int(11) NOT NULL AUTO_INCREMENT,
  `UserID` int(11) NOT NULL,
  `ContentType` enum('Vocabulary','Grammar','Listening','Speaking','Reading','Writing','Lesson','Quiz') NOT NULL,
  `ContentID` int(11) NOT NULL,
  `Reason` varchar(255) NOT NULL,
  `Priority` enum('Low','Medium','High') DEFAULT 'Medium',
  `IsViewed` tinyint(1) DEFAULT 0,
  `IsCompleted` tinyint(1) DEFAULT 0,
  `CreatedAt` timestamp DEFAULT CURRENT_TIMESTAMP,
  `UpdatedAt` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`RecommendID`),
  KEY `idx_user` (`UserID`),
  KEY `idx_content` (`ContentType`, `ContentID`),
  KEY `idx_priority` (`Priority`),
  FOREIGN KEY (`UserID`) REFERENCES `users` (`UserID`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Add foreign key constraints after all tables are created
ALTER TABLE `grammarrules` ADD CONSTRAINT `fk_grammar_quiz` FOREIGN KEY (`QuizID`) REFERENCES `quizzes` (`QuizID`) ON DELETE SET NULL;
ALTER TABLE `lessons` ADD CONSTRAINT `fk_lesson_quiz` FOREIGN KEY (`QuizID`) REFERENCES `quizzes` (`QuizID`) ON DELETE SET NULL;

-- Insert sample data

-- Insert sample admin user
INSERT INTO `users` (`FullName`, `Email`, `Password`, `Role`, `Level`, `Streak`, `TotalXP`) VALUES
('Admin User', 'admin@vipenglish.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Admin', 'C2', 30, 5000),
('John Student', 'student@example.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Student', 'A2', 5, 250),
('Jane Teacher', 'teacher@example.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Teacher', 'C1', 15, 2000);

-- Insert sample topics
INSERT INTO `topics` (`Title`, `Description`, `Level`) VALUES
('Family', 'Vocabulary and conversations about family members', 'A1'),
('Travel', 'Travel-related vocabulary and phrases', 'A2'),
('Food & Dining', 'Food vocabulary and restaurant conversations', 'A1'),
('Work & Career', 'Professional vocabulary and workplace communication', 'B1'),
('Health & Fitness', 'Health-related vocabulary and medical terms', 'B2'),
('Technology', 'Tech vocabulary and digital communication', 'B1'),
('Education', 'Academic vocabulary and school-related terms', 'A2'),
('Entertainment', 'Entertainment vocabulary and leisure activities', 'A1');

-- Insert sample vocabulary
INSERT INTO `vocabulary` (`Word`, `Phonetic`, `Type`, `Meaning`, `Example`, `TopicID`, `Difficulty`) VALUES
('family', '/ˈfæməli/', 'noun', 'gia đình', 'I love my family very much.', 1, 'Easy'),
('mother', '/ˈmʌðər/', 'noun', 'mẹ', 'My mother is a teacher.', 1, 'Easy'),
('father', '/ˈfɑːðər/', 'noun', 'bố', 'My father works in an office.', 1, 'Easy'),
('travel', '/ˈtrævəl/', 'verb', 'du lịch', 'I love to travel around the world.', 2, 'Medium'),
('airport', '/ˈeərpɔːrt/', 'noun', 'sân bay', 'We arrived at the airport early.', 2, 'Medium'),
('restaurant', '/ˈrestərɑːnt/', 'noun', 'nhà hàng', 'Let\'s have dinner at a nice restaurant.', 3, 'Easy'),
('delicious', '/dɪˈlɪʃəs/', 'adjective', 'ngon', 'This food is absolutely delicious!', 3, 'Medium'),
('meeting', '/ˈmiːtɪŋ/', 'noun', 'cuộc họp', 'We have a meeting at 3 PM today.', 4, 'Medium'),
('project', '/ˈprɑːdʒekt/', 'noun', 'dự án', 'I\'m working on a new project.', 4, 'Medium'),
('healthy', '/ˈhelθi/', 'adjective', 'khỏe mạnh', 'Eating vegetables keeps you healthy.', 5, 'Easy');

-- Insert sample quizzes
INSERT INTO `quizzes` (`Title`, `Type`, `Level`, `Duration`, `Description`) VALUES
('Family Vocabulary Test', 'Vocabulary', 'A1', 15, 'Test your knowledge of family-related vocabulary'),
('Travel Phrases Quiz', 'Vocabulary', 'A2', 20, 'Quiz about travel and transportation vocabulary'),
('Food & Dining Quiz', 'Vocabulary', 'A1', 15, 'Test your food and restaurant vocabulary'),
('Basic Grammar Test', 'Grammar', 'A1', 25, 'Test basic English grammar rules'),
('Work Vocabulary Quiz', 'Vocabulary', 'B1', 20, 'Professional vocabulary and workplace terms');

-- Insert sample questions
INSERT INTO `questions` (`QuizID`, `Content`, `OptionA`, `OptionB`, `OptionC`, `OptionD`, `CorrectAnswer`, `Explanation`) VALUES
(1, 'What do you call your father\'s mother?', 'Grandmother', 'Aunt', 'Sister', 'Cousin', 'A', 'Your father\'s mother is your grandmother.'),
(1, 'What is the opposite of "young"?', 'Old', 'Small', 'Big', 'New', 'A', 'The opposite of young is old.'),
(2, 'Where do you go to catch a plane?', 'Train station', 'Airport', 'Bus stop', 'Harbor', 'B', 'You catch a plane at the airport.'),
(3, 'What do you call a place where you eat food?', 'School', 'Restaurant', 'Hospital', 'Library', 'B', 'A restaurant is a place where you eat food.'),
(4, 'Which sentence is correct?', 'I am go to school', 'I go to school', 'I going to school', 'I goes to school', 'B', 'The correct present simple form is "I go to school".');

-- Insert sample lessons
INSERT INTO `lessons` (`Title`, `Description`, `Type`, `Level`, `VideoLink`, `TextContent`, `TopicID`, `Duration`) VALUES
('Introducing Family Members', 'Learn how to introduce your family members in English', 'Speaking', 'A1', 'https://youtube.com/watch?v=dQw4w9WgXcQ', 'In this lesson, you will learn how to introduce your family members...', 1, 15),
('At the Airport', 'Essential phrases for traveling by plane', 'Listening', 'A2', 'https://youtube.com/watch?v=dQw4w9WgXcQ', 'Learn important phrases you\'ll need at the airport...', 2, 20),
('Ordering Food', 'How to order food in a restaurant', 'Speaking', 'A1', 'https://youtube.com/watch?v=dQw4w9WgXcQ', 'Practice ordering food and drinks in English...', 3, 18),
('Present Simple Tense', 'Learn the basic present simple tense', 'Grammar', 'A1', 'https://youtube.com/watch?v=dQw4w9WgXcQ', 'The present simple tense is used for habits and general truths...', 8, 25);

-- Insert sample conversations
INSERT INTO `conversations` (`Title`, `Level`, `Script`, `TopicID`, `Duration`) VALUES
('Family Dinner', 'A1', 'A: How was your day, dear?\nB: It was good, Mom. How about yours?\nA: Busy but productive. What did you learn at school today?\nB: We learned about animals. I really like elephants!', 1, 2),
('At the Airport Check-in', 'A2', 'A: Good morning. I\'d like to check in for my flight.\nB: Good morning. May I see your passport and ticket?\nA: Here you are.\nB: Thank you. Would you like a window or aisle seat?\nA: Window seat, please.', 2, 3),
('Ordering at Restaurant', 'A1', 'A: Good evening. Table for two?\nB: Yes, please.\nA: Here\'s your menu. I\'ll be back to take your order.\nB: Thank you. We\'ll have the chicken and fish, please.', 3, 4);

-- Insert sample grammar rules
INSERT INTO `grammarrules` (`Title`, `Explanation`, `Example`, `Level`) VALUES
('Present Simple', 'Used for habits, routines, and general truths. Form: Subject + base verb (+s for 3rd person)', 'I work every day. She works in an office.', 'A1'),
('Past Simple', 'Used for completed actions in the past. Form: Subject + past tense verb', 'I went to school yesterday. She studied English last night.', 'A2'),
('Present Continuous', 'Used for actions happening now. Form: Subject + am/is/are + verb-ing', 'I am reading a book. She is cooking dinner.', 'A1'),
('Future Simple', 'Used for future plans and predictions. Form: Subject + will + base verb', 'I will travel to Japan next year. It will rain tomorrow.', 'A2');

-- Insert sample user statistics
INSERT INTO `statistics` (`UserID`, `WordsLearned`, `LessonsCompleted`, `QuizzesCompleted`, `HoursSpent`, `AvgScore`, `StreakDays`, `TotalXP`) VALUES
(1, 0, 0, 0, 0.00, 0.00, 0, 0),
(2, 15, 3, 2, 2.50, 85.50, 5, 250),
(3, 50, 8, 5, 8.75, 92.30, 15, 2000);

-- Insert sample flashcards for user 2
INSERT INTO `flashcards` (`WordID`, `UserID`, `CorrectCount`, `WrongCount`, `NextReview`, `Difficulty`, `Interval`, `Repetitions`, `EaseFactor`) VALUES
(1, 2, 3, 1, DATE_ADD(NOW(), INTERVAL 1 DAY), 'Easy', 1, 3, 2.50),
(2, 2, 2, 0, DATE_ADD(NOW(), INTERVAL 2 DAY), 'Easy', 2, 2, 2.50),
(3, 2, 1, 1, DATE_ADD(NOW(), INTERVAL 1 DAY), 'Medium', 1, 1, 2.50);

-- Insert sample user progress
INSERT INTO `userprogress` (`UserID`, `LessonID`, `Score`, `Completed`, `CompletionDate`, `TimeSpent`, `Attempts`) VALUES
(2, 1, 85.50, 1, NOW(), 15, 1),
(2, 2, 92.00, 1, NOW(), 20, 1),
(2, 1, 78.00, 1, NOW(), 25, 1);

-- Insert sample recommendations
INSERT INTO `recommendations` (`UserID`, `ContentType`, `ContentID`, `Reason`, `Priority`) VALUES
(2, 'Vocabulary', 4, 'You often struggle with travel-related words', 'High'),
(2, 'Lesson', 2, 'Based on your interest in travel topics', 'Medium'),
(2, 'Quiz', 2, 'Practice travel vocabulary you\'ve been learning', 'High');