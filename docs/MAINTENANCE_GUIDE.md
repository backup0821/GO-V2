# 維護模式管理指南

## 概述

本專案提供了多種方式來管理維護模式，包括 GitHub Actions 和本地腳本。

## 方法一：GitHub Actions (推薦)

### 使用步驟

1. **前往 GitHub Actions 頁面**
   - 在您的 GitHub 儲存庫中，點擊 "Actions" 標籤
   - 選擇 "維護模式管理" 工作流程

2. **啟動維護模式**
   - 點擊 "Run workflow" 按鈕
   - 選擇 "start" 操作
   - 輸入維護原因（可選）
   - 點擊 "Run workflow"

3. **結束維護模式**
   - 點擊 "Run workflow" 按鈕
   - 選擇 "end" 操作
   - 點擊 "Run workflow"

### 工作流程說明

- **完整版** (`.github/workflows/maintenance.yml`)
  - 包含詳細的維護資訊設定
  - 自動部署到 GitHub Pages
  - 建立維護記錄
  - 支援更多自訂選項

- **簡化版** (`.github/workflows/maintenance-simple.yml`)
  - 基本維護模式切換
  - 較少的設定選項
  - 適合快速操作

## 方法二：本地腳本

### Windows 批次檔

```bash
# 啟動維護模式
start-maintenance.bat

# 結束維護模式
end-maintenance.bat
```

### 手動操作

1. **啟動維護模式**
   ```bash
   # 修改 maintenance-status.json
   {
     "maintenance": true,
     "message": "系統維護中 - 您的維護原因",
     "startTime": "2024-01-01 12:00:00",
     "endTime": null,
     "reason": "您的維護原因"
   }
   
   # 備份原始 index.html 為 main_index.html
   cp index.html main_index.html
   # 將 maintenance.html 複製為 index.html
   cp maintenance.html index.html
   ```

2. **結束維護模式**
   ```bash
   # 修改 maintenance-status.json
   {
     "maintenance": false,
     "message": "系統正常運行",
     "startTime": null,
     "endTime": "2024-01-01 13:00:00",
     "reason": null
   }
   
   # 恢復原始 index.html
   cp main_index.html index.html
   ```

## 維護狀態檔案格式

`maintenance-status.json` 檔案包含以下欄位：

```json
{
  "maintenance": boolean,        // 是否在維護模式
  "message": string,            // 顯示給使用者的訊息
  "startTime": string|null,     // 維護開始時間
  "endTime": string|null,       // 維護結束時間
  "reason": string|null,        // 維護原因
  "duration": string|null,      // 預估維護時間
  "contact": string|null,       // 聯絡方式
  "triggeredBy": string|null,   // 觸發方式
  "triggeredAt": string|null    // 觸發時間
}
```

## 維護頁面

當系統進入維護模式時，使用者會被重導向到 `maintenance.html` 頁面，該頁面會顯示：

- 維護訊息
- 預估完成時間
- 聯絡方式
- 維護原因

## 自動化部署

如果使用 GitHub Actions，變更會自動：

1. 提交到主分支
2. 觸發 GitHub Pages 部署
3. 更新線上網站

## 注意事項

1. **備份檔案**
   - 系統會自動備份 `index.html` 為 `index.html.backup`
   - 結束維護時會自動恢復

2. **權限設定**
   - 確保 GitHub Actions 有寫入權限
   - 檢查 `GITHUB_TOKEN` 權限

3. **測試**
   - 建議先在測試環境中測試維護模式
   - 確認維護頁面正常顯示

4. **通知**
   - 可以整合 Slack、Discord 等通知服務
   - 在維護開始/結束時發送通知

## 故障排除

### 常見問題

1. **GitHub Actions 執行失敗**
   - 檢查權限設定
   - 確認 `GITHUB_TOKEN` 有效
   - 查看 Actions 日誌

2. **維護頁面無法顯示**
   - 檢查 `maintenance.html` 是否存在
   - 確認重導向設定正確
   - 檢查瀏覽器快取

3. **無法結束維護模式**
   - 檢查 `index.html.backup` 是否存在
   - 手動恢復原始檔案
   - 重新執行結束維護腳本

### 緊急恢復

如果維護模式出現問題，可以手動恢復：

```bash
# 恢復原始 index.html
cp index.html.backup index.html

# 修改維護狀態
echo '{"maintenance": false, "message": "系統正常運行"}' > maintenance-status.json

# 提交變更
git add .
git commit -m "緊急恢復系統"
git push
```

## 最佳實踐

1. **維護前準備**
   - 提前通知使用者
   - 準備維護頁面內容
   - 設定適當的維護時間

2. **維護期間**
   - 監控系統狀態
   - 及時更新維護進度
   - 保持與使用者的溝通

3. **維護後**
   - 確認系統正常運行
   - 更新維護記錄
   - 分析維護過程中的問題

## 進階功能

### 自訂維護頁面

可以修改 `maintenance.html` 來：

- 添加進度條
- 顯示預計完成時間
- 提供聯絡方式
- 添加倒數計時器

### 整合監控

可以整合監控服務來：

- 自動檢測系統問題
- 觸發維護模式
- 發送警報通知

### 多環境支援

可以擴展腳本來支援：

- 開發環境
- 測試環境
- 生產環境

---

如有任何問題，請聯絡開發團隊：
- 電子郵件：makerbackup0821@gmail.com
- GitHub Issues：在儲存庫中建立 Issue
