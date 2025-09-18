@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion

REM 無障礙廁所GO V2 - 啟動維護模式

echo.
echo 🔧 無障礙廁所GO V2 - 啟動維護模式
echo ================================================
echo.

REM 檢查是否已經在維護模式
if exist "maintenance-status.json" (
    for /f "usebackq tokens=2 delims=:" %%a in (`findstr /c:"\"maintenance\":" maintenance-status.json`) do (
        set status=%%a
        set status=!status: =!
        set status=!status:,=!
    )
    
    if "!status!"=="true" (
        echo ⚠️  系統已經在維護模式中
        echo.
        set /p continue="是否要重新設定維護模式? (y/N): "
        if /i not "!continue!"=="y" (
            echo ❌ 操作已取消
            pause
            exit /b 0
        )
    )
)

echo 📝 請輸入維護資訊：
echo.

set /p reason="維護原因 (預設: 系統升級): "
if "%reason%"=="" set reason=系統升級

set /p duration="預估維護時間 (預設: 1小時): "
if "%duration%"=="" set duration=1小時

set /p contact="聯絡方式 (預設: makerbackup0821@gmail.com): "
if "%contact%"=="" set contact=makerbackup0821@gmail.com

echo.
echo 📋 維護設定：
echo   原因: %reason%
echo   時間: %duration%
echo   聯絡: %contact%
echo.

set /p confirm="確認啟動維護模式? (Y/n): "
if /i "%confirm%"=="n" (
    echo ❌ 操作已取消
    pause
    exit /b 0
)

echo.
echo 🔧 正在啟動維護模式...

REM 建立維護狀態檔案
(
echo {
echo     "maintenance": true,
echo     "message": "系統維護中 - %reason%",
echo     "startTime": "%date% %time%",
echo     "endTime": null,
echo     "reason": "%reason%",
echo     "duration": "%duration%",
echo     "contact": "%contact%"
echo }
) > maintenance-status.json

REM 備份原始 index.html 為 main_index.html
if not exist "main_index.html" (
    copy "index.html" "main_index.html" >nul
    echo ✅ 已備份原始 index.html 為 main_index.html
)

REM 將 maintenance.html 複製為 index.html
if exist "maintenance.html" (
    copy "maintenance.html" "index.html" >nul
    echo ✅ 已將維護頁面設為首頁
) else (
    echo ❌ 找不到 maintenance.html 檔案
    pause
    exit /b 1
)

echo ✅ 維護模式已啟動
echo.
echo 📊 維護資訊：
echo   - 開始時間: %date% %time%
echo   - 維護原因: %reason%
echo   - 預估時間: %duration%
echo   - 聯絡方式: %contact%
echo.
echo 🌐 網站現在會顯示維護頁面
echo 📁 原始網站檔案已備份為 main_index.html
echo 🔄 要結束維護模式，請執行 end-maintenance.bat
echo.
echo 按任意鍵退出...
pause >nul
