# 貢獻指南

感謝您對無障礙廁所GO V2專案的關注！我們歡迎所有形式的貢獻，無論是程式碼、文檔、測試、回報問題或提出建議。

## 如何貢獻

### 1. 回報問題

如果您發現了bug或有功能建議，請：

1. 檢查 [Issues](https://github.com/lkjh-maker/accessible-toilet-go-v2/issues) 是否已有相同問題
2. 建立新的Issue，並包含：
   - 清楚的問題描述
   - 重現步驟
   - 預期行為與實際行為
   - 環境資訊（瀏覽器、作業系統等）
   - 相關截圖或錯誤訊息

### 2. 程式碼貢獻

#### 設定開發環境

1. **Fork專案**
   ```bash
   # 在GitHub上fork專案，然後複製到本地
   git clone https://github.com/YOUR_USERNAME/accessible-toilet-go-v2.git
   cd accessible-toilet-go-v2
   ```

2. **安裝依賴**
   ```bash
   npm run setup
   ```

3. **建立分支**
   ```bash
   git checkout -b feature/your-feature-name
   # 或
   git checkout -b bugfix/your-bugfix-name
   ```

4. **啟動開發環境**
   ```bash
   npm run dev
   ```

#### 程式碼規範

- **TypeScript**: 使用TypeScript進行開發
- **程式碼風格**: 使用Prettier和ESLint進行格式化
- **命名規範**: 使用camelCase（變數、函數）、PascalCase（元件、類別）
- **註解**: 為複雜邏輯添加清楚的註解
- **測試**: 新增功能時請同時撰寫測試

#### 無障礙開發規範

由於這是無障礙相關專案，請特別注意：

- **語義化HTML**: 使用適當的HTML標籤
- **ARIA標籤**: 為互動元素添加ARIA屬性
- **鍵盤導航**: 確保所有功能都可以透過鍵盤操作
- **色彩對比**: 維持適當的色彩對比度
- **螢幕閱讀器**: 測試螢幕閱讀器相容性

#### 提交程式碼

1. **檢查程式碼**
   ```bash
   npm run lint
   npm run test
   ```

2. **提交變更**
   ```bash
   git add .
   git commit -m "feat: 新增無障礙設施篩選功能"
   ```

3. **推送分支**
   ```bash
   git push origin feature/your-feature-name
   ```

4. **建立Pull Request**
   - 在GitHub上建立Pull Request
   - 填寫詳細的PR描述
   - 連結相關的Issue
   - 請求code review

### 3. 文檔貢獻

- 修正文檔中的錯誤
- 新增使用說明
- 改善文檔結構和可讀性
- 翻譯文檔到其他語言

### 4. 測試貢獻

- 撰寫單元測試
- 進行整合測試
- 無障礙功能測試
- 效能測試

## 開發流程

### 分支策略

- `main`: 主要分支，包含穩定的發布版本
- `develop`: 開發分支，整合新功能
- `feature/*`: 功能開發分支
- `bugfix/*`: 錯誤修正分支
- `hotfix/*`: 緊急修正分支

### 提交訊息規範

使用 [Conventional Commits](https://www.conventionalcommits.org/) 格式：

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

**類型 (type)**:
- `feat`: 新功能
- `fix`: 錯誤修正
- `docs`: 文檔變更
- `style`: 程式碼格式變更
- `refactor`: 程式碼重構
- `test`: 測試相關變更
- `chore`: 建置過程或輔助工具的變更

**範例**:
```
feat(map): 新增地圖縮放功能

新增了地圖的縮放控制，使用者可以透過滑鼠滾輪或按鈕進行縮放操作。
同時改善了觸控裝置的縮放體驗。

Closes #123
```

## 程式碼審查

所有程式碼變更都需要經過審查：

### 審查重點

1. **功能正確性**: 程式碼是否正確實現預期功能
2. **無障礙性**: 是否符合無障礙標準
3. **程式碼品質**: 是否遵循編碼規範
4. **效能**: 是否影響應用程式效能
5. **安全性**: 是否有安全風險
6. **測試覆蓋率**: 是否有足夠的測試

### 審查流程

1. 自動化檢查（CI/CD）
2. 同行審查（至少一位審查者）
3. 無障礙測試
4. 最終審查和合併

## 發布流程

1. **版本規劃**: 在Issues中規劃版本功能
2. **開發**: 在feature分支中開發
3. **測試**: 在develop分支中整合測試
4. **發布**: 從main分支發布
5. **文檔**: 更新發布說明和文檔

## 社群規範

### 行為準則

我們致力於提供一個友善、包容的社群環境：

- **尊重他人**: 尊重所有社群成員
- **包容性**: 歡迎不同背景和經驗的貢獻者
- **建設性**: 提供建設性的回饋和建議
- **專業**: 保持專業和友善的溝通

### 溝通管道

- **GitHub Issues**: 問題回報和功能建議
- **GitHub Discussions**: 一般討論和問答
- **Pull Requests**: 程式碼審查和技術討論

## 獲得幫助

如果您需要幫助：

1. 查看 [文檔](dev.md)
2. 搜尋 [Issues](https://github.com/lkjh-maker/accessible-toilet-go-v2/issues)
3. 建立新的Issue
4. 參與 [Discussions](https://github.com/lkjh-maker/accessible-toilet-go-v2/discussions)

## 致謝

感謝所有貢獻者對無障礙環境的努力！您的每一份貢獻都讓這個世界變得更加友善和包容。

---

**讓我們一起打造更好的無障礙環境！** ♿💙
