#!/bin/bash

# VIP English Learning - Deployment Script
echo "🚀 VIP English Learning Deployment Script"
echo "=========================================="

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "📁 Initializing Git repository..."
    git init
    git add .
    git commit -m "Initial commit - VIP English Learning Platform"
fi

# Check if remote origin exists
if ! git remote get-url origin > /dev/null 2>&1; then
    echo "⚠️  No remote origin found!"
    echo "Please add your GitHub repository:"
    echo "git remote add origin https://github.com/yourusername/vip-english-learning.git"
    echo ""
    echo "Then run:"
    echo "git push -u origin main"
    exit 1
fi

# Build frontend
echo "🔨 Building frontend..."
cd frontend
npm install
npm run build
cd ..

# Commit changes
echo "📝 Committing changes..."
git add .
git commit -m "Deploy to Render.com - $(date)"

# Push to GitHub
echo "⬆️  Pushing to GitHub..."
git push origin main

echo ""
echo "✅ Deployment preparation complete!"
echo ""
echo "Next steps:"
echo "1. Go to https://render.com"
echo "2. Create a new PostgreSQL database"
echo "3. Create a new Web Service"
echo "4. Connect your GitHub repository"
echo "5. Use the provided Dockerfile"
echo "6. Set environment variables"
echo ""
echo "📖 See DEPLOYMENT.md for detailed instructions"
