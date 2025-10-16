<?php
// Script to import Chinese HSK1 data into database
mb_internal_encoding('UTF-8');
mb_http_output('UTF-8');

// Database connection
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
    
    echo "✅ Database connected successfully\n";
    
    // First, add Chinese language if not exists
    $stmt = $pdo->prepare("SELECT LanguageID FROM Languages WHERE LanguageCode = 'zh'");
    $stmt->execute();
    $chineseLang = $stmt->fetch();
    
    if (!$chineseLang) {
        $stmt = $pdo->prepare("INSERT INTO Languages (LanguageName, LanguageCode, IsActive, SortOrder) VALUES (?, ?, 1, 3)");
        $stmt->execute(['中文', 'zh']);
        $chineseLangId = $pdo->lastInsertId();
        echo "✅ Added Chinese language (ID: $chineseLangId)\n";
    } else {
        $chineseLangId = $chineseLang['LanguageID'];
        echo "✅ Chinese language already exists (ID: $chineseLangId)\n";
    }
    
    // Import topics
    $topicsData = [
        ['LanguageID' => $chineseLangId, 'Title' => 'HSK1 - Gia đình', 'Description' => 'Chủ đề gia đình và người thân', 'Level' => 'HSK1', 'Icon' => '👨‍👩‍👧‍👦', 'Color' => '#EF4444', 'SortOrder' => 1],
        ['LanguageID' => $chineseLangId, 'Title' => 'HSK1 - Số đếm', 'Description' => 'Số đếm và thời gian', 'Level' => 'HSK1', 'Icon' => '🔢', 'Color' => '#F59E0B', 'SortOrder' => 2],
        ['LanguageID' => $chineseLangId, 'Title' => 'HSK1 - Màu sắc', 'Description' => 'Màu sắc và hình dạng', 'Level' => 'HSK1', 'Icon' => '🎨', 'Color' => '#8B5CF6', 'SortOrder' => 3],
        ['LanguageID' => $chineseLangId, 'Title' => 'HSK1 - Thức ăn', 'Description' => 'Đồ ăn và thức uống', 'Level' => 'HSK1', 'Icon' => '🍕', 'Color' => '#10B981', 'SortOrder' => 4],
        ['LanguageID' => $chineseLangId, 'Title' => 'HSK1 - Nhà cửa', 'Description' => 'Nhà và đồ nội thất', 'Level' => 'HSK1', 'Icon' => '🏠', 'Color' => '#3B82F6', 'SortOrder' => 5],
        ['LanguageID' => $chineseLangId, 'Title' => 'HSK1 - Trường học', 'Description' => 'Trường học và học tập', 'Level' => 'HSK1', 'Icon' => '📚', 'Color' => '#6366F1', 'SortOrder' => 6],
        ['LanguageID' => $chineseLangId, 'Title' => 'HSK1 - Công việc', 'Description' => 'Công việc và nghề nghiệp', 'Level' => 'HSK1', 'Icon' => '💼', 'Color' => '#EC4899', 'SortOrder' => 7],
        ['LanguageID' => $chineseLangId, 'Title' => 'HSK1 - Giao thông', 'Description' => 'Phương tiện giao thông', 'Level' => 'HSK1', 'Icon' => '🚗', 'Color' => '#14B8A6', 'SortOrder' => 8],
        ['LanguageID' => $chineseLangId, 'Title' => 'HSK1 - Thời tiết', 'Description' => 'Thời tiết và khí hậu', 'Level' => 'HSK1', 'Icon' => '☀️', 'Color' => '#F97316', 'SortOrder' => 9],
        ['LanguageID' => $chineseLangId, 'Title' => 'HSK1 - Cơ thể', 'Description' => 'Cơ thể và sức khỏe', 'Level' => 'HSK1', 'Icon' => '👤', 'Color' => '#8B5CF6', 'SortOrder' => 10]
    ];
    
    $topicIds = [];
    foreach ($topicsData as $topic) {
        $stmt = $pdo->prepare("INSERT INTO Topics (LanguageID, Title, Description, Level, Icon, Color, IsActive, SortOrder) VALUES (?, ?, ?, ?, ?, ?, 1, ?)");
        $stmt->execute([
            $topic['LanguageID'],
            $topic['Title'],
            $topic['Description'],
            $topic['Level'],
            $topic['Icon'],
            $topic['Color'],
            $topic['SortOrder']
        ]);
        $topicIds[] = $pdo->lastInsertId();
        echo "✅ Added topic: " . $topic['Title'] . " (ID: " . $pdo->lastInsertId() . ")\n";
    }
    
    // Import vocabulary
    $vocabularyData = [
        // Numbers
        ['Word' => '一', 'Phonetic' => 'yī', 'Type' => 'number', 'Meaning' => 'one', 'Example' => '一个苹果', 'Audio' => 'one.mp3', 'TopicID' => $topicIds[1], 'LanguageID' => $chineseLangId, 'Difficulty' => 'Easy'],
        ['Word' => '二', 'Phonetic' => 'èr', 'Type' => 'number', 'Meaning' => 'two', 'Example' => '两个苹果', 'Audio' => 'two.mp3', 'TopicID' => $topicIds[1], 'LanguageID' => $chineseLangId, 'Difficulty' => 'Easy'],
        ['Word' => '三', 'Phonetic' => 'sān', 'Type' => 'number', 'Meaning' => 'three', 'Example' => '三个苹果', 'Audio' => 'three.mp3', 'TopicID' => $topicIds[1], 'LanguageID' => $chineseLangId, 'Difficulty' => 'Easy'],
        ['Word' => '四', 'Phonetic' => 'sì', 'Type' => 'number', 'Meaning' => 'four', 'Example' => '四个苹果', 'Audio' => 'four.mp3', 'TopicID' => $topicIds[1], 'LanguageID' => $chineseLangId, 'Difficulty' => 'Easy'],
        ['Word' => '五', 'Phonetic' => 'wǔ', 'Type' => 'number', 'Meaning' => 'five', 'Example' => '五个苹果', 'Audio' => 'five.mp3', 'TopicID' => $topicIds[1], 'LanguageID' => $chineseLangId, 'Difficulty' => 'Easy'],
        ['Word' => '六', 'Phonetic' => 'liù', 'Type' => 'number', 'Meaning' => 'six', 'Example' => '六个苹果', 'Audio' => 'six.mp3', 'TopicID' => $topicIds[1], 'LanguageID' => $chineseLangId, 'Difficulty' => 'Easy'],
        ['Word' => '七', 'Phonetic' => 'qī', 'Type' => 'number', 'Meaning' => 'seven', 'Example' => '七个苹果', 'Audio' => 'seven.mp3', 'TopicID' => $topicIds[1], 'LanguageID' => $chineseLangId, 'Difficulty' => 'Easy'],
        ['Word' => '八', 'Phonetic' => 'bā', 'Type' => 'number', 'Meaning' => 'eight', 'Example' => '八个苹果', 'Audio' => 'eight.mp3', 'TopicID' => $topicIds[1], 'LanguageID' => $chineseLangId, 'Difficulty' => 'Easy'],
        ['Word' => '九', 'Phonetic' => 'jiǔ', 'Type' => 'number', 'Meaning' => 'nine', 'Example' => '九个苹果', 'Audio' => 'nine.mp3', 'TopicID' => $topicIds[1], 'LanguageID' => $chineseLangId, 'Difficulty' => 'Easy'],
        ['Word' => '十', 'Phonetic' => 'shí', 'Type' => 'number', 'Meaning' => 'ten', 'Example' => '十个苹果', 'Audio' => 'ten.mp3', 'TopicID' => $topicIds[1], 'LanguageID' => $chineseLangId, 'Difficulty' => 'Easy'],
        
        // Family
        ['Word' => '爸爸', 'Phonetic' => 'bàba', 'Type' => 'noun', 'Meaning' => 'father', 'Example' => '我爸爸是医生', 'Audio' => 'father.mp3', 'TopicID' => $topicIds[0], 'LanguageID' => $chineseLangId, 'Difficulty' => 'Easy'],
        ['Word' => '妈妈', 'Phonetic' => 'māma', 'Type' => 'noun', 'Meaning' => 'mother', 'Example' => '我妈妈做饭很好吃', 'Audio' => 'mother.mp3', 'TopicID' => $topicIds[0], 'LanguageID' => $chineseLangId, 'Difficulty' => 'Easy'],
        ['Word' => '哥哥', 'Phonetic' => 'gēge', 'Type' => 'noun', 'Meaning' => 'older brother', 'Example' => '我哥哥在上大学', 'Audio' => 'brother.mp3', 'TopicID' => $topicIds[0], 'LanguageID' => $chineseLangId, 'Difficulty' => 'Easy'],
        ['Word' => '姐姐', 'Phonetic' => 'jiějie', 'Type' => 'noun', 'Meaning' => 'older sister', 'Example' => '我姐姐很漂亮', 'Audio' => 'sister.mp3', 'TopicID' => $topicIds[0], 'LanguageID' => $chineseLangId, 'Difficulty' => 'Easy'],
        ['Word' => '弟弟', 'Phonetic' => 'dìdi', 'Type' => 'noun', 'Meaning' => 'younger brother', 'Example' => '我弟弟很可爱', 'Audio' => 'younger_brother.mp3', 'TopicID' => $topicIds[0], 'LanguageID' => $chineseLangId, 'Difficulty' => 'Easy'],
        ['Word' => '妹妹', 'Phonetic' => 'mèimei', 'Type' => 'noun', 'Meaning' => 'younger sister', 'Example' => '我妹妹很聪明', 'Audio' => 'younger_sister.mp3', 'TopicID' => $topicIds[0], 'LanguageID' => $chineseLangId, 'Difficulty' => 'Easy'],
        
        // Basic pronouns
        ['Word' => '我', 'Phonetic' => 'wǒ', 'Type' => 'pronoun', 'Meaning' => 'I', 'Example' => '我是学生', 'Audio' => 'I.mp3', 'TopicID' => $topicIds[0], 'LanguageID' => $chineseLangId, 'Difficulty' => 'Easy'],
        ['Word' => '你', 'Phonetic' => 'nǐ', 'Type' => 'pronoun', 'Meaning' => 'you', 'Example' => '你好吗', 'Audio' => 'you.mp3', 'TopicID' => $topicIds[0], 'LanguageID' => $chineseLangId, 'Difficulty' => 'Easy'],
        ['Word' => '他', 'Phonetic' => 'tā', 'Type' => 'pronoun', 'Meaning' => 'he', 'Example' => '他是我的朋友', 'Audio' => 'he.mp3', 'TopicID' => $topicIds[0], 'LanguageID' => $chineseLangId, 'Difficulty' => 'Easy'],
        ['Word' => '她', 'Phonetic' => 'tā', 'Type' => 'pronoun', 'Meaning' => 'she', 'Example' => '她是我的老师', 'Audio' => 'she.mp3', 'TopicID' => $topicIds[0], 'LanguageID' => $chineseLangId, 'Difficulty' => 'Easy'],
        ['Word' => '我们', 'Phonetic' => 'wǒmen', 'Type' => 'pronoun', 'Meaning' => 'we', 'Example' => '我们是同学', 'Audio' => 'we.mp3', 'TopicID' => $topicIds[0], 'LanguageID' => $chineseLangId, 'Difficulty' => 'Easy'],
        ['Word' => '你们', 'Phonetic' => 'nǐmen', 'Type' => 'pronoun', 'Meaning' => 'you (plural)', 'Example' => '你们好吗', 'Audio' => 'you_plural.mp3', 'TopicID' => $topicIds[0], 'LanguageID' => $chineseLangId, 'Difficulty' => 'Easy'],
        ['Word' => '他们', 'Phonetic' => 'tāmen', 'Type' => 'pronoun', 'Meaning' => 'they', 'Example' => '他们是我的朋友', 'Audio' => 'they.mp3', 'TopicID' => $topicIds[0], 'LanguageID' => $chineseLangId, 'Difficulty' => 'Easy'],
        
        // Basic verbs
        ['Word' => '是', 'Phonetic' => 'shì', 'Type' => 'verb', 'Meaning' => 'to be', 'Example' => '我是学生', 'Audio' => 'to_be.mp3', 'TopicID' => $topicIds[0], 'LanguageID' => $chineseLangId, 'Difficulty' => 'Easy'],
        ['Word' => '有', 'Phonetic' => 'yǒu', 'Type' => 'verb', 'Meaning' => 'to have', 'Example' => '我有一个苹果', 'Audio' => 'to_have.mp3', 'TopicID' => $topicIds[0], 'LanguageID' => $chineseLangId, 'Difficulty' => 'Easy'],
        ['Word' => '在', 'Phonetic' => 'zài', 'Type' => 'verb', 'Meaning' => 'to be at', 'Example' => '我在学校', 'Audio' => 'to_be_at.mp3', 'TopicID' => $topicIds[0], 'LanguageID' => $chineseLangId, 'Difficulty' => 'Easy'],
        ['Word' => '去', 'Phonetic' => 'qù', 'Type' => 'verb', 'Meaning' => 'to go', 'Example' => '我去学校', 'Audio' => 'to_go.mp3', 'TopicID' => $topicIds[0], 'LanguageID' => $chineseLangId, 'Difficulty' => 'Easy'],
        ['Word' => '来', 'Phonetic' => 'lái', 'Type' => 'verb', 'Meaning' => 'to come', 'Example' => '来我家', 'Audio' => 'to_come.mp3', 'TopicID' => $topicIds[0], 'LanguageID' => $chineseLangId, 'Difficulty' => 'Easy'],
        ['Word' => '看', 'Phonetic' => 'kàn', 'Type' => 'verb', 'Meaning' => 'to see', 'Example' => '看这本书', 'Audio' => 'to_see.mp3', 'TopicID' => $topicIds[0], 'LanguageID' => $chineseLangId, 'Difficulty' => 'Easy'],
        ['Word' => '听', 'Phonetic' => 'tīng', 'Type' => 'verb', 'Meaning' => 'to listen', 'Example' => '听音乐', 'Audio' => 'to_listen.mp3', 'TopicID' => $topicIds[0], 'LanguageID' => $chineseLangId, 'Difficulty' => 'Easy'],
        ['Word' => '说', 'Phonetic' => 'shuō', 'Type' => 'verb', 'Meaning' => 'to speak', 'Example' => '说中文', 'Audio' => 'to_speak.mp3', 'TopicID' => $topicIds[0], 'LanguageID' => $chineseLangId, 'Difficulty' => 'Easy'],
        ['Word' => '吃', 'Phonetic' => 'chī', 'Type' => 'verb', 'Meaning' => 'to eat', 'Example' => '吃饭', 'Audio' => 'to_eat.mp3', 'TopicID' => $topicIds[0], 'LanguageID' => $chineseLangId, 'Difficulty' => 'Easy'],
        ['Word' => '喝', 'Phonetic' => 'hē', 'Type' => 'verb', 'Meaning' => 'to drink', 'Example' => '喝水', 'Audio' => 'to_drink.mp3', 'TopicID' => $topicIds[0], 'LanguageID' => $chineseLangId, 'Difficulty' => 'Easy'],
        
        // Basic adjectives
        ['Word' => '好', 'Phonetic' => 'hǎo', 'Type' => 'adjective', 'Meaning' => 'good', 'Example' => '很好', 'Audio' => 'good.mp3', 'TopicID' => $topicIds[0], 'LanguageID' => $chineseLangId, 'Difficulty' => 'Easy'],
        ['Word' => '大', 'Phonetic' => 'dà', 'Type' => 'adjective', 'Meaning' => 'big', 'Example' => '很大', 'Audio' => 'big.mp3', 'TopicID' => $topicIds[0], 'LanguageID' => $chineseLangId, 'Difficulty' => 'Easy'],
        ['Word' => '小', 'Phonetic' => 'xiǎo', 'Type' => 'adjective', 'Meaning' => 'small', 'Example' => '很小', 'Audio' => 'small.mp3', 'TopicID' => $topicIds[0], 'LanguageID' => $chineseLangId, 'Difficulty' => 'Easy'],
        ['Word' => '新', 'Phonetic' => 'xīn', 'Type' => 'adjective', 'Meaning' => 'new', 'Example' => '新书', 'Audio' => 'new.mp3', 'TopicID' => $topicIds[0], 'LanguageID' => $chineseLangId, 'Difficulty' => 'Easy'],
        ['Word' => '旧', 'Phonetic' => 'jiù', 'Type' => 'adjective', 'Meaning' => 'old', 'Example' => '旧书', 'Audio' => 'old.mp3', 'TopicID' => $topicIds[0], 'LanguageID' => $chineseLangId, 'Difficulty' => 'Easy'],
        
        // Colors
        ['Word' => '红', 'Phonetic' => 'hóng', 'Type' => 'adjective', 'Meaning' => 'red', 'Example' => '红色的苹果', 'Audio' => 'red.mp3', 'TopicID' => $topicIds[2], 'LanguageID' => $chineseLangId, 'Difficulty' => 'Easy'],
        ['Word' => '蓝', 'Phonetic' => 'lán', 'Type' => 'adjective', 'Meaning' => 'blue', 'Example' => '蓝色的天空', 'Audio' => 'blue.mp3', 'TopicID' => $topicIds[2], 'LanguageID' => $chineseLangId, 'Difficulty' => 'Easy'],
        ['Word' => '绿', 'Phonetic' => 'lǜ', 'Type' => 'adjective', 'Meaning' => 'green', 'Example' => '绿色的草', 'Audio' => 'green.mp3', 'TopicID' => $topicIds[2], 'LanguageID' => $chineseLangId, 'Difficulty' => 'Easy'],
        ['Word' => '黄', 'Phonetic' => 'huáng', 'Type' => 'adjective', 'Meaning' => 'yellow', 'Example' => '黄色的花', 'Audio' => 'yellow.mp3', 'TopicID' => $topicIds[2], 'LanguageID' => $chineseLangId, 'Difficulty' => 'Easy'],
        ['Word' => '黑', 'Phonetic' => 'hēi', 'Type' => 'adjective', 'Meaning' => 'black', 'Example' => '黑色的头发', 'Audio' => 'black.mp3', 'TopicID' => $topicIds[2], 'LanguageID' => $chineseLangId, 'Difficulty' => 'Easy'],
        ['Word' => '白', 'Phonetic' => 'bái', 'Type' => 'adjective', 'Meaning' => 'white', 'Example' => '白色的云', 'Audio' => 'white.mp3', 'TopicID' => $topicIds[2], 'LanguageID' => $chineseLangId, 'Difficulty' => 'Easy'],
        
        // Time
        ['Word' => '今天', 'Phonetic' => 'jīntiān', 'Type' => 'time', 'Meaning' => 'today', 'Example' => '今天天气很好', 'Audio' => 'today.mp3', 'TopicID' => $topicIds[1], 'LanguageID' => $chineseLangId, 'Difficulty' => 'Easy'],
        ['Word' => '明天', 'Phonetic' => 'míngtiān', 'Type' => 'time', 'Meaning' => 'tomorrow', 'Example' => '明天见', 'Audio' => 'tomorrow.mp3', 'TopicID' => $topicIds[1], 'LanguageID' => $chineseLangId, 'Difficulty' => 'Easy'],
        ['Word' => '昨天', 'Phonetic' => 'zuótiān', 'Type' => 'time', 'Meaning' => 'yesterday', 'Example' => '昨天我去了学校', 'Audio' => 'yesterday.mp3', 'TopicID' => $topicIds[1], 'LanguageID' => $chineseLangId, 'Difficulty' => 'Easy'],
        ['Word' => '现在', 'Phonetic' => 'xiànzài', 'Type' => 'time', 'Meaning' => 'now', 'Example' => '现在几点了', 'Audio' => 'now.mp3', 'TopicID' => $topicIds[1], 'LanguageID' => $chineseLangId, 'Difficulty' => 'Easy'],
        ['Word' => '早上', 'Phonetic' => 'zǎoshang', 'Type' => 'time', 'Meaning' => 'morning', 'Example' => '早上好', 'Audio' => 'morning.mp3', 'TopicID' => $topicIds[1], 'LanguageID' => $chineseLangId, 'Difficulty' => 'Easy'],
        ['Word' => '中午', 'Phonetic' => 'zhōngwǔ', 'Type' => 'time', 'Meaning' => 'noon', 'Example' => '中午吃饭', 'Audio' => 'noon.mp3', 'TopicID' => $topicIds[1], 'LanguageID' => $chineseLangId, 'Difficulty' => 'Easy'],
        ['Word' => '晚上', 'Phonetic' => 'wǎnshang', 'Type' => 'time', 'Meaning' => 'evening', 'Example' => '晚上好', 'Audio' => 'evening.mp3', 'TopicID' => $topicIds[1], 'LanguageID' => $chineseLangId, 'Difficulty' => 'Easy'],
        
        // School
        ['Word' => '学校', 'Phonetic' => 'xuéxiào', 'Type' => 'noun', 'Meaning' => 'school', 'Example' => '我在学校学习', 'Audio' => 'school.mp3', 'TopicID' => $topicIds[5], 'LanguageID' => $chineseLangId, 'Difficulty' => 'Easy'],
        ['Word' => '老师', 'Phonetic' => 'lǎoshī', 'Type' => 'noun', 'Meaning' => 'teacher', 'Example' => '我的老师很好', 'Audio' => 'teacher.mp3', 'TopicID' => $topicIds[5], 'LanguageID' => $chineseLangId, 'Difficulty' => 'Easy'],
        ['Word' => '学生', 'Phonetic' => 'xuéshēng', 'Type' => 'noun', 'Meaning' => 'student', 'Example' => '我是学生', 'Audio' => 'student.mp3', 'TopicID' => $topicIds[5], 'LanguageID' => $chineseLangId, 'Difficulty' => 'Easy'],
        ['Word' => '朋友', 'Phonetic' => 'péngyǒu', 'Type' => 'noun', 'Meaning' => 'friend', 'Example' => '他是我的朋友', 'Audio' => 'friend.mp3', 'TopicID' => $topicIds[5], 'LanguageID' => $chineseLangId, 'Difficulty' => 'Easy'],
        ['Word' => '同学', 'Phonetic' => 'tóngxué', 'Type' => 'noun', 'Meaning' => 'classmate', 'Example' => '我的同学', 'Audio' => 'classmate.mp3', 'TopicID' => $topicIds[5], 'LanguageID' => $chineseLangId, 'Difficulty' => 'Easy'],
        ['Word' => '书', 'Phonetic' => 'shū', 'Type' => 'noun', 'Meaning' => 'book', 'Example' => '这本书很好', 'Audio' => 'book.mp3', 'TopicID' => $topicIds[5], 'LanguageID' => $chineseLangId, 'Difficulty' => 'Easy'],
        ['Word' => '笔', 'Phonetic' => 'bǐ', 'Type' => 'noun', 'Meaning' => 'pen', 'Example' => '用笔写字', 'Audio' => 'pen.mp3', 'TopicID' => $topicIds[5], 'LanguageID' => $chineseLangId, 'Difficulty' => 'Easy'],
        ['Word' => '纸', 'Phonetic' => 'zhǐ', 'Type' => 'noun', 'Meaning' => 'paper', 'Example' => '一张纸', 'Audio' => 'paper.mp3', 'TopicID' => $topicIds[5], 'LanguageID' => $chineseLangId, 'Difficulty' => 'Easy'],
        
        // Home
        ['Word' => '家', 'Phonetic' => 'jiā', 'Type' => 'noun', 'Meaning' => 'home', 'Example' => '我的家很温馨', 'Audio' => 'home.mp3', 'TopicID' => $topicIds[4], 'LanguageID' => $chineseLangId, 'Difficulty' => 'Easy'],
        ['Word' => '桌子', 'Phonetic' => 'zhuōzi', 'Type' => 'noun', 'Meaning' => 'table', 'Example' => '桌子很大', 'Audio' => 'table.mp3', 'TopicID' => $topicIds[4], 'LanguageID' => $chineseLangId, 'Difficulty' => 'Easy'],
        ['Word' => '椅子', 'Phonetic' => 'yǐzi', 'Type' => 'noun', 'Meaning' => 'chair', 'Example' => '坐在椅子上', 'Audio' => 'chair.mp3', 'TopicID' => $topicIds[4], 'LanguageID' => $chineseLangId, 'Difficulty' => 'Easy'],
        ['Word' => '门', 'Phonetic' => 'mén', 'Type' => 'noun', 'Meaning' => 'door', 'Example' => '开门', 'Audio' => 'door.mp3', 'TopicID' => $topicIds[4], 'LanguageID' => $chineseLangId, 'Difficulty' => 'Easy'],
        ['Word' => '窗', 'Phonetic' => 'chuāng', 'Type' => 'noun', 'Meaning' => 'window', 'Example' => '开窗', 'Audio' => 'window.mp3', 'TopicID' => $topicIds[4], 'LanguageID' => $chineseLangId, 'Difficulty' => 'Easy'],
        ['Word' => '房间', 'Phonetic' => 'fángjiān', 'Type' => 'noun', 'Meaning' => 'room', 'Example' => '我的房间', 'Audio' => 'room.mp3', 'TopicID' => $topicIds[4], 'LanguageID' => $chineseLangId, 'Difficulty' => 'Easy'],
        ['Word' => '床', 'Phonetic' => 'chuáng', 'Type' => 'noun', 'Meaning' => 'bed', 'Example' => '睡觉的床', 'Audio' => 'bed.mp3', 'TopicID' => $topicIds[4], 'LanguageID' => $chineseLangId, 'Difficulty' => 'Easy'],
        
        // Food
        ['Word' => '饭', 'Phonetic' => 'fàn', 'Type' => 'noun', 'Meaning' => 'rice/meal', 'Example' => '吃饭', 'Audio' => 'rice.mp3', 'TopicID' => $topicIds[3], 'LanguageID' => $chineseLangId, 'Difficulty' => 'Easy'],
        ['Word' => '水', 'Phonetic' => 'shuǐ', 'Type' => 'noun', 'Meaning' => 'water', 'Example' => '喝水', 'Audio' => 'water.mp3', 'TopicID' => $topicIds[3], 'LanguageID' => $chineseLangId, 'Difficulty' => 'Easy'],
        ['Word' => '茶', 'Phonetic' => 'chá', 'Type' => 'noun', 'Meaning' => 'tea', 'Example' => '喝茶', 'Audio' => 'tea.mp3', 'TopicID' => $topicIds[3], 'LanguageID' => $chineseLangId, 'Difficulty' => 'Easy'],
        ['Word' => '咖啡', 'Phonetic' => 'kāfēi', 'Type' => 'noun', 'Meaning' => 'coffee', 'Example' => '喝咖啡', 'Audio' => 'coffee.mp3', 'TopicID' => $topicIds[3], 'LanguageID' => $chineseLangId, 'Difficulty' => 'Easy'],
        ['Word' => '苹果', 'Phonetic' => 'píngguǒ', 'Type' => 'noun', 'Meaning' => 'apple', 'Example' => '一个苹果', 'Audio' => 'apple.mp3', 'TopicID' => $topicIds[3], 'LanguageID' => $chineseLangId, 'Difficulty' => 'Easy'],
        ['Word' => '香蕉', 'Phonetic' => 'xiāngjiāo', 'Type' => 'noun', 'Meaning' => 'banana', 'Example' => '一个香蕉', 'Audio' => 'banana.mp3', 'TopicID' => $topicIds[3], 'LanguageID' => $chineseLangId, 'Difficulty' => 'Easy'],
        ['Word' => '面包', 'Phonetic' => 'miànbāo', 'Type' => 'noun', 'Meaning' => 'bread', 'Example' => '吃面包', 'Audio' => 'bread.mp3', 'TopicID' => $topicIds[3], 'LanguageID' => $chineseLangId, 'Difficulty' => 'Easy'],
        ['Word' => '鸡蛋', 'Phonetic' => 'jīdàn', 'Type' => 'noun', 'Meaning' => 'egg', 'Example' => '一个鸡蛋', 'Audio' => 'egg.mp3', 'TopicID' => $topicIds[3], 'LanguageID' => $chineseLangId, 'Difficulty' => 'Easy'],
        
        // Work
        ['Word' => '工作', 'Phonetic' => 'gōngzuò', 'Type' => 'noun', 'Meaning' => 'work', 'Example' => '工作很忙', 'Audio' => 'work.mp3', 'TopicID' => $topicIds[6], 'LanguageID' => $chineseLangId, 'Difficulty' => 'Easy'],
        ['Word' => '医生', 'Phonetic' => 'yīshēng', 'Type' => 'noun', 'Meaning' => 'doctor', 'Example' => '我爸爸是医生', 'Audio' => 'doctor.mp3', 'TopicID' => $topicIds[6], 'LanguageID' => $chineseLangId, 'Difficulty' => 'Easy'],
        ['Word' => '老师', 'Phonetic' => 'lǎoshī', 'Type' => 'noun', 'Meaning' => 'teacher', 'Example' => '我的老师', 'Audio' => 'teacher.mp3', 'TopicID' => $topicIds[6], 'LanguageID' => $chineseLangId, 'Difficulty' => 'Easy'],
        ['Word' => '学生', 'Phonetic' => 'xuéshēng', 'Type' => 'noun', 'Meaning' => 'student', 'Example' => '我是学生', 'Audio' => 'student.mp3', 'TopicID' => $topicIds[6], 'LanguageID' => $chineseLangId, 'Difficulty' => 'Easy'],
        
        // Transportation
        ['Word' => '车', 'Phonetic' => 'chē', 'Type' => 'noun', 'Meaning' => 'car', 'Example' => '开车', 'Audio' => 'car.mp3', 'TopicID' => $topicIds[7], 'LanguageID' => $chineseLangId, 'Difficulty' => 'Easy'],
        ['Word' => '公共汽车', 'Phonetic' => 'gōnggòngqìchē', 'Type' => 'noun', 'Meaning' => 'bus', 'Example' => '坐公共汽车', 'Audio' => 'bus.mp3', 'TopicID' => $topicIds[7], 'LanguageID' => $chineseLangId, 'Difficulty' => 'Easy'],
        ['Word' => '地铁', 'Phonetic' => 'dìtiě', 'Type' => 'noun', 'Meaning' => 'subway', 'Example' => '坐地铁', 'Audio' => 'subway.mp3', 'TopicID' => $topicIds[7], 'LanguageID' => $chineseLangId, 'Difficulty' => 'Easy'],
        ['Word' => '飞机', 'Phonetic' => 'fēijī', 'Type' => 'noun', 'Meaning' => 'airplane', 'Example' => '坐飞机', 'Audio' => 'airplane.mp3', 'TopicID' => $topicIds[7], 'LanguageID' => $chineseLangId, 'Difficulty' => 'Easy'],
        ['Word' => '火车', 'Phonetic' => 'huǒchē', 'Type' => 'noun', 'Meaning' => 'train', 'Example' => '坐火车', 'Audio' => 'train.mp3', 'TopicID' => $topicIds[7], 'LanguageID' => $chineseLangId, 'Difficulty' => 'Easy'],
        
        // Weather
        ['Word' => '天气', 'Phonetic' => 'tiānqì', 'Type' => 'noun', 'Meaning' => 'weather', 'Example' => '今天天气很好', 'Audio' => 'weather.mp3', 'TopicID' => $topicIds[8], 'LanguageID' => $chineseLangId, 'Difficulty' => 'Easy'],
        ['Word' => '太阳', 'Phonetic' => 'tàiyáng', 'Type' => 'noun', 'Meaning' => 'sun', 'Example' => '太阳很大', 'Audio' => 'sun.mp3', 'TopicID' => $topicIds[8], 'LanguageID' => $chineseLangId, 'Difficulty' => 'Easy'],
        ['Word' => '雨', 'Phonetic' => 'yǔ', 'Type' => 'noun', 'Meaning' => 'rain', 'Example' => '下雨了', 'Audio' => 'rain.mp3', 'TopicID' => $topicIds[8], 'LanguageID' => $chineseLangId, 'Difficulty' => 'Easy'],
        ['Word' => '雪', 'Phonetic' => 'xuě', 'Type' => 'noun', 'Meaning' => 'snow', 'Example' => '下雪了', 'Audio' => 'snow.mp3', 'TopicID' => $topicIds[8], 'LanguageID' => $chineseLangId, 'Difficulty' => 'Easy'],
        ['Word' => '风', 'Phonetic' => 'fēng', 'Type' => 'noun', 'Meaning' => 'wind', 'Example' => '风很大', 'Audio' => 'wind.mp3', 'TopicID' => $topicIds[8], 'LanguageID' => $chineseLangId, 'Difficulty' => 'Easy'],
        
        // Body
        ['Word' => '人', 'Phonetic' => 'rén', 'Type' => 'noun', 'Meaning' => 'person', 'Example' => '这个人很友好', 'Audio' => 'person.mp3', 'TopicID' => $topicIds[9], 'LanguageID' => $chineseLangId, 'Difficulty' => 'Easy'],
        ['Word' => '头', 'Phonetic' => 'tóu', 'Type' => 'noun', 'Meaning' => 'head', 'Example' => '我的头', 'Audio' => 'head.mp3', 'TopicID' => $topicIds[9], 'LanguageID' => $chineseLangId, 'Difficulty' => 'Easy'],
        ['Word' => '眼睛', 'Phonetic' => 'yǎnjing', 'Type' => 'noun', 'Meaning' => 'eyes', 'Example' => '我的眼睛', 'Audio' => 'eyes.mp3', 'TopicID' => $topicIds[9], 'LanguageID' => $chineseLangId, 'Difficulty' => 'Easy'],
        ['Word' => '鼻子', 'Phonetic' => 'bízi', 'Type' => 'noun', 'Meaning' => 'nose', 'Example' => '我的鼻子', 'Audio' => 'nose.mp3', 'TopicID' => $topicIds[9], 'LanguageID' => $chineseLangId, 'Difficulty' => 'Easy'],
        ['Word' => '嘴', 'Phonetic' => 'zuǐ', 'Type' => 'noun', 'Meaning' => 'mouth', 'Example' => '我的嘴', 'Audio' => 'mouth.mp3', 'TopicID' => $topicIds[9], 'LanguageID' => $chineseLangId, 'Difficulty' => 'Easy'],
        ['Word' => '手', 'Phonetic' => 'shǒu', 'Type' => 'noun', 'Meaning' => 'hand', 'Example' => '我的手', 'Audio' => 'hand.mp3', 'TopicID' => $topicIds[9], 'LanguageID' => $chineseLangId, 'Difficulty' => 'Easy'],
        ['Word' => '脚', 'Phonetic' => 'jiǎo', 'Type' => 'noun', 'Meaning' => 'foot', 'Example' => '我的脚', 'Audio' => 'foot.mp3', 'TopicID' => $topicIds[9], 'LanguageID' => $chineseLangId, 'Difficulty' => 'Easy'],
        
        // Basic actions
        ['Word' => '买', 'Phonetic' => 'mǎi', 'Type' => 'verb', 'Meaning' => 'to buy', 'Example' => '买苹果', 'Audio' => 'to_buy.mp3', 'TopicID' => $topicIds[0], 'LanguageID' => $chineseLangId, 'Difficulty' => 'Easy'],
        ['Word' => '卖', 'Phonetic' => 'mài', 'Type' => 'verb', 'Meaning' => 'to sell', 'Example' => '卖东西', 'Audio' => 'to_sell.mp3', 'TopicID' => $topicIds[0], 'LanguageID' => $chineseLangId, 'Difficulty' => 'Easy'],
        ['Word' => '做', 'Phonetic' => 'zuò', 'Type' => 'verb', 'Meaning' => 'to do', 'Example' => '做作业', 'Audio' => 'to_do.mp3', 'TopicID' => $topicIds[0], 'LanguageID' => $chineseLangId, 'Difficulty' => 'Easy'],
        ['Word' => '学习', 'Phonetic' => 'xuéxí', 'Type' => 'verb', 'Meaning' => 'to study', 'Example' => '学习中文', 'Audio' => 'to_study.mp3', 'TopicID' => $topicIds[5], 'LanguageID' => $chineseLangId, 'Difficulty' => 'Easy'],
        ['Word' => '工作', 'Phonetic' => 'gōngzuò', 'Type' => 'verb', 'Meaning' => 'to work', 'Example' => '工作很忙', 'Audio' => 'to_work.mp3', 'TopicID' => $topicIds[6], 'LanguageID' => $chineseLangId, 'Difficulty' => 'Easy'],
        ['Word' => '睡觉', 'Phonetic' => 'shuìjiào', 'Type' => 'verb', 'Meaning' => 'to sleep', 'Example' => '睡觉', 'Audio' => 'to_sleep.mp3', 'TopicID' => $topicIds[0], 'LanguageID' => $chineseLangId, 'Difficulty' => 'Easy'],
        ['Word' => '起床', 'Phonetic' => 'qǐchuáng', 'Type' => 'verb', 'Meaning' => 'to get up', 'Example' => '起床', 'Audio' => 'to_get_up.mp3', 'TopicID' => $topicIds[0], 'LanguageID' => $chineseLangId, 'Difficulty' => 'Easy']
    ];
    
    $imported = 0;
    foreach ($vocabularyData as $vocab) {
        $stmt = $pdo->prepare("INSERT INTO Vocabulary (Word, Phonetic, Type, Meaning, Example, Audio, TopicID, LanguageID, Difficulty, IsActive) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 1)");
        $stmt->execute([
            $vocab['Word'],
            $vocab['Phonetic'],
            $vocab['Type'],
            $vocab['Meaning'],
            $vocab['Example'],
            $vocab['Audio'],
            $vocab['TopicID'],
            $vocab['LanguageID'],
            $vocab['Difficulty']
        ]);
        $imported++;
        echo "✅ Added vocabulary: " . $vocab['Word'] . " (" . $vocab['Meaning'] . ")\n";
    }
    
    // Update vocabulary count
    $pdo->exec("UPDATE Topics SET VocabularyCount = (SELECT COUNT(*) FROM Vocabulary WHERE Vocabulary.TopicID = Topics.TopicID)");
    
    echo "\n🎉 Import completed successfully!\n";
    echo "📊 Statistics:\n";
    echo "- Topics imported: " . count($topicsData) . "\n";
    echo "- Vocabulary imported: $imported\n";
    echo "- Language: Chinese (中文)\n";
    echo "- Level: HSK1\n";
    
} catch (PDOException $e) {
    echo "❌ Database error: " . $e->getMessage() . "\n";
} catch (Exception $e) {
    echo "❌ Error: " . $e->getMessage() . "\n";
}
?>
