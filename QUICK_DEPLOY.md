# 🚀 Quick Deploy lên Render.com

## Bước 1: Chuẩn bị GitHub Repository

### 1.1 Tạo repository trên GitHub
1. Đi tới [GitHub.com](https://github.com)
2. Click **"New repository"**
3. Đặt tên: `vip-english-learning`
4. Chọn **Public** hoặc **Private**
5. Click **"Create repository"**

### 1.2 Push code lên GitHub
```bash
# Trong thư mục HocTuVung
git init
git add .
git commit -m "Initial commit - VIP English Learning Platform"
git branch -M main
git remote add origin https://github.com/yourusername/vip-english-learning.git
git push -u origin main
```

## Bước 2: Tạo Database trên Render

### 2.1 Đăng nhập Render
1. Đi tới [Render.com](https://render.com)
2. Đăng ký/đăng nhập bằng GitHub

### 2.2 Tạo PostgreSQL Database
1. Click **"New"** → **"PostgreSQL"**
2. Cấu hình:
   ```
   Name: vip-english-db
   Plan: Free (hoặc Starter $7/tháng)
   Region: Oregon (US West)
   ```
3. Click **"Create Database"**
4. **Lưu lại thông tin kết nối** (sẽ cần cho bước sau)

## Bước 3: Deploy Web Service

### 3.1 Tạo Web Service
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

### 3.2 Environment Variables
Thêm các biến môi trường (lấy từ database đã tạo):
```
NODE_ENV=production
DB_HOST=your-database-host
DB_NAME=vip_english_learning
DB_USER=your-db-user
DB_PASSWORD=your-db-password
```

### 3.3 Deploy
1. Click **"Create Web Service"**
2. Render sẽ tự động build và deploy
3. **Lưu lại URL** của service (ví dụ: `https://vip-english-learning.onrender.com`)

## Bước 4: Import Database

### 4.1 Chuẩn bị database
1. Tải file `database/complete_database_backup.sql`
2. Sử dụng pgAdmin hoặc psql để import:
   ```bash
   psql -h your-db-host -U your-db-user -d your-db-name -f complete_database_backup.sql
   ```

### 4.2 Test database
```bash
# Test connection
curl https://your-app-url.onrender.com/complete_api.php/api/languages
```

## Bước 5: Cấu hình Frontend

### 5.1 Cập nhật API URL
Tạo file `.env` trong thư mục `frontend/`:
```
VITE_API_URL=https://your-app-url.onrender.com
```

### 5.2 Rebuild và redeploy
```bash
# Push changes
git add .
git commit -m "Update API URL for production"
git push origin main
```

## Bước 6: Test Deployment

### 6.1 Kiểm tra các tính năng
1. **Frontend**: `https://your-app-url.onrender.com`
2. **Admin Panel**: `https://your-app-url.onrender.com/admin`
3. **News Admin**: `https://your-app-url.onrender.com/admin-news`
4. **Vocabulary Learning**: `https://your-app-url.onrender.com/vocabulary-learning`

### 6.2 Test API endpoints
```bash
# Test articles
curl https://your-app-url.onrender.com/simple_articles.php

# Test admin API
curl https://your-app-url.onrender.com/complete_api.php/api/languages
```

## Troubleshooting

### Lỗi thường gặp:

#### 1. **Build Failed**
- Kiểm tra logs trên Render dashboard
- Đảm bảo Dockerfile đúng
- Kiểm tra dependencies

#### 2. **Database Connection Failed**
- Kiểm tra environment variables
- Đảm bảo database đã được tạo
- Test connection string

#### 3. **Frontend Not Loading**
- Kiểm tra build process
- Đảm bảo dist folder được tạo
- Kiểm tra Apache configuration

#### 4. **CORS Errors**
- Thêm CORS headers vào backend
- Kiểm tra API endpoints

### Debug Commands:
```bash
# Test API locally
curl http://localhost:8000/simple_articles.php

# Test database connection
psql -h your-host -U your-user -d your-database
```

## Chi phí ước tính:

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

## Tối ưu hóa:

### 1. **Performance**
- Sử dụng CDN (Cloudflare)
- Enable gzip compression
- Optimize images

### 2. **Security**
- Sử dụng environment variables
- Enable HTTPS (tự động)
- Regular security updates

### 3. **Monitoring**
- Setup alerts
- Monitor uptime
- Track performance metrics

## 🎉 Hoàn thành!

Nếu làm theo hướng dẫn này, bạn sẽ có:
- ✅ Website học tiếng Anh hoàn chỉnh
- ✅ Admin panel quản lý
- ✅ Tính năng dịch thuật
- ✅ Database đầy đủ dữ liệu
- ✅ HTTPS tự động
- ✅ Backup tự động

**URL của bạn**: `https://your-app-name.onrender.com`

---

## 📞 Support

- **Render Documentation**: https://render.com/docs
- **Community Forum**: https://community.render.com
- **Email Support**: support@render.com
