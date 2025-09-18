@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion

REM 更新備份資料腳本

echo.
echo 📊 更新廁所資料備份
echo ================================================
echo.

echo 🔄 正在更新備份資料...
echo.

REM 檢查 Node.js 是否安裝
node --version >nul 2>&1
if !errorlevel! neq 0 (
    echo ❌ 未安裝 Node.js，請先安裝 Node.js
    echo 下載地址: https://nodejs.org/
    pause
    exit /b 1
)

REM 執行更新腳本
node update-backup-data.js

if !errorlevel! equ 0 (
    echo.
    echo ✅ 備份資料更新完成！
    echo.
    echo 📁 備份檔案位置: data\toilets-backup.json
    echo 🔄 建議定期執行此腳本來更新資料
    echo.
) else (
    echo.
    echo ❌ 備份資料更新失敗
    echo 請檢查網路連線和 API 狀態
    echo.
)

echo 按任意鍵退出...
pause >nul
