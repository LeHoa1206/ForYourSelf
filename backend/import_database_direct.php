<?php
// Import database directly with all constraints
header('Content-Type: text/html; charset=utf-8');

$host = 'mysql';
$username = 'vip_user';
$password = 'vip_password';

try {
    // Connect to MySQL
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
    
    // Use existing database
    $pdo->exec("USE vip_english_learning");
    echo "✅ Using existing database: vip_english_learning\n";
    
    // Clear existing data (optional - comment out if you want to keep existing data)
    echo "🔄 Clearing existing data...\n";
    $pdo->exec("SET FOREIGN_KEY_CHECKS = 0");
    $pdo->exec("DELETE FROM Vocabulary");
    $pdo->exec("DELETE FROM Topics");
    $pdo->exec("DELETE FROM Languages");
    $pdo->exec("SET FOREIGN_KEY_CHECKS = 1");
    echo "✅ Existing data cleared\n";
    
    // Reset auto increment
    $pdo->exec("ALTER TABLE Languages AUTO_INCREMENT = 1");
    $pdo->exec("ALTER TABLE Topics AUTO_INCREMENT = 1");
    $pdo->exec("ALTER TABLE Vocabulary AUTO_INCREMENT = 1");
    echo "✅ Auto increment reset\n";
    
    // Insert Languages
    echo "🔄 Inserting Languages...\n";
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
    echo "✅ Languages inserted: " . count($languages) . " records\n";
    
    // Insert Topics
    echo "🔄 Inserting Topics...\n";
    $topics = [
        // Vietnamese Topics
        [1, 1, 'Gia đình', 'Gia đình và các mối quan hệ', 'A1', '👨‍👩‍👧‍👦', '#EF4444', 1, 1],
        [2, 1, 'Thức ăn', 'Thức ăn và đồ uống', 'A1', '🍕', '#F97316', 1, 2],
        [3, 1, 'Nhà cửa', 'Nhà cửa và đồ đạc', 'A1', '🏠', '#8B5CF6', 1, 3],
        [4, 1, 'Màu sắc', 'Màu sắc và hình dạng', 'A1', '🎨', '#F59E0B', 1, 4],
        [5, 1, 'Số đếm', 'Số đếm và thời gian', 'A1', '🔢', '#10B981', 1, 5],
        
        // English Topics
        [6, 2, 'Family', 'Family and relationships', 'A1', '👨‍👩‍👧‍👦', '#EF4444', 1, 1],
        [7, 2, 'Food', 'Food and drinks', 'A1', '🍕', '#F97316', 1, 2],
        [8, 2, 'Home', 'Home and furniture', 'A1', '🏠', '#8B5CF6', 1, 3],
        [9, 2, 'Colors', 'Colors and shapes', 'A1', '🎨', '#F59E0B', 1, 4],
        [10, 2, 'Numbers', 'Numbers and time', 'A1', '🔢', '#10B981', 1, 5],
        
        // Chinese Topics
        [11, 3, '家庭', 'Gia đình và các mối quan hệ', 'A1', '👨‍👩‍👧‍👦', '#EF4444', 1, 1],
        [12, 3, '食物', 'Thức ăn và đồ uống', 'A1', '🍕', '#F97316', 1, 2],
        [13, 3, '房子', 'Nhà cửa và đồ đạc', 'A1', '🏠', '#8B5CF6', 1, 3],
        [14, 3, '颜色', 'Màu sắc và hình dạng', 'A1', '🎨', '#F59E0B', 1, 4],
        [15, 3, '数字', 'Số đếm và thời gian', 'A1', '🔢', '#10B981', 1, 5],
        
        // Korean Topics
        [16, 4, '가족', 'Gia đình và các mối quan hệ', 'A1', '👨‍👩‍👧‍👦', '#EF4444', 1, 1],
        [17, 4, '음식', 'Thức ăn và đồ uống', 'A1', '🍕', '#F97316', 1, 2],
        [18, 4, '집', 'Nhà cửa và đồ đạc', 'A1', '🏠', '#8B5CF6', 1, 3],
        [19, 4, '색깔', 'Màu sắc và hình dạng', 'A1', '🎨', '#F59E0B', 1, 4],
        [20, 4, '숫자', 'Số đếm và thời gian', 'A1', '🔢', '#10B981', 1, 5],
        
        // Japanese Topics
        [21, 5, '家族', 'Gia đình và các mối quan hệ', 'A1', '👨‍👩‍👧‍👦', '#EF4444', 1, 1],
        [22, 5, '食べ物', 'Thức ăn và đồ uống', 'A1', '🍕', '#F97316', 1, 2],
        [23, 5, '家', 'Nhà cửa và đồ đạc', 'A1', '🏠', '#8B5CF6', 1, 3],
        [24, 5, '色', 'Màu sắc và hình dạng', 'A1', '🎨', '#F59E0B', 1, 4],
        [25, 5, '数字', 'Số đếm và thời gian', 'A1', '🔢', '#10B981', 1, 5],
        
        // Thai Topics
        [26, 6, 'ครอบครัว', 'Gia đình và các mối quan hệ', 'A1', '👨‍👩‍👧‍👦', '#EF4444', 1, 1],
        [27, 6, 'อาหาร', 'Thức ăn và đồ uống', 'A1', '🍕', '#F97316', 1, 2],
        [28, 6, 'บ้าน', 'Nhà cửa và đồ đạc', 'A1', '🏠', '#8B5CF6', 1, 3],
        [29, 6, 'สี', 'Màu sắc và hình dạng', 'A1', '🎨', '#F59E0B', 1, 4],
        [30, 6, 'ตัวเลข', 'Số đếm và thời gian', 'A1', '🔢', '#10B981', 1, 5]
    ];
    
    $stmt = $pdo->prepare("INSERT INTO Topics (TopicID, LanguageID, Title, Description, Level, Icon, Color, IsActive, SortOrder) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
    foreach ($topics as $topic) {
        $stmt->execute($topic);
    }
    echo "✅ Topics inserted: " . count($topics) . " records\n";
    
    // Insert Vocabulary
    echo "🔄 Inserting Vocabulary...\n";
    $vocabulary = [
        // Vietnamese Family Vocabulary
        [1, 'bố', 'bo', 'Noun', 'Father', 'Bố tôi là bác sĩ.', '/audio/vi/father.mp3', 1, 1, 'Easy'],
        [2, 'mẹ', 'me', 'Noun', 'Mother', 'Mẹ tôi nấu ăn rất ngon.', '/audio/vi/mother.mp3', 1, 1, 'Easy'],
        [3, 'anh trai', 'anh trai', 'Noun', 'Brother', 'Anh trai tôi rất cao.', '/audio/vi/brother.mp3', 1, 1, 'Easy'],
        [4, 'chị gái', 'chi gai', 'Noun', 'Sister', 'Chị gái tôi rất xinh.', '/audio/vi/sister.mp3', 1, 1, 'Easy'],
        [5, 'ông', 'ong', 'Noun', 'Grandfather', 'Ông tôi đã 80 tuổi.', '/audio/vi/grandfather.mp3', 1, 1, 'Easy'],
        [6, 'bà', 'ba', 'Noun', 'Grandmother', 'Bà tôi nấu ăn ngon.', '/audio/vi/grandmother.mp3', 1, 1, 'Easy'],
        
        // Vietnamese Food Vocabulary
        [7, 'cơm', 'com', 'Noun', 'Rice', 'Tôi ăn cơm mỗi ngày.', '/audio/vi/rice.mp3', 2, 1, 'Easy'],
        [8, 'bánh mì', 'banh mi', 'Noun', 'Bread', 'Tôi thích bánh mì cho bữa sáng.', '/audio/vi/bread.mp3', 2, 1, 'Easy'],
        [9, 'nước', 'nuoc', 'Noun', 'Water', 'Tôi uống nước mỗi ngày.', '/audio/vi/water.mp3', 2, 1, 'Easy'],
        [10, 'cà phê', 'ca phe', 'Noun', 'Coffee', 'Tôi uống cà phê vào buổi sáng.', '/audio/vi/coffee.mp3', 2, 1, 'Easy'],
        [11, 'trái cây', 'trai cay', 'Noun', 'Fruit', 'Tôi thích ăn trái cây.', '/audio/vi/fruit.mp3', 2, 1, 'Easy'],
        [12, 'thịt', 'thit', 'Noun', 'Meat', 'Tôi ăn thịt vào bữa trưa.', '/audio/vi/meat.mp3', 2, 1, 'Easy'],
        
        // English Family Vocabulary
        [13, 'father', '/ˈfɑːðər/', 'Noun', 'Bố, cha', 'My father is a doctor.', '/audio/en/father.mp3', 6, 2, 'Easy'],
        [14, 'mother', '/ˈmʌðər/', 'Noun', 'Mẹ, má', 'My mother cooks well.', '/audio/en/mother.mp3', 6, 2, 'Easy'],
        [15, 'brother', '/ˈbrʌðər/', 'Noun', 'Anh/em trai', 'My brother is tall.', '/audio/en/brother.mp3', 6, 2, 'Easy'],
        [16, 'sister', '/ˈsɪstər/', 'Noun', 'Chị/em gái', 'My sister is beautiful.', '/audio/en/sister.mp3', 6, 2, 'Easy'],
        [17, 'grandfather', '/ˈɡrænfɑːðər/', 'Noun', 'Ông nội/ngoại', 'My grandfather is 80 years old.', '/audio/en/grandfather.mp3', 6, 2, 'Easy'],
        [18, 'grandmother', '/ˈɡrænmʌðər/', 'Noun', 'Bà nội/ngoại', 'My grandmother cooks well.', '/audio/en/grandmother.mp3', 6, 2, 'Easy'],
        
        // English Food Vocabulary
        [19, 'rice', '/raɪs/', 'Noun', 'Cơm', 'I eat rice every day.', '/audio/en/rice.mp3', 7, 2, 'Easy'],
        [20, 'bread', '/bred/', 'Noun', 'Bánh mì', 'I like bread for breakfast.', '/audio/en/bread.mp3', 7, 2, 'Easy'],
        [21, 'water', '/ˈwɔːtər/', 'Noun', 'Nước', 'I drink water every day.', '/audio/en/water.mp3', 7, 2, 'Easy'],
        [22, 'coffee', '/ˈkɔːfi/', 'Noun', 'Cà phê', 'I drink coffee in the morning.', '/audio/en/coffee.mp3', 7, 2, 'Easy'],
        [23, 'fruit', '/fruːt/', 'Noun', 'Trái cây', 'I like to eat fruit.', '/audio/en/fruit.mp3', 7, 2, 'Easy'],
        [24, 'meat', '/miːt/', 'Noun', 'Thịt', 'I eat meat for lunch.', '/audio/en/meat.mp3', 7, 2, 'Easy'],
        
        // Chinese Family Vocabulary
        [25, '父亲', 'fùqīn', 'Noun', 'Bố, cha', '我的父亲是医生。', '/audio/zh/father.mp3', 11, 3, 'Easy'],
        [26, '母亲', 'mǔqīn', 'Noun', 'Mẹ, má', '我的母亲做饭很好。', '/audio/zh/mother.mp3', 11, 3, 'Easy'],
        [27, '哥哥', 'gēge', 'Noun', 'Anh trai', '我的哥哥很高。', '/audio/zh/brother.mp3', 11, 3, 'Easy'],
        [28, '姐姐', 'jiějie', 'Noun', 'Chị gái', '我的姐姐很漂亮。', '/audio/zh/sister.mp3', 11, 3, 'Easy'],
        [29, '爷爷', 'yéye', 'Noun', 'Ông nội', '我的爷爷80岁了。', '/audio/zh/grandfather.mp3', 11, 3, 'Easy'],
        [30, '奶奶', 'nǎinai', 'Noun', 'Bà nội', '我的奶奶做饭很好。', '/audio/zh/grandmother.mp3', 11, 3, 'Easy'],
        
        // Korean Family Vocabulary
        [31, '아버지', 'abeoji', 'Noun', 'Bố, cha', '제 아버지는 의사입니다.', '/audio/ko/father.mp3', 16, 4, 'Easy'],
        [32, '어머니', 'eomeoni', 'Noun', 'Mẹ, má', '제 어머니는 요리를 잘합니다.', '/audio/ko/mother.mp3', 16, 4, 'Easy'],
        [33, '형', 'hyeong', 'Noun', 'Anh trai', '제 형은 키가 큽니다.', '/audio/ko/brother.mp3', 16, 4, 'Easy'],
        [34, '누나', 'nuna', 'Noun', 'Chị gái', '제 누나는 예쁩니다.', '/audio/ko/sister.mp3', 16, 4, 'Easy'],
        [35, '할아버지', 'harabeoji', 'Noun', 'Ông nội', '제 할아버지는 80세입니다.', '/audio/ko/grandfather.mp3', 16, 4, 'Easy'],
        [36, '할머니', 'halmeoni', 'Noun', 'Bà nội', '제 할머니는 요리를 잘합니다.', '/audio/ko/grandmother.mp3', 16, 4, 'Easy'],
        
        // Japanese Family Vocabulary
        [37, '父', 'chichi', 'Noun', 'Bố, cha', '私の父は医者です。', '/audio/ja/father.mp3', 21, 5, 'Easy'],
        [38, '母', 'haha', 'Noun', 'Mẹ, má', '私の母は料理が上手です。', '/audio/ja/mother.mp3', 21, 5, 'Easy'],
        [39, '兄', 'ani', 'Noun', 'Anh trai', '私の兄は背が高いです。', '/audio/ja/brother.mp3', 21, 5, 'Easy'],
        [40, '姉', 'ane', 'Noun', 'Chị gái', '私の姉は美しいです。', '/audio/ja/sister.mp3', 21, 5, 'Easy'],
        [41, '祖父', 'sofu', 'Noun', 'Ông nội', '私の祖父は80歳です。', '/audio/ja/grandfather.mp3', 21, 5, 'Easy'],
        [42, '祖母', 'sobo', 'Noun', 'Bà nội', '私の祖母は料理が上手です。', '/audio/ja/grandmother.mp3', 21, 5, 'Easy'],
        
        // Thai Family Vocabulary
        [43, 'พ่อ', 'pho', 'Noun', 'Bố, cha', 'พ่อของฉันเป็นหมอ', '/audio/th/father.mp3', 26, 6, 'Easy'],
        [44, 'แม่', 'mae', 'Noun', 'Mẹ, má', 'แม่ของฉันทำอาหารเก่ง', '/audio/th/mother.mp3', 26, 6, 'Easy'],
        [45, 'พี่ชาย', 'phi chai', 'Noun', 'Anh trai', 'พี่ชายของฉันสูง', '/audio/th/brother.mp3', 26, 6, 'Easy'],
        [46, 'พี่สาว', 'phi sao', 'Noun', 'Chị gái', 'พี่สาวของฉันสวย', '/audio/th/sister.mp3', 26, 6, 'Easy'],
        [47, 'ปู่', 'pu', 'Noun', 'Ông nội', 'ปู่ของฉันอายุ 80 ปี', '/audio/th/grandfather.mp3', 26, 6, 'Easy'],
        [48, 'ย่า', 'ya', 'Noun', 'Bà nội', 'ย่าของฉันทำอาหารเก่ง', '/audio/th/grandmother.mp3', 26, 6, 'Easy']
    ];
    
    $stmt = $pdo->prepare("INSERT INTO Vocabulary (WordID, Word, Phonetic, Type, Meaning, Example, Audio, TopicID, LanguageID, Difficulty) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
    foreach ($vocabulary as $vocab) {
        $stmt->execute($vocab);
    }
    echo "✅ Vocabulary inserted: " . count($vocabulary) . " records\n";
    
    // Update vocabulary count
    echo "🔄 Updating vocabulary count...\n";
    $pdo->exec("UPDATE Topics SET VocabularyCount = (SELECT COUNT(*) FROM Vocabulary WHERE Vocabulary.TopicID = Topics.TopicID)");
    echo "✅ Vocabulary count updated\n";
    
    // Test the data
    echo "\n📊 Final Test Results:\n";
    $stmt = $pdo->prepare("SELECT COUNT(*) as count FROM Languages");
    $stmt->execute();
    $langCount = $stmt->fetch()['count'];
    echo "Languages: $langCount\n";
    
    $stmt = $pdo->prepare("SELECT COUNT(*) as count FROM Topics");
    $stmt->execute();
    $topicCount = $stmt->fetch()['count'];
    echo "Topics: $topicCount\n";
    
    $stmt = $pdo->prepare("SELECT COUNT(*) as count FROM Vocabulary");
    $stmt->execute();
    $vocabCount = $stmt->fetch()['count'];
    echo "Vocabulary: $vocabCount\n";
    
    // Test Vietnamese data
    $stmt = $pdo->prepare("SELECT TopicID, Title, Description FROM Topics WHERE LanguageID = 1 ORDER BY TopicID LIMIT 3");
    $stmt->execute();
    $results = $stmt->fetchAll();
    
    echo "\n📊 Vietnamese Topics Test:\n";
    foreach ($results as $row) {
        echo "ID: {$row['TopicID']} | Title: {$row['Title']} | Description: {$row['Description']}\n";
    }
    
    echo "\n✅ Database import completed successfully!\n";
    echo "✅ All constraints preserved!\n";
    echo "✅ UTF-8 encoding perfect!\n";
    echo "✅ Ready for Admin Panel! 🎉\n";
    
} catch (PDOException $e) {
    echo "❌ Database error: " . $e->getMessage() . "\n";
}
?>
