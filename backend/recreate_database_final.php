<?php
// =====================================================
// RECREATE DATABASE FINAL - PHP SCRIPT
// =====================================================
// File: recreate_database_final.php
// Description: Recreate database with perfect UTF-8 encoding
// =====================================================

// Set UTF-8 headers
header('Content-Type: text/html; charset=utf-8');

// Database connection
$host = 'mysql';
$username = 'vip_user';
$password = 'vip_password';

try {
    // Connect without database first
    $pdo = new PDO("mysql:host=$host;charset=utf8mb4", $username, $password, [
        PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci"
    ]);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    // Force UTF-8 encoding
    $pdo->exec("SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci");
    $pdo->exec("SET CHARACTER SET utf8mb4");
    $pdo->exec("SET character_set_client = utf8mb4");
    $pdo->exec("SET character_set_connection = utf8mb4");
    $pdo->exec("SET character_set_results = utf8mb4");
    
    echo "✅ Connected to MySQL with UTF-8 encoding\n";
    
    // Drop and recreate database
    $pdo->exec("DROP DATABASE IF EXISTS vip_english_learning");
    $pdo->exec("CREATE DATABASE vip_english_learning CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci");
    $pdo->exec("USE vip_english_learning");
    
    echo "✅ Database recreated with UTF-8 encoding\n";
    
    // Create tables
    $pdo->exec("
        CREATE TABLE Languages (
            LanguageID INT AUTO_INCREMENT PRIMARY KEY,
            LanguageCode VARCHAR(10) NOT NULL UNIQUE,
            LanguageName VARCHAR(50) NOT NULL,
            NativeName VARCHAR(50) NOT NULL,
            Flag VARCHAR(10) NOT NULL,
            IsActive BOOLEAN DEFAULT TRUE,
            SortOrder INT DEFAULT 0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    ");
    
    $pdo->exec("
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
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            FOREIGN KEY (LanguageID) REFERENCES Languages(LanguageID) ON DELETE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    ");
    
    $pdo->exec("
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
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            FOREIGN KEY (TopicID) REFERENCES Topics(TopicID) ON DELETE CASCADE,
            FOREIGN KEY (LanguageID) REFERENCES Languages(LanguageID) ON DELETE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    ");
    
    echo "✅ Tables created with UTF-8 encoding\n";
    
    // Insert data with proper UTF-8
    $languages = [
        [1, 'vi', 'Vietnamese', 'Tiếng Việt', '🇻🇳', 1, 1],
        [2, 'en', 'English', 'English', '🇺🇸', 1, 2],
        [3, 'zh', 'Chinese', '中文', '🇨🇳', 1, 3],
        [4, 'ko', 'Korean', '한국어', '🇰🇷', 1, 4],
        [5, 'ja', 'Japanese', '日本語', '🇯🇵', 1, 5],
        [6, 'th', 'Thai', 'ไทย', '🇹🇭', 1, 6]
    ];
    
    $stmt = $pdo->prepare("INSERT INTO Languages (LanguageID, LanguageCode, LanguageName, NativeName, Flag, IsActive, SortOrder) VALUES (?, ?, ?, ?, ?, ?, ?)");
    foreach ($languages as $lang) {
        $stmt->execute($lang);
    }
    
    echo "✅ Languages inserted\n";
    
    $topics = [
        [1, 1, 'Gia đình', 'Gia đình và các mối quan hệ', 'A1', '👨‍👩‍👧‍👦', '#EF4444', 1, 1],
        [2, 1, 'Thức ăn', 'Thức ăn và đồ uống', 'A1', '🍕', '#F97316', 1, 2],
        [3, 1, 'Nhà cửa', 'Nhà cửa và đồ đạc', 'A1', '🏠', '#8B5CF6', 1, 3],
        [4, 1, 'Màu sắc', 'Màu sắc và hình dạng', 'A1', '🎨', '#F59E0B', 1, 4],
        [5, 1, 'Số đếm', 'Số đếm và thời gian', 'A1', '🔢', '#10B981', 1, 5],
        [6, 1, 'Cơ thể', 'Cơ thể và sức khỏe', 'A1', '👤', '#EC4899', 1, 6],
        [7, 1, 'Động vật', 'Động vật và thiên nhiên', 'A1', '🐶', '#06B6D4', 1, 7],
        [8, 1, 'Quần áo', 'Quần áo và thời trang', 'A1', '👕', '#8B5CF6', 1, 8],
        [9, 1, 'Thời tiết', 'Thời tiết và mùa', 'A2', '☀️', '#F59E0B', 1, 9],
        [10, 1, 'Du lịch', 'Du lịch và phương tiện', 'A2', '✈️', '#10B981', 1, 10]
    ];
    
    $stmt = $pdo->prepare("INSERT INTO Topics (TopicID, LanguageID, Title, Description, Level, Icon, Color, IsActive, SortOrder) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
    foreach ($topics as $topic) {
        $stmt->execute($topic);
    }
    
    echo "✅ Topics inserted\n";
    
    $vocabulary = [
        [1, 'bố', 'bo', 'Noun', 'Father', 'Bố tôi là bác sĩ.', '/audio/vi/father.mp3', 1, 1, 'Easy'],
        [2, 'mẹ', 'me', 'Noun', 'Mother', 'Mẹ tôi nấu ăn rất ngon.', '/audio/vi/mother.mp3', 1, 1, 'Easy'],
        [3, 'anh trai', 'anh trai', 'Noun', 'Brother', 'Anh trai tôi rất cao.', '/audio/vi/brother.mp3', 1, 1, 'Easy'],
        [4, 'chị gái', 'chi gai', 'Noun', 'Sister', 'Chị gái tôi rất xinh.', '/audio/vi/sister.mp3', 1, 1, 'Easy'],
        [5, 'ông', 'ong', 'Noun', 'Grandfather', 'Ông tôi đã 80 tuổi.', '/audio/vi/grandfather.mp3', 1, 1, 'Easy'],
        [6, 'bà', 'ba', 'Noun', 'Grandmother', 'Bà tôi nấu ăn ngon.', '/audio/vi/grandmother.mp3', 1, 1, 'Easy'],
        [7, 'cơm', 'com', 'Noun', 'Rice', 'Tôi ăn cơm mỗi ngày.', '/audio/vi/rice.mp3', 2, 1, 'Easy'],
        [8, 'bánh mì', 'banh mi', 'Noun', 'Bread', 'Tôi thích bánh mì cho bữa sáng.', '/audio/vi/bread.mp3', 2, 1, 'Easy'],
        [9, 'nước', 'nuoc', 'Noun', 'Water', 'Tôi uống nước mỗi ngày.', '/audio/vi/water.mp3', 2, 1, 'Easy'],
        [10, 'cà phê', 'ca phe', 'Noun', 'Coffee', 'Tôi uống cà phê vào buổi sáng.', '/audio/vi/coffee.mp3', 2, 1, 'Easy'],
        [11, 'xe ô tô', 'xe o to', 'Noun', 'Car', 'Tôi lái xe ô tô đi làm.', '/audio/vi/car.mp3', 10, 1, 'Easy'],
        [12, 'máy bay', 'may bay', 'Noun', 'Plane', 'Tôi đi du lịch bằng máy bay.', '/audio/vi/plane.mp3', 10, 1, 'Easy']
    ];
    
    $stmt = $pdo->prepare("INSERT INTO Vocabulary (WordID, Word, Phonetic, Type, Meaning, Example, Audio, TopicID, LanguageID, Difficulty) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
    foreach ($vocabulary as $vocab) {
        $stmt->execute($vocab);
    }
    
    echo "✅ Vocabulary inserted\n";
    
    // Update vocabulary count
    $pdo->exec("UPDATE Topics SET VocabularyCount = (SELECT COUNT(*) FROM Vocabulary WHERE Vocabulary.TopicID = Topics.TopicID)");
    
    echo "✅ Vocabulary count updated\n";
    
    // Test the data
    $stmt = $pdo->prepare("SELECT TopicID, Title, Description FROM Topics WHERE LanguageID = 1 ORDER BY TopicID LIMIT 3");
    $stmt->execute();
    $results = $stmt->fetchAll();
    
    echo "\n📊 Final Test Results:\n";
    foreach ($results as $row) {
        echo "ID: {$row['TopicID']} | Title: {$row['Title']} | Description: {$row['Description']}\n";
    }
    
    echo "\n✅ Database recreated successfully with perfect UTF-8 encoding!\n";
    echo "✅ All Vietnamese characters display correctly!\n";
    
} catch (PDOException $e) {
    echo "❌ Database error: " . $e->getMessage() . "\n";
}
?>
