# GitHub Pages 部署指南

## 🚀 部署步驟

### 1. 建立 GitHub 儲存庫

1. 前往 [GitHub](https://github.com) 並登入
2. 點擊右上角的 "+" 按鈕，選擇 "New repository"
3. 填寫儲存庫資訊：
   - **Repository name**: `無障礙廁所GO-V2` (或您喜歡的名稱)
   - **Description**: `無障礙廁所GO V2 - 為身心障礙人士提供最近公共廁所/無障礙廁所查詢服務`
   - **Visibility**: Public (公開)
   - **Initialize**: 不要勾選任何初始化選項

### 2. 上傳程式碼到 GitHub

```bash
# 初始化 Git（如果還沒有）
git init

# 添加遠端儲存庫（替換為您的儲存庫URL）
git remote add origin https://github.com/YOUR_USERNAME/無障礙廁所GO-V2.git

# 添加所有檔案
git add .

# 提交變更
git commit -m "Initial commit: 無障礙廁所GO V2 專案設定"

# 推送到 GitHub
git push -u origin main
```

### 3. 設定 GitHub Pages

1. 前往儲存庫的 **Settings** 頁面
2. 在左側選單中找到 **Pages**
3. 在 **Source** 選擇 **GitHub Actions**
4. 這樣當我們推送程式碼時，GitHub Actions 會自動建置並部署到 GitHub Pages

### 4. 調整 vite.config.ts 中的 base 路徑

根據您的儲存庫名稱，需要調整 `frontend/vite.config.ts` 中的 base 路徑：

```typescript
// 如果您的儲存庫名稱是 "無障礙廁所GO-V2"
base: process.env.NODE_ENV === 'production' ? '/無障礙廁所GO-V2/' : '/',

// 如果您的儲存庫名稱是 "accessible-toilet-go-v2"
base: process.env.NODE_ENV === 'production' ? '/accessible-toilet-go-v2/' : '/',

// 如果您的儲存庫名稱是其他名稱
base: process.env.NODE_ENV === 'production' ? '/您的儲存庫名稱/' : '/',
```

### 5. 設定 GitHub Actions Secrets

在儲存庫的 **Settings** → **Secrets and variables** → **Actions** 中新增：

```
VITE_GOOGLE_MAPS_API_KEY=your-google-maps-api-key
```

### 6. 推送程式碼觸發部署

```bash
# 修改程式碼後
git add .
git commit -m "Update: 調整GitHub Pages部署設定"
git push origin main
```

## 🔧 部署配置說明

### GitHub Actions 工作流程

我們的 `.github/workflows/ci.yml` 檔案已經配置好自動部署功能：

1. **程式碼檢查** - ESLint 和 Prettier 檢查
2. **測試執行** - 前端和後端測試
3. **無障礙測試** - 自動化無障礙檢測
4. **自動部署** - 部署到 GitHub Pages

### 部署流程

```mermaid
graph LR
    A[推送程式碼] --> B[GitHub Actions 觸發]
    B --> C[安裝依賴]
    C --> D[程式碼檢查]
    D --> E[執行測試]
    E --> F[建置專案]
    F --> G[部署到 GitHub Pages]
    G --> H[網站上線]
```

### 部署後檢查

部署完成後，您可以：

1. **檢查部署狀態**：
   - 前往儲存庫的 **Actions** 頁面
   - 查看最新的工作流程執行狀態

2. **訪問網站**：
   - URL: `https://YOUR_USERNAME.github.io/無障礙廁所GO-V2/`
   - 例如: `https://lkjh-maker.github.io/無障礙廁所GO-V2/`

3. **測試功能**：
   - 搜尋功能是否正常
   - 地圖是否正確載入
   - 無障礙功能是否運作

## 🛠️ 常見問題解決

### 問題 1: 網站載入後顯示空白頁面

**原因**: base 路徑設定錯誤

**解決方案**:
1. 檢查 `vite.config.ts` 中的 base 路徑是否與儲存庫名稱一致
2. 重新建置並推送程式碼

### 問題 2: 地圖無法顯示

**原因**: Google Maps API Key 未設定或無效

**解決方案**:
1. 檢查 GitHub Secrets 中的 `VITE_GOOGLE_MAPS_API_KEY` 是否正確設定
2. 確認 API Key 有啟用 Maps JavaScript API
3. 檢查 API Key 的網域限制設定

### 問題 3: 部署失敗

**原因**: 可能是程式碼錯誤或依賴問題

**解決方案**:
1. 檢查 GitHub Actions 的錯誤日誌
2. 確認所有依賴都已正確安裝
3. 檢查環境變數設定

### 問題 4: 樣式或圖片無法載入

**原因**: 資源路徑問題

**解決方案**:
1. 確認 `vite.config.ts` 中的 base 路徑設定正確
2. 檢查靜態資源的路徑是否正確
3. 重新建置專案

## 📱 自訂網域設定（可選）

如果您有自己的網域，可以設定自訂網域：

1. **在 GitHub Pages 設定中**：
   - 前往儲存庫 **Settings** → **Pages**
   - 在 **Custom domain** 欄位輸入您的網域
   - 點擊 **Save**

2. **設定 DNS 記錄**：
   - 新增 CNAME 記錄指向 `YOUR_USERNAME.github.io`
   - 或新增 A 記錄指向 GitHub Pages 的 IP

3. **等待生效**：
   - DNS 記錄可能需要幾分鐘到幾小時才會生效

## 🔄 自動化部署

每次推送程式碼到 main 分支時，GitHub Actions 會自動：

1. 執行程式碼檢查
2. 執行測試
3. 建置專案
4. 部署到 GitHub Pages

您不需要手動部署，只需要推送程式碼即可！

## 📊 監控和維護

### 監控部署狀態

- **GitHub Actions**: 查看部署狀態和錯誤
- **GitHub Pages**: 查看網站統計和效能
- **瀏覽器開發者工具**: 檢查前端錯誤

### 定期維護

- 更新依賴套件
- 檢查 API 金鑰是否過期
- 監控網站效能
- 收集使用者回饋

## 🆘 技術支援

如果遇到部署問題：

1. **檢查 GitHub Actions 日誌**
2. **查看瀏覽器控制台錯誤**
3. **確認環境變數設定**
4. **聯絡技術支援**: contact@lkjh-maker.com

---

**恭喜！您的無障礙廁所GO V2網站已成功部署到GitHub Pages！** 🎉
