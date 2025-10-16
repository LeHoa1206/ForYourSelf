# 🎯 Admin Panel - Hướng dẫn sử dụng

## 📋 Tổng quan
Admin Panel cung cấp đầy đủ chức năng CRUD (Create, Read, Update, Delete) cho:
- **Topics (Chủ đề)**: Quản lý các chủ đề học tập
- **Vocabulary (Từ vựng)**: Quản lý từ vựng đa ngôn ngữ
- **Import Excel**: Import hàng loạt từ file Excel/CSV

## 🚀 Truy cập Admin Panel
```
http://localhost:3000/admin
```

## 🔧 Chức năng chính

### 1. **Quản lý Topics (Chủ đề)**
- ✅ **Xem danh sách**: Tất cả chủ đề với thông tin chi tiết
- ✅ **Thêm mới**: Tạo chủ đề mới với đầy đủ thông tin
- ✅ **Chỉnh sửa**: Cập nhật thông tin chủ đề
- ✅ **Xóa**: Xóa chủ đề (soft delete)
- ✅ **Tìm kiếm**: Tìm kiếm theo tên và mô tả

### 2. **Quản lý Vocabulary (Từ vựng)**
- ✅ **Xem danh sách**: Tất cả từ vựng với thông tin chi tiết
- ✅ **Thêm mới**: Tạo từ vựng mới với đầy đủ thông tin
- ✅ **Chỉnh sửa**: Cập nhật thông tin từ vựng
- ✅ **Xóa**: Xóa từ vựng (soft delete)
- ✅ **Tìm kiếm**: Tìm kiếm theo từ và nghĩa

### 3. **Import Excel/CSV**
- ✅ **Import Topics**: Import hàng loạt chủ đề từ file CSV
- ✅ **Import Vocabulary**: Import hàng loạt từ vựng từ file CSV
- ✅ **Template mẫu**: Tải template mẫu để import
- ✅ **Validation**: Kiểm tra dữ liệu trước khi import

## 📊 Cấu trúc dữ liệu

### Topics (Chủ đề)
```csv
LanguageID,Title,Description,Level,Icon,Color,SortOrder
1,Gia đình,Gia đình và các mối quan hệ,A1,👨‍👩‍👧‍👦,#EF4444,1
2,Family,Family and relationships,A1,👨‍👩‍👧‍👦,#EF4444,1
```

### Vocabulary (Từ vựng)
```csv
Word,Phonetic,Type,Meaning,Example,Audio,TopicID,LanguageID,Difficulty
bố,bo,Noun,Father,Bố tôi là bác sĩ.,/audio/vi/father.mp3,1,1,Easy
father,/ˈfɑːðər/,Noun,Bố cha,My father is a doctor.,/audio/en/father.mp3,6,2,Easy
```

## 🌍 Đa ngôn ngữ hỗ trợ
- **Vietnamese** (Tiếng Việt) - ID: 1
- **English** (English) - ID: 2  
- **Chinese** (中文) - ID: 3
- **Korean** (한국어) - ID: 4
- **Japanese** (日本語) - ID: 5
- **Thai** (ไทย) - ID: 6

## 📁 File template mẫu
- **Topics**: `http://localhost:8000/templates/topics_import_template.csv`
- **Vocabulary**: `http://localhost:8000/templates/vocabulary_import_template.csv`

## 🔗 API Endpoints

### Languages
- `GET /enhanced_api.php/api/languages` - Lấy danh sách ngôn ngữ

### Topics
- `GET /enhanced_api.php/api/topics` - Lấy danh sách chủ đề
- `POST /enhanced_api.php/api/topics/create` - Tạo chủ đề mới
- `POST /enhanced_api.php/api/topics/update` - Cập nhật chủ đề
- `POST /enhanced_api.php/api/topics/delete` - Xóa chủ đề

### Vocabulary
- `GET /enhanced_api.php/api/vocabulary` - Lấy danh sách từ vựng
- `POST /enhanced_api.php/api/vocabulary/create` - Tạo từ vựng mới
- `POST /enhanced_api.php/api/vocabulary/update` - Cập nhật từ vựng
- `POST /enhanced_api.php/api/vocabulary/delete` - Xóa từ vựng

### Import
- `POST /enhanced_api.php/api/import/topics` - Import chủ đề từ CSV
- `POST /enhanced_api.php/api/import/vocabulary` - Import từ vựng từ CSV

## 🎨 Giao diện
- **Theme**: Dark mode với gradient đẹp mắt
- **Responsive**: Tương thích mọi thiết bị
- **Animations**: Hiệu ứng mượt mà với Framer Motion
- **Icons**: Lucide React icons

## 🚨 Lưu ý quan trọng
1. **Encoding**: Tất cả dữ liệu được lưu với UTF-8 encoding
2. **Soft Delete**: Xóa chỉ đánh dấu IsActive = 0, không xóa thật
3. **Validation**: Kiểm tra dữ liệu trước khi lưu
4. **Error Handling**: Xử lý lỗi chi tiết và thông báo rõ ràng

## 🔧 Troubleshooting
- **Lỗi encoding**: Đảm bảo file CSV được lưu với UTF-8
- **Lỗi import**: Kiểm tra format file và header
- **Lỗi API**: Kiểm tra console để xem chi tiết lỗi

## 📈 Tính năng nâng cao
- **Real-time search**: Tìm kiếm real-time
- **Bulk operations**: Thao tác hàng loạt
- **Data validation**: Kiểm tra dữ liệu tự động
- **Error reporting**: Báo cáo lỗi chi tiết
- **Template system**: Hệ thống template mẫu

---
**🎉 Admin Panel hoàn chỉnh với đầy đủ chức năng CRUD và Import Excel!**
