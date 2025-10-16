@echo off
echo ========================================
echo VIP English Learning Platform
echo ========================================
echo.
echo Starting Docker containers...
echo.

docker-compose up -d

echo.
echo ========================================
echo Application Status:
echo ========================================
echo Frontend: http://localhost:3000
echo Backend API: http://localhost:8000
echo MySQL: localhost:3307
echo Redis: localhost:6379
echo.
echo Default Admin Credentials:
echo Email: admin@vipenglish.com
echo Password: password
echo.
echo ========================================
echo.

docker ps

echo.
echo Press any key to exit...
pause > nul
