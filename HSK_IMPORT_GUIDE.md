# 🇨🇳 Hướng dẫn Import HSK (1-5) - Tiếng Trung

## 📋 Cấu trúc dữ liệu:

### 5 Chủ đề HSK:
1. **HSK1** - Tất cả từ vựng HSK1 (150 từ) 🇨🇳
2. **HSK2** - Tất cả từ vựng HSK2 (300 từ) 🇨🇳  
3. **HSK3** - Tất cả từ vựng HSK3 (600 từ) 🇨🇳
4. **HSK4** - Tất cả từ vựng HSK4 (1200 từ) 🇨🇳
5. **HSK5** - Tất cả từ vựng HSK5 (2500 từ) 🇨🇳

## 🚀 Cách import:

### Bước 1: Khởi động hệ thống
```bash
# Khởi động Docker containers
docker-compose up -d

# Kiểm tra containers đang chạy
docker ps
```

### Bước 2: Import dữ liệu HSK
```bash
# Chạy script import tất cả HSK levels
php import_hsk_all.php
```

### Bước 3: Kiểm tra kết quả
1. Vào Admin Panel: `http://localhost:3000/admin`
2. Chọn tab "Topics" → Xem 5 chủ đề HSK
3. Chọn tab "Vocabulary" → Xem từ vựng HSK1

## 📁 Files đã tạo:

### 1. `templates/hsk_topics.csv`
- 5 chủ đề HSK (1-5)
- Mỗi chủ đề chứa tất cả từ vựng của level đó

### 2. `templates/hsk1_vocabulary.csv`
- 100+ từ vựng HSK1 cơ bản
- Bao gồm: số đếm, gia đình, đại từ, động từ, tính từ, màu sắc, thời gian, trường học, nhà cửa, thức ăn, công việc, giao thông, thời tiết, cơ thể

### 3. `import_hsk_all.php`
- Script import tự động tất cả HSK levels
- Thêm ngôn ngữ tiếng Trung
- Import topics và vocabulary

## 🎯 Tính năng:

### ✅ Đã có:
- **5 chủ đề HSK** với màu sắc phân biệt
- **100+ từ HSK1** với phiên âm pinyin
- **Ví dụ câu** thực tế cho mỗi từ
- **Phân loại từ loại** rõ ràng
- **Encoding UTF-8** đúng cho tiếng Trung

### 🔧 Có thể mở rộng:
- Thêm từ vựng HSK2-5
- Thêm file audio thực tế
- Tạo bài tập cho từng level
- Thêm hình ảnh minh họa
- Tạo flashcard theo level

## 📊 Thống kê dữ liệu:

| HSK Level | Số từ | Mô tả | Màu sắc |
|-----------|-------|-------|---------|
| HSK1 | 100+ | Từ cơ bản nhất | 🔴 #EF4444 |
| HSK2 | 300 | Từ trung cấp | 🟠 #F59E0B |
| HSK3 | 600 | Từ nâng cao | 🟢 #10B981 |
| HSK4 | 1200 | Từ chuyên sâu | 🔵 #3B82F6 |
| HSK5 | 2500 | Từ chuyên nghiệp | 🟣 #8B5CF6 |

## 🎉 Kết quả mong đợi:

Sau khi import thành công, bạn sẽ có:
- **5 chủ đề HSK** với đầy đủ thông tin
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
php import_hsk_all.php
```

## 📈 Kế hoạch mở rộng:

### HSK2 Vocabulary (300 từ):
- Từ vựng trung cấp
- Ngữ pháp phức tạp hơn
- Tình huống giao tiếp

### HSK3 Vocabulary (600 từ):
- Từ vựng nâng cao
- Văn hóa Trung Quốc
- Kinh doanh

### HSK4 Vocabulary (1200 từ):
- Từ vựng chuyên sâu
- Học thuật
- Nghề nghiệp

### HSK5 Vocabulary (2500 từ):
- Từ vựng chuyên nghiệp
- Nghiên cứu
- Lãnh đạo

Chúc bạn học tiếng Trung thành công! 🎊🇨🇳
