# 無障礙廁所GO V2 - 開發文檔

## 專案概述

無障礙廁所GO V2 是一個專為身心障礙人士設計的網站應用程式，提供即時查詢最近公共廁所和無障礙廁所的功能。透過地理位置定位和友善的介面設計，讓使用者能夠快速找到符合需求的廁所設施。

## 專案目標

- 提供身心障礙人士友善的廁所查詢服務
- 整合地理位置功能，提供最近距離的廁所資訊
- 建立完善的無障礙設施資料庫
- 設計符合無障礙標準的使用者介面
- 提供多種查詢和篩選功能

## 技術架構

### 前端技術棧
- **框架**: React 18 + TypeScript
- **UI框架**: Material-UI (MUI) - 提供良好的無障礙支援
- **地圖服務**: Google Maps API 或 OpenStreetMap
- **狀態管理**: Redux Toolkit + RTK Query
- **路由**: React Router v6
- **樣式**: Emotion (MUI預設) + CSS-in-JS
- **建置工具**: Vite
- **測試**: Jest + React Testing Library

### 後端技術棧
- **框架**: Node.js + Express.js
- **資料庫**: PostgreSQL + PostGIS (地理空間資料)
- **ORM**: Prisma
- **API**: RESTful API + GraphQL (可選)
- **認證**: JWT + bcrypt
- **快取**: Redis
- **部署**: Docker + PM2

