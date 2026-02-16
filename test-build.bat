# Run a full test build to verify everything works
@echo off

echo.
echo ================================================
echo  Testing Monolithic Build
echo ================================================
echo.

cd /d "%~dp0"

echo [1/3] Building all games...
echo.
call pnpm build:games

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ERROR: Game build failed!
    pause
    exit /b 1
)

echo.
echo [2/3] Building Angular Shell...
echo.
call pnpm build:shell

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ERROR: Shell build failed!
    pause
    exit /b 1
)

echo.
echo ================================================
echo  Build Complete!
echo ================================================
echo.
echo Output directory:
echo   angular-shell\dist\angular-shell\browser\
echo.
echo To test locally:
echo   pnpm serve:prod
echo.
echo To deploy:
echo   Upload the browser\ folder to your server
echo.

pause
