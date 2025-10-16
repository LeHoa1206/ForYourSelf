@echo off
echo ========================================
echo VIP English Learning Platform - Stop
echo ========================================
echo.
echo Stopping Docker containers...
echo.

docker-compose down

echo.
echo All containers stopped successfully!
echo.
pause
