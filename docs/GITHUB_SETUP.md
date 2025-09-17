# GitHub 託管設定指南

## 專案設定

### 1. 建立 GitHub 儲存庫

1. 前往 [GitHub](https://github.com) 並登入
2. 點擊右上角的 "+" 按鈕，選擇 "New repository"
3. 填寫儲存庫資訊：
   - **Repository name**: `accessible-toilet-go-v2`
   - **Description**: `無障礙廁所GO V2 - 為身心障礙人士提供最近公共廁所/無障礙廁所查詢服務`
   - **Visibility**: Public (公開)
   - **Initialize**: 不要勾選任何初始化選項（我們已有檔案）

### 2. 上傳專案檔案

```bash
# 初始化 Git（如果還沒有）
git init

# 添加遠端儲存庫
git remote add origin https://github.com/YOUR_USERNAME/accessible-toilet-go-v2.git

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

### 4. 設定 Secrets

在儲存庫的 **Settings** → **Secrets and variables** → **Actions** 中新增以下 secrets：

#### 必要的 Secrets
```
API_URL=https://your-api-domain.com/api
GOOGLE_MAPS_API_KEY=your-google-maps-api-key
DATABASE_URL=your-database-connection-string
JWT_SECRET=your-jwt-secret-key
```

#### 可選的 Secrets
```
REDIS_URL=your-redis-connection-string
SENTRY_DSN=your-sentry-dsn
EMAIL_SERVICE_API_KEY=your-email-service-key
```

### 5. 設定分支保護規則

1. 前往 **Settings** → **Branches**
2. 點擊 **Add rule**
3. 設定規則：
   - **Branch name pattern**: `main`
   - 勾選以下選項：
     - ✅ Require a pull request before merging
     - ✅ Require status checks to pass before merging
     - ✅ Require branches to be up to date before merging
     - ✅ Require conversation resolution before merging

## GitHub Actions 工作流程

### CI/CD 流程說明

我們的 GitHub Actions 工作流程包含以下階段：

1. **程式碼品質檢查**
   - ESLint 程式碼檢查
   - Prettier 格式檢查

2. **前端測試**
   - 單元測試
   - 建置測試

3. **後端測試**
   - 單元測試
   - 整合測試
   - 資料庫測試

4. **無障礙測試**
   - 自動化無障礙檢測
   - 螢幕閱讀器相容性測試

5. **自動部署**
   - 部署到 GitHub Pages
   - 部署到後端服務

### 工作流程檔案位置

- `.github/workflows/ci.yml` - 主要的 CI/CD 流程
- `.github/workflows/deploy.yml` - 部署流程（可選）

## Issue 和 Pull Request 管理

### Issue 範本

我們設定了三種 Issue 範本：

1. **Bug 回報** (`.github/ISSUE_TEMPLATE/bug_report.md`)
   - 包含無障礙相關資訊欄位
   - 環境資訊收集
   - 重現步驟

2. **功能建議** (`.github/ISSUE_TEMPLATE/feature_request.md`)
   - 無障礙考量評估
   - 使用者類型分析
   - 優先級設定

3. **無障礙問題回報** (`.github/ISSUE_TEMPLATE/accessibility_issue.md`)
   - WCAG 2.1 準則對應
   - 輔助技術測試
   - 影響範圍評估

### Pull Request 範本

- `.github/PULL_REQUEST_TEMPLATE.md`
- 包含無障礙測試檢查清單
- 程式碼品質檢查項目

## 專案管理

### Labels 設定

建議在 GitHub 中設定以下標籤：

#### 類型標籤
- `bug` - Bug 回報
- `enhancement` - 功能改善
- `feature` - 新功能
- `documentation` - 文檔相關
- `accessibility` - 無障礙相關

#### 優先級標籤
- `priority: high` - 高優先級
- `priority: medium` - 中優先級
- `priority: low` - 低優先級

#### 狀態標籤
- `status: needs-triage` - 需要分類
- `status: in-progress` - 進行中
- `status: blocked` - 被阻擋
- `status: ready-for-review` - 準備審查

### Milestones 設定

建議設定以下里程碑：

- `v2.0.0 - MVP` - 最小可行產品
- `v2.1.0 - 功能完善` - 功能完善版本
- `v2.2.0 - 無障礙優化` - 無障礙優化版本
- `v2.3.0 - 效能優化` - 效能優化版本

## 社群管理

### 行為準則

建議在專案根目錄新增 `CODE_OF_CONDUCT.md`：

```markdown
# 行為準則

我們致力於為每個人提供友善、包容的社群環境。
請尊重所有社群成員，無論其背景、經驗或能力。
```

### 貢獻指南

- `CONTRIBUTING.md` - 詳細的貢獻指南
- 包含開發環境設定
- 程式碼規範
- 無障礙開發指南

## 監控和維護

### 自動化工具

1. **Dependabot**
   - 自動更新依賴套件
   - 安全漏洞檢測

2. **CodeQL**
   - 程式碼安全分析
   - 漏洞檢測

3. **Stale Bot**
   - 自動關閉長時間未活動的 Issue/PR

### 統計和洞察

在 GitHub 的 **Insights** 頁面可以查看：

- 貢獻者統計
- 程式碼頻率
- 流量統計
- 依賴項分析

## 授權和版權

### 授權條款

本專案使用 **創用 CC 姓名標示-非商業性 4.0 國際** 授權條款：

- ✅ 允許分享和修改
- ✅ 需要姓名標示
- ❌ 禁止商業使用

### 版權聲明

所有程式碼和文檔都屬於 LKJH MAKER 鹿中創客，但遵循 CC BY-NC 4.0 授權條款。

## 聯絡和支援

### 支援管道

1. **GitHub Issues** - 問題回報和功能建議
2. **GitHub Discussions** - 一般討論和問答
3. **電子郵件** - contact@lkjh-maker.com

### 社群連結

- 官方網站: https://lkjh-maker.com
- 專案頁面: https://github.com/lkjh-maker/accessible-toilet-go-v2

---

**讓我們一起打造更好的無障礙環境！** ♿💙
