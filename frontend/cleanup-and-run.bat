@echo off
REM Complete frontend cleanup and rebuild script

cd /d "C:\Users\sruja\OneDrive\Desktop\SmartHMS\frontend"

echo ===== STEP 1: Stopping any npm processes =====
taskkill /F /IM node.exe 2>nul

echo ===== STEP 2: Removing build artifacts =====
if exist "node_modules" rmdir /s /q "node_modules"
if exist ".vite" rmdir /s /q ".vite"
if exist "dist" rmdir /s /q "dist"
if exist "package-lock.json" del "package-lock.json"

echo ===== STEP 3: Clearing npm cache =====
call npm cache clean --force

echo ===== STEP 4: Reinstalling dependencies =====
call npm install

echo ===== STEP 5: Starting dev server =====
call npm run dev

pause
