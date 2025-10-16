-- Drop and recreate database with perfect UTF-8 encoding
DROP DATABASE IF EXISTS vip_english_learning;
CREATE DATABASE vip_english_learning CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE vip_english_learning;

-- Languages Table
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Topics Table
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Vocabulary Table
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Study Methods Table
CREATE TABLE StudyMethods (
    MethodID INT AUTO_INCREMENT PRIMARY KEY,
    MethodCode VARCHAR(20) NOT NULL UNIQUE,
    MethodName VARCHAR(50) NOT NULL,
    Description TEXT,
    Icon VARCHAR(50) DEFAULT '📚',
    IsActive BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert Languages Data
INSERT INTO Languages (LanguageID, LanguageCode, LanguageName, NativeName, Flag, IsActive, SortOrder) VALUES
(1, 'vi', 'Vietnamese', 'Tiếng Việt', '🇻🇳', 1, 1),
(2, 'en', 'English', 'English', '🇺🇸', 1, 2),
(3, 'zh', 'Chinese', '中文', '🇨🇳', 1, 3),
(4, 'ko', 'Korean', '한국어', '🇰🇷', 1, 4),
(5, 'ja', 'Japanese', '日本語', '🇯🇵', 1, 5),
(6, 'th', 'Thai', 'ไทย', '🇹🇭', 1, 6);

-- Insert Study Methods Data
INSERT INTO StudyMethods (MethodID, MethodCode, MethodName, Description, Icon, IsActive) VALUES
(1, 'flashcard', 'Flashcards', 'Học từ vựng với thẻ ghi nhớ tương tác', '🃏', 1),
(2, 'spaced', 'Lặp Lại Ngắt Quãng', 'Lặp lại theo khoảng thời gian tối ưu', '🔄', 1),
(3, 'writing', 'Luyện Viết', 'Luyện viết từ vựng chính xác', '✍️', 1);

-- Insert Topics Data for Vietnamese (LanguageID = 1)
INSERT INTO Topics (TopicID, LanguageID, Title, Description, Level, Icon, Color, IsActive, SortOrder) VALUES
(1, 1, 'Gia đình', 'Gia đình và các mối quan hệ', 'A1', '👨‍👩‍👧‍👦', '#EF4444', 1, 1),
(2, 1, 'Thức ăn', 'Thức ăn và đồ uống', 'A1', '🍕', '#F97316', 1, 2),
(3, 1, 'Nhà cửa', 'Nhà cửa và đồ đạc', 'A1', '🏠', '#8B5CF6', 1, 3),
(4, 1, 'Màu sắc', 'Màu sắc và hình dạng', 'A1', '🎨', '#F59E0B', 1, 4),
(5, 1, 'Số đếm', 'Số đếm và thời gian', 'A1', '🔢', '#10B981', 1, 5),
(6, 1, 'Cơ thể', 'Cơ thể và sức khỏe', 'A1', '👤', '#EC4899', 1, 6),
(7, 1, 'Động vật', 'Động vật và thiên nhiên', 'A1', '🐶', '#06B6D4', 1, 7),
(8, 1, 'Quần áo', 'Quần áo và thời trang', 'A1', '👕', '#8B5CF6', 1, 8),
(9, 1, 'Thời tiết', 'Thời tiết và mùa', 'A2', '☀️', '#F59E0B', 1, 9),
(10, 1, 'Du lịch', 'Du lịch và phương tiện', 'A2', '✈️', '#10B981', 1, 10);

-- Insert Topics Data for English (LanguageID = 2)
INSERT INTO Topics (TopicID, LanguageID, Title, Description, Level, Icon, Color, IsActive, SortOrder) VALUES
(11, 2, 'Family', 'Family and relationships', 'A1', '👨‍👩‍👧‍👦', '#EF4444', 1, 1),
(12, 2, 'Food', 'Food and drinks', 'A1', '🍕', '#F97316', 1, 2),
(13, 2, 'Home', 'Home and furniture', 'A1', '🏠', '#8B5CF6', 1, 3),
(14, 2, 'Colors', 'Colors and shapes', 'A1', '🎨', '#F59E0B', 1, 4),
(15, 2, 'Numbers', 'Numbers and time', 'A1', '🔢', '#10B981', 1, 5),
(16, 2, 'Body Parts', 'Body parts and health', 'A1', '👤', '#EC4899', 1, 6),
(17, 2, 'Animals', 'Animals and nature', 'A1', '🐶', '#06B6D4', 1, 7),
(18, 2, 'Clothes', 'Clothes and fashion', 'A1', '👕', '#8B5CF6', 1, 8),
(19, 2, 'Weather', 'Weather and seasons', 'A2', '☀️', '#F59E0B', 1, 9),
(20, 2, 'Travel', 'Travel and transportation', 'A2', '✈️', '#10B981', 1, 10);

-- Insert Topics Data for Chinese (LanguageID = 3)
INSERT INTO Topics (TopicID, LanguageID, Title, Description, Level, Icon, Color, IsActive, SortOrder) VALUES
(21, 3, '家庭', 'Gia đình và các mối quan hệ', 'A1', '👨‍👩‍👧‍👦', '#EF4444', 1, 1),
(22, 3, '食物', 'Thức ăn và đồ uống', 'A1', '🍕', '#F97316', 1, 2),
(23, 3, '房子', 'Nhà cửa và đồ đạc', 'A1', '🏠', '#8B5CF6', 1, 3),
(24, 3, '颜色', 'Màu sắc và hình dạng', 'A1', '🎨', '#F59E0B', 1, 4),
(25, 3, '数字', 'Số đếm và thời gian', 'A1', '🔢', '#10B981', 1, 5),
(26, 3, '身体', 'Cơ thể và sức khỏe', 'A1', '👤', '#EC4899', 1, 6),
(27, 3, '动物', 'Động vật và thiên nhiên', 'A1', '🐶', '#06B6D4', 1, 7),
(28, 3, '衣服', 'Quần áo và thời trang', 'A1', '👕', '#8B5CF6', 1, 8),
(29, 3, '天气', 'Thời tiết và mùa', 'A2', '☀️', '#F59E0B', 1, 9),
(30, 3, '旅行', 'Du lịch và phương tiện', 'A2', '✈️', '#10B981', 1, 10);

-- Insert Topics Data for Korean (LanguageID = 4)
INSERT INTO Topics (TopicID, LanguageID, Title, Description, Level, Icon, Color, IsActive, SortOrder) VALUES
(31, 4, '가족', 'Gia đình và các mối quan hệ', 'A1', '👨‍👩‍👧‍👦', '#EF4444', 1, 1),
(32, 4, '음식', 'Thức ăn và đồ uống', 'A1', '🍕', '#F97316', 1, 2),
(33, 4, '집', 'Nhà cửa và đồ đạc', 'A1', '🏠', '#8B5CF6', 1, 3),
(34, 4, '색깔', 'Màu sắc và hình dạng', 'A1', '🎨', '#F59E0B', 1, 4),
(35, 4, '숫자', 'Số đếm và thời gian', 'A1', '🔢', '#10B981', 1, 5),
(36, 4, '몸', 'Cơ thể và sức khỏe', 'A1', '👤', '#EC4899', 1, 6),
(37, 4, '동물', 'Động vật và thiên nhiên', 'A1', '🐶', '#06B6D4', 1, 7),
(38, 4, '옷', 'Quần áo và thời trang', 'A1', '👕', '#8B5CF6', 1, 8),
(39, 4, '날씨', 'Thời tiết và mùa', 'A2', '☀️', '#F59E0B', 1, 9),
(40, 4, '여행', 'Du lịch và phương tiện', 'A2', '✈️', '#10B981', 1, 10);

-- Insert Topics Data for Japanese (LanguageID = 5)
INSERT INTO Topics (TopicID, LanguageID, Title, Description, Level, Icon, Color, IsActive, SortOrder) VALUES
(41, 5, '家族', 'Gia đình và các mối quan hệ', 'A1', '👨‍👩‍👧‍👦', '#EF4444', 1, 1),
(42, 5, '食べ物', 'Thức ăn và đồ uống', 'A1', '🍕', '#F97316', 1, 2),
(43, 5, '家', 'Nhà cửa và đồ đạc', 'A1', '🏠', '#8B5CF6', 1, 3),
(44, 5, '色', 'Màu sắc và hình dạng', 'A1', '🎨', '#F59E0B', 1, 4),
(45, 5, '数字', 'Số đếm và thời gian', 'A1', '🔢', '#10B981', 1, 5),
(46, 5, '体', 'Cơ thể và sức khỏe', 'A1', '👤', '#EC4899', 1, 6),
(47, 5, '動物', 'Động vật và thiên nhiên', 'A1', '🐶', '#06B6D4', 1, 7),
(48, 5, '服', 'Quần áo và thời trang', 'A1', '👕', '#8B5CF6', 1, 8),
(49, 5, '天気', 'Thời tiết và mùa', 'A2', '☀️', '#F59E0B', 1, 9),
(50, 5, '旅行', 'Du lịch và phương tiện', 'A2', '✈️', '#10B981', 1, 10);

-- Insert Topics Data for Thai (LanguageID = 6)
INSERT INTO Topics (TopicID, LanguageID, Title, Description, Level, Icon, Color, IsActive, SortOrder) VALUES
(51, 6, 'ครอบครัว', 'Gia đình và các mối quan hệ', 'A1', '👨‍👩‍👧‍👦', '#EF4444', 1, 1),
(52, 6, 'อาหาร', 'Thức ăn và đồ uống', 'A1', '🍕', '#F97316', 1, 2),
(53, 6, 'บ้าน', 'Nhà cửa và đồ đạc', 'A1', '🏠', '#8B5CF6', 1, 3),
(54, 6, 'สี', 'Màu sắc và hình dạng', 'A1', '🎨', '#F59E0B', 1, 4),
(55, 6, 'ตัวเลข', 'Số đếm và thời gian', 'A1', '🔢', '#10B981', 1, 5),
(56, 6, 'ร่างกาย', 'Cơ thể và sức khỏe', 'A1', '👤', '#EC4899', 1, 6),
(57, 6, 'สัตว์', 'Động vật và thiên nhiên', 'A1', '🐶', '#06B6D4', 1, 7),
(58, 6, 'เสื้อผ้า', 'Quần áo và thời trang', 'A1', '👕', '#8B5CF6', 1, 8),
(59, 6, 'อากาศ', 'Thời tiết và mùa', 'A2', '☀️', '#F59E0B', 1, 9),
(60, 6, 'การเดินทาง', 'Du lịch và phương tiện', 'A2', '✈️', '#10B981', 1, 10);

-- Insert Vocabulary Data for Vietnamese Family Topic (TopicID = 1)
INSERT INTO Vocabulary (WordID, Word, Phonetic, Type, Meaning, Example, Audio, TopicID, LanguageID, Difficulty) VALUES
(1, 'bố', 'bo', 'Noun', 'Father', 'Bố tôi là bác sĩ.', '/audio/vi/father.mp3', 1, 1, 'Easy'),
(2, 'mẹ', 'me', 'Noun', 'Mother', 'Mẹ tôi nấu ăn rất ngon.', '/audio/vi/mother.mp3', 1, 1, 'Easy'),
(3, 'anh trai', 'anh trai', 'Noun', 'Brother', 'Anh trai tôi rất cao.', '/audio/vi/brother.mp3', 1, 1, 'Easy'),
(4, 'chị gái', 'chi gai', 'Noun', 'Sister', 'Chị gái tôi rất xinh.', '/audio/vi/sister.mp3', 1, 1, 'Easy'),
(5, 'ông', 'ong', 'Noun', 'Grandfather', 'Ông tôi đã 80 tuổi.', '/audio/vi/grandfather.mp3', 1, 1, 'Easy'),
(6, 'bà', 'ba', 'Noun', 'Grandmother', 'Bà tôi nấu ăn ngon.', '/audio/vi/grandmother.mp3', 1, 1, 'Easy');

-- Insert Vocabulary Data for Vietnamese Food Topic (TopicID = 2)
INSERT INTO Vocabulary (WordID, Word, Phonetic, Type, Meaning, Example, Audio, TopicID, LanguageID, Difficulty) VALUES
(7, 'cơm', 'com', 'Noun', 'Rice', 'Tôi ăn cơm mỗi ngày.', '/audio/vi/rice.mp3', 2, 1, 'Easy'),
(8, 'bánh mì', 'banh mi', 'Noun', 'Bread', 'Tôi thích bánh mì cho bữa sáng.', '/audio/vi/bread.mp3', 2, 1, 'Easy'),
(9, 'nước', 'nuoc', 'Noun', 'Water', 'Tôi uống nước mỗi ngày.', '/audio/vi/water.mp3', 2, 1, 'Easy'),
(10, 'cà phê', 'ca phe', 'Noun', 'Coffee', 'Tôi uống cà phê vào buổi sáng.', '/audio/vi/coffee.mp3', 2, 1, 'Easy'),
(11, 'trái cây', 'trai cay', 'Noun', 'Fruit', 'Tôi thích ăn trái cây.', '/audio/vi/fruit.mp3', 2, 1, 'Easy'),
(12, 'thịt', 'thit', 'Noun', 'Meat', 'Tôi ăn thịt vào bữa trưa.', '/audio/vi/meat.mp3', 2, 1, 'Easy');

-- Insert Vocabulary Data for Vietnamese Travel Topic (TopicID = 10)
INSERT INTO Vocabulary (WordID, Word, Phonetic, Type, Meaning, Example, Audio, TopicID, LanguageID, Difficulty) VALUES
(13, 'xe ô tô', 'xe o to', 'Noun', 'Car', 'Tôi lái xe ô tô đi làm.', '/audio/vi/car.mp3', 10, 1, 'Easy'),
(14, 'máy bay', 'may bay', 'Noun', 'Plane', 'Tôi đi du lịch bằng máy bay.', '/audio/vi/plane.mp3', 10, 1, 'Easy'),
(15, 'khách sạn', 'khach san', 'Noun', 'Hotel', 'Tôi ở khách sạn khi du lịch.', '/audio/vi/hotel.mp3', 10, 1, 'Easy'),
(16, 'hộ chiếu', 'ho chieu', 'Noun', 'Passport', 'Tôi cần hộ chiếu để đi du lịch.', '/audio/vi/passport.mp3', 10, 1, 'Easy'),
(17, 'vé máy bay', 've may bay', 'Noun', 'Airplane ticket', 'Tôi mua vé máy bay.', '/audio/vi/ticket.mp3', 10, 1, 'Easy'),
(18, 'hành lý', 'hanh ly', 'Noun', 'Luggage', 'Tôi mang hành lý đi du lịch.', '/audio/vi/luggage.mp3', 10, 1, 'Easy');

-- Insert Vocabulary Data for English Family Topic (TopicID = 11)
INSERT INTO Vocabulary (WordID, Word, Phonetic, Type, Meaning, Example, Audio, TopicID, LanguageID, Difficulty) VALUES
(19, 'father', '/ˈfɑːðər/', 'Noun', 'Bố, cha', 'My father is a doctor.', '/audio/en/father.mp3', 11, 2, 'Easy'),
(20, 'mother', '/ˈmʌðər/', 'Noun', 'Mẹ, má', 'My mother cooks well.', '/audio/en/mother.mp3', 11, 2, 'Easy'),
(21, 'brother', '/ˈbrʌðər/', 'Noun', 'Anh/em trai', 'My brother is tall.', '/audio/en/brother.mp3', 11, 2, 'Easy'),
(22, 'sister', '/ˈsɪstər/', 'Noun', 'Chị/em gái', 'My sister is beautiful.', '/audio/en/sister.mp3', 11, 2, 'Easy'),
(23, 'grandfather', '/ˈɡrænfɑːðər/', 'Noun', 'Ông nội/ngoại', 'My grandfather is 80 years old.', '/audio/en/grandfather.mp3', 11, 2, 'Easy'),
(24, 'grandmother', '/ˈɡrænmʌðər/', 'Noun', 'Bà nội/ngoại', 'My grandmother cooks well.', '/audio/en/grandmother.mp3', 11, 2, 'Easy');

-- Insert Vocabulary Data for English Food Topic (TopicID = 12)
INSERT INTO Vocabulary (WordID, Word, Phonetic, Type, Meaning, Example, Audio, TopicID, LanguageID, Difficulty) VALUES
(25, 'rice', '/raɪs/', 'Noun', 'Cơm', 'I eat rice every day.', '/audio/en/rice.mp3', 12, 2, 'Easy'),
(26, 'bread', '/bred/', 'Noun', 'Bánh mì', 'I like bread for breakfast.', '/audio/en/bread.mp3', 12, 2, 'Easy'),
(27, 'water', '/ˈwɔːtər/', 'Noun', 'Nước', 'I drink water every day.', '/audio/en/water.mp3', 12, 2, 'Easy'),
(28, 'coffee', '/ˈkɔːfi/', 'Noun', 'Cà phê', 'I drink coffee in the morning.', '/audio/en/coffee.mp3', 12, 2, 'Easy'),
(29, 'fruit', '/fruːt/', 'Noun', 'Trái cây', 'I like to eat fruit.', '/audio/en/fruit.mp3', 12, 2, 'Easy'),
(30, 'meat', '/miːt/', 'Noun', 'Thịt', 'I eat meat for lunch.', '/audio/en/meat.mp3', 12, 2, 'Easy');

-- Insert Vocabulary Data for English Travel Topic (TopicID = 20)
INSERT INTO Vocabulary (WordID, Word, Phonetic, Type, Meaning, Example, Audio, TopicID, LanguageID, Difficulty) VALUES
(31, 'car', '/kɑːr/', 'Noun', 'Xe ô tô', 'I drive a car to work.', '/audio/en/car.mp3', 20, 2, 'Easy'),
(32, 'plane', '/pleɪn/', 'Noun', 'Máy bay', 'I travel by plane.', '/audio/en/plane.mp3', 20, 2, 'Easy'),
(33, 'hotel', '/hoʊˈtel/', 'Noun', 'Khách sạn', 'I stay at a hotel.', '/audio/en/hotel.mp3', 20, 2, 'Easy'),
(34, 'passport', '/ˈpæspɔːrt/', 'Noun', 'Hộ chiếu', 'I need a passport to travel.', '/audio/en/passport.mp3', 20, 2, 'Easy'),
(35, 'ticket', '/ˈtɪkɪt/', 'Noun', 'Vé', 'I buy a plane ticket.', '/audio/en/ticket.mp3', 20, 2, 'Easy'),
(36, 'luggage', '/ˈlʌɡɪdʒ/', 'Noun', 'Hành lý', 'I pack my luggage.', '/audio/en/luggage.mp3', 20, 2, 'Easy');

-- Insert Vocabulary Data for Chinese Family Topic (TopicID = 21)
INSERT INTO Vocabulary (WordID, Word, Phonetic, Type, Meaning, Example, Audio, TopicID, LanguageID, Difficulty) VALUES
(37, '父亲', 'fùqīn', 'Noun', 'Bố, cha', '我的父亲是医生。', '/audio/zh/father.mp3', 21, 3, 'Easy'),
(38, '母亲', 'mǔqīn', 'Noun', 'Mẹ, má', '我的母亲做饭很好。', '/audio/zh/mother.mp3', 21, 3, 'Easy'),
(39, '哥哥', 'gēge', 'Noun', 'Anh trai', '我的哥哥很高。', '/audio/zh/brother.mp3', 21, 3, 'Easy'),
(40, '姐姐', 'jiějie', 'Noun', 'Chị gái', '我的姐姐很漂亮。', '/audio/zh/sister.mp3', 21, 3, 'Easy'),
(41, '爷爷', 'yéye', 'Noun', 'Ông nội', '我的爷爷80岁了。', '/audio/zh/grandfather.mp3', 21, 3, 'Easy'),
(42, '奶奶', 'nǎinai', 'Noun', 'Bà nội', '我的奶奶做饭很好。', '/audio/zh/grandmother.mp3', 21, 3, 'Easy');

-- Insert Vocabulary Data for Korean Family Topic (TopicID = 31)
INSERT INTO Vocabulary (WordID, Word, Phonetic, Type, Meaning, Example, Audio, TopicID, LanguageID, Difficulty) VALUES
(43, '아버지', 'abeoji', 'Noun', 'Bố, cha', '제 아버지는 의사입니다.', '/audio/ko/father.mp3', 31, 4, 'Easy'),
(44, '어머니', 'eomeoni', 'Noun', 'Mẹ, má', '제 어머니는 요리를 잘합니다.', '/audio/ko/mother.mp3', 31, 4, 'Easy'),
(45, '형', 'hyeong', 'Noun', 'Anh trai', '제 형은 키가 큽니다.', '/audio/ko/brother.mp3', 31, 4, 'Easy'),
(46, '누나', 'nuna', 'Noun', 'Chị gái', '제 누나는 예쁩니다.', '/audio/ko/sister.mp3', 31, 4, 'Easy'),
(47, '할아버지', 'harabeoji', 'Noun', 'Ông nội', '제 할아버지는 80세입니다.', '/audio/ko/grandfather.mp3', 31, 4, 'Easy'),
(48, '할머니', 'halmeoni', 'Noun', 'Bà nội', '제 할머니는 요리를 잘합니다.', '/audio/ko/grandmother.mp3', 31, 4, 'Easy');

-- Insert Vocabulary Data for Japanese Family Topic (TopicID = 41)
INSERT INTO Vocabulary (WordID, Word, Phonetic, Type, Meaning, Example, Audio, TopicID, LanguageID, Difficulty) VALUES
(49, '父', 'chichi', 'Noun', 'Bố, cha', '私の父は医者です。', '/audio/ja/father.mp3', 41, 5, 'Easy'),
(50, '母', 'haha', 'Noun', 'Mẹ, má', '私の母は料理が上手です。', '/audio/ja/mother.mp3', 41, 5, 'Easy'),
(51, '兄', 'ani', 'Noun', 'Anh trai', '私の兄は背が高いです。', '/audio/ja/brother.mp3', 41, 5, 'Easy'),
(52, '姉', 'ane', 'Noun', 'Chị gái', '私の姉は美しいです。', '/audio/ja/sister.mp3', 41, 5, 'Easy'),
(53, '祖父', 'sofu', 'Noun', 'Ông nội', '私の祖父は80歳です。', '/audio/ja/grandfather.mp3', 41, 5, 'Easy'),
(54, '祖母', 'sobo', 'Noun', 'Bà nội', '私の祖母は料理が上手です。', '/audio/ja/grandmother.mp3', 41, 5, 'Easy');

-- Insert Vocabulary Data for Thai Family Topic (TopicID = 51)
INSERT INTO Vocabulary (WordID, Word, Phonetic, Type, Meaning, Example, Audio, TopicID, LanguageID, Difficulty) VALUES
(55, 'พ่อ', 'pho', 'Noun', 'Bố, cha', 'พ่อของฉันเป็นหมอ', '/audio/th/father.mp3', 51, 6, 'Easy'),
(56, 'แม่', 'mae', 'Noun', 'Mẹ, má', 'แม่ของฉันทำอาหารเก่ง', '/audio/th/mother.mp3', 51, 6, 'Easy'),
(57, 'พี่ชาย', 'phi chai', 'Noun', 'Anh trai', 'พี่ชายของฉันสูง', '/audio/th/brother.mp3', 51, 6, 'Easy'),
(58, 'พี่สาว', 'phi sao', 'Noun', 'Chị gái', 'พี่สาวของฉันสวย', '/audio/th/sister.mp3', 51, 6, 'Easy'),
(59, 'ปู่', 'pu', 'Noun', 'Ông nội', 'ปู่ของฉันอายุ 80 ปี', '/audio/th/grandfather.mp3', 51, 6, 'Easy'),
(60, 'ย่า', 'ya', 'Noun', 'Bà nội', 'ย่าของฉันทำอาหารเก่ง', '/audio/th/grandmother.mp3', 51, 6, 'Easy');

-- Update VocabularyCount for all topics
UPDATE Topics SET VocabularyCount = (
    SELECT COUNT(*) FROM Vocabulary WHERE Vocabulary.TopicID = Topics.TopicID
);
