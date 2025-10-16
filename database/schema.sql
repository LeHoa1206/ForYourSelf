-- HocTuVung Database Schema
-- Vocabulary Learning Platform

-- Create database
CREATE DATABASE IF NOT EXISTS hoctu_vung CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE hoctu_vung;

-- Users table
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('user', 'admin') DEFAULT 'user',
    avatar_url VARCHAR(255),
    settings JSON,
    email_verified_at TIMESTAMP NULL,
    last_login TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_role (role)
);

-- Words table
CREATE TABLE words (
    id INT PRIMARY KEY AUTO_INCREMENT,
    lemma VARCHAR(100) NOT NULL,
    pos VARCHAR(20), -- part of speech (noun, verb, adj, etc.)
    ipa VARCHAR(100), -- International Phonetic Alphabet
    meaning_en TEXT,
    meaning_vn TEXT,
    example_en TEXT,
    example_vn TEXT,
    audio_url VARCHAR(255),
    image_url VARCHAR(255),
    tags JSON,
    level ENUM('beginner', 'intermediate', 'advanced') DEFAULT 'beginner',
    difficulty_score DECIMAL(3,2) DEFAULT 1.00,
    created_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_lemma (lemma),
    INDEX idx_level (level),
    INDEX idx_created_by (created_by),
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
);

