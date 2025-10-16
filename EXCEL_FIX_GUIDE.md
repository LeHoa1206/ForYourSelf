# 🔧 Hướng dẫn khắc phục lỗi encoding Excel

## Vấn đề:
- File CSV tải về bị lỗi encoding tiếng Việt
- Excel hiển thị ký tự lạ thay vì tiếng Việt
- Template không đúng định dạng

## ✅ Giải pháp:

### Cách 1: Sử dụng template có sẵn (Khuyến nghị)
1. Vào Admin Panel: `http://localhost:3000/admin`
2. Chọn tab "Topics" hoặc "Vocabulary"  
3. Click "Download Template"
4. **Mở file CSV bằng Notepad++** (không dùng Excel trực tiếp)
5. Trong Notepad++: Encoding → Convert to UTF-8-BOM
6. Save file
7. Mở file bằng Excel → File → Open → Chọn file CSV → Chọn "UTF-8" encoding

### Cách 2: Tạo file Excel mới
1. Mở Excel
2. Tạo bảng mới với các cột:
   - **Topics**: LanguageID, Title, Description, Level, Icon, Color, SortOrder
   - **Vocabulary**: Word, Phonetic, Type, Meaning, Example, Audio, TopicID, LanguageID, Difficulty
3. Nhập dữ liệu tiếng Việt
4. Save As → CSV UTF-8 (Comma delimited) (*.csv)

### Cách 3: Sử dụng Google Sheets
1. Mở Google Sheets
2. Tạo bảng với format như trên
3. Nhập dữ liệu tiếng Việt (sẽ hiển thị đúng)
4. File → Download → Comma-separated values (.csv)

## 📋 Format dữ liệu chuẩn:

### Topics Template:
```
LanguageID | Title | Description | Level | Icon | Color | SortOrder
1 | Gia đình | Chủ đề về gia đình | A1 | 👨‍👩‍👧‍👦 | #EF4444 | 1
2 | Family | Family topics | A1 | 👨‍👩‍👧‍👦 | #EF4444 | 1
```

### Vocabulary Template:
```
Word | Phonetic | Type | Meaning | Example | Audio | TopicID | LanguageID | Difficulty
gia đình | gia đình | noun | family | Tôi yêu gia đình | family.mp3 | 1 | 1 | Easy
family | fam-uh-lee | noun | gia đình | I love family | family.mp3 | 1 | 2 | Easy
```

## 🔍 Kiểm tra encoding:
- Mở file CSV bằng Notepad++
- Xem góc dưới bên phải: "UTF-8" hoặc "UTF-8-BOM"
- Nếu hiển thị "ANSI" → Convert to UTF-8-BOM

## ⚠️ Lưu ý quan trọng:
1. **Luôn dùng UTF-8-BOM** cho file CSV
2. **Không mở trực tiếp bằng Excel** - dùng Notepad++ trước
3. **Kiểm tra LanguageID và TopicID** có tồn tại trong database
4. **Icon sử dụng emoji Unicode** (👨‍👩‍👧‍👦, 🍕, 🏠, 🎨, 🔢)

## 🚀 Test import:
1. Tạo file CSV với format đúng
2. Vào Admin Panel → Import Excel
3. Chọn file → Click Import
4. Kiểm tra kết quả trong bảng dữ liệu

## 📞 Nếu vẫn lỗi:
1. Kiểm tra file log: `docker logs vip-backend`
2. Xem console browser (F12)
3. Đảm bảo Docker containers đang chạy
4. Restart containers: `docker-compose restart`
