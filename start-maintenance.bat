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

set /p contact="聯絡方式 (預設: contact@lkjh-maker.com): "
if "%contact%"=="" set contact=contact@lkjh-maker.com

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

REM 備份原始 index.html
if not exist "index.html.backup" (
    copy "index.html" "index.html.backup" >nul
    echo ✅ 已備份原始 index.html
)

REM 建立重導向到維護頁面的 index.html
(
echo ^<!DOCTYPE html^>
echo ^<html lang="zh-TW"^>
echo ^<head^>
echo     ^<meta charset="UTF-8"^>
echo     ^<meta name="viewport" content="width=device-width, initial-scale=1.0"^>
echo     ^<title^>系統維護中 - 無障礙廁所GO V2^</title^>
echo     ^<meta http-equiv="refresh" content="0; url=maintenance.html"^>
echo ^</head^>
echo ^<body^>
echo     ^<script^>
echo         window.location.href = 'maintenance.html';
echo     ^</script^>
echo ^</body^>
echo ^</html^>
) > index.html

echo ✅ 維護模式已啟動
echo.
echo 📊 維護資訊：
echo   - 開始時間: %date% %time%
echo   - 維護原因: %reason%
echo   - 預估時間: %duration%
echo   - 聯絡方式: %contact%
echo.
echo 🌐 網站現在會顯示維護頁面
echo 🔄 要結束維護模式，請執行 end-maintenance.bat
echo.
echo 按任意鍵退出...
pause >nul
