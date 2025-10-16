# 🚀 Hướng dẫn Deploy lên Render.com

## Bước 1: Chuẩn bị Repository

### 1.1 Tạo GitHub Repository
```bash
# Khởi tạo git repository
git init
git add .
git commit -m "Initial commit - VIP English Learning Platform"

# Tạo repository trên GitHub và push code
git remote add origin https://github.com/yourusername/vip-english-learning.git
git branch -M main
git push -u origin main
```

### 1.2 Cấu trúc project
```
HocTuVung/
├── frontend/          # React frontend
├── backend/           # PHP backend
├── database/          # Database files
├── Dockerfile         # Main Dockerfile
├── render.yaml        # Render configuration
└── package.json       # Dependencies
```

## Bước 2: Tạo Database trên Render

### 2.1 Tạo PostgreSQL Database
1. Đăng nhập vào [Render.com](https://render.com)
2. Click **"New"** → **"PostgreSQL"**
3. Cấu hình:
   ```
   Name: vip-english-db
   Plan: Free (hoặc Starter $7/tháng)
   Region: Oregon (US West)
   ```
4. Lưu lại thông tin kết nối

### 2.2 Import Database Schema
1. Download file `database/complete_database_backup.sql`
2. Sử dụng pgAdmin hoặc psql để import:
   ```sql
   psql -h your-db-host -U your-user -d your-database -f complete_database_backup.sql
   ```

## Bước 3: Deploy Web Service

### 3.1 Tạo Web Service
1. Click **"New"** → **"Web Service"**
2. Connect GitHub repository
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
Thêm các biến môi trường:
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
3. Lưu lại URL của service

## Bước 4: Cấu hình Domain (Tùy chọn)

### 4.1 Custom Domain
1. Vào service → **"Settings"** → **"Custom Domains"**
2. Thêm domain của bạn
3. Cấu hình DNS records

### 4.2 SSL Certificate
- Render tự động cung cấp SSL certificate
- HTTPS được enable mặc định

## Bước 5: Test Deployment

### 5.1 Kiểm tra API
```bash
# Test backend API
curl https://your-app-name.onrender.com/simple_articles.php

# Test database connection
curl https://your-app-name.onrender.com/complete_api.php/api/languages
```

### 5.2 Kiểm tra Frontend
1. Truy cập: `https://your-app-name.onrender.com`
2. Test các tính năng:
   - Đăng nhập/đăng ký
   - Quản lý từ vựng
   - Đọc tin tức
   - Dịch thuật

## Bước 6: Monitoring và Maintenance

### 6.1 Logs
- Vào service → **"Logs"** để xem logs
- Monitor errors và performance

### 6.2 Database Backup
- Render tự động backup database
- Có thể download backup từ dashboard

### 6.3 Updates
- Push code mới lên GitHub
- Render sẽ tự động redeploy

## Troubleshooting

### Lỗi thường gặp:

#### 1. **Build Failed**
```bash
# Kiểm tra logs
# Thường do thiếu dependencies
```

#### 2. **Database Connection Failed**
```bash
# Kiểm tra environment variables
# Đảm bảo database đã được tạo
```

#### 3. **CORS Errors**
```bash
# Thêm CORS headers vào backend
header('Access-Control-Allow-Origin: *');
```

#### 4. **Frontend Not Loading**
```bash
# Kiểm tra build process
# Đảm bảo dist folder được tạo
```

### Debug Commands:
```bash
# Test API locally
curl http://localhost:8000/simple_articles.php

# Test database
mysql -h your-host -u your-user -p your-database
```

## Chi phí ước tính:

### Free Plan:
- **Web Service**: $0/tháng (có giới hạn)
- **Database**: $0/tháng (có giới hạn)
- **Bandwidth**: 100GB/tháng

### Starter Plan (Khuyến nghị):
- **Web Service**: $7/tháng
- **Database**: $7/tháng
- **Bandwidth**: 1TB/tháng

## Tối ưu hóa:

### 1. **Performance**
- Sử dụng CDN (Cloudflare)
- Enable gzip compression
- Optimize images

### 2. **Security**
- Sử dụng environment variables
- Enable HTTPS
- Regular security updates

### 3. **Monitoring**
- Setup alerts
- Monitor uptime
- Track performance metrics

## Support:

- **Render Documentation**: https://render.com/docs
- **Community Forum**: https://community.render.com
- **Email Support**: support@render.com

---

## 🎉 Chúc mừng!

Nếu làm theo hướng dẫn này, bạn sẽ có một ứng dụng học tiếng Anh hoàn chỉnh chạy trên Render.com!

**URL của bạn sẽ là**: `https://your-app-name.onrender.com`
