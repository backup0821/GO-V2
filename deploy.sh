#!/bin/bash

# 無障礙廁所GO V2 - GitHub Pages 部署腳本

echo "🚀 開始部署無障礙廁所GO V2到GitHub Pages..."

# 檢查是否在Git儲存庫中
if [ ! -d ".git" ]; then
    echo "❌ 錯誤: 請在Git儲存庫目錄中執行此腳本"
    exit 1
fi

# 檢查是否有未提交的變更
if [ -n "$(git status --porcelain)" ]; then
    echo "⚠️  警告: 發現未提交的變更"
    echo "請先提交所有變更："
    echo "  git add ."
    echo "  git commit -m 'Your commit message'"
    exit 1
fi

# 檢查當前分支
CURRENT_BRANCH=$(git branch --show-current)
echo "📍 當前分支: $CURRENT_BRANCH"

if [ "$CURRENT_BRANCH" != "main" ]; then
    echo "⚠️  警告: 建議在main分支進行部署"
    read -p "是否繼續部署? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "❌ 部署已取消"
        exit 1
    fi
fi

# 檢查是否有遠端儲存庫
if ! git remote get-url origin >/dev/null 2>&1; then
    echo "❌ 錯誤: 未設定遠端儲存庫"
    echo "請先設定遠端儲存庫："
    echo "  git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git"
    exit 1
fi

REMOTE_URL=$(git remote get-url origin)
echo "🔗 遠端儲存庫: $REMOTE_URL"

# 檢查環境變數檔案
if [ ! -f "frontend/.env" ]; then
    echo "⚠️  警告: 未找到 frontend/.env 檔案"
    echo "請先設定環境變數："
    echo "  cp frontend/env.example frontend/.env"
    echo "  # 編輯 frontend/.env 並設定 VITE_GOOGLE_MAPS_API_KEY"
    read -p "是否繼續部署? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "❌ 部署已取消"
        exit 1
    fi
fi

# 檢查GitHub Pages設定
echo "🔍 檢查GitHub Pages設定..."
echo "請確保已設定GitHub Pages："
echo "  1. 前往儲存庫 Settings → Pages"
echo "  2. Source 選擇 'GitHub Actions'"
echo "  3. 設定 VITE_GOOGLE_MAPS_API_KEY secret"

# 推送程式碼到GitHub
echo "📤 推送程式碼到GitHub..."
git push origin $CURRENT_BRANCH

if [ $? -eq 0 ]; then
    echo "✅ 程式碼推送成功！"
    echo ""
    echo "🎉 部署流程已啟動："
    echo "  1. GitHub Actions 會自動開始建置"
    echo "  2. 建置完成後會自動部署到 GitHub Pages"
    echo "  3. 部署完成後可訪問您的網站"
    echo ""
    echo "📊 監控部署狀態："
    echo "  - 前往儲存庫的 Actions 頁面查看進度"
    echo "  - 或訪問: https://github.com/$(git remote get-url origin | sed 's/.*github.com[:/]\([^/]*\)\/\([^.]*\).*/\1\/\2/')/actions"
    echo ""
    echo "🌐 網站URL（部署完成後）："
    REPO_NAME=$(basename "$(git remote get-url origin)" .git)
    USERNAME=$(git remote get-url origin | sed 's/.*github.com[:/]\([^/]*\)\/.*/\1/')
    echo "  https://$USERNAME.github.io/$REPO_NAME/"
else
    echo "❌ 推送失敗，請檢查網路連線和權限設定"
    exit 1
fi
