<?php
// Database connection
$host = 'mysql';
$dbname = 'vip_english_learning';
$username = 'vip_user';
$password = 'vip_password';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $pdo->exec("SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci");
    $pdo->exec("SET CHARACTER SET utf8mb4");
    
    // Drop and recreate database
    $pdo->exec("DROP DATABASE IF EXISTS vip_english_learning");
    $pdo->exec("CREATE DATABASE vip_english_learning CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci");
    $pdo->exec("USE vip_english_learning");
    
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
    
    $pdo->exec("
        CREATE TABLE StudyMethods (
            MethodID INT AUTO_INCREMENT PRIMARY KEY,
            MethodCode VARCHAR(20) NOT NULL UNIQUE,
            MethodName VARCHAR(50) NOT NULL,
            Description TEXT,
            Icon VARCHAR(50) DEFAULT '📚',
            IsActive BOOLEAN DEFAULT TRUE,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    ");
    
    // Insert Languages Data
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
    
    // Insert Study Methods Data
    $methods = [
        [1, 'flashcard', 'Flashcards', 'Học từ vựng với thẻ ghi nhớ tương tác', '🃏', 1],
        [2, 'spaced', 'Lặp Lại Ngắt Quãng', 'Lặp lại theo khoảng thời gian tối ưu', '🔄', 1],
        [3, 'writing', 'Luyện Viết', 'Luyện viết từ vựng chính xác', '✍️', 1]
    ];
    
    $stmt = $pdo->prepare("INSERT INTO StudyMethods (MethodID, MethodCode, MethodName, Description, Icon, IsActive) VALUES (?, ?, ?, ?, ?, ?)");
    foreach ($methods as $method) {
        $stmt->execute($method);
    }
    
    // Insert Topics Data for Vietnamese (LanguageID = 1)
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
    
    // Insert Topics Data for English (LanguageID = 2)
    $topics_en = [
        [11, 2, 'Family', 'Family and relationships', 'A1', '👨‍👩‍👧‍👦', '#EF4444', 1, 1],
        [12, 2, 'Food', 'Food and drinks', 'A1', '🍕', '#F97316', 1, 2],
        [13, 2, 'Home', 'Home and furniture', 'A1', '🏠', '#8B5CF6', 1, 3],
        [14, 2, 'Colors', 'Colors and shapes', 'A1', '🎨', '#F59E0B', 1, 4],
        [15, 2, 'Numbers', 'Numbers and time', 'A1', '🔢', '#10B981', 1, 5],
        [16, 2, 'Body Parts', 'Body parts and health', 'A1', '👤', '#EC4899', 1, 6],
        [17, 2, 'Animals', 'Animals and nature', 'A1', '🐶', '#06B6D4', 1, 7],
        [18, 2, 'Clothes', 'Clothes and fashion', 'A1', '👕', '#8B5CF6', 1, 8],
        [19, 2, 'Weather', 'Weather and seasons', 'A2', '☀️', '#F59E0B', 1, 9],
        [20, 2, 'Travel', 'Travel and transportation', 'A2', '✈️', '#10B981', 1, 10]
    ];
    
    foreach ($topics_en as $topic) {
        $stmt->execute($topic);
    }
    
    // Insert Topics Data for Chinese (LanguageID = 3)
    $topics_zh = [
        [21, 3, '家庭', 'Gia đình và các mối quan hệ', 'A1', '👨‍👩‍👧‍👦', '#EF4444', 1, 1],
        [22, 3, '食物', 'Thức ăn và đồ uống', 'A1', '🍕', '#F97316', 1, 2],
        [23, 3, '房子', 'Nhà cửa và đồ đạc', 'A1', '🏠', '#8B5CF6', 1, 3],
        [24, 3, '颜色', 'Màu sắc và hình dạng', 'A1', '🎨', '#F59E0B', 1, 4],
        [25, 3, '数字', 'Số đếm và thời gian', 'A1', '🔢', '#10B981', 1, 5],
        [26, 3, '身体', 'Cơ thể và sức khỏe', 'A1', '👤', '#EC4899', 1, 6],
        [27, 3, '动物', 'Động vật và thiên nhiên', 'A1', '🐶', '#06B6D4', 1, 7],
        [28, 3, '衣服', 'Quần áo và thời trang', 'A1', '👕', '#8B5CF6', 1, 8],
        [29, 3, '天气', 'Thời tiết và mùa', 'A2', '☀️', '#F59E0B', 1, 9],
        [30, 3, '旅行', 'Du lịch và phương tiện', 'A2', '✈️', '#10B981', 1, 10]
    ];
    
    foreach ($topics_zh as $topic) {
        $stmt->execute($topic);
    }
    
    // Insert Topics Data for Korean (LanguageID = 4)
    $topics_ko = [
        [31, 4, '가족', 'Gia đình và các mối quan hệ', 'A1', '👨‍👩‍👧‍👦', '#EF4444', 1, 1],
        [32, 4, '음식', 'Thức ăn và đồ uống', 'A1', '🍕', '#F97316', 1, 2],
        [33, 4, '집', 'Nhà cửa và đồ đạc', 'A1', '🏠', '#8B5CF6', 1, 3],
        [34, 4, '색깔', 'Màu sắc và hình dạng', 'A1', '🎨', '#F59E0B', 1, 4],
        [35, 4, '숫자', 'Số đếm và thời gian', 'A1', '🔢', '#10B981', 1, 5],
        [36, 4, '몸', 'Cơ thể và sức khỏe', 'A1', '👤', '#EC4899', 1, 6],
        [37, 4, '동물', 'Động vật và thiên nhiên', 'A1', '🐶', '#06B6D4', 1, 7],
        [38, 4, '옷', 'Quần áo và thời trang', 'A1', '👕', '#8B5CF6', 1, 8],
        [39, 4, '날씨', 'Thời tiết và mùa', 'A2', '☀️', '#F59E0B', 1, 9],
        [40, 4, '여행', 'Du lịch và phương tiện', 'A2', '✈️', '#10B981', 1, 10]
    ];
    
    foreach ($topics_ko as $topic) {
        $stmt->execute($topic);
    }
    
    // Insert Topics Data for Japanese (LanguageID = 5)
    $topics_ja = [
        [41, 5, '家族', 'Gia đình và các mối quan hệ', 'A1', '👨‍👩‍👧‍👦', '#EF4444', 1, 1],
        [42, 5, '食べ物', 'Thức ăn và đồ uống', 'A1', '🍕', '#F97316', 1, 2],
        [43, 5, '家', 'Nhà cửa và đồ đạc', 'A1', '🏠', '#8B5CF6', 1, 3],
        [44, 5, '色', 'Màu sắc và hình dạng', 'A1', '🎨', '#F59E0B', 1, 4],
        [45, 5, '数字', 'Số đếm và thời gian', 'A1', '🔢', '#10B981', 1, 5],
        [46, 5, '体', 'Cơ thể và sức khỏe', 'A1', '👤', '#EC4899', 1, 6],
        [47, 5, '動物', 'Động vật và thiên nhiên', 'A1', '🐶', '#06B6D4', 1, 7],
        [48, 5, '服', 'Quần áo và thời trang', 'A1', '👕', '#8B5CF6', 1, 8],
        [49, 5, '天気', 'Thời tiết và mùa', 'A2', '☀️', '#F59E0B', 1, 9],
        [50, 5, '旅行', 'Du lịch và phương tiện', 'A2', '✈️', '#10B981', 1, 10]
    ];
    
    foreach ($topics_ja as $topic) {
        $stmt->execute($topic);
    }
    
    // Insert Topics Data for Thai (LanguageID = 6)
    $topics_th = [
        [51, 6, 'ครอบครัว', 'Gia đình và các mối quan hệ', 'A1', '👨‍👩‍👧‍👦', '#EF4444', 1, 1],
        [52, 6, 'อาหาร', 'Thức ăn và đồ uống', 'A1', '🍕', '#F97316', 1, 2],
        [53, 6, 'บ้าน', 'Nhà cửa và đồ đạc', 'A1', '🏠', '#8B5CF6', 1, 3],
        [54, 6, 'สี', 'Màu sắc và hình dạng', 'A1', '🎨', '#F59E0B', 1, 4],
        [55, 6, 'ตัวเลข', 'Số đếm và thời gian', 'A1', '🔢', '#10B981', 1, 5],
        [56, 6, 'ร่างกาย', 'Cơ thể và sức khỏe', 'A1', '👤', '#EC4899', 1, 6],
        [57, 6, 'สัตว์', 'Động vật và thiên nhiên', 'A1', '🐶', '#06B6D4', 1, 7],
        [58, 6, 'เสื้อผ้า', 'Quần áo và thời trang', 'A1', '👕', '#8B5CF6', 1, 8],
        [59, 6, 'อากาศ', 'Thời tiết và mùa', 'A2', '☀️', '#F59E0B', 1, 9],
        [60, 6, 'การเดินทาง', 'Du lịch và phương tiện', 'A2', '✈️', '#10B981', 1, 10]
    ];
    
    foreach ($topics_th as $topic) {
        $stmt->execute($topic);
    }
    
    // Insert Vocabulary Data for Vietnamese Family Topic (TopicID = 1)
    $vocabulary_vi_family = [
        [1, 'bố', 'bo', 'Noun', 'Father', 'Bố tôi là bác sĩ.', '/audio/vi/father.mp3', 1, 1, 'Easy'],
        [2, 'mẹ', 'me', 'Noun', 'Mother', 'Mẹ tôi nấu ăn rất ngon.', '/audio/vi/mother.mp3', 1, 1, 'Easy'],
        [3, 'anh trai', 'anh trai', 'Noun', 'Brother', 'Anh trai tôi rất cao.', '/audio/vi/brother.mp3', 1, 1, 'Easy'],
        [4, 'chị gái', 'chi gai', 'Noun', 'Sister', 'Chị gái tôi rất xinh.', '/audio/vi/sister.mp3', 1, 1, 'Easy'],
        [5, 'ông', 'ong', 'Noun', 'Grandfather', 'Ông tôi đã 80 tuổi.', '/audio/vi/grandfather.mp3', 1, 1, 'Easy'],
        [6, 'bà', 'ba', 'Noun', 'Grandmother', 'Bà tôi nấu ăn ngon.', '/audio/vi/grandmother.mp3', 1, 1, 'Easy']
    ];
    
    $stmt = $pdo->prepare("INSERT INTO Vocabulary (WordID, Word, Phonetic, Type, Meaning, Example, Audio, TopicID, LanguageID, Difficulty) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
    foreach ($vocabulary_vi_family as $vocab) {
        $stmt->execute($vocab);
    }
    
    // Insert Vocabulary Data for English Family Topic (TopicID = 11)
    $vocabulary_en_family = [
        [19, 'father', '/ˈfɑːðər/', 'Noun', 'Bố, cha', 'My father is a doctor.', '/audio/en/father.mp3', 11, 2, 'Easy'],
        [20, 'mother', '/ˈmʌðər/', 'Noun', 'Mẹ, má', 'My mother cooks well.', '/audio/en/mother.mp3', 11, 2, 'Easy'],
        [21, 'brother', '/ˈbrʌðər/', 'Noun', 'Anh/em trai', 'My brother is tall.', '/audio/en/brother.mp3', 11, 2, 'Easy'],
        [22, 'sister', '/ˈsɪstər/', 'Noun', 'Chị/em gái', 'My sister is beautiful.', '/audio/en/sister.mp3', 11, 2, 'Easy'],
        [23, 'grandfather', '/ˈɡrænfɑːðər/', 'Noun', 'Ông nội/ngoại', 'My grandfather is 80 years old.', '/audio/en/grandfather.mp3', 11, 2, 'Easy'],
        [24, 'grandmother', '/ˈɡrænmʌðər/', 'Noun', 'Bà nội/ngoại', 'My grandmother cooks well.', '/audio/en/grandmother.mp3', 11, 2, 'Easy']
    ];
    
    foreach ($vocabulary_en_family as $vocab) {
        $stmt->execute($vocab);
    }
    
    // Update VocabularyCount for all topics
    $pdo->exec("UPDATE Topics SET VocabularyCount = (SELECT COUNT(*) FROM Vocabulary WHERE Vocabulary.TopicID = Topics.TopicID)");
    
    echo "Database created successfully with proper UTF-8 encoding!\n";
    
} catch (PDOException $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
?>
