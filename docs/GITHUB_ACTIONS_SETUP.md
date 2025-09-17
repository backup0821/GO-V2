# GitHub Actions 設定指南

本文檔說明如何設定無障礙廁所GO V2專案的GitHub Actions工作流程。

## 概述

本專案包含以下GitHub Actions工作流程：

1. **CI (持續整合)** - 程式碼檢查、測試、建置
2. **Deploy (部署)** - 自動部署到測試和生產環境
3. **Data Update (資料更新)** - 定期更新廁所資料
4. **Security (安全性掃描)** - 安全性檢查和漏洞掃描
5. **Performance (效能測試)** - 效能測試和回歸檢測

## 必要設定

### 1. Repository Secrets

在GitHub Repository的Settings > Secrets and variables > Actions中新增以下secrets：

#### 資料庫相關
```
DATABASE_URL=postgresql://username:password@host:port/database
TEST_DATABASE_URL=postgresql://username:password@host:port/test_database
POSTGRES_USER=your_postgres_user
POSTGRES_PASSWORD=your_postgres_password
POSTGRES_REPLICATION_USER=replication_user
POSTGRES_REPLICATION_PASSWORD=replication_password
REDIS_URL=redis://username:password@host:port
TEST_REDIS_URL=redis://username:password@host:port
```

#### API金鑰
```
GOOGLE_MAPS_API_KEY=your_google_maps_api_key
GOVERNMENT_DATA_API_KEY=your_government_data_api_key
JWT_SECRET=your_jwt_secret_key
```

#### 部署相關
```
STAGING_HOST=your_staging_server_ip
STAGING_USERNAME=deploy_user
STAGING_SSH_KEY=your_private_ssh_key

PRODUCTION_HOST=your_production_server_ip
PRODUCTION_USERNAME=deploy_user
PRODUCTION_SSH_KEY=your_private_ssh_key

DOCKER_USERNAME=your_docker_hub_username
DOCKER_PASSWORD=your_docker_hub_password
```

#### 監控和通知
```
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/your/webhook/url
SENTRY_DSN=https://your_sentry_dsn
MONITORING_TOKEN=your_monitoring_api_token
GRAFANA_PASSWORD=your_grafana_admin_password
```

#### AWS相關 (備份用)
```
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
BACKUP_S3_BUCKET=your_backup_bucket_name
```

#### 第三方服務
```
SONAR_TOKEN=your_sonarcloud_token
```

### 2. Environment設定

在Repository Settings > Environments中建立以下環境：

#### staging
- **保護規則**: 需要審核者批准
- **環境變數**: 
  - `ENVIRONMENT=staging`
  - `API_URL=https://staging-api.accessible-toilet-go.com`

#### production
- **保護規則**: 需要審核者批准
- **環境變數**:
  - `ENVIRONMENT=production`
  - `API_URL=https://api.accessible-toilet-go.com`

### 3. Branch保護規則

在Repository Settings > Branches中設定：

#### main分支
- ✅ Require a pull request before merging
- ✅ Require approvals (至少1人)
- ✅ Dismiss stale PR approvals when new commits are pushed
- ✅ Require status checks to pass before merging
  - ✅ CI工作流程必須通過
  - ✅ Security掃描必須通過
- ✅ Require branches to be up to date before merging
- ✅ Require conversation resolution before merging

#### develop分支
- ✅ Require a pull request before merging
- ✅ Require status checks to pass before merging
  - ✅ CI工作流程必須通過

## 工作流程說明

### 1. CI工作流程 (ci.yml)

**觸發條件**:
- Push到main或develop分支
- Pull Request到main或develop分支

**主要工作**:
- 前端測試和建置
- 後端測試
- 無障礙測試
- 安全性掃描
- 程式碼品質檢查
- Docker映像建置

### 2. 部署工作流程 (deploy.yml)

**觸發條件**:
- Push到main分支 (自動部署到staging)
- 建立tag (自動部署到production)
- 手動觸發 (可選擇環境)

**部署流程**:
1. 建置Docker映像
2. 部署到指定環境
3. 執行資料庫遷移
4. 健康檢查
5. 煙霧測試

### 3. 資料更新工作流程 (data-update.yml)

**觸發條件**:
- 每天凌晨2點自動執行
- 手動觸發 (可選擇資料來源)

**更新流程**:
1. 同步政府開放資料
2. 處理使用者回報
3. 資料品質檢查
4. 更新地圖快取
5. 執行備份

### 4. 安全性工作流程 (security.yml)

**觸發條件**:
- 每週日凌晨3點自動執行
- Push到main或develop分支
- Pull Request到main分支
- 手動觸發

**安全檢查**:
- 依賴漏洞掃描
- 程式碼安全性掃描
- Docker映像掃描
- 敏感資訊檢查
- 安全性測試

### 5. 效能測試工作流程 (performance.yml)

**觸發條件**:
- 每週二凌晨4點自動執行
- Push到main分支
- 手動觸發 (可選擇測試類型)

**效能測試**:
- API效能測試
- 前端效能測試
- 資料庫效能測試
- 端對端效能測試
- 效能回歸檢測

## 監控和通知

### Slack通知

所有工作流程都會發送通知到Slack頻道：
- `#deployments` - 部署相關通知
- `#data-updates` - 資料更新通知
- `#security` - 安全性相關通知
- `#performance` - 效能測試通知

### GitHub Security

安全性掃描結果會自動上傳到GitHub Security頁面：
- Code scanning alerts
- Dependency review
- Secret scanning alerts

## 故障排除

### 常見問題

1. **工作流程失敗**
   - 檢查Secrets設定是否正確
   - 確認環境變數是否完整
   - 查看詳細的錯誤日誌

2. **部署失敗**
   - 確認伺服器SSH連線
   - 檢查Docker映像是否成功建置
   - 驗證環境變數設定

3. **測試失敗**
   - 檢查測試資料庫連線
   - 確認測試環境設定
   - 查看測試日誌

### 除錯技巧

1. **啟用詳細日誌**
   ```yaml
   - name: Debug
     run: |
       echo "Debug information"
       env | sort
   ```

2. **檢查工作流程狀態**
   - 在Actions頁面查看詳細日誌
   - 使用GitHub CLI檢查狀態

3. **本地測試**
   - 使用act工具在本地執行GitHub Actions
   - 測試Docker Compose配置

## 最佳實踐

### 1. 安全性
- 定期更新依賴套件
- 使用最小權限原則
- 定期輪換Secrets
- 啟用所有安全性掃描

### 2. 效能
- 使用Docker層快取
- 並行執行不相關的工作
- 定期清理舊的artifacts
- 監控工作流程執行時間

### 3. 可靠性
- 設定適當的重試機制
- 使用健康檢查
- 實作滾動更新
- 定期備份資料

### 4. 可維護性
- 使用語義化版本標籤
- 保持工作流程簡潔
- 添加適當的註解
- 定期檢視和更新

## 擴展功能

### 自定義工作流程

可以根據需要添加更多工作流程：

1. **文檔部署** - 自動部署文檔網站
2. **多環境測試** - 測試不同環境配置
3. **效能基準測試** - 建立效能基準
4. **災難恢復測試** - 定期測試備份和恢復

### 整合第三方服務

- **SonarCloud** - 程式碼品質分析
- **Sentry** - 錯誤追蹤
- **DataDog** - 監控和日誌
- **PagerDuty** - 告警和事件管理

---

**注意**: 請根據實際需求調整工作流程配置，並定期檢視和更新設定。
