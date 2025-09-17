# 無障礙廁所GO V2

![License](https://img.shields.io/badge/license-CC%20BY--NC%204.0-blue.svg)
![Version](https://img.shields.io/badge/version-2.0.0-green.svg)
![Accessibility](https://img.shields.io/badge/accessibility-WCAG%202.1%20AA-green.svg)

為身心障礙人士提供最近公共廁所/無障礙廁所查詢服務的網站應用程式。

## 🌟 特色功能

- **精確定位** - 使用GPS定位技術，快速找到最近的廁所
- **無障礙友善** - 詳細的無障礙設施資訊，讓每個人都能輕鬆使用
- **智慧搜尋** - 支援關鍵字搜尋、篩選條件，快速找到符合需求的廁所
- **安全可靠** - 資料來源於環保署官方API，資訊準確可靠
- **完全無障礙** - 遵循WCAG 2.1 AA級標準，支援各種輔助技術

## 🚀 快速開始

### 環境需求
- 現代瀏覽器 (Chrome 90+, Firefox 88+, Safari 14+, Edge 90+)
- Google Maps API Key

### 安裝步驟

1. **複製專案**
```bash
git clone https://github.com/YOUR_USERNAME/無障礙廁所GO-V2.git
cd 無障礙廁所GO-V2
```

2. **設定 Google Maps API Key**
   - 前往 [Google Cloud Console](https://console.cloud.google.com/)
   - 建立新專案或選擇現有專案
   - 啟用 Maps JavaScript API
   - 建立 API 金鑰
   - 在 `js/config.js` 中設定您的 API Key：
   ```javascript
   MAPS: {
       API_KEY: 'YOUR_GOOGLE_MAPS_API_KEY'
   }
   ```

3. **開啟網站**
   - 直接在瀏覽器中開啟 `index.html`
   - 或使用本地伺服器：
   ```bash
   # 使用 Python
   python -m http.server 8000
   
   # 使用 Node.js
   npx serve .
   
   # 使用 PHP
   php -S localhost:8000
   ```

4. **訪問網站**
   - 開啟瀏覽器訪問 `http://localhost:8000`

## 🌐 GitHub Pages 部署

本專案已配置自動部署到 GitHub Pages：

### 部署步驟

1. **Fork 或 Clone 專案到您的 GitHub 帳號**
2. **設定 GitHub Pages**：
   - 前往儲存庫 Settings → Pages
   - Source 選擇 "GitHub Actions"
3. **設定 Secrets**：
   - 前往 Settings → Secrets and variables → Actions
   - 新增 `VITE_GOOGLE_MAPS_API_KEY` secret
4. **推送程式碼**：
   ```bash
   git push origin main
   ```
5. **自動部署**：
   - GitHub Actions 會自動建置並部署網站
   - 部署完成後可訪問：`https://YOUR_USERNAME.github.io/無障礙廁所GO-V2/`

### Windows 一鍵部署
```cmd
deploy.bat
```

詳細部署說明請參考：[GitHub 部署指南](docs/GITHUB_DEPLOYMENT.md)

## 📁 專案結構

```
無障礙廁所GO V2/
├── index.html              # 主要HTML檔案
├── manifest.json           # PWA清單檔案
├── robots.txt              # 搜尋引擎爬蟲規則
├── sitemap.xml             # 網站地圖
├── css/                    # 樣式檔案
│   ├── styles.css          # 主要樣式
│   ├── accessibility.css   # 無障礙樣式
│   └── responsive.css      # 響應式樣式
├── js/                     # JavaScript檔案
│   ├── config.js           # 配置檔案
│   ├── utils.js            # 工具函數
│   ├── api.js              # API服務
│   ├── map.js              # 地圖服務
│   ├── accessibility.js    # 無障礙功能
│   ├── navigation.js       # 導航功能
│   ├── search.js           # 搜尋功能
│   └── main.js             # 主要應用程式
├── icons/                  # 應用程式圖示
├── docs/                   # 文檔
│   ├── API.md              # API文檔
│   ├── CONTRIBUTING.md     # 貢獻指南
│   ├── GITHUB_SETUP.md     # GitHub設定指南
│   └── GITHUB_DEPLOYMENT.md # 部署指南
├── deploy.bat              # Windows部署腳本
├── setup-github.bat        # GitHub初始化腳本
└── README.md               # 專案說明
```

## 🎨 技術架構

### 前端技術
- **HTML5** - 語意化標記，無障礙支援
- **CSS3** - 響應式設計，CSS變數，動畫效果
- **JavaScript ES6+** - 模組化架構，現代語法
- **Google Maps API** - 地圖顯示和定位功能
- **PWA** - 漸進式網頁應用程式

### 無障礙功能
- **WCAG 2.1 AA級標準** - 完全符合無障礙標準
- **鍵盤導航** - 完整的鍵盤操作支援
- **螢幕閱讀器** - 支援JAWS、NVDA、VoiceOver等
- **高對比模式** - 視覺障礙者友善
- **大字體模式** - 可調整字體大小
- **減少動畫** - 尊重使用者偏好設定

### 資料來源
- **環保署公共廁所API** - 官方資料來源
- **即時更新** - 資料定期更新
- **本地快取** - 提升載入速度

## 🎯 使用方式

### 基本功能
1. **搜尋廁所** - 在首頁輸入關鍵字或點擊「取得我的位置」
2. **篩選結果** - 使用類型、等級等篩選條件
3. **查看詳情** - 點擊廁所卡片查看詳細資訊
4. **導航前往** - 點擊導航按鈕開啟Google Maps導航

### 無障礙功能
1. **鍵盤導航** - 使用Tab鍵導航，Enter鍵確認
2. **螢幕閱讀器** - 支援各種螢幕閱讀器軟體
3. **高對比模式** - 在無障礙設定中啟用
4. **大字體模式** - 調整字體大小至適合的程度

### 快捷鍵
- `Ctrl + /` - 聚焦搜尋框
- `Alt + 1` - 前往首頁
- `Alt + 2` - 前往搜尋頁面
- `Alt + 3` - 前往無障礙設定
- `Alt + 4` - 前往關於我們
- `Alt + A` - 開啟無障礙設定
- `Esc` - 關閉模態框

## 🔧 開發指南

### 本地開發
```bash
# 啟動開發伺服器
python -m http.server 8000

# 或使用其他工具
npx serve .
```

### 程式碼風格
- 使用 ESLint 和 Prettier 保持程式碼一致性
- 遵循語意化HTML標準
- 使用BEM命名規範
- 註解使用繁體中文

### 測試
- 手動測試各種瀏覽器
- 測試無障礙功能
- 測試響應式設計
- 測試離線功能

## 📊 效能優化

- **圖片優化** - 使用WebP格式，延遲載入
- **程式碼分割** - 按需載入JavaScript模組
- **快取策略** - 本地儲存和服務工作者快取
- **壓縮** - Gzip壓縮，最小化CSS/JS
- **CDN** - 使用CDN加速靜態資源

## 🌍 瀏覽器支援

| 瀏覽器 | 最低版本 | 支援狀態 |
|--------|----------|----------|
| Chrome | 90+ | ✅ 完全支援 |
| Firefox | 88+ | ✅ 完全支援 |
| Safari | 14+ | ✅ 完全支援 |
| Edge | 90+ | ✅ 完全支援 |
| IE | - | ❌ 不支援 |

## 📱 行動裝置支援

- **響應式設計** - 適配各種螢幕尺寸
- **觸控優化** - 適合觸控操作的介面
- **PWA支援** - 可安裝到主畫面
- **離線功能** - 基本功能可離線使用

## 🤝 貢獻指南

我們歡迎社群貢獻！請參考 [CONTRIBUTING.md](docs/CONTRIBUTING.md) 了解詳細的貢獻流程。

### 貢獻方式
1. Fork 專案
2. 建立功能分支
3. 提交變更
4. 發起 Pull Request

### 回報問題
- 使用 GitHub Issues 回報問題
- 提供詳細的重現步驟
- 包含瀏覽器和作業系統資訊

## 📄 授權條款

本專案採用 [創用CC 姓名標示-非商業性 4.0 國際授權條款](LICENSE)。

### 授權摘要
- ✅ **分享** - 您可以複製和重新散布素材
- ✅ **修改** - 您可以重新混合、轉換和建立新素材
- ⚠️ **姓名標示** - 您必須提供適當的表彰
- ❌ **非商業性** - 您不得將素材用於商業目的

## 📞 聯絡我們

- **電子郵件**: contact@lkjh-maker.com
- **GitHub**: [lkjh-maker](https://github.com/lkjh-maker)
- **網站**: [lkjh-maker.com](https://lkjh-maker.com)

## 🙏 致謝

- **行政院環境保護署** - 提供公共廁所資料API
- **Google Maps** - 提供地圖服務
- **社群貢獻者** - 感謝所有貢獻者
- **無障礙社群** - 提供寶貴的建議和回饋

## 📈 版本歷史

### v2.0.0 (2024-01-01)
- 🎉 全新設計，純HTML/CSS/JavaScript實作
- ♿ 完全無障礙，符合WCAG 2.1 AA標準
- 📱 響應式設計，支援各種裝置
- 🗺️ 整合Google Maps API
- 🔍 智慧搜尋和篩選功能
- 💾 本地快取和離線支援
- 🎨 現代化UI設計

### v1.0.0 (2023-12-01)
- 🚀 初始版本發布
- 📊 基本廁所查詢功能
- 🗺️ 簡單地圖顯示

---

**無障礙廁所GO V2** - 讓每個人都能輕鬆找到適合的廁所設施 🚽♿
