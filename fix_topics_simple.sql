-- =====================================================
-- FIX TOPICS DATA - SIMPLE VERSION
-- =====================================================
-- File: fix_topics_simple.sql
-- Description: Fix topics data with correct UTF-8 encoding (simple version)
-- =====================================================

USE vip_english_learning;

-- Set charset for the session
SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci;
SET CHARACTER SET utf8mb4;

-- =====================================================
-- 1. FIX VIETNAMESE TOPICS - Sửa chủ đề tiếng Việt
-- =====================================================

-- Update Vietnamese topics with correct characters and icons
UPDATE Topics SET 
    Title = 'Family',
    Description = 'Gia đình và các mối quan hệ',
    Icon = '👨‍👩‍👧‍👦'
WHERE TopicID = 1 AND LanguageID = 1;

UPDATE Topics SET 
    Title = 'Food',
    Description = 'Thức ăn và đồ uống',
    Icon = '🍕'
WHERE TopicID = 2 AND LanguageID = 1;

UPDATE Topics SET 
    Title = 'Home',
    Description = 'Nhà cửa và đồ đạc',
    Icon = '🏠'
WHERE TopicID = 3 AND LanguageID = 1;

UPDATE Topics SET 
    Title = 'Colors',
    Description = 'Màu sắc và hình dạng',
    Icon = '🎨'
WHERE TopicID = 4 AND LanguageID = 1;

UPDATE Topics SET 
    Title = 'Numbers',
    Description = 'Số đếm và thời gian',
    Icon = '🔢'
WHERE TopicID = 5 AND LanguageID = 1;

UPDATE Topics SET 
    Title = 'Body Parts',
    Description = 'Cơ thể và sức khỏe',
    Icon = '👤'
WHERE TopicID = 6 AND LanguageID = 1;

UPDATE Topics SET 
    Title = 'Animals',
    Description = 'Động vật và thiên nhiên',
    Icon = '🐶'
WHERE TopicID = 7 AND LanguageID = 1;

UPDATE Topics SET 
    Title = 'Clothes',
    Description = 'Quần áo và thời trang',
    Icon = '👕'
WHERE TopicID = 8 AND LanguageID = 1;

UPDATE Topics SET 
    Title = 'Weather',
    Description = 'Thời tiết và mùa',
    Icon = '☀️'
WHERE TopicID = 9 AND LanguageID = 1;

UPDATE Topics SET 
    Title = 'Travel',
    Description = 'Du lịch và phương tiện',
    Icon = '✈️'
WHERE TopicID = 10 AND LanguageID = 1;

UPDATE Topics SET 
    Title = 'Music',
    Description = 'Âm nhạc và giải trí',
    Icon = '🎵'
WHERE TopicID = 11 AND LanguageID = 1;

UPDATE Topics SET 
    Title = 'Sports',
    Description = 'Thể thao và hoạt động',
    Icon = '⚽'
WHERE TopicID = 12 AND LanguageID = 1;

UPDATE Topics SET 
    Title = 'Work',
    Description = 'Công việc và nghề nghiệp',
    Icon = '💼'
WHERE TopicID = 13 AND LanguageID = 1;

UPDATE Topics SET 
    Title = 'Education',
    Description = 'Giáo dục và học tập',
    Icon = '🎓'
WHERE TopicID = 14 AND LanguageID = 1;

UPDATE Topics SET 
    Title = 'Technology',
    Description = 'Công nghệ và internet',
    Icon = '💻'
WHERE TopicID = 15 AND LanguageID = 1;

UPDATE Topics SET 
    Title = 'Shopping',
    Description = 'Mua sắm và tiền bạc',
    Icon = '🛒'
WHERE TopicID = 16 AND LanguageID = 1;

UPDATE Topics SET 
    Title = 'Health',
    Description = 'Sức khỏe và y tế',
    Icon = '🏥'
WHERE TopicID = 17 AND LanguageID = 1;

UPDATE Topics SET 
    Title = 'Environment',
    Description = 'Môi trường và bảo vệ',
    Icon = '🌱'
WHERE TopicID = 18 AND LanguageID = 1;

UPDATE Topics SET 
    Title = 'Culture',
    Description = 'Văn hóa và truyền thống',
    Icon = '🏛️'
WHERE TopicID = 19 AND LanguageID = 1;

UPDATE Topics SET 
    Title = 'Business',
    Description = 'Kinh doanh và thương mại',
    Icon = '📊'
WHERE TopicID = 20 AND LanguageID = 1;

UPDATE Topics SET 
    Title = 'Science',
    Description = 'Khoa học và nghiên cứu',
    Icon = '🔬'
WHERE TopicID = 21 AND LanguageID = 1;

UPDATE Topics SET 
    Title = 'Politics',
    Description = 'Chính trị và xã hội',
    Icon = '🏛️'
WHERE TopicID = 22 AND LanguageID = 1;

UPDATE Topics SET 
    Title = 'Philosophy',
    Description = 'Triết học và tư duy',
    Icon = '🤔'
WHERE TopicID = 23 AND LanguageID = 1;

UPDATE Topics SET 
    Title = 'Literature',
    Description = 'Văn học và nghệ thuật',
    Icon = '📚'
WHERE TopicID = 24 AND LanguageID = 1;

-- =====================================================
-- COMPLETION MESSAGE
-- =====================================================

-- ✅ Vietnamese topics fixed with correct encoding!
-- ✅ All titles, descriptions, and icons updated
-- ✅ Ready for frontend display! 🎉
