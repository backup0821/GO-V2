# GitHub Actions 維護模式管理

## 🚀 快速開始

### 1. 設定 GitHub Actions

執行設定腳本：
```bash
setup-github-actions.bat
```

或手動建立 `.github/workflows/` 目錄並複製工作流程檔案。

### 2. 推送到 GitHub

```bash
git add .
git commit -m "新增 GitHub Actions 維護模式管理"
git push
```

### 3. 使用維護模式

1. 前往 GitHub 儲存庫的 **Actions** 頁面
2. 選擇 **"維護模式管理"** 工作流程
3. 點擊 **"Run workflow"** 按鈕
4. 選擇操作：
   - **start**: 啟動維護模式
   - **end**: 結束維護模式
5. 輸入維護原因（可選）
6. 點擊 **"Run workflow"** 執行

## 📋 工作流程說明

### 完整版 (maintenance.yml)

**功能：**
- ✅ 啟動/結束維護模式
- ✅ 自動備份和恢復 index.html (備份為 main_index.html)
- ✅ 將 maintenance.html 複製為 index.html
- ✅ 更新 maintenance-status.json
- ✅ 自動部署到 GitHub Pages
- ✅ 建立維護記錄
- ✅ 支援詳細的維護資訊設定

**適用場景：**
- 生產環境維護
- 需要詳細記錄的維護
- 自動化部署需求

### 簡化版 (maintenance-simple.yml)

**功能：**
- ✅ 啟動/結束維護模式
- ✅ 自動備份和恢復 index.html (備份為 main_index.html)
- ✅ 將 maintenance.html 複製為 index.html
- ✅ 更新 maintenance-status.json
- ✅ 基本維護資訊設定

**適用場景：**
- 快速維護切換
- 測試環境
- 簡單的維護需求

## 🔧 使用範例

### 啟動維護模式

1. **GitHub Actions 頁面**
   - 選擇 "維護模式管理"
   - 點擊 "Run workflow"
   - 選擇 "start"
   - 輸入維護原因：`系統升級`
   - 點擊 "Run workflow"

2. **結果**
   - 網站會顯示維護頁面
   - maintenance-status.json 更新為維護狀態
   - 自動部署到 GitHub Pages

### 結束維護模式

1. **GitHub Actions 頁面**
   - 選擇 "維護模式管理"
   - 點擊 "Run workflow"
   - 選擇 "end"
   - 點擊 "Run workflow"

2. **結果**
   - 網站恢復正常運行
   - maintenance-status.json 更新為正常狀態
   - 自動部署到 GitHub Pages

## 📊 維護狀態檔案

`maintenance-status.json` 檔案格式：

```json
{
  "maintenance": true,
  "message": "系統維護中 - 系統升級",
  "startTime": "2024-01-01 12:00:00 UTC",
  "endTime": null,
  "reason": "系統升級",
  "duration": "1小時",
  "contact": "makerbackup0821@gmail.com",
  "triggeredBy": "GitHub Action",
  "triggeredAt": "2024-01-01 12:00:00 UTC"
}
```

## 🔐 權限設定

確保您的 GitHub Token 具有以下權限：

- `contents: write` - 寫入儲存庫內容
- `pages: write` - 部署到 GitHub Pages
- `actions: write` - 執行 Actions

## 🚨 故障排除

### 常見問題

1. **Actions 執行失敗**
   - 檢查權限設定
   - 確認 GITHUB_TOKEN 有效
   - 查看 Actions 日誌

2. **維護頁面無法顯示**
   - 檢查 maintenance.html 是否存在
   - 確認重導向設定正確
   - 檢查瀏覽器快取

3. **無法結束維護模式**
   - 檢查 main_index.html 是否存在
   - 手動恢復原始檔案
   - 重新執行結束維護腳本

### 緊急恢復

如果維護模式出現問題，可以手動恢復：

```bash
# 恢復原始 index.html
cp main_index.html index.html

# 修改維護狀態
echo '{"maintenance": false, "message": "系統正常運行"}' > maintenance-status.json

# 提交變更
git add .
git commit -m "緊急恢復系統"
git push
```

## 📚 相關文檔

- [維護模式管理指南](docs/MAINTENANCE_GUIDE.md)
- [專案開發文檔](dev.md)
- [專案說明](README.md)

## 🤝 貢獻

歡迎提交 Issue 和 Pull Request 來改善維護模式管理功能！

## 📞 支援

如有任何問題，請聯絡：
- 電子郵件：makerbackup0821@gmail.com
- GitHub Issues：在儲存庫中建立 Issue

---

**讓維護變得簡單！** 🔧✨
