# 無障礙廁所GO V2

![專案標誌](docs/assets/logo.png)

## 專案簡介

無障礙廁所GO V2 是一個專為身心障礙人士設計的網站應用程式，提供即時查詢最近公共廁所和無障礙廁所的功能。透過地理位置定位和友善的介面設計，讓使用者能夠快速找到符合需求的廁所設施。

## 主要功能

- 🗺️ **地理位置定位**: 自動獲取使用者當前位置，提供最近距離的廁所資訊
- ♿ **無障礙設施查詢**: 詳細顯示輪椅通道、扶手、緊急按鈕等無障礙設施
- 🔍 **智慧搜尋**: 支援地址搜尋、設施篩選、評分排序等多種查詢方式
- ⭐ **評分系統**: 使用者可對廁所進行評分和評論，提供真實使用體驗
- 📱 **響應式設計**: 支援各種裝置，包括手機、平板、桌面電腦
- ♿ **無障礙設計**: 遵循WCAG 2.1 AA級標準，支援螢幕閱讀器和鍵盤導航

## 技術架構

### 前端
- React 18 + TypeScript
- Material-UI (MUI)
- Google Maps API
- Redux Toolkit
- Vite

### 後端
- Node.js + Express.js
- PostgreSQL + PostGIS
- Prisma ORM
- Redis

## 快速開始

### 環境需求
- Node.js 18+
- PostgreSQL 14+
- Redis 6+

### 安裝步驟

1. **複製專案**
```bash
git clone https://github.com/makerbackup0821/GO-V2-main.git
cd GO-V2-main
```

2. **安裝依賴**
```bash
npm run setup
```

3. **設定環境變數**
```bash
# 複製環境變數範本
cp frontend/env.example frontend/.env

# 編輯環境變數檔案，填入Google Maps API金鑰
# 需要申請 Google Maps API Key 並啟用 Maps JavaScript API
```

4. **啟動開發伺服器**
```bash
npm run dev:frontend
```

5. **開啟瀏覽器**
訪問 http://localhost:3000

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
   - 部署完成後可訪問：`https://makerbackup0821.github.io/GO-V2-main/`

詳細部署說明請參考：[GitHub 部署指南](docs/GITHUB_DEPLOYMENT.md)

## 專案結構

```
無障礙廁所GO V2/
├── frontend/                 # 前端應用程式
│   ├── src/
│   │   ├── components/       # 可重用元件
│   │   ├── pages/           # 頁面元件
│   │   ├── hooks/           # 自定義Hooks
│   │   ├── services/        # API服務
│   │   ├── store/           # Redux狀態管理
│   │   └── utils/           # 工具函數
│   └── package.json
├── backend/                  # 後端應用程式
│   ├── src/
│   │   ├── controllers/     # 控制器
│   │   ├── models/          # 資料模型
│   │   ├── routes/          # 路由定義
│   │   └── services/        # 業務邏輯
│   └── package.json
├── docs/                     # 專案文檔
├── dev.md                    # 主要開發文檔
└── README.md
```

## 開發指南

詳細的開發文檔請參考 [dev.md](dev.md)

### 開發指令

```bash
# 啟動開發環境
npm run dev

# 執行測試
npm run test

# 程式碼檢查
npm run lint

# 建置專案
npm run build
```

## 無障礙功能

本專案特別注重無障礙設計，包含以下功能：

- **螢幕閱讀器支援**: 完整的ARIA標籤和語義化HTML
- **鍵盤導航**: 支援Tab鍵和方向鍵導航
- **高對比模式**: 提供高對比度主題選項
- **字體縮放**: 支援瀏覽器字體縮放功能
- **語音提示**: 整合語音導航功能

## 貢獻指南

我們歡迎所有形式的貢獻！請參考 [CONTRIBUTING.md](docs/CONTRIBUTING.md) 了解詳細的貢獻指南。

### 如何貢獻

1. Fork 本專案
2. 建立您的功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交您的變更 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 開啟一個 Pull Request

## 授權條款

本專案採用創用 CC 姓名標示-非商業性 4.0 國際 授權條款 - 詳見 [LICENSE](LICENSE) 檔案

您可自由：
- 分享 — 以任何媒介或格式重製及散布本素材
- 修改 — 重混、轉換本素材、及依本素材建立新素材

惟須遵守下列條件：
- 姓名標示 — 您必須給予適當表彰、提供指向本授權條款的連結
- 非商業性 — 您不得將本素材用於商業目的

## 聯絡我們

- **專案維護者**: MAKER BACKUP
- **電子郵件**: makerbackup0821@gmail.com

## 致謝

感謝所有為無障礙環境努力的開發者和志工！

## 更新日誌

### v2.0.0 (開發中)
- 重新設計使用者介面
- 優化無障礙功能
- 新增評分和評論系統
- 改善搜尋和篩選功能

### v1.0.0
- 初始版本發布
- 基本地圖和搜尋功能
- 無障礙廁所資料庫

---

**讓每個人都能輕鬆找到適合的廁所設施！** ♿💙
