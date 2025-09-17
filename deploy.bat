@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion

REM 無障礙廁所GO V2 - GitHub Pages 部署腳本 (Windows版)

echo 🚀 開始部署無障礙廁所GO V2到GitHub Pages...

REM 檢查是否在Git儲存庫中
if not exist ".git" (
    echo ❌ 錯誤: 請在Git儲存庫目錄中執行此腳本
    pause
    exit /b 1
)

REM 檢查是否有未提交的變更
git status --porcelain > temp_status.txt
set /p status_content=<temp_status.txt
del temp_status.txt

if not "%status_content%"=="" (
    echo ⚠️  警告: 發現未提交的變更
    echo 請先提交所有變更：
    echo   git add .
    echo   git commit -m "Your commit message"
    pause
    exit /b 1
)

REM 獲取當前分支
for /f "tokens=*" %%i in ('git branch --show-current') do set CURRENT_BRANCH=%%i
echo 📍 當前分支: %CURRENT_BRANCH%

if not "%CURRENT_BRANCH%"=="main" (
    echo ⚠️  警告: 建議在main分支進行部署
    set /p continue="是否繼續部署? (y/N): "
    if /i not "%continue%"=="y" (
        echo ❌ 部署已取消
        pause
        exit /b 1
    )
)

REM 檢查遠端儲存庫
git remote get-url origin >nul 2>&1
if errorlevel 1 (
    echo ❌ 錯誤: 未設定遠端儲存庫
    echo 請先設定遠端儲存庫：
    echo   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('git remote get-url origin') do set REMOTE_URL=%%i
echo 🔗 遠端儲存庫: %REMOTE_URL%

REM 檢查環境變數檔案
if not exist "frontend\.env" (
    echo ⚠️  警告: 未找到 frontend\.env 檔案
    echo 請先設定環境變數：
    echo   copy frontend\env.example frontend\.env
    echo   # 編輯 frontend\.env 並設定 VITE_GOOGLE_MAPS_API_KEY
    set /p continue="是否繼續部署? (y/N): "
    if /i not "%continue%"=="y" (
        echo ❌ 部署已取消
        pause
        exit /b 1
    )
)

echo 🔍 檢查GitHub Pages設定...
echo 請確保已設定GitHub Pages：
echo   1. 前往儲存庫 Settings → Pages
echo   2. Source 選擇 'GitHub Actions'
echo   3. 設定 VITE_GOOGLE_MAPS_API_KEY secret

REM 推送程式碼到GitHub
echo 📤 推送程式碼到GitHub...
git push origin %CURRENT_BRANCH%

if errorlevel 1 (
    echo ❌ 推送失敗，請檢查網路連線和權限設定
    pause
    exit /b 1
) else (
    echo ✅ 程式碼推送成功！
    echo.
    echo 🎉 部署流程已啟動：
    echo   1. GitHub Actions 會自動開始建置
    echo   2. 建置完成後會自動部署到 GitHub Pages
    echo   3. 部署完成後可訪問您的網站
    echo.
    echo 📊 監控部署狀態：
    echo   - 前往儲存庫的 Actions 頁面查看進度
    echo.
    echo 🌐 網站URL（部署完成後）：
    echo   請查看您的GitHub Pages設定頁面獲取URL
    echo.
    echo 按任意鍵退出...
    pause >nul
)
