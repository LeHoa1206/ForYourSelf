# 🚀 Deploy với MySQL trên Render.com

## 📋 Hướng dẫn Deploy với MySQL

### Bước 1: Tạo MySQL Database trên Render

#### 1.1 Tạo Database
1. Đăng nhập [Render.com](https://render.com)
2. Click **"New"** → **"MySQL"** (nếu có) hoặc **"PostgreSQL"** → **"Custom"**
3. Cấu hình:
   ```
   Name: vip-english-db
   Plan: Free (hoặc Starter $7/tháng)
   Region: Oregon (US West)
   ```

#### 1.2 Lưu thông tin kết nối
```
DB_HOST=your-mysql-host
DB_NAME=vip_english_learning
DB_USER=your-username
DB_PASSWORD=your-password
DB_PORT=3306
```

### Bước 2: Deploy Web Service

#### 2.1 Cấu hình Service
```
Name: vip-english-learning
Environment: Docker
Region: Oregon (US West)
Branch: main
Root Directory: ./
Dockerfile Path: ./Dockerfile
```

#### 2.2 Environment Variables
```
NODE_ENV=production
DB_HOST=your-mysql-host
DB_NAME=vip_english_learning
DB_USER=your-username
DB_PASSWORD=your-password
```

### Bước 3: Import Database

#### 3.1 Sử dụng MySQL Workbench
1. Tải MySQL Workbench từ [mysql.com](https://www.mysql.com/products/workbench/)
2. Tạo connection mới với thông tin database
3. Chạy file `database/init.sql`

#### 3.2 Hoặc sử dụng command line
```bash
mysql -h your-host -u your-username -p vip_english_learning < database/init.sql
```

### Bước 4: Test Deployment

#### 4.1 Kiểm tra API
```bash
# Test articles
curl https://your-app-url.onrender.com/simple_articles.php

# Test admin API
curl https://your-app-url.onrender.com/complete_api.php/api/languages
```

#### 4.2 Kiểm tra Frontend
- Frontend: `https://your-app-url.onrender.com`
- Admin Panel: `https://your-app-url.onrender.com/admin`
- News Admin: `https://your-app-url.onrender.com/admin-news`

## 🔧 Troubleshooting

### Lỗi thường gặp:

#### 1. **Database Connection Failed**
```bash
# Kiểm tra environment variables
# Đảm bảo database đã được tạo
# Test connection string
```

#### 2. **Build Failed**
```bash
# Kiểm tra logs trên Render dashboard
# Đảm bảo Dockerfile đúng
# Kiểm tra dependencies
```

#### 3. **CORS Errors**
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
mysql -h your-host -u your-username -p your-database

# Test frontend build
cd frontend && npm run build
```

## 💰 Chi phí ước tính:

### Free Plan:
- **Web Service**: $0/tháng
- **Database**: $0/tháng
- **Bandwidth**: 100GB/tháng
- **Sleep time**: 15 phút không hoạt động

### Starter Plan (Khuyến nghị):
- **Web Service**: $7/tháng
- **Database**: $7/tháng
- **Bandwidth**: 1TB/tháng
- **Always on**: Không sleep

## 🎉 Hoàn thành!

Nếu làm theo hướng dẫn này, bạn sẽ có:
- ✅ Website học tiếng Anh hoàn chỉnh
- ✅ Admin panel quản lý từ vựng và tin tức
- ✅ Tính năng dịch thuật Google Translate
- ✅ Text-to-speech cho nhiều ngôn ngữ
- ✅ MySQL database đầy đủ dữ liệu
- ✅ HTTPS tự động
- ✅ Backup tự động

**URL của bạn**: `https://your-app-name.onrender.com`
