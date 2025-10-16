<?php
// =====================================================
// FIX DATABASE ENCODING - PHP SCRIPT
// =====================================================
// File: fix_database_encoding.php
// Description: Fix database encoding using PHP with proper UTF-8
// =====================================================

// Set UTF-8 headers
header('Content-Type: text/html; charset=utf-8');

// Database connection with proper UTF-8
$host = 'mysql';
$dbname = 'vip_english_learning';
$username = 'vip_user';
$password = 'vip_password';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $username, $password, [
        PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci"
    ]);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
    
    // Force UTF-8 encoding
    $pdo->exec("SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci");
    $pdo->exec("SET CHARACTER SET utf8mb4");
    $pdo->exec("SET character_set_client = utf8mb4");
    $pdo->exec("SET character_set_connection = utf8mb4");
    $pdo->exec("SET character_set_results = utf8mb4");
    
    echo "✅ Database connection established with UTF-8 encoding\n";
    
    // Clear existing data
    $pdo->exec("DELETE FROM Vocabulary");
    $pdo->exec("DELETE FROM Topics");
    $pdo->exec("DELETE FROM Languages");
    
    echo "✅ Existing data cleared\n";
    
    // Insert Languages with proper UTF-8
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
    
    echo "✅ Languages inserted with proper UTF-8\n";
    
    // Insert Topics with proper UTF-8
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
    
    echo "✅ Topics inserted with proper UTF-8\n";
    
    // Insert Vocabulary with proper UTF-8
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
    
    echo "✅ Vocabulary inserted with proper UTF-8\n";
    
    // Update vocabulary count
    $pdo->exec("UPDATE Topics SET VocabularyCount = (SELECT COUNT(*) FROM Vocabulary WHERE Vocabulary.TopicID = Topics.TopicID)");
    
    echo "✅ Vocabulary count updated\n";
    
    // Test the data
    $stmt = $pdo->prepare("SELECT TopicID, Title, Description FROM Topics WHERE LanguageID = 1 ORDER BY TopicID LIMIT 3");
    $stmt->execute();
    $results = $stmt->fetchAll();
    
    echo "\n📊 Test Results:\n";
    foreach ($results as $row) {
        echo "ID: {$row['TopicID']} | Title: {$row['Title']} | Description: {$row['Description']}\n";
    }
    
    echo "\n✅ Database encoding fixed successfully!\n";
    echo "✅ All Vietnamese characters display correctly!\n";
    
} catch (PDOException $e) {
    echo "❌ Database error: " . $e->getMessage() . "\n";
}
?>
