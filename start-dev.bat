@echo off
echo Starting SPLE Exam System Development Server...
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Error: Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

REM Check if node_modules exists
if not exist "node_modules" (
    echo Installing dependencies...
    npm install
    if %errorlevel% neq 0 (
        echo Error: Failed to install dependencies
        pause
        exit /b 1
    )
)

REM Check if .env.local exists
if not exist ".env.local" (
    echo Warning: .env.local file not found
    echo Please copy .env.local.example to .env.local and configure Firebase settings
    echo.
)

echo Starting development server...
npm run dev

pause
