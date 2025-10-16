# VIP English Learning Platform

## Overview
A modern English learning platform built with React frontend and PHP backend, featuring video-based learning with interactive subtitles and vocabulary.

## Technology Stack
- **Frontend**: React 18, TypeScript, Tailwind CSS, Vite
- **Backend**: PHP 8.2, MySQL 8.0
- **Containerization**: Docker & Docker Compose
- **Cache**: Redis

## Features
- 🎥 Video-based English learning
- 📝 Interactive bilingual subtitles
- 📚 Vocabulary learning with definitions
- 🎯 Difficulty-based content filtering
- 📱 Responsive design
- ⚡ Real-time subtitle synchronization

## Quick Start

### Prerequisites
- Docker and Docker Compose installed
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd HocTuVung
   ```

2. **Start the application**
   ```bash
   docker-compose up -d --build
   ```

3. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000
   - MySQL: localhost:3306
   - Redis: localhost:6379

### Default Credentials
- **Admin Email**: admin@vipenglish.com
- **Admin Password**: password

## Project Structure

```
HocTuVung/
├── backend/                 # PHP Backend
│   ├── index.php           # Main API endpoint
│   └── Dockerfile          # Backend container
├── frontend/               # React Frontend
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── pages/         # Page components
│   │   └── services/      # API services
│   └── Dockerfile         # Frontend container
├── database/
│   └── init/
│       └── schema.sql      # Database schema
└── docker-compose.yml     # Docker orchestration
```

## API Endpoints

### Videos
- `GET /api/videos` - Get all videos
- `GET /api/videos/subtitles?video_id={id}` - Get video subtitles
- `GET /api/videos/vocabulary?video_id={id}` - Get video vocabulary

## Development

### Backend Development
The backend uses pure PHP with PDO for database operations. No framework dependencies.

### Frontend Development
The frontend uses React with TypeScript and Tailwind CSS for styling.

### Database Schema
The database includes tables for:
- `users` - User management
- `videos` - Video content
- `video_subtitles` - Bilingual subtitles
- `video_vocabulary` - Word definitions
- `video_exercises` - Learning exercises

## Contributing
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License
This project is licensed under the MIT License.