### 開發工具
- **版本控制**: Git
- **程式碼品質**: ESLint + Prettier
- **API測試**: Postman/Insomnia
- **資料庫管理**: pgAdmin
- **監控**: Winston (日誌) + Morgan (HTTP日誌)

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
│   │   ├── utils/           # 工具函數
│   │   ├── types/           # TypeScript型別定義
│   │   └── styles/          # 全域樣式
│   ├── public/              # 靜態資源
│   └── package.json
├── backend/                  # 後端應用程式
│   ├── src/
│   │   ├── controllers/     # 控制器
│   │   ├── models/          # 資料模型
│   │   ├── routes/          # 路由定義
│   │   ├── services/        # 業務邏輯
│   │   ├── middleware/      # 中介軟體
│   │   ├── utils/           # 工具函數
│   │   └── config/          # 設定檔
│   ├── prisma/              # 資料庫schema
│   └── package.json
├── docs/                     # 專案文檔
├── docker/                   # Docker設定
└── README.md
```

## 核心功能規劃

### 1. 地理位置服務
- **GPS定位**: 自動獲取使用者當前位置
- **手動位置輸入**: 支援地址搜尋和地圖點選
- **距離計算**: 計算到各廁所的直線距離和步行距離
- **地圖顯示**: 在地圖上標示廁所位置和路線

### 2. 廁所資料管理
- **基本資訊**: 名稱、地址、開放時間
- **無障礙設施**: 輪椅通道、扶手、緊急按鈕等
- **設施詳情**: 廁所類型、數量、清潔度評分
- **即時狀態**: 是否開放、維修中、排隊狀況

### 3. 搜尋與篩選
- **距離排序**: 按距離遠近排序
- **設施篩選**: 篩選特定無障礙設施
- **評分篩選**: 按使用者評分排序
- **關鍵字搜尋**: 支援名稱和地址搜尋

### 4. 使用者功能
- **評分系統**: 使用者可對廁所進行評分和評論
- **收藏功能**: 收藏常用廁所
- **歷史記錄**: 查看搜尋歷史
- **回報功能**: 回報廁所問題或更新資訊

### 5. 無障礙設計
- **螢幕閱讀器支援**: 完整的ARIA標籤
- **鍵盤導航**: 支援Tab鍵導航
- **高對比模式**: 提供高對比度主題
- **字體大小調整**: 支援字體縮放
- **語音導航**: 整合語音提示功能

## 資料庫設計

### 主要資料表

#### toilets (廁所基本資料)
```sql
- id: UUID (主鍵)
- name: VARCHAR(255) (廁所名稱)
- address: TEXT (地址)
- latitude: DECIMAL(10,8) (緯度)
- longitude: DECIMAL(11,8) (經度)
- type: ENUM('public', 'accessible', 'both') (廁所類型)
- opening_hours: JSON (開放時間)
- created_at: TIMESTAMP
- updated_at: TIMESTAMP
```

#### accessibility_features (無障礙設施)
```sql
- id: UUID (主鍵)
- toilet_id: UUID (外鍵)
- wheelchair_accessible: BOOLEAN (輪椅通道)
- handrails: BOOLEAN (扶手)
- emergency_button: BOOLEAN (緊急按鈕)
- wide_door: BOOLEAN (寬門)
- lower_sink: BOOLEAN (低位洗手台)
- tactile_indicators: BOOLEAN (觸覺指示器)
- audio_announcements: BOOLEAN (語音播報)
- created_at: TIMESTAMP
- updated_at: TIMESTAMP
```

#### reviews (使用者評分)
```sql
- id: UUID (主鍵)
- toilet_id: UUID (外鍵)
- user_id: UUID (外鍵，可為null)
- rating: INTEGER (1-5分)
- comment: TEXT (評論)
- cleanliness: INTEGER (清潔度1-5)
- accessibility_rating: INTEGER (無障礙評分1-5)
- created_at: TIMESTAMP
```

## API設計

### 主要端點

#### 廁所查詢
- `GET /api/toilets/nearby` - 取得附近廁所
  - Query: lat, lng, radius, limit
- `GET /api/toilets/search` - 搜尋廁所
  - Query: keyword, filters
- `GET /api/toilets/:id` - 取得特定廁所詳情

#### 無障礙設施
- `GET /api/accessibility/features` - 取得所有無障礙設施類型
- `GET /api/toilets/:id/features` - 取得特定廁所的無障礙設施

#### 使用者功能
- `POST /api/reviews` - 新增評分評論
- `GET /api/toilets/:id/reviews` - 取得廁所評分評論
- `POST /api/users/favorites` - 新增收藏
- `GET /api/users/favorites` - 取得收藏清單

## 開發階段規劃

### 第一階段 (MVP - 4週)
- [ ] 建立專案基礎架構
- [ ] 實作基本地圖顯示功能
- [ ] 建立廁所資料庫和基本CRUD
- [ ] 實作地理位置定位和距離計算
- [ ] 建立基本的搜尋和篩選功能
- [ ] 實作響應式設計

### 第二階段 (功能完善 - 3週)
- [ ] 實作使用者評分和評論系統
- [ ] 加入無障礙設施詳細資訊
- [ ] 實作收藏和歷史記錄功能
- [ ] 優化搜尋演算法
- [ ] 加入即時狀態更新功能

### 第三階段 (無障礙優化 - 2週)
- [ ] 完善ARIA標籤和無障礙標記
- [ ] 實作鍵盤導航
- [ ] 加入高對比模式
- [ ] 測試螢幕閱讀器相容性
- [ ] 優化觸控和語音操作

### 第四階段 (效能與部署 - 2週)
- [ ] 效能優化和快取策略
- [ ] 實作PWA功能
- [ ] 設定CI/CD流程
- [ ] 部署到生產環境
- [ ] 建立監控和日誌系統

## 無障礙標準遵循

### WCAG 2.1 AA級標準
- **可感知性**: 提供文字替代方案、字幕、對比度
- **可操作性**: 鍵盤可訪問、無癲癇風險
- **可理解性**: 可讀性、可預測性
- **穩健性**: 相容性、輔助技術支援

### 實作重點
- 使用語義化HTML標籤
- 提供完整的ARIA標籤
- 確保鍵盤導航流暢
- 維持適當的色彩對比度
- 支援螢幕閱讀器
- 提供多種輸入方式

## 測試策略

### 前端測試
- **單元測試**: 元件邏輯和工具函數
- **整合測試**: 元件間互動
- **端對端測試**: 完整使用者流程
- **無障礙測試**: 自動化無障礙檢測

### 後端測試
- **單元測試**: 業務邏輯和工具函數
- **整合測試**: API端點和資料庫操作
- **效能測試**: 負載和壓力測試

## 部署與維護

### 部署環境
- **前端**: Vercel/Netlify (CDN加速)
- **後端**: AWS EC2/DigitalOcean
- **資料庫**: AWS RDS PostgreSQL
- **快取**: Redis Cloud
- **監控**: Sentry (錯誤追蹤)

### 維護計劃
- 定期更新廁所資料
- 監控系統效能和錯誤
- 收集使用者回饋並持續改善
- 定期進行無障礙測試
- 備份和災難恢復計劃

## 資料來源與更新

### 初始資料來源
- 政府開放資料平台
- 民間組織提供的無障礙設施資料
- 使用者回報和驗證

### 資料更新機制
- 定期從官方來源同步
- 使用者回報系統
- 志工實地驗證
- 自動化資料品質檢查

## 安全考量

### 資料保護
- HTTPS加密傳輸
- 使用者資料匿名化
- 定期安全更新
- 資料備份策略

### 隱私保護
- 最小化位置資料收集
- 使用者同意機制
- 資料保留政策
- GDPR合規性

## 未來擴展計劃

### 功能擴展
- 多語言支援
- 離線地圖功能
- 社群功能
- 整合交通資訊
- AI推薦系統

### 平台擴展
- 行動應用程式開發
- 智慧手錶支援
- 語音助理整合
- IoT設備整合

---

*此文檔將隨著專案開發進度持續更新*
