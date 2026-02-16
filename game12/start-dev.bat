@echo off
REM Monolithic Development Startup Script

echo.
echo ================================================
echo  Master Micro-Frontend Shell - Monolithic Mode
echo ================================================
echo.
echo Starting development server...
echo.
echo This will start:
echo   - Angular Shell on port 4200
echo   - All games will be served from Shell assets
echo.
echo Access at: http://localhost:4200
echo.
echo Press Ctrl+C to stop all services
echo.
echo ================================================
echo.

cd /d "%~dp0"
pnpm dev
