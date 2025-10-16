# Hướng Dẫn Import Vocabulary từ Excel/CSV

## Cấu trúc File Excel/CSV

File Excel/CSV phải có đầy đủ các cột theo thứ tự sau:

| Cột | Tên Trường | Kiểu Dữ Liệu | Bắt Buộc | Mô Tả |
|-----|------------|--------------|----------|-------|
| 1 | Word | varchar(100) | ✅ | Từ vựng (VD: father, mother) |
| 2 | Meaning | text | ✅ | Nghĩa (VD: cha bố, mẹ) |
| 3 | Phonetic | varchar(100) | ❌ | Phiên âm (VD: /ˈfɑːðər/) |
| 4 | Type | varchar(50) | ❌ | Loại từ (VD: Noun, Verb, Adjective) |
| 5 | Example | text | ❌ | Ví dụ (VD: My father is a doctor.) |
| 6 | Audio | varchar(255) | ❌ | URL audio (VD: https://example.com/audio/father.mp3) |
| 7 | TopicID | int | ✅ | ID của topic (VD: 1, 2, 3) |
| 8 | LanguageID | int | ✅ | ID của ngôn ngữ (VD: 1=English, 2=Vietnamese) |
| 9 | Difficulty | enum | ❌ | Độ khó (Easy, Medium, Hard) - Mặc định: Easy |
| 10 | IsActive | tinyint(1) | ❌ | Trạng thái (1=Hoạt động, 0=Không hoạt động) - Mặc định: 1 |

## Ví Dụ File CSV

```csv
Word,Meaning,Phonetic,Type,Example,Audio,TopicID,LanguageID,Difficulty,IsActive
father,cha bố,/ˈfɑːðər/,Noun,My father is a doctor.,https://example.com/audio/father.mp3,1,1,Easy,1
mother,mẹ,/ˈmʌðər/,Noun,My mother cooks well.,https://example.com/audio/mother.mp3,1,1,Easy,1
brother,anh trai,/ˈbrʌðər/,Noun,My brother is tall.,https://example.com/audio/brother.mp3,1,1,Easy,1
sister,chị gái,/ˈsɪstər/,Noun,My sister is beautiful.,https://example.com/audio/sister.mp3,1,1,Easy,1
apple,táo,/ˈæpəl/,Noun,I eat an apple every day.,https://example.com/audio/apple.mp3,2,1,Easy,1
banana,chuối,/bəˈnɑːnə/,Noun,The banana is yellow.,https://example.com/audio/banana.mp3,2,1,Easy,1
orange,cam,/ˈɔːrɪndʒ/,Noun,Orange juice is healthy.,https://example.com/audio/orange.mp3,2,1,Easy,1
red,đỏ,/red/,Adjective,The red car is fast.,https://example.com/audio/red.mp3,3,1,Easy,1
blue,xanh dương,/bluː/,Adjective,The blue sky is clear.,https://example.com/audio/blue.mp3,3,1,Easy,1
green,xanh lá,/ɡriːn/,Adjective,Green grass is fresh.,https://example.com/audio/green.mp3,3,1,Easy,1
```

## Cách Import

1. **Truy cập Admin Panel**: http://localhost:3000/admin
2. **Chọn tab "Quản lý Vocabulary"**
3. **Nhấn nút "Import từ Excel/CSV"**
4. **Chọn file Excel/CSV** với cấu trúc như trên
5. **Nhấn "Import"** để bắt đầu import
6. **Kiểm tra kết quả** trong bảng Vocabulary

## Lưu Ý Quan Trọng

- **TopicID và LanguageID** phải tồn tại trong database
- **Word** không được trùng lặp trong cùng một topic
- **Difficulty** chỉ chấp nhận: Easy, Medium, Hard
- **IsActive** chỉ chấp nhận: 0 hoặc 1
- **Audio URL** phải là link hợp lệ
- **Phonetic** nên theo chuẩn IPA
- **Example** nên là câu hoàn chỉnh

## Xử Lý Lỗi

- Nếu thiếu trường bắt buộc → Bỏ qua dòng đó
- Nếu TopicID/LanguageID không tồn tại → Bỏ qua dòng đó
- Nếu Difficulty không hợp lệ → Mặc định là Easy
- Nếu IsActive không hợp lệ → Mặc định là 1

## Kết Quả Import

Sau khi import thành công, bạn sẽ thấy:
- Số lượng từ vựng đã import
- Danh sách lỗi (nếu có)
- Từ vựng mới xuất hiện trong bảng Vocabulary
