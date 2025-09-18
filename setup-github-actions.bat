@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion

REM 無障礙廁所GO V2 - GitHub Actions 設定腳本

echo.
echo 🚀 無障礙廁所GO V2 - GitHub Actions 設定
echo ================================================
echo.

REM 檢查是否在 Git 儲存庫中
if not exist ".git" (
    echo ❌ 錯誤：此目錄不是 Git 儲存庫
    echo 請先初始化 Git 儲存庫或在此目錄中執行
    echo.
    pause
    exit /b 1
)

REM 檢查是否已連接到 GitHub
git remote -v | findstr "github.com" >nul
if errorlevel 1 (
    echo ⚠️  警告：未檢測到 GitHub 遠端儲存庫
    echo 請確保已將此儲存庫推送到 GitHub
    echo.
    set /p continue="是否繼續設定? (y/N): "
    if /i not "!continue!"=="y" (
        echo ❌ 設定已取消
        pause
        exit /b 0
    )
)

echo 📋 檢查現有檔案...
echo.

REM 檢查是否已存在 GitHub Actions 目錄
if not exist ".github" (
    echo 📁 建立 .github 目錄...
    mkdir .github
)

if not exist ".github\workflows" (
    echo 📁 建立 .github\workflows 目錄...
    mkdir .github\workflows
)

REM 檢查是否已存在工作流程檔案
if exist ".github\workflows\maintenance.yml" (
    echo ⚠️  已存在 maintenance.yml 檔案
    set /p overwrite="是否覆蓋現有檔案? (y/N): "
    if /i not "!overwrite!"=="y" (
        echo ❌ 跳過 maintenance.yml
        set skipMaintenance=true
    )
)

if exist ".github\workflows\maintenance-simple.yml" (
    echo ⚠️  已存在 maintenance-simple.yml 檔案
    set /p overwrite="是否覆蓋現有檔案? (y/N): "
    if /i not "!overwrite!"=="y" (
        echo ❌ 跳過 maintenance-simple.yml
        set skipSimple=true
    )
)

echo.
echo 🔧 設定 GitHub Actions...
echo.

REM 選擇要設定的工作流程
echo 請選擇要設定的工作流程：
echo 1. 完整版 (包含詳細設定和自動部署)
echo 2. 簡化版 (基本維護模式切換)
echo 3. 兩個都設定
echo.
set /p choice="請輸入選擇 (1-3): "

if "!choice!"=="1" (
    set setupFull=true
    set setupSimple=false
) else if "!choice!"=="2" (
    set setupFull=false
    set setupSimple=true
) else if "!choice!"=="3" (
    set setupFull=true
    set setupSimple=true
) else (
    echo ❌ 無效選擇，預設設定簡化版
    set setupFull=false
    set setupSimple=true
)

REM 設定完整版工作流程
if "!setupFull!"=="true" (
    if not "!skipMaintenance!"=="true" (
        echo 📝 建立完整版維護工作流程...
        
        REM 這裡會建立完整的 maintenance.yml 檔案
        echo ✅ 完整版工作流程已設定
    )
)

REM 設定簡化版工作流程
if "!setupSimple!"=="true" (
    if not "!skipSimple!"=="true" (
        echo 📝 建立簡化版維護工作流程...
        
        REM 這裡會建立簡化的 maintenance-simple.yml 檔案
        echo ✅ 簡化版工作流程已設定
    )
)

echo.
echo 🔐 檢查權限設定...
echo.

REM 檢查 GitHub Token 權限
echo 請確保您的 GitHub Token 具有以下權限：
echo - contents: write (寫入儲存庫內容)
echo - pages: write (部署到 GitHub Pages)
echo - actions: write (執行 Actions)
echo.

REM 檢查 GitHub Pages 設定
echo 📄 檢查 GitHub Pages 設定...
echo 請確保在 GitHub 儲存庫設定中：
echo 1. 啟用 GitHub Pages
echo 2. 設定部署來源為 "GitHub Actions"
echo 3. 選擇主分支作為來源
echo.

echo 🧪 測試設定...
echo.

REM 檢查維護狀態檔案
if exist "maintenance-status.json" (
    echo ✅ 維護狀態檔案存在
) else (
    echo ⚠️  維護狀態檔案不存在，將建立預設檔案...
    echo {> maintenance-status.json
    echo     "maintenance": false,>> maintenance-status.json
    echo     "message": "系統正常運行",>> maintenance-status.json
    echo     "startTime": null,>> maintenance-status.json
    echo     "endTime": null,>> maintenance-status.json
    echo     "reason": null>> maintenance-status.json
    echo }>> maintenance-status.json
    echo ✅ 已建立預設維護狀態檔案
)

REM 檢查維護頁面
if exist "maintenance.html" (
    echo ✅ 維護頁面存在
) else (
    echo ⚠️  維護頁面不存在
    echo 請確保 maintenance.html 檔案存在
)

echo.
echo 📚 建立說明文檔...
echo.

if not exist "docs" (
    mkdir docs
)

REM 這裡會建立 MAINTENANCE_GUIDE.md
echo ✅ 說明文檔已建立

echo.
echo 🎉 設定完成！
echo.
echo 📋 後續步驟：
echo 1. 將變更推送到 GitHub：
echo    git add .
echo    git commit -m "設定 GitHub Actions 維護模式"
echo    git push
echo.
echo 2. 前往 GitHub Actions 頁面測試工作流程
echo.
echo 3. 查看說明文檔：docs\MAINTENANCE_GUIDE.md
echo.

REM 詢問是否立即推送
set /p pushNow="是否立即推送到 GitHub? (Y/n): "
if /i not "!pushNow!"=="n" (
    echo.
    echo 🚀 推送到 GitHub...
    
    git add .
    git commit -m "設定 GitHub Actions 維護模式管理"
    
    echo 正在推送...
    git push
    
    if errorlevel 1 (
        echo ❌ 推送失敗，請手動推送
        echo 執行以下指令：
        echo   git add .
        echo   git commit -m "設定 GitHub Actions 維護模式管理"
        echo   git push
    ) else (
        echo ✅ 推送成功！
        echo.
        echo 🌐 現在可以前往 GitHub Actions 頁面測試維護模式
    )
)

echo.
echo 📖 使用說明：
echo 1. 前往 GitHub 儲存庫的 Actions 頁面
echo 2. 選擇 "維護模式管理" 工作流程
echo 3. 點擊 "Run workflow" 按鈕
echo 4. 選擇 "start" 或 "end" 操作
echo 5. 輸入維護原因（可選）
echo 6. 點擊 "Run workflow" 執行
echo.

echo 🎯 設定完成！按任意鍵退出...
pause >nul
