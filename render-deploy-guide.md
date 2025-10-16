# 🚀 Hướng dẫn Deploy VIP English Learning lên Render.com

## 📋 Tổng quan

Dự án VIP English Learning bao gồm:
- **Frontend**: React + TypeScript + Tailwind CSS
- **Backend**: PHP 8.2 + MySQL
- **Features**: Quản lý từ vựng, đọc tin tức, dịch thuật, text-to-speech

## 🛠️ Chuẩn bị

### 1. Tạo GitHub Repository

```bash
# Trong thư mục HocTuVung
git init
git add .
git commit -m "Initial commit - VIP English Learning Platform"
git branch -M main
git remote add origin https://github.com/yourusername/vip-english-learning.git
git push -u origin main
```

### 2. Chuẩn bị Files

Các file đã được tạo sẵn:
- ✅ `Dockerfile` - Multi-stage build
- ✅ `render.yaml` - Render configuration
- ✅ `package.json` - Dependencies
- ✅ `frontend/src/config/api.ts` - API configuration

## 🗄️ Bước 1: Tạo Database

### 1.1 Đăng nhập Render
1. Truy cập [Render.com](https://render.com)
2. Đăng ký/đăng nhập bằng GitHub

### 1.2 Tạo PostgreSQL Database
1. Click **"New"** → **"PostgreSQL"**
2. Cấu hình:
   ```
   Name: vip-english-db
   Plan: Free (hoặc Starter $7/tháng)
   Region: Oregon (US West)
   ```
3. Click **"Create Database"**
4. **Lưu lại thông tin kết nối**:
   - Host
   - Database name
   - Username
   - Password
   - Port

## 🌐 Bước 2: Deploy Web Service

### 2.1 Tạo Web Service
1. Click **"New"** → **"Web Service"**
2. Connect GitHub repository: `vip-english-learning`
3. Cấu hình:
   ```
   Name: vip-english-learning
   Environment: Docker
   Region: Oregon (US West)
   Branch: main
   Root Directory: ./
   Dockerfile Path: ./Dockerfile
   ```

### 2.2 Environment Variables
Thêm các biến môi trường (lấy từ database đã tạo):
```
NODE_ENV=production
DB_HOST=your-database-host
DB_NAME=vip_english_learning
DB_USER=your-db-user
DB_PASSWORD=your-db-password
```

### 2.3 Deploy
1. Click **"Create Web Service"**
2. Render sẽ tự động build và deploy
3. **Lưu lại URL** của service

## 📊 Bước 3: Import Database

### 3.1 Chuẩn bị Database Schema
Sử dụng file `database/complete_database_backup.sql` hoặc tạo mới:

```sql
-- Tạo database
CREATE DATABASE vip_english_learning;

-- Tạo tables
CREATE TABLE Languages (
    LanguageID INT PRIMARY KEY AUTO_INCREMENT,
    LanguageName VARCHAR(50) NOT NULL,
    LanguageCode VARCHAR(10) NOT NULL,
    IsActive BOOLEAN DEFAULT TRUE
);

CREATE TABLE Topics (
    TopicID INT PRIMARY KEY AUTO_INCREMENT,
    Title VARCHAR(255) NOT NULL,
    Description TEXT,
    Level VARCHAR(50),
    Icon VARCHAR(100),
    Color VARCHAR(20),
    SortOrder INT DEFAULT 0,
    LanguageID INT,
    IsActive BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (LanguageID) REFERENCES Languages(LanguageID)
);

CREATE TABLE Vocabulary (
    VocabularyID INT PRIMARY KEY AUTO_INCREMENT,
    Word VARCHAR(255) NOT NULL,
    Phonetic VARCHAR(255),
    Type VARCHAR(100),
    Meaning TEXT,
    Example TEXT,
    Audio VARCHAR(255),
    TopicID INT,
    LanguageID INT,
    Difficulty VARCHAR(20),
    IsActive BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (TopicID) REFERENCES Topics(TopicID),
    FOREIGN KEY (LanguageID) REFERENCES Languages(LanguageID)
);

-- Insert sample data
INSERT INTO Languages (LanguageName, LanguageCode) VALUES
('English', 'en'),
('Chinese', 'zh'),
('Japanese', 'ja'),
('Korean', 'ko'),
('Thai', 'th');

INSERT INTO Topics (Title, Description, Level, LanguageID) VALUES
('Basic Vocabulary', 'Basic English words', 'Beginner', 1),
('Business English', 'Business related vocabulary', 'Intermediate', 1);

INSERT INTO Vocabulary (Word, Meaning, TopicID, LanguageID) VALUES
('Hello', 'A greeting', 1, 1),
('World', 'The earth', 1, 1);
```

### 3.2 Import Data
Sử dụng pgAdmin hoặc psql:
```bash
psql -h your-db-host -U your-db-user -d your-db-name -f complete_database_backup.sql
```

## 🔧 Bước 4: Cấu hình Frontend

### 4.1 Cập nhật API URL
Tạo file `.env` trong thư mục `frontend/`:
```
VITE_API_URL=https://your-app-url.onrender.com
```

### 4.2 Rebuild và redeploy
```bash
# Push changes
git add .
git commit -m "Update API URL for production"
git push origin main
```

## ✅ Bước 5: Test Deployment

### 5.1 Kiểm tra các tính năng
1. **Frontend**: `https://your-app-url.onrender.com`
2. **Admin Panel**: `https://your-app-url.onrender.com/admin`
3. **News Admin**: `https://your-app-url.onrender.com/admin-news`
4. **Vocabulary Learning**: `https://your-app-url.onrender.com/vocabulary-learning`

### 5.2 Test API endpoints
```bash
# Test articles
curl https://your-app-url.onrender.com/simple_articles.php

# Test admin API
curl https://your-app-url.onrender.com/complete_api.php/api/languages

# Test translation
curl -X POST https://your-app-url.onrender.com/google_translate_api.php \
  -H "Content-Type: application/json" \
  -d '{"word":"hello","target_language":"zh","source_language":"en"}'
```

## 🐛 Troubleshooting

### Lỗi thường gặp:

#### 1. **Build Failed**
```bash
# Kiểm tra logs trên Render dashboard
# Thường do thiếu dependencies hoặc Dockerfile sai
```

#### 2. **Database Connection Failed**
```bash
# Kiểm tra environment variables
# Đảm bảo database đã được tạo
# Test connection string
```

#### 3. **Frontend Not Loading**
```bash
# Kiểm tra build process
# Đảm bảo dist folder được tạo
# Kiểm tra Apache configuration
```

#### 4. **CORS Errors**
```bash
# Thêm CORS headers vào backend
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
```

### Debug Commands:
```bash
# Test API locally
curl http://localhost:8000/simple_articles.php

# Test database connection
psql -h your-host -U your-user -d your-database

# Test frontend build
cd frontend && npm run build
```

## 💰 Chi phí ước tính:

### Free Plan (Giới hạn):
- **Web Service**: $0/tháng
- **Database**: $0/tháng
- **Bandwidth**: 100GB/tháng
- **Sleep time**: 15 phút không hoạt động

### Starter Plan (Khuyến nghị):
- **Web Service**: $7/tháng
- **Database**: $7/tháng
- **Bandwidth**: 1TB/tháng
- **Always on**: Không sleep

## 🚀 Tối ưu hóa:

### 1. **Performance**
- Sử dụng CDN (Cloudflare)
- Enable gzip compression
- Optimize images
- Cache static assets

### 2. **Security**
- Sử dụng environment variables
- Enable HTTPS (tự động)
- Regular security updates
- Database encryption

### 3. **Monitoring**
- Setup alerts
- Monitor uptime
- Track performance metrics
- Database monitoring

## 🎉 Hoàn thành!

Nếu làm theo hướng dẫn này, bạn sẽ có:
- ✅ Website học tiếng Anh hoàn chỉnh
- ✅ Admin panel quản lý từ vựng và tin tức
- ✅ Tính năng dịch thuật Google Translate
- ✅ Text-to-speech cho nhiều ngôn ngữ
- ✅ Database đầy đủ dữ liệu
- ✅ HTTPS tự động
- ✅ Backup tự động

**URL của bạn**: `https://your-app-name.onrender.com`

---

## 📞 Support

- **Render Documentation**: https://render.com/docs
- **Community Forum**: https://community.render.com
- **Email Support**: support@render.com
- **GitHub Issues**: Tạo issue trên repository
