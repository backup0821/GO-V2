// 無障礙廁所GO V2 - 配置檔案

const CONFIG = {
    // API 配置
    API: {
        BASE_URL: 'https://data.moenv.gov.tw/api/v2/fac_p_07',
        API_KEY: '58d6040c-dca7-407f-a244-d0bfdfa8144a',
        TIMEOUT: 10000,
        LIMIT: 1000
    },
    
    // Google Maps 配置
    MAPS: {
        API_KEY: 'YOUR_GOOGLE_MAPS_API_KEY', // 請替換為您的 API Key
        DEFAULT_CENTER: {
            lat: 25.047924, // 台北車站
            lng: 121.517081
        },
        DEFAULT_ZOOM: 15,
        MAX_ZOOM: 18,
        MIN_ZOOM: 10
    },
    
    // 搜尋配置
    SEARCH: {
        DEFAULT_RADIUS: 1000, // 預設搜尋半徑 (公尺)
        MAX_RADIUS: 5000, // 最大搜尋半徑
        MIN_RADIUS: 100, // 最小搜尋半徑
        DEFAULT_LIMIT: 20, // 預設回傳數量
        MAX_LIMIT: 100 // 最大回傳數量
    },
    
    // 無障礙配置
    ACCESSIBILITY: {
        FONT_SIZE_MULTIPLIER: {
            normal: 1,
            large: 1.25,
            extraLarge: 1.5,
            huge: 2
        },
        ANIMATION_DURATION: {
            normal: '0.3s',
            reduced: '0.01ms'
        }
    },
    
    // 廁所類型配置
    TOILET_TYPES: {
        '男廁所': { color: '#1976d2', icon: 'fas fa-male' },
        '女廁所': { color: '#e91e63', icon: 'fas fa-female' },
        '無障礙廁所': { color: '#4caf50', icon: 'fas fa-wheelchair' },
        '混合廁所': { color: '#ff9800', icon: 'fas fa-restroom' }
    },
    
    // 等級配置
    TOILET_GRADES: {
        '特優級': { color: '#4caf50', stars: 5, priority: 1 },
        '優級': { color: '#2196f3', stars: 4, priority: 2 },
        '良級': { color: '#ff9800', stars: 3, priority: 3 },
        '普通級': { color: '#795548', stars: 2, priority: 4 },
        '不合格': { color: '#f44336', stars: 1, priority: 5 }
    },
    
    // 類別配置
    TOILET_CATEGORIES: [
        '交通',
        '觀光地區及風景區',
        '公園',
        '民眾洽公場所',
        '商業營業場所',
        '文化育樂活動場所',
        '社福機構、集會場所',
        '醫療機構',
        '教育場所',
        '其他'
    ],
    
    // 統計資料
    STATS: {
        totalToilets: 46121,
        accessibleToilets: 12847,
        excellentToilets: 8234,
        monthlyNew: 127
    },
    
    // 快取配置
    CACHE: {
        TOILETS_KEY: 'accessible_toilets_cache',
        LOCATION_KEY: 'user_location',
        SETTINGS_KEY: 'accessibility_settings',
        SEARCH_HISTORY_KEY: 'search_history',
        FAVORITES_KEY: 'favorite_toilets',
        CACHE_DURATION: 24 * 60 * 60 * 1000 // 24小時
    },
    
    // 錯誤訊息
    MESSAGES: {
        LOCATION_DENIED: '位置存取權限被拒絕',
        LOCATION_UNAVAILABLE: '位置資訊不可用',
        LOCATION_TIMEOUT: '位置請求超時',
        LOCATION_ERROR: '無法取得位置資訊',
        SEARCH_ERROR: '搜尋失敗，請稍後再試',
        MAPS_ERROR: '無法載入地圖，請檢查網路連線',
        API_ERROR: '無法取得資料，請稍後再試',
        NETWORK_ERROR: '網路連線錯誤',
        UNKNOWN_ERROR: '發生未知錯誤'
    },
    
    // 鍵盤快捷鍵
    SHORTCUTS: {
        SEARCH: 'ctrl+/',
        ACCESSIBILITY: 'alt+a',
        NAVIGATION: {
            HOME: 'alt+1',
            SEARCH: 'alt+2',
            ACCESSIBILITY: 'alt+3',
            ABOUT: 'alt+4'
        }
    },
    
    // 動畫配置
    ANIMATIONS: {
        FADE_IN: 'fadeIn',
        SLIDE_UP: 'slideUp',
        BOUNCE: 'bounce'
    },
    
    // 地圖標記樣式
    MAP_MARKERS: {
        USER_LOCATION: {
            path: 'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z',
            fillColor: '#4285F4',
            fillOpacity: 1,
            strokeColor: '#ffffff',
            strokeWeight: 3,
            scale: 1
        },
        TOILET: {
            path: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z',
            scale: 0.8,
            fillOpacity: 0.8,
            strokeColor: '#ffffff',
            strokeWeight: 2
        }
    },
    
    // 分頁配置
    PAGINATION: {
        ITEMS_PER_PAGE: 20,
        MAX_PAGES_SHOWN: 10
    },
    
    // 效能配置
    PERFORMANCE: {
        DEBOUNCE_DELAY: 300, // 搜尋防抖延遲 (毫秒)
        THROTTLE_DELAY: 100, // 滾動節流延遲 (毫秒)
        LAZY_LOAD_OFFSET: 100 // 懶載入偏移量 (像素)
    }
};

// 環境變數覆蓋
if (typeof process !== 'undefined' && process.env) {
    if (process.env.VITE_GOOGLE_MAPS_API_KEY) {
        CONFIG.MAPS.API_KEY = process.env.VITE_GOOGLE_MAPS_API_KEY;
    }
}

// 瀏覽器環境變數覆蓋 (Vite)
if (typeof import !== 'undefined' && import.meta && import.meta.env) {
    if (import.meta.env.VITE_GOOGLE_MAPS_API_KEY) {
        CONFIG.MAPS.API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
    }
}

// 全域配置物件
window.CONFIG = CONFIG;

// 匯出配置 (如果使用模組系統)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
}