-- Decks table
CREATE TABLE decks (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    owner_id INT NOT NULL,
    visibility ENUM('public', 'private', 'unlisted') DEFAULT 'public',
    category VARCHAR(50),
    tags JSON,
    word_count INT DEFAULT 0,
    study_count INT DEFAULT 0,
    rating DECIMAL(3,2) DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_owner_id (owner_id),
    INDEX idx_visibility (visibility),
    INDEX idx_category (category),
    FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Deck words junction table
CREATE TABLE deck_words (
    id INT PRIMARY KEY AUTO_INCREMENT,
    deck_id INT NOT NULL,
    word_id INT NOT NULL,
    position INT DEFAULT 0,
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY unique_deck_word (deck_id, word_id),
    INDEX idx_deck_id (deck_id),
    INDEX idx_word_id (word_id),
    INDEX idx_position (position),
    FOREIGN KEY (deck_id) REFERENCES decks(id) ON DELETE CASCADE,
    FOREIGN KEY (word_id) REFERENCES words(id) ON DELETE CASCADE
);

-- User deck subscriptions
CREATE TABLE user_decks (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    deck_id INT NOT NULL,
    subscribed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY unique_user_deck (user_id, deck_id),
    INDEX idx_user_id (user_id),
    INDEX idx_deck_id (deck_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (deck_id) REFERENCES decks(id) ON DELETE CASCADE
);

-- Flashcards progress (SRS - Spaced Repetition System)
CREATE TABLE flashcards_progress (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    word_id INT NOT NULL,
    deck_id INT NOT NULL,
    ease DECIMAL(3,2) DEFAULT 2.50,
    interval_days INT DEFAULT 1,
    repetitions INT DEFAULT 0,
    next_review_date DATE,
    last_reviewed TIMESTAMP NULL,
    review_count INT DEFAULT 0,
    correct_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY unique_user_word_deck (user_id, word_id, deck_id),
    INDEX idx_user_id (user_id),
    INDEX idx_word_id (word_id),
    INDEX idx_deck_id (deck_id),
    INDEX idx_next_review (next_review_date),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (word_id) REFERENCES words(id) ON DELETE CASCADE,
    FOREIGN KEY (deck_id) REFERENCES decks(id) ON DELETE CASCADE
);

-- Quizzes table
CREATE TABLE quizzes (
    id INT PRIMARY KEY AUTO_INCREMENT,
    deck_id INT NOT NULL,
    user_id INT NOT NULL,
    quiz_type ENUM('multiple_choice', 'fill_blank', 'matching', 'listening') DEFAULT 'multiple_choice',
    questions JSON NOT NULL,
    answers JSON NOT NULL,
    score DECIMAL(5,2) DEFAULT 0.00,
    total_questions INT DEFAULT 0,
    correct_answers INT DEFAULT 0,
    time_taken INT DEFAULT 0, -- in seconds
    completed_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_deck_id (deck_id),
    INDEX idx_user_id (user_id),
    INDEX idx_quiz_type (quiz_type),
    FOREIGN KEY (deck_id) REFERENCES decks(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Study sessions
CREATE TABLE study_sessions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    deck_id INT NOT NULL,
    session_type ENUM('flashcard', 'quiz', 'review') DEFAULT 'flashcard',
    words_studied INT DEFAULT 0,
    correct_answers INT DEFAULT 0,
    time_spent INT DEFAULT 0, -- in seconds
    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ended_at TIMESTAMP NULL,
    INDEX idx_user_id (user_id),
    INDEX idx_deck_id (deck_id),
    INDEX idx_session_type (session_type),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (deck_id) REFERENCES decks(id) ON DELETE CASCADE
);

-- AI Chat messages
CREATE TABLE messages_ai (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    prompt TEXT NOT NULL,
    response TEXT NOT NULL,
    context JSON,
    tokens_used INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_user_id (user_id),
    INDEX idx_created_at (created_at),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Activity log
CREATE TABLE activity_log (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    action VARCHAR(100) NOT NULL,
    resource_type VARCHAR(50),
    resource_id INT,
    meta JSON,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_user_id (user_id),
    INDEX idx_action (action),
    INDEX idx_resource (resource_type, resource_id),
    INDEX idx_created_at (created_at),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Word ratings and reviews
CREATE TABLE word_reviews (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    word_id INT NOT NULL,
    rating TINYINT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    review TEXT,
    helpful_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY unique_user_word_review (user_id, word_id),
    INDEX idx_user_id (user_id),
    INDEX idx_word_id (word_id),
    INDEX idx_rating (rating),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (word_id) REFERENCES words(id) ON DELETE CASCADE
);

-- Deck ratings
CREATE TABLE deck_ratings (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    deck_id INT NOT NULL,
    rating TINYINT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    review TEXT,
    helpful_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY unique_user_deck_rating (user_id, deck_id),
    INDEX idx_user_id (user_id),
    INDEX idx_deck_id (deck_id),
    INDEX idx_rating (rating),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (deck_id) REFERENCES decks(id) ON DELETE CASCADE
);

-- Notifications
CREATE TABLE notifications (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    type VARCHAR(50) NOT NULL,
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    data JSON,
    read_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_user_id (user_id),
    INDEX idx_type (type),
    INDEX idx_read_at (read_at),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Insert default admin user
INSERT INTO users (name, email, password_hash, role) VALUES 
('Admin', 'admin@hoctu-vung.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin');

-- Insert sample words
INSERT INTO words (lemma, pos, ipa, meaning_en, meaning_vn, example_en, example_vn, level) VALUES
('hello', 'interjection', '/həˈloʊ/', 'used as a greeting', 'xin chào', 'Hello, how are you?', 'Xin chào, bạn khỏe không?', 'beginner'),
('beautiful', 'adjective', '/ˈbjuːtɪfəl/', 'pleasing to the senses or mind', 'đẹp', 'She has beautiful eyes.', 'Cô ấy có đôi mắt đẹp.', 'beginner'),
('learn', 'verb', '/lɜːrn/', 'gain knowledge or skills', 'học', 'I want to learn English.', 'Tôi muốn học tiếng Anh.', 'beginner'),
('vocabulary', 'noun', '/vəˈkæbjələri/', 'the body of words used in a particular language', 'từ vựng', 'Reading books helps expand your vocabulary.', 'Đọc sách giúp mở rộng từ vựng của bạn.', 'intermediate'),
('comprehensive', 'adjective', '/ˌkɑːmprɪˈhensɪv/', 'including or dealing with all or nearly all elements', 'toàn diện', 'This is a comprehensive study guide.', 'Đây là một hướng dẫn học tập toàn diện.', 'advanced');

-- Insert sample deck
INSERT INTO decks (title, description, owner_id, category) VALUES
('Basic English Words', 'Essential vocabulary for beginners', 1, 'beginner'),
('IELTS Vocabulary', 'High-frequency words for IELTS exam', 1, 'exam');

-- Add words to sample deck
INSERT INTO deck_words (deck_id, word_id, position) VALUES
(1, 1, 1), (1, 2, 2), (1, 3, 3),
(2, 4, 1), (2, 5, 2);
