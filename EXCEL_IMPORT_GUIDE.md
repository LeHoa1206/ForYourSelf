# Hướng dẫn Import Excel với Encoding Đúng

## Vấn đề đã được khắc phục:
- ✅ File Excel hiển thị tiếng Việt đúng định dạng
- ✅ Không còn ký tự lạ (mojibake)
- ✅ Template có sẵn dữ liệu mẫu

## Cách sử dụng:

### 1. Tải Template
1. Vào Admin Panel: `http://localhost:3000/admin`
2. Chọn tab "Topics" hoặc "Vocabulary"
3. Click "Download Template" để tải file CSV mẫu

### 2. Mở file CSV trong Excel
1. Mở Excel
2. File → Open → Chọn file CSV vừa tải
3. Chọn "UTF-8" encoding khi import
4. Hoặc mở bằng Notepad++ và Save As với UTF-8 BOM

### 3. Chỉnh sửa dữ liệu
- **Topics**: Điền LanguageID, Title, Description, Level, Icon, Color, SortOrder
- **Vocabulary**: Điền Word, Phonetic, Type, Meaning, Example, Audio, TopicID, LanguageID, Difficulty

### 4. Import vào hệ thống
1. Quay lại Admin Panel
2. Click "Import Excel"
3. Chọn file CSV đã chỉnh sửa
4. Click "Import"

## Format dữ liệu:

### Topics Template:
```
LanguageID,Title,Description,Level,Icon,Color,SortOrder
1,Gia đình,Chủ đề về gia đình,A1,👨‍👩‍👧‍👦,#EF4444,1
2,Family,Family topics,A1,👨‍👩‍👧‍👦,#EF4444,1
```

### Vocabulary Template:
```
Word,Phonetic,Type,Meaning,Example,Audio,TopicID,LanguageID,Difficulty
gia đình,gia đình,noun,family,Tôi yêu gia đình,family.mp3,1,1,Easy
family,fam-uh-lee,noun,gia đình,I love family,family.mp3,1,2,Easy
```

## Lưu ý:
- LanguageID: 1 = Tiếng Việt, 2 = Tiếng Anh
- TopicID: Phải tồn tại trong bảng Topics
- Icon: Sử dụng emoji hoặc ký tự Unicode
- Color: Mã màu hex (#EF4444)
- Difficulty: Easy, Medium, Hard

## Khắc phục lỗi encoding:
1. Nếu Excel vẫn hiển thị ký tự lạ:
   - Mở file bằng Notepad++
   - Encoding → Convert to UTF-8-BOM
   - Save và mở lại Excel

2. Nếu import bị lỗi:
   - Kiểm tra format dữ liệu
   - Đảm bảo LanguageID và TopicID tồn tại
   - Xem log trong browser console
