@echo off
echo 🚀 VIP English Learning Deployment Script
echo ==========================================

REM Check if git is initialized
if not exist ".git" (
    echo 📁 Initializing Git repository...
    git init
    git add .
    git commit -m "Initial commit - VIP English Learning Platform"
)

REM Check if remote origin exists
git remote get-url origin >nul 2>&1
if errorlevel 1 (
    echo ⚠️  No remote origin found!
    echo Please add your GitHub repository:
    echo git remote add origin https://github.com/yourusername/vip-english-learning.git
    echo.
    echo Then run:
    echo git push -u origin main
    pause
    exit /b 1
)

REM Build frontend
echo 🔨 Building frontend...
cd frontend
call npm install
call npm run build
cd ..

REM Commit changes
echo 📝 Committing changes...
git add .
git commit -m "Deploy to Render.com - %date% %time%"

REM Push to GitHub
echo ⬆️  Pushing to GitHub...
git push origin main

echo.
echo ✅ Deployment preparation complete!
echo.
echo Next steps:
echo 1. Go to https://render.com
echo 2. Create a new PostgreSQL database
echo 3. Create a new Web Service
echo 4. Connect your GitHub repository
echo 5. Use the provided Dockerfile
echo 6. Set environment variables
echo.
echo 📖 See QUICK_DEPLOY.md for detailed instructions
pause
