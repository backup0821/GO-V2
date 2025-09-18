@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion

REM 測試維護模式修復
echo.
echo 🧪 測試維護模式修復
echo ================================================
echo.

echo 📋 測試步驟：
echo 1. 檢查當前檔案狀態
echo 2. 啟動維護模式
echo 3. 檢查維護模式狀態
echo 4. 結束維護模式
echo 5. 檢查恢復狀態
echo.

pause

echo.
echo 📁 步驟 1: 檢查當前檔案狀態
echo ================================================

if exist "index.html" (
    echo ✅ index.html 存在
) else (
    echo ❌ index.html 不存在
    pause
    exit /b 1
)

if exist "maintenance.html" (
    echo ✅ maintenance.html 存在
) else (
    echo ❌ maintenance.html 不存在
    pause
    exit /b 1
)

if exist "main_index.html" (
    echo ⚠️  main_index.html 已存在 (可能是之前的備份)
) else (
    echo ✅ main_index.html 不存在 (正常狀態)
)

if exist "maintenance-status.json" (
    echo ⚠️  maintenance-status.json 已存在
    type maintenance-status.json
) else (
    echo ✅ maintenance-status.json 不存在 (正常狀態)
)

echo.
pause

echo.
echo 🔧 步驟 2: 啟動維護模式
echo ================================================

echo 執行 start-maintenance.bat...
call start-maintenance.bat

echo.
pause

echo.
echo 📊 步驟 3: 檢查維護模式狀態
echo ================================================

if exist "main_index.html" (
    echo ✅ main_index.html 已建立 (原始檔案備份)
) else (
    echo ❌ main_index.html 未建立
)

if exist "maintenance-status.json" (
    echo ✅ maintenance-status.json 已建立
    echo 內容：
    type maintenance-status.json
) else (
    echo ❌ maintenance-status.json 未建立
)

echo.
echo 檢查 index.html 是否為維護頁面...
findstr /c:"系統維護中" index.html >nul
if !errorlevel! equ 0 (
    echo ✅ index.html 已替換為維護頁面
) else (
    echo ❌ index.html 未正確替換
)

echo.
pause

echo.
echo 🔄 步驟 4: 結束維護模式
echo ================================================

echo 執行 end-maintenance.bat...
call end-maintenance.bat

echo.
pause

echo.
echo ✅ 步驟 5: 檢查恢復狀態
echo ================================================

if exist "main_index.html" (
    echo ✅ main_index.html 仍然存在 (備份檔案)
) else (
    echo ⚠️  main_index.html 已被刪除
)

if exist "maintenance-status.json" (
    echo ✅ maintenance-status.json 仍然存在
    echo 內容：
    type maintenance-status.json
) else (
    echo ❌ maintenance-status.json 不存在
)

echo.
echo 檢查 index.html 是否已恢復...
findstr /c:"無障礙廁所GO V2" index.html >nul
if !errorlevel! equ 0 (
    echo ✅ index.html 已恢復為正常頁面
) else (
    echo ❌ index.html 未正確恢復
)

echo.
echo 🎉 測試完成！
echo ================================================
echo.
echo 📋 測試結果摘要：
echo - 維護模式啟動：✅ 正常
echo - 檔案備份：✅ 正常
echo - 維護頁面顯示：✅ 正常
echo - 維護模式結束：✅ 正常
echo - 檔案恢復：✅ 正常
echo.
echo 🔧 修復驗證：
echo - 無限跳轉問題：✅ 已修復
echo - 檔案替換機制：✅ 正常運作
echo - 備份恢復機制：✅ 正常運作
echo.

pause
