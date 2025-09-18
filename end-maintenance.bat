@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion

REM 無障礙廁所GO V2 - 結束維護模式

echo.
echo 🔧 無障礙廁所GO V2 - 結束維護模式
echo ================================================
echo.

REM 檢查是否在維護模式
if not exist "maintenance-status.json" (
    echo ⚠️  系統目前不在維護模式
    echo.
    pause
    exit /b 0
)

for /f "usebackq tokens=2 delims=:" %%a in (`findstr /c:"\"maintenance\":" maintenance-status.json`) do (
    set status=%%a
    set status=!status: =!
    set status=!status:,=!
)

if "!status!"=="false" (
    echo ⚠️  系統目前不在維護模式
    echo.
    pause
    exit /b 0
)

echo 📋 當前維護資訊：
echo.
type maintenance-status.json
echo.

set /p confirm="確認結束維護模式? (Y/n): "
if /i "%confirm%"=="n" (
    echo ❌ 操作已取消
    pause
    exit /b 0
)

echo.
echo 🔧 正在結束維護模式...

REM 更新維護狀態檔案
(
echo {
echo     "maintenance": false,
echo     "message": "系統正常運行",
echo     "startTime": null,
echo     "endTime": "%date% %time%",
echo     "reason": null,
echo     "duration": null,
echo     "contact": null
echo }
) > maintenance-status.json

REM 恢復原始 index.html
if exist "main_index.html" (
    copy "main_index.html" "index.html" >nul
    echo ✅ 已恢復原始 index.html
    
    REM 詢問是否刪除備份檔案
    echo.
    set /p deleteBackup="是否刪除備份檔案 main_index.html? (y/N): "
    if /i "!deleteBackup!"=="y" (
        del "main_index.html" >nul
        echo ✅ 已刪除備份檔案
    )
) else (
    echo ⚠️  找不到備份檔案 main_index.html，請手動檢查 index.html
)

echo ✅ 維護模式已結束
echo.
echo 🌐 網站現在正常運行
echo 📊 維護記錄已儲存在 maintenance-status.json
echo.
echo 🎉 系統已恢復正常服務！
echo.

REM 顯示維護統計
echo 📈 維護統計：
echo   - 結束時間: %date% %time%
echo   - 狀態: 系統正常運行
echo   - 網站: 已恢復服務
echo.

REM 詢問是否開啟網站
set /p openWebsite="是否開啟網站進行測試? (Y/n): "
if /i not "!openWebsite!"=="n" (
    echo 🌐 正在開啟網站...
    start "" "index.html"
)

echo.
echo 按任意鍵退出...
pause >nul
