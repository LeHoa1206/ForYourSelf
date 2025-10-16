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
    
    echo "Adding vocabulary for all languages...\n";
    
    // Insert Vocabulary Data for Vietnamese Food Topic (TopicID = 2)
    $vocabulary_vi_food = [
        [7, 'cơm', 'com', 'Noun', 'Rice', 'Tôi ăn cơm mỗi ngày.', '/audio/vi/rice.mp3', 2, 1, 'Easy'],
        [8, 'bánh mì', 'banh mi', 'Noun', 'Bread', 'Tôi thích bánh mì cho bữa sáng.', '/audio/vi/bread.mp3', 2, 1, 'Easy'],
        [9, 'nước', 'nuoc', 'Noun', 'Water', 'Tôi uống nước mỗi ngày.', '/audio/vi/water.mp3', 2, 1, 'Easy'],
        [10, 'cà phê', 'ca phe', 'Noun', 'Coffee', 'Tôi uống cà phê vào buổi sáng.', '/audio/vi/coffee.mp3', 2, 1, 'Easy'],
        [11, 'trái cây', 'trai cay', 'Noun', 'Fruit', 'Tôi thích ăn trái cây.', '/audio/vi/fruit.mp3', 2, 1, 'Easy'],
        [12, 'thịt', 'thit', 'Noun', 'Meat', 'Tôi ăn thịt vào bữa trưa.', '/audio/vi/meat.mp3', 2, 1, 'Easy']
    ];
    
    $stmt = $pdo->prepare("INSERT INTO Vocabulary (WordID, Word, Phonetic, Type, Meaning, Example, Audio, TopicID, LanguageID, Difficulty) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
    foreach ($vocabulary_vi_food as $vocab) {
        $stmt->execute($vocab);
    }
    
    // Insert Vocabulary Data for Vietnamese Travel Topic (TopicID = 10)
    $vocabulary_vi_travel = [
        [13, 'xe ô tô', 'xe o to', 'Noun', 'Car', 'Tôi lái xe ô tô đi làm.', '/audio/vi/car.mp3', 10, 1, 'Easy'],
        [14, 'máy bay', 'may bay', 'Noun', 'Plane', 'Tôi đi du lịch bằng máy bay.', '/audio/vi/plane.mp3', 10, 1, 'Easy'],
        [15, 'khách sạn', 'khach san', 'Noun', 'Hotel', 'Tôi ở khách sạn khi du lịch.', '/audio/vi/hotel.mp3', 10, 1, 'Easy'],
        [16, 'hộ chiếu', 'ho chieu', 'Noun', 'Passport', 'Tôi cần hộ chiếu để đi du lịch.', '/audio/vi/passport.mp3', 10, 1, 'Easy'],
        [17, 'vé máy bay', 've may bay', 'Noun', 'Airplane ticket', 'Tôi mua vé máy bay.', '/audio/vi/ticket.mp3', 10, 1, 'Easy'],
        [18, 'hành lý', 'hanh ly', 'Noun', 'Luggage', 'Tôi mang hành lý đi du lịch.', '/audio/vi/luggage.mp3', 10, 1, 'Easy']
    ];
    
    foreach ($vocabulary_vi_travel as $vocab) {
        $stmt->execute($vocab);
    }
    
    // Insert Vocabulary Data for English Food Topic (TopicID = 12)
    $vocabulary_en_food = [
        [25, 'rice', '/raɪs/', 'Noun', 'Cơm', 'I eat rice every day.', '/audio/en/rice.mp3', 12, 2, 'Easy'],
        [26, 'bread', '/bred/', 'Noun', 'Bánh mì', 'I like bread for breakfast.', '/audio/en/bread.mp3', 12, 2, 'Easy'],
        [27, 'water', '/ˈwɔːtər/', 'Noun', 'Nước', 'I drink water every day.', '/audio/en/water.mp3', 12, 2, 'Easy'],
        [28, 'coffee', '/ˈkɔːfi/', 'Noun', 'Cà phê', 'I drink coffee in the morning.', '/audio/en/coffee.mp3', 12, 2, 'Easy'],
        [29, 'fruit', '/fruːt/', 'Noun', 'Trái cây', 'I like to eat fruit.', '/audio/en/fruit.mp3', 12, 2, 'Easy'],
        [30, 'meat', '/miːt/', 'Noun', 'Thịt', 'I eat meat for lunch.', '/audio/en/meat.mp3', 12, 2, 'Easy']
    ];
    
    foreach ($vocabulary_en_food as $vocab) {
        $stmt->execute($vocab);
    }
    
    // Insert Vocabulary Data for English Travel Topic (TopicID = 20)
    $vocabulary_en_travel = [
        [31, 'car', '/kɑːr/', 'Noun', 'Xe ô tô', 'I drive a car to work.', '/audio/en/car.mp3', 20, 2, 'Easy'],
        [32, 'plane', '/pleɪn/', 'Noun', 'Máy bay', 'I travel by plane.', '/audio/en/plane.mp3', 20, 2, 'Easy'],
        [33, 'hotel', '/hoʊˈtel/', 'Noun', 'Khách sạn', 'I stay at a hotel.', '/audio/en/hotel.mp3', 20, 2, 'Easy'],
        [34, 'passport', '/ˈpæspɔːrt/', 'Noun', 'Hộ chiếu', 'I need a passport to travel.', '/audio/en/passport.mp3', 20, 2, 'Easy'],
        [35, 'ticket', '/ˈtɪkɪt/', 'Noun', 'Vé', 'I buy a plane ticket.', '/audio/en/ticket.mp3', 20, 2, 'Easy'],
        [36, 'luggage', '/ˈlʌɡɪdʒ/', 'Noun', 'Hành lý', 'I pack my luggage.', '/audio/en/luggage.mp3', 20, 2, 'Easy']
    ];
    
    foreach ($vocabulary_en_travel as $vocab) {
        $stmt->execute($vocab);
    }
    
    // Insert Vocabulary Data for Chinese Family Topic (TopicID = 21)
    $vocabulary_zh_family = [
        [37, '父亲', 'fùqīn', 'Noun', 'Bố, cha', '我的父亲是医生。', '/audio/zh/father.mp3', 21, 3, 'Easy'],
        [38, '母亲', 'mǔqīn', 'Noun', 'Mẹ, má', '我的母亲做饭很好。', '/audio/zh/mother.mp3', 21, 3, 'Easy'],
        [39, '哥哥', 'gēge', 'Noun', 'Anh trai', '我的哥哥很高。', '/audio/zh/brother.mp3', 21, 3, 'Easy'],
        [40, '姐姐', 'jiějie', 'Noun', 'Chị gái', '我的姐姐很漂亮。', '/audio/zh/sister.mp3', 21, 3, 'Easy'],
        [41, '爷爷', 'yéye', 'Noun', 'Ông nội', '我的爷爷80岁了。', '/audio/zh/grandfather.mp3', 21, 3, 'Easy'],
        [42, '奶奶', 'nǎinai', 'Noun', 'Bà nội', '我的奶奶做饭很好。', '/audio/zh/grandmother.mp3', 21, 3, 'Easy']
    ];
    
    foreach ($vocabulary_zh_family as $vocab) {
        $stmt->execute($vocab);
    }
    
    // Insert Vocabulary Data for Chinese Food Topic (TopicID = 22)
    $vocabulary_zh_food = [
        [43, '米饭', 'mǐfàn', 'Noun', 'Cơm', '我每天吃米饭。', '/audio/zh/rice.mp3', 22, 3, 'Easy'],
        [44, '面包', 'miànbāo', 'Noun', 'Bánh mì', '我喜欢早餐吃面包。', '/audio/zh/bread.mp3', 22, 3, 'Easy'],
        [45, '水', 'shuǐ', 'Noun', 'Nước', '我每天喝水。', '/audio/zh/water.mp3', 22, 3, 'Easy'],
        [46, '咖啡', 'kāfēi', 'Noun', 'Cà phê', '我早上喝咖啡。', '/audio/zh/coffee.mp3', 22, 3, 'Easy'],
        [47, '水果', 'shuǐguǒ', 'Noun', 'Trái cây', '我喜欢吃水果。', '/audio/zh/fruit.mp3', 22, 3, 'Easy'],
        [48, '肉', 'ròu', 'Noun', 'Thịt', '我午餐吃肉。', '/audio/zh/meat.mp3', 22, 3, 'Easy']
    ];
    
    foreach ($vocabulary_zh_food as $vocab) {
        $stmt->execute($vocab);
    }
    
    // Insert Vocabulary Data for Chinese Travel Topic (TopicID = 30)
    $vocabulary_zh_travel = [
        [49, '汽车', 'qìchē', 'Noun', 'Xe ô tô', '我开车去上班。', '/audio/zh/car.mp3', 30, 3, 'Easy'],
        [50, '飞机', 'fēijī', 'Noun', 'Máy bay', '我坐飞机旅行。', '/audio/zh/plane.mp3', 30, 3, 'Easy'],
        [51, '酒店', 'jiǔdiàn', 'Noun', 'Khách sạn', '我住在酒店。', '/audio/zh/hotel.mp3', 30, 3, 'Easy'],
        [52, '护照', 'hùzhào', 'Noun', 'Hộ chiếu', '我需要护照旅行。', '/audio/zh/passport.mp3', 30, 3, 'Easy'],
        [53, '票', 'piào', 'Noun', 'Vé', '我买飞机票。', '/audio/zh/ticket.mp3', 30, 3, 'Easy'],
        [54, '行李', 'xínglǐ', 'Noun', 'Hành lý', '我收拾行李。', '/audio/zh/luggage.mp3', 30, 3, 'Easy']
    ];
    
    foreach ($vocabulary_zh_travel as $vocab) {
        $stmt->execute($vocab);
    }
    
    // Insert Vocabulary Data for Korean Family Topic (TopicID = 31)
    $vocabulary_ko_family = [
        [55, '아버지', 'abeoji', 'Noun', 'Bố, cha', '제 아버지는 의사입니다.', '/audio/ko/father.mp3', 31, 4, 'Easy'],
        [56, '어머니', 'eomeoni', 'Noun', 'Mẹ, má', '제 어머니는 요리를 잘합니다.', '/audio/ko/mother.mp3', 31, 4, 'Easy'],
        [57, '형', 'hyeong', 'Noun', 'Anh trai', '제 형은 키가 큽니다.', '/audio/ko/brother.mp3', 31, 4, 'Easy'],
        [58, '누나', 'nuna', 'Noun', 'Chị gái', '제 누나는 예쁩니다.', '/audio/ko/sister.mp3', 31, 4, 'Easy'],
        [59, '할아버지', 'harabeoji', 'Noun', 'Ông nội', '제 할아버지는 80세입니다.', '/audio/ko/grandfather.mp3', 31, 4, 'Easy'],
        [60, '할머니', 'halmeoni', 'Noun', 'Bà nội', '제 할머니는 요리를 잘합니다.', '/audio/ko/grandmother.mp3', 31, 4, 'Easy']
    ];
    
    foreach ($vocabulary_ko_family as $vocab) {
        $stmt->execute($vocab);
    }
    
    // Insert Vocabulary Data for Korean Food Topic (TopicID = 32)
    $vocabulary_ko_food = [
        [61, '밥', 'bap', 'Noun', 'Cơm', '저는 매일 밥을 먹습니다.', '/audio/ko/rice.mp3', 32, 4, 'Easy'],
        [62, '빵', 'ppang', 'Noun', 'Bánh mì', '저는 아침에 빵을 좋아합니다.', '/audio/ko/bread.mp3', 32, 4, 'Easy'],
        [63, '물', 'mul', 'Noun', 'Nước', '저는 매일 물을 마십니다.', '/audio/ko/water.mp3', 32, 4, 'Easy'],
        [64, '커피', 'keopi', 'Noun', 'Cà phê', '저는 아침에 커피를 마십니다.', '/audio/ko/coffee.mp3', 32, 4, 'Easy'],
        [65, '과일', 'gwail', 'Noun', 'Trái cây', '저는 과일을 좋아합니다.', '/audio/ko/fruit.mp3', 32, 4, 'Easy'],
        [66, '고기', 'gogi', 'Noun', 'Thịt', '저는 점심에 고기를 먹습니다.', '/audio/ko/meat.mp3', 32, 4, 'Easy']
    ];
    
    foreach ($vocabulary_ko_food as $vocab) {
        $stmt->execute($vocab);
    }
    
    // Insert Vocabulary Data for Korean Travel Topic (TopicID = 40)
    $vocabulary_ko_travel = [
        [67, '자동차', 'jadongcha', 'Noun', 'Xe ô tô', '저는 자동차로 출근합니다.', '/audio/ko/car.mp3', 40, 4, 'Easy'],
        [68, '비행기', 'bihaenggi', 'Noun', 'Máy bay', '저는 비행기로 여행합니다.', '/audio/ko/plane.mp3', 40, 4, 'Easy'],
        [69, '호텔', 'hotel', 'Noun', 'Khách sạn', '저는 호텔에 머뭅니다.', '/audio/ko/hotel.mp3', 40, 4, 'Easy'],
        [70, '여권', 'yeogwon', 'Noun', 'Hộ chiếu', '여행하려면 여권이 필요합니다.', '/audio/ko/passport.mp3', 40, 4, 'Easy'],
        [71, '표', 'pyo', 'Noun', 'Vé', '저는 비행기 표를 삽니다.', '/audio/ko/ticket.mp3', 40, 4, 'Easy'],
        [72, '짐', 'jim', 'Noun', 'Hành lý', '저는 짐을 쌉니다.', '/audio/ko/luggage.mp3', 40, 4, 'Easy']
    ];
    
    foreach ($vocabulary_ko_travel as $vocab) {
        $stmt->execute($vocab);
    }
    
    // Insert Vocabulary Data for Japanese Family Topic (TopicID = 41)
    $vocabulary_ja_family = [
        [73, '父', 'chichi', 'Noun', 'Bố, cha', '私の父は医者です。', '/audio/ja/father.mp3', 41, 5, 'Easy'],
        [74, '母', 'haha', 'Noun', 'Mẹ, má', '私の母は料理が上手です。', '/audio/ja/mother.mp3', 41, 5, 'Easy'],
        [75, '兄', 'ani', 'Noun', 'Anh trai', '私の兄は背が高いです。', '/audio/ja/brother.mp3', 41, 5, 'Easy'],
        [76, '姉', 'ane', 'Noun', 'Chị gái', '私の姉は美しいです。', '/audio/ja/sister.mp3', 41, 5, 'Easy'],
        [77, '祖父', 'sofu', 'Noun', 'Ông nội', '私の祖父は80歳です。', '/audio/ja/grandfather.mp3', 41, 5, 'Easy'],
        [78, '祖母', 'sobo', 'Noun', 'Bà nội', '私の祖母は料理が上手です。', '/audio/ja/grandmother.mp3', 41, 5, 'Easy']
    ];
    
    foreach ($vocabulary_ja_family as $vocab) {
        $stmt->execute($vocab);
    }
    
    // Insert Vocabulary Data for Japanese Food Topic (TopicID = 42)
    $vocabulary_ja_food = [
        [79, 'ご飯', 'gohan', 'Noun', 'Cơm', '私は毎日ご飯を食べます。', '/audio/ja/rice.mp3', 42, 5, 'Easy'],
        [80, 'パン', 'pan', 'Noun', 'Bánh mì', '私は朝食にパンが好きです。', '/audio/ja/bread.mp3', 42, 5, 'Easy'],
        [81, '水', 'mizu', 'Noun', 'Nước', '私は毎日水を飲みます。', '/audio/ja/water.mp3', 42, 5, 'Easy'],
        [82, 'コーヒー', 'koohii', 'Noun', 'Cà phê', '私は朝にコーヒーを飲みます。', '/audio/ja/coffee.mp3', 42, 5, 'Easy'],
        [83, '果物', 'kudamono', 'Noun', 'Trái cây', '私は果物が好きです。', '/audio/ja/fruit.mp3', 42, 5, 'Easy'],
        [84, '肉', 'niku', 'Noun', 'Thịt', '私は昼食に肉を食べます。', '/audio/ja/meat.mp3', 42, 5, 'Easy']
    ];
    
    foreach ($vocabulary_ja_food as $vocab) {
        $stmt->execute($vocab);
    }
    
    // Insert Vocabulary Data for Japanese Travel Topic (TopicID = 50)
    $vocabulary_ja_travel = [
        [85, '車', 'kuruma', 'Noun', 'Xe ô tô', '私は車で通勤します。', '/audio/ja/car.mp3', 50, 5, 'Easy'],
        [86, '飛行機', 'hikouki', 'Noun', 'Máy bay', '私は飛行機で旅行します。', '/audio/ja/plane.mp3', 50, 5, 'Easy'],
        [87, 'ホテル', 'hoteru', 'Noun', 'Khách sạn', '私はホテルに泊まります。', '/audio/ja/hotel.mp3', 50, 5, 'Easy'],
        [88, 'パスポート', 'pasupooto', 'Noun', 'Hộ chiếu', '旅行にはパスポートが必要です。', '/audio/ja/passport.mp3', 50, 5, 'Easy'],
        [89, '切符', 'kippu', 'Noun', 'Vé', '私は飛行機の切符を買います。', '/audio/ja/ticket.mp3', 50, 5, 'Easy'],
        [90, '荷物', 'nimotsu', 'Noun', 'Hành lý', '私は荷物をまとめます。', '/audio/ja/luggage.mp3', 50, 5, 'Easy']
    ];
    
    foreach ($vocabulary_ja_travel as $vocab) {
        $stmt->execute($vocab);
    }
    
    // Insert Vocabulary Data for Thai Family Topic (TopicID = 51)
    $vocabulary_th_family = [
        [91, 'พ่อ', 'pho', 'Noun', 'Bố, cha', 'พ่อของฉันเป็นหมอ', '/audio/th/father.mp3', 51, 6, 'Easy'],
        [92, 'แม่', 'mae', 'Noun', 'Mẹ, má', 'แม่ของฉันทำอาหารเก่ง', '/audio/th/mother.mp3', 51, 6, 'Easy'],
        [93, 'พี่ชาย', 'phi chai', 'Noun', 'Anh trai', 'พี่ชายของฉันสูง', '/audio/th/brother.mp3', 51, 6, 'Easy'],
        [94, 'พี่สาว', 'phi sao', 'Noun', 'Chị gái', 'พี่สาวของฉันสวย', '/audio/th/sister.mp3', 51, 6, 'Easy'],
        [95, 'ปู่', 'pu', 'Noun', 'Ông nội', 'ปู่ของฉันอายุ 80 ปี', '/audio/th/grandfather.mp3', 51, 6, 'Easy'],
        [96, 'ย่า', 'ya', 'Noun', 'Bà nội', 'ย่าของฉันทำอาหารเก่ง', '/audio/th/grandmother.mp3', 51, 6, 'Easy']
    ];
    
    foreach ($vocabulary_th_family as $vocab) {
        $stmt->execute($vocab);
    }
    
    // Insert Vocabulary Data for Thai Food Topic (TopicID = 52)
    $vocabulary_th_food = [
        [97, 'ข้าว', 'khao', 'Noun', 'Cơm', 'ฉันกินข้าวทุกวัน', '/audio/th/rice.mp3', 52, 6, 'Easy'],
        [98, 'ขนมปัง', 'khanom pang', 'Noun', 'Bánh mì', 'ฉันชอบขนมปังตอนเช้า', '/audio/th/bread.mp3', 52, 6, 'Easy'],
        [99, 'น้ำ', 'nam', 'Noun', 'Nước', 'ฉันดื่มน้ำทุกวัน', '/audio/th/water.mp3', 52, 6, 'Easy'],
        [100, 'กาแฟ', 'ka-fae', 'Noun', 'Cà phê', 'ฉันดื่มกาแฟตอนเช้า', '/audio/th/coffee.mp3', 52, 6, 'Easy'],
        [101, 'ผลไม้', 'phon la mai', 'Noun', 'Trái cây', 'ฉันชอบกินผลไม้', '/audio/th/fruit.mp3', 52, 6, 'Easy'],
        [102, 'เนื้อ', 'nuea', 'Noun', 'Thịt', 'ฉันกินเนื้อตอนเที่ยง', '/audio/th/meat.mp3', 52, 6, 'Easy']
    ];
    
    foreach ($vocabulary_th_food as $vocab) {
        $stmt->execute($vocab);
    }
    
    // Insert Vocabulary Data for Thai Travel Topic (TopicID = 60)
    $vocabulary_th_travel = [
        [103, 'รถ', 'rot', 'Noun', 'Xe ô tô', 'ฉันขับรถไปทำงาน', '/audio/th/car.mp3', 60, 6, 'Easy'],
        [104, 'เครื่องบิน', 'khrueang bin', 'Noun', 'Máy bay', 'ฉันเดินทางด้วยเครื่องบิน', '/audio/th/plane.mp3', 60, 6, 'Easy'],
        [105, 'โรงแรม', 'rong raem', 'Noun', 'Khách sạn', 'ฉันพักที่โรงแรม', '/audio/th/hotel.mp3', 60, 6, 'Easy'],
        [106, 'หนังสือเดินทาง', 'nang sue doen thang', 'Noun', 'Hộ chiếu', 'ฉันต้องใช้หนังสือเดินทางเพื่อเดินทาง', '/audio/th/passport.mp3', 60, 6, 'Easy'],
        [107, 'ตั๋ว', 'tua', 'Noun', 'Vé', 'ฉันซื้อตั๋วเครื่องบิน', '/audio/th/ticket.mp3', 60, 6, 'Easy'],
        [108, 'กระเป๋า', 'kra pao', 'Noun', 'Hành lý', 'ฉันแพ็คกระเป๋า', '/audio/th/luggage.mp3', 60, 6, 'Easy']
    ];
    
    foreach ($vocabulary_th_travel as $vocab) {
        $stmt->execute($vocab);
    }
    
    // Update VocabularyCount for all topics
    $pdo->exec("UPDATE Topics SET VocabularyCount = (SELECT COUNT(*) FROM Vocabulary WHERE Vocabulary.TopicID = Topics.TopicID)");
    
    echo "Vocabulary added successfully for all languages!\n";
    echo "Total vocabulary entries: " . $pdo->query("SELECT COUNT(*) FROM Vocabulary")->fetchColumn() . "\n";
    
} catch (PDOException $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
?>

