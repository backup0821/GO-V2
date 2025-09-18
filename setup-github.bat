@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion

REM 無障礙廁所GO V2 - GitHub 儲存庫初始化腳本

echo 🚀 無障礙廁所GO V2 - GitHub 儲存庫初始化
echo ================================================
echo.

REM 檢查Git是否已安裝
git --version >nul 2>&1
if errorlevel 1 (
    echo ❌ 錯誤: 未安裝Git或Git不在PATH中
    echo 請先安裝Git: https://git-scm.com/downloads
    pause
    exit /b 1
)

echo ✅ Git已安裝
echo.

REM 獲取使用者輸入
set /p GITHUB_USERNAME="請輸入您的GitHub使用者名稱: "
set /p REPO_NAME="請輸入儲存庫名稱 (建議: 無障礙廁所GO-V2): "

if "%REPO_NAME%"=="" set REPO_NAME=無障礙廁所GO-V2

echo.
echo 📋 設定資訊：
echo   使用者名稱: %GITHUB_USERNAME%
echo   儲存庫名稱: %REPO_NAME%
echo   完整URL: https://github.com/%GITHUB_USERNAME%/%REPO_NAME%
echo.

set /p confirm="確認以上設定? (Y/n): "
if /i not "%confirm%"=="y" if not "%confirm%"=="" (
    echo ❌ 設定已取消
    pause
    exit /b 1
)

echo.
echo 🔧 開始初始化Git儲存庫...

REM 初始化Git儲存庫
if not exist ".git" (
    echo 📁 初始化Git儲存庫...
    git init
    if errorlevel 1 (
        echo ❌ Git初始化失敗
        pause
        exit /b 1
    )
) else (
    echo ✅ Git儲存庫已存在
)

REM 設定遠端儲存庫
echo 🔗 設定遠端儲存庫...
git remote remove origin >nul 2>&1
git remote add origin https://github.com/%GITHUB_USERNAME%/%REPO_NAME%.git
if errorlevel 1 (
    echo ❌ 遠端儲存庫設定失敗
    pause
    exit /b 1
)

REM 檢查環境變數檔案
if not exist "frontend\.env" (
    echo 📝 建立環境變數檔案...
    copy "frontend\env.example" "frontend\.env" >nul
    echo ✅ 已建立 frontend\.env 檔案
    echo ⚠️  請編輯 frontend\.env 並設定 VITE_GOOGLE_MAPS_API_KEY
) else (
    echo ✅ 環境變數檔案已存在
)

REM 添加所有檔案
echo 📦 添加檔案到Git...
git add .
if errorlevel 1 (
    echo ❌ 添加檔案失敗
    pause
    exit /b 1
)

REM 提交變更
echo 💾 提交初始變更...
git commit -m "Initial commit: 無障礙廁所GO V2 專案初始化"
if errorlevel 1 (
    echo ❌ 提交失敗
    pause
    exit /b 1
)

echo.
echo 🎉 Git儲存庫初始化完成！
echo.
echo 📋 接下來的步驟：
echo.
echo 1. 在GitHub上建立儲存庫：
echo    - 前往 https://github.com/new
echo    - 儲存庫名稱: %REPO_NAME%
echo    - 描述: 無障礙廁所GO V2 - 為身心障礙人士提供最近公共廁所/無障礙廁所查詢服務
echo    - 設為公開儲存庫
echo    - 不要初始化README、.gitignore或授權
echo.
echo 2. 推送程式碼到GitHub：
echo    git push -u origin main
echo.
echo 3. 設定GitHub Pages：
echo    - 前往儲存庫 Settings → Pages
echo    - Source 選擇 "GitHub Actions"
echo.
echo 4. 設定Secrets：
echo    - 前往 Settings → Secrets and variables → Actions
echo    - 新增 VITE_GOOGLE_MAPS_API_KEY secret
echo.
echo 5. 申請Google Maps API Key：
echo    - 前往 https://console.cloud.google.com/
echo    - 啟用 Maps JavaScript API
echo    - 建立API金鑰
echo.

set /p push_now="是否現在推送到GitHub? (y/N): "
if /i "%push_now%"=="y" (
    echo.
    echo 📤 推送到GitHub...
    git push -u origin main
    
    if errorlevel 1 (
        echo ❌ 推送失敗，請檢查：
        echo    1. GitHub儲存庫是否已建立
        echo    2. 網路連線是否正常
        echo    3. GitHub認證是否正確
        echo.
        echo 您可以稍後手動執行：git push -u origin main
    ) else (
        echo ✅ 推送成功！
        echo.
        echo 🌐 您的網站將在以下位置：
        echo    https://%GITHUB_USERNAME%.github.io/%REPO_NAME%/
        echo.
        echo 📊 監控部署狀態：
        echo    https://github.com/%GITHUB_USERNAME%/%REPO_NAME%/actions
    )
)

echo.
echo 🎊 設定完成！祝您使用愉快！
echo.
pause
