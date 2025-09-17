# 無障礙廁所GO V2 - 啟動指南

## 🚀 快速開始

### 1. 安裝依賴
```bash
# 安裝根目錄依賴
npm install

# 安裝前端依賴
cd frontend
npm install
```

### 2. 設定環境變數
```bash
# 複製環境變數範本
cp frontend/env.example frontend/.env

# 編輯環境變數檔案
# 需要設定 Google Maps API Key
```

### 3. 啟動開發伺服器
```bash
# 回到根目錄
cd ..

# 啟動前端開發伺服器
npm run dev:frontend
```

### 4. 開啟瀏覽器
訪問 http://localhost:3000

## 📋 功能特色

### ✅ 已完成功能
- **首頁**: 美觀的歡迎頁面，包含搜尋功能和統計資訊
- **搜尋頁面**: 完整的廁所搜尋和篩選功能
- **地圖整合**: Google Maps 地圖顯示和標記
- **無障礙設定**: 完整的無障礙功能設定頁面
- **響應式設計**: 支援各種裝置尺寸
- **TypeScript**: 完整的型別定義
- **Redux**: 狀態管理
- **Material-UI**: 現代化UI元件

### 🔧 技術特色
- **無障礙設計**: 遵循WCAG 2.1 AA級標準
- **鍵盤導航**: 支援完整的鍵盤操作
- **螢幕閱讀器**: 完整的ARIA標籤支援
- **高對比模式**: 視覺輔助功能
- **大字體模式**: 文字縮放功能
- **語音提示**: 螢幕閱讀器語音支援

## 🗺️ 資料來源

本專案使用環保署的公共廁所API：
- **API URL**: https://data.moenv.gov.tw/api/v2/fac_p_07
- **資料量**: 46,121 筆廁所資料
- **更新頻率**: 即時更新
- **涵蓋範圍**: 全台各縣市

## 🎨 設計特色

### 色彩配置
- **主色調**: 藍色 (#1976d2) - 專業、可信賴
- **輔助色**: 紅色 (#dc004e) - 重要提示
- **成功色**: 綠色 (#4caf50) - 無障礙設施
- **警告色**: 橙色 (#ff9800) - 注意事項
- **錯誤色**: 紅色 (#f44336) - 錯誤訊息

### 無障礙設計
- **高對比模式**: 黑白高對比配色
- **大字體**: 支援125%-200%字體縮放
- **鍵盤導航**: Tab鍵完整導航支援
- **語義化HTML**: 正確的標籤結構
- **ARIA標籤**: 完整的無障礙標記

## 📱 響應式設計

### 斷點設定
- **手機**: < 768px
- **平板**: 768px - 1024px
- **桌面**: > 1024px

### 適配特色
- **彈性網格**: 自動調整佈局
- **觸控友善**: 適合觸控操作
- **字體縮放**: 支援瀏覽器縮放
- **簡化導航**: 行動版簡化選單

## 🔍 搜尋功能

### 搜尋方式
- **關鍵字搜尋**: 廁所名稱、地址、管理單位
- **位置搜尋**: GPS定位附近廁所
- **篩選搜尋**: 類型、等級、設施篩選

### 篩選條件
- **廁所類型**: 男廁、女廁、無障礙廁所、混合廁所
- **等級評分**: 特優級、優級、良級、普通級、不合格
- **設施條件**: 尿布檯、無障礙設施
- **距離範圍**: 100m - 5km

### 排序方式
- **距離排序**: 由近到遠
- **等級排序**: 由高到低
- **名稱排序**: 字母順序

## 🗺️ 地圖功能

### 地圖特色
- **即時定位**: GPS自動定位
- **標記顯示**: 不同類型廁所標記
- **資訊視窗**: 詳細廁所資訊
- **路線規劃**: 導航功能
- **地圖控制**: 縮放、平移、類型切換

### 標記圖例
- 🟢 **綠色**: 無障礙廁所
- 🔵 **藍色**: 特優級廁所
- 🟣 **紫色**: 優級廁所
- 🟠 **橙色**: 良級廁所
- 🟤 **棕色**: 普通級廁所
- 🔴 **紅色**: 不合格廁所

## ♿ 無障礙功能

### 視覺輔助
- **高對比模式**: 提高視覺對比度
- **大字體模式**: 放大文字顯示
- **色彩調整**: 色彩盲友善配色
- **動畫控制**: 減少動畫效果

### 操作輔助
- **鍵盤導航**: 完整鍵盤操作支援
- **語音提示**: 螢幕閱讀器語音
- **焦點指示**: 清楚的焦點標示
- **快捷鍵**: 常用功能快捷鍵

### 輔助技術支援
- **NVDA**: 完全支援
- **JAWS**: 完全支援
- **VoiceOver**: 完全支援
- **TalkBack**: 完全支援
- **Dragon**: 部分支援

## 🚀 GitHub Pages 部署

### 快速部署步驟

1. **建立 GitHub 儲存庫**
   - 前往 GitHub 建立新儲存庫
   - 儲存庫名稱建議：`無障礙廁所GO-V2`

2. **上傳程式碼**
   ```bash
   git init
   git remote add origin https://github.com/YOUR_USERNAME/無障礙廁所GO-V2.git
   git add .
   git commit -m "Initial commit: 無障礙廁所GO V2"
   git push -u origin main
   ```

3. **設定 GitHub Pages**
   - 前往儲存庫 Settings → Pages
   - Source 選擇 "GitHub Actions"

4. **設定 Secrets**
   - 前往 Settings → Secrets and variables → Actions
   - 新增 `VITE_GOOGLE_MAPS_API_KEY` secret

5. **自動部署**
   - 推送程式碼後，GitHub Actions 會自動建置並部署
   - 部署完成後可訪問：`https://YOUR_USERNAME.github.io/無障礙廁所GO-V2/`

### Windows 一鍵部署
```cmd
deploy.bat
```

### 詳細部署指南
請參考：[GitHub 部署指南](docs/GITHUB_DEPLOYMENT.md)

### 環境變數設定
```bash
# 開發環境
VITE_GOOGLE_MAPS_API_KEY=your-development-api-key
VITE_NODE_ENV=development

# 生產環境 (GitHub Actions 自動設定)
VITE_GOOGLE_MAPS_API_KEY=your-production-api-key
VITE_NODE_ENV=production
```

## 📞 技術支援

### 聯絡方式
- **電子郵件**: contact@lkjh-maker.com
- **GitHub**: https://github.com/lkjh-maker/accessible-toilet-go-v2
- **官方網站**: https://lkjh-maker.com

### 回報問題
- **Bug回報**: 使用GitHub Issues
- **功能建議**: 使用GitHub Discussions
- **無障礙問題**: 使用專用Issue範本

## 📄 授權資訊

本專案採用 **創用CC 姓名標示-非商業性 4.0 國際** 授權條款。

### 允許的使用
- ✅ 分享和散布
- ✅ 修改和重混
- ✅ 建立衍生作品

### 使用條件
- 📝 **姓名標示**: 必須註明原作者
- 🚫 **非商業性**: 不得用於商業用途

---

**讓每個人都能輕鬆找到適合的廁所設施！** ♿💙
