# API 文檔

## 概述

無障礙廁所GO V2 API 提供RESTful介面來管理廁所資料、無障礙設施資訊和使用者功能。

**Base URL**: `https://api.accessible-toilet-go.com/v2`

## 認證

API使用JWT (JSON Web Token) 進行認證。需要在請求標頭中包含認證token：

```
Authorization: Bearer <your-jwt-token>
```

## 回應格式

所有API回應都使用JSON格式：

```json
{
  "success": true,
  "data": {},
  "message": "操作成功",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

錯誤回應格式：

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "錯誤訊息",
    "details": {}
  },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## 端點列表

### 廁所相關

#### 取得附近廁所
```http
GET /api/toilets/nearby
```

**查詢參數**:
- `lat` (required): 緯度
- `lng` (required): 經度
- `radius` (optional): 搜尋半徑（公尺），預設1000
- `limit` (optional): 回傳數量限制，預設20
- `type` (optional): 廁所類型 (`public`, `accessible`, `both`)

**回應範例**:
```json
{
  "success": true,
  "data": {
    "toilets": [
      {
        "id": "uuid",
        "name": "台北車站無障礙廁所",
        "address": "台北市中正區北平西路3號",
        "latitude": 25.047924,
        "longitude": 121.517081,
        "type": "accessible",
        "distance": 150.5,
        "accessibilityFeatures": {
          "wheelchairAccessible": true,
          "handrails": true,
          "emergencyButton": true
        },
        "averageRating": 4.5,
        "reviewCount": 23
      }
    ],
    "total": 1,
    "radius": 1000
  }
}
```

#### 搜尋廁所
```http
GET /api/toilets/search
```

**查詢參數**:
- `keyword` (optional): 搜尋關鍵字
- `lat` (optional): 緯度（用於距離排序）
- `lng` (optional): 經度（用於距離排序）
- `filters` (optional): JSON格式的篩選條件
- `page` (optional): 頁碼，預設1
- `limit` (optional): 每頁數量，預設20
- `sort` (optional): 排序方式 (`distance`, `rating`, `name`)

**篩選條件範例**:
```json
{
  "type": "accessible",
  "accessibilityFeatures": {
    "wheelchairAccessible": true,
    "handrails": true
  },
  "minRating": 3.0
}
```

#### 取得特定廁所詳情
```http
GET /api/toilets/:id
```

**回應範例**:
```json
{
  "success": true,
  "data": {
    "toilet": {
      "id": "uuid",
      "name": "台北車站無障礙廁所",
      "address": "台北市中正區北平西路3號",
      "latitude": 25.047924,
      "longitude": 121.517081,
      "type": "accessible",
      "openingHours": {
        "monday": "06:00-22:00",
        "tuesday": "06:00-22:00",
        "wednesday": "06:00-22:00",
        "thursday": "06:00-22:00",
        "friday": "06:00-22:00",
        "saturday": "06:00-22:00",
        "sunday": "06:00-22:00"
      },
      "accessibilityFeatures": {
        "wheelchairAccessible": true,
        "handrails": true,
        "emergencyButton": true,
        "wideDoor": true,
        "lowerSink": true,
        "tactileIndicators": true,
        "audioAnnouncements": false
      },
      "averageRating": 4.5,
      "reviewCount": 23,
      "recentReviews": [
        {
          "id": "review-uuid",
          "rating": 5,
          "comment": "設施完善，使用體驗很好",
          "cleanliness": 5,
          "accessibilityRating": 5,
          "createdAt": "2024-01-01T10:00:00.000Z"
        }
      ]
    }
  }
}
```

### 無障礙設施相關

#### 取得所有無障礙設施類型
```http
GET /api/accessibility/features
```

**回應範例**:
```json
{
  "success": true,
  "data": {
    "features": [
      {
        "key": "wheelchairAccessible",
        "name": "輪椅通道",
        "description": "廁所入口和內部通道適合輪椅通行",
        "icon": "♿"
      },
      {
        "key": "handrails",
        "name": "扶手",
        "description": "廁所內設有安全扶手",
        "icon": "🦯"
      }
    ]
  }
}
```

#### 取得特定廁所的無障礙設施
```http
GET /api/toilets/:id/features
```

### 評分評論相關

#### 新增評分評論
```http
POST /api/reviews
```

**請求體**:
```json
{
  "toiletId": "uuid",
  "rating": 5,
  "comment": "設施完善，使用體驗很好",
  "cleanliness": 5,
  "accessibilityRating": 5
}
```

#### 取得廁所的評分評論
```http
GET /api/toilets/:id/reviews
```

**查詢參數**:
- `page` (optional): 頁碼，預設1
- `limit` (optional): 每頁數量，預設10
- `sort` (optional): 排序方式 (`newest`, `oldest`, `highest`, `lowest`)

### 使用者功能

#### 新增收藏
```http
POST /api/users/favorites
```

**請求體**:
```json
{
  "toiletId": "uuid"
}
```

#### 取得收藏清單
```http
GET /api/users/favorites
```

**查詢參數**:
- `page` (optional): 頁碼，預設1
- `limit` (optional): 每頁數量，預設20

#### 移除收藏
```http
DELETE /api/users/favorites/:toiletId
```

#### 取得搜尋歷史
```http
GET /api/users/search-history
```

**查詢參數**:
- `limit` (optional): 回傳數量限制，預設10

### 管理員功能

#### 新增廁所
```http
POST /api/admin/toilets
```

**請求體**:
```json
{
  "name": "廁所名稱",
  "address": "地址",
  "latitude": 25.047924,
  "longitude": 121.517081,
  "type": "accessible",
  "openingHours": {
    "monday": "06:00-22:00",
    "tuesday": "06:00-22:00"
  },
  "accessibilityFeatures": {
    "wheelchairAccessible": true,
    "handrails": true
  }
}
```

#### 更新廁所資訊
```http
PUT /api/admin/toilets/:id
```

#### 刪除廁所
```http
DELETE /api/admin/toilets/:id
```

## 錯誤代碼

| 代碼 | 訊息 | 描述 |
|------|------|------|
| `INVALID_PARAMETERS` | 無效的參數 | 請求參數格式錯誤或缺少必要參數 |
| `TOILET_NOT_FOUND` | 找不到廁所 | 指定的廁所不存在 |
| `UNAUTHORIZED` | 未授權 | 需要認證或認證失敗 |
| `FORBIDDEN` | 禁止存取 | 沒有權限執行此操作 |
| `RATE_LIMIT_EXCEEDED` | 請求頻率過高 | 超過API請求頻率限制 |
| `INTERNAL_SERVER_ERROR` | 內部伺服器錯誤 | 伺服器內部錯誤 |

## 速率限制

API有速率限制以確保服務穩定性：

- **一般使用者**: 1000 請求/小時
- **認證使用者**: 5000 請求/小時
- **管理員**: 10000 請求/小時

當超過限制時，會回傳 `429 Too Many Requests` 狀態碼。

## 版本控制

API使用URL路徑進行版本控制：
- 當前版本: `v2`
- 舊版本: `v1` (已棄用)

## SDK和工具

### JavaScript SDK
```javascript
import { AccessibleToiletAPI } from '@accessible-toilet-go/sdk';

const api = new AccessibleToiletAPI({
  baseURL: 'https://api.accessible-toilet-go.com/v2',
  apiKey: 'your-api-key'
});

// 取得附近廁所
const nearbyToilets = await api.toilets.getNearby({
  lat: 25.047924,
  lng: 121.517081,
  radius: 1000
});
```

### Postman Collection
可下載Postman Collection來測試API端點：
[下載連結](https://api.accessible-toilet-go.com/v2/postman-collection.json)

## 支援

如有API相關問題，請：
1. 查看此文檔
2. 檢查 [FAQ](https://github.com/lkjh-maker/accessible-toilet-go-v2/wiki/FAQ)
3. 建立 [Issue](https://github.com/lkjh-maker/accessible-toilet-go-v2/issues)
4. 聯絡技術支援: api-support@accessible-toilet-go.com
