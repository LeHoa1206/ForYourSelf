# 🇨🇳 Hướng dẫn Import Tiếng Trung HSK1

## 📋 Dữ liệu đã chuẩn bị:

### 1. Topics (Chủ đề) - 10 chủ đề HSK1:
- HSK1 - Gia đình (👨‍👩‍👧‍👦)
- HSK1 - Số đếm (🔢) 
- HSK1 - Màu sắc (🎨)
- HSK1 - Thức ăn (🍕)
- HSK1 - Nhà cửa (🏠)
- HSK1 - Trường học (📚)
- HSK1 - Công việc (💼)
- HSK1 - Giao thông (🚗)
- HSK1 - Thời tiết (☀️)
- HSK1 - Cơ thể (👤)

### 2. Vocabulary (Từ vựng) - 100+ từ HSK1:
- **Số đếm**: 一, 二, 三, 四, 五, 六, 七, 八, 九, 十
- **Gia đình**: 爸爸, 妈妈, 哥哥, 姐姐, 弟弟, 妹妹
- **Đại từ**: 我, 你, 他, 她, 我们, 你们, 他们
- **Động từ cơ bản**: 是, 有, 在, 去, 来, 看, 听, 说, 吃, 喝
- **Tính từ**: 好, 大, 小, 新, 旧, 红, 蓝, 绿, 黄, 黑, 白
- **Thời gian**: 今天, 明天, 昨天, 现在, 早上, 中午, 晚上
- **Trường học**: 学校, 老师, 学生, 朋友, 同学, 书, 笔, 纸
- **Nhà cửa**: 家, 桌子, 椅子, 门, 窗, 房间, 床
- **Thức ăn**: 饭, 水, 茶, 咖啡, 苹果, 香蕉, 面包, 鸡蛋
- **Công việc**: 工作, 医生, 老师, 学生
- **Giao thông**: 车, 公共汽车, 地铁, 飞机, 火车
- **Thời tiết**: 天气, 太阳, 雨, 雪, 风
- **Cơ thể**: 人, 头, 眼睛, 鼻子, 嘴, 手, 脚
- **Hành động**: 买, 卖, 做, 学习, 工作, 睡觉, 起床

## 🚀 Cách import:

### Bước 1: Khởi động hệ thống
```bash
# Khởi động Docker containers
docker-compose up -d

# Kiểm tra containers đang chạy
docker ps
```

### Bước 2: Import dữ liệu
```bash
# Chạy script import
php import_chinese_hsk1.php
```

### Bước 3: Kiểm tra kết quả
1. Vào Admin Panel: `http://localhost:3000/admin`
2. Chọn tab "Topics" → Xem chủ đề tiếng Trung
3. Chọn tab "Vocabulary" → Xem từ vựng HSK1

## 📁 Files đã tạo:

### 1. `templates/chinese_hsk1_topics.csv`
- Template chủ đề tiếng Trung HSK1
- 10 chủ đề với icon và màu sắc

### 2. `templates/chinese_hsk1_vocabulary.csv`  
- Template từ vựng HSK1
- 100+ từ với phiên âm, nghĩa, ví dụ

### 3. `import_chinese_hsk1.php`
- Script import tự động
- Thêm ngôn ngữ tiếng Trung
- Import topics và vocabulary

## 🎯 Tính năng:

### ✅ Đã có:
- **Phát âm**: Phiên âm pinyin cho mỗi từ
- **Loại từ**: noun, verb, adjective, pronoun, time
- **Ví dụ**: Câu ví dụ thực tế
- **Audio**: File âm thanh (có thể thêm sau)
- **Độ khó**: Easy (phù hợp HSK1)
- **Phân loại**: Theo chủ đề rõ ràng

### 🔧 Có thể mở rộng:
- Thêm file audio thực tế
- Tạo bài tập cho từng chủ đề
- Thêm hình ảnh minh họa
- Tạo flashcard
- Thêm HSK2, HSK3...

## 📊 Thống kê dữ liệu:

| Chủ đề | Số từ | Mô tả |
|--------|-------|-------|
| Gia đình | 15+ | Người thân, đại từ |
| Số đếm | 10 | Số từ 1-10 |
| Màu sắc | 6 | Màu cơ bản |
| Thức ăn | 8+ | Đồ ăn, thức uống |
| Nhà cửa | 7+ | Đồ nội thất |
| Trường học | 8+ | Học tập, bạn bè |
| Công việc | 4+ | Nghề nghiệp |
| Giao thông | 5+ | Phương tiện |
| Thời tiết | 5+ | Khí hậu |
| Cơ thể | 7+ | Bộ phận cơ thể |

## 🎉 Kết quả mong đợi:

Sau khi import thành công, bạn sẽ có:
- **10 chủ đề tiếng Trung** với đầy đủ thông tin
- **100+ từ vựng HSK1** với phiên âm và nghĩa
- **Hệ thống học tập** hoàn chỉnh cho tiếng Trung
- **Admin Panel** để quản lý dữ liệu

## ⚠️ Lưu ý:

1. **Đảm bảo Docker chạy** trước khi import
2. **Kiểm tra encoding UTF-8** cho tiếng Trung
3. **Backup database** trước khi import
4. **Test import** với một ít dữ liệu trước

## 🔄 Nếu cần import lại:

```bash
# Xóa dữ liệu cũ (nếu cần)
# Chạy lại script import
php import_chinese_hsk1.php
```

Chúc bạn học tiếng Trung vui vẻ! 🎊
