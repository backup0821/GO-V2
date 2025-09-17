// 無障礙廁所GO V2 - API 服務

/**
 * API 服務類別
 */
class APIService {
    constructor() {
        this.baseURL = CONFIG.API.BASE_URL;
        this.apiKey = CONFIG.API.API_KEY;
        this.timeout = CONFIG.API.TIMEOUT;
        this.cache = new Map();
    }

    /**
     * 發送 HTTP 請求
     * @param {string} url - 請求 URL
     * @param {Object} options - 請求選項
     * @returns {Promise} 請求結果
     */
    async request(url, options = {}) {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.timeout);

        try {
            const response = await fetch(url, {
                ...options,
                signal: controller.signal,
                headers: {
                    'Content-Type': 'application/json',
                    ...options.headers
                }
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            clearTimeout(timeoutId);
            
            if (error.name === 'AbortError') {
                throw new Error(CONFIG.MESSAGES.API_ERROR);
            }
            
            throw error;
        }
    }

    /**
     * 取得所有廁所資料
     * @param {number} limit - 限制數量
     * @returns {Promise<Array>} 廁所資料列表
     */
    async getAllToilets(limit = CONFIG.API.LIMIT) {
        const cacheKey = `toilets_${limit}`;
        const cached = this.cache.get(cacheKey);
        
        if (cached && Date.now() - cached.timestamp < CONFIG.CACHE.CACHE_DURATION) {
            return cached.data;
        }

        try {
            const url = `${this.baseURL}?api_key=${this.apiKey}&limit=${limit}&sort=ImportDate desc&format=JSON`;
            const response = await this.request(url);
            
            const toilets = response.records.map(record => this.transformToiletData(record));
            
            // 快取資料
            this.cache.set(cacheKey, {
                data: toilets,
                timestamp: Date.now()
            });

            // 儲存到本地儲存
            Utils.Storage.set(CONFIG.CACHE.TOILETS_KEY, toilets, CONFIG.CACHE.CACHE_DURATION);
            
            return toilets;
        } catch (error) {
            console.error('取得廁所資料失敗:', error);
            
            // 嘗試從本地儲存取得
            const localData = Utils.Storage.get(CONFIG.CACHE.TOILETS_KEY);
            if (localData) {
                return localData;
            }
            
            throw new Error(CONFIG.MESSAGES.API_ERROR);
        }
    }

    /**
     * 搜尋附近廁所
     * @param {Object} params - 搜尋參數
     * @returns {Promise<Object>} 搜尋結果
     */
    async searchNearbyToilets(params) {
        try {
            // 先取得所有資料
            let allToilets = await this.getAllToilets();
            
            // 關鍵字搜尋
            if (params.keyword) {
                allToilets = Utils.searchToilets(allToilets, params.keyword);
            }
            
            // 篩選
            if (params.filters) {
                allToilets = Utils.filterToilets(allToilets, params.filters);
            }
            
            // 根據位置計算距離並排序
            if (params.location) {
                allToilets = Utils.sortToilets(allToilets, 'distance', params.location);
            } else if (params.sortBy) {
                allToilets = Utils.sortToilets(allToilets, params.sortBy);
            }
            
            // 分頁
            const limit = params.limit || CONFIG.SEARCH.DEFAULT_LIMIT;
            const page = params.page || 1;
            const startIndex = (page - 1) * limit;
            const endIndex = startIndex + limit;
            const paginatedToilets = allToilets.slice(startIndex, endIndex);
            
            return {
                toilets: paginatedToilets,
                total: allToilets.length,
                page: page,
                limit: limit,
                hasMore: endIndex < allToilets.length
            };
        } catch (error) {
            console.error('搜尋附近廁所失敗:', error);
            throw new Error(CONFIG.MESSAGES.SEARCH_ERROR);
        }
    }

    /**
     * 取得特定廁所詳情
     * @param {string} id - 廁所ID
     * @returns {Promise<Object|null>} 廁所詳情
     */
    async getToiletById(id) {
        try {
            const allToilets = await this.getAllToilets();
            const toilet = allToilets.find(t => t.id === id);
            return toilet || null;
        } catch (error) {
            console.error('取得廁所詳情失敗:', error);
            throw new Error(CONFIG.MESSAGES.API_ERROR);
        }
    }

    /**
     * 取得縣市列表
     * @returns {Promise<Array>} 縣市列表
     */
    async getCounties() {
        try {
            const allToilets = await this.getAllToilets();
            const counties = [...new Set(allToilets.map(t => t.county))];
            return counties.sort();
        } catch (error) {
            console.error('取得縣市列表失敗:', error);
            return [];
        }
    }

    /**
     * 轉換環保署資料格式為內部格式
     * @param {Object} record - 環保署資料記錄
     * @returns {Object} 轉換後的廁所資料
     */
    transformToiletData(record) {
        return {
            id: record.number,
            name: record.name,
            address: record.address,
            latitude: parseFloat(record.latitude),
            longitude: parseFloat(record.longitude),
            type: record.type,
            category: record.type2,
            grade: record.grade,
            management: record.exec,
            hasDiaperTable: record.diaper === '1',
            county: record.county,
            city: record.city,
            village: record.village,
            administration: record.administration
        };
    }

    /**
     * 清除快取
     */
    clearCache() {
        this.cache.clear();
        Utils.Storage.remove(CONFIG.CACHE.TOILETS_KEY);
    }
}

/**
 * 位置服務類別
 */
class LocationService {
    constructor() {
        this.currentLocation = null;
        this.watchId = null;
    }

    /**
     * 取得當前位置
     * @param {Object} options - 位置選項
     * @returns {Promise<Object>} 位置資訊
     */
    async getCurrentPosition(options = {}) {
        return new Promise((resolve, reject) => {
            if (!navigator.geolocation) {
                reject(new Error(CONFIG.MESSAGES.LOCATION_ERROR));
                return;
            }

            const defaultOptions = {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 60000
            };

            const finalOptions = { ...defaultOptions, ...options };

            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const location = {
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                        accuracy: position.coords.accuracy,
                        timestamp: position.timestamp
                    };
                    
                    this.currentLocation = location;
                    Utils.Storage.set(CONFIG.CACHE.LOCATION_KEY, location);
                    
                    resolve(location);
                },
                (error) => {
                    let errorMessage = CONFIG.MESSAGES.LOCATION_ERROR;
                    
                    switch (error.code) {
                        case error.PERMISSION_DENIED:
                            errorMessage = CONFIG.MESSAGES.LOCATION_DENIED;
                            break;
                        case error.POSITION_UNAVAILABLE:
                            errorMessage = CONFIG.MESSAGES.LOCATION_UNAVAILABLE;
                            break;
                        case error.TIMEOUT:
                            errorMessage = CONFIG.MESSAGES.LOCATION_TIMEOUT;
                            break;
                    }
                    
                    reject(new Error(errorMessage));
                },
                finalOptions
            );
        });
    }

    /**
     * 監聽位置變化
     * @param {Function} callback - 回調函數
     * @param {Object} options - 位置選項
     * @returns {number} 監聽ID
     */
    watchPosition(callback, options = {}) {
        if (!navigator.geolocation) {
            throw new Error(CONFIG.MESSAGES.LOCATION_ERROR);
        }

        const defaultOptions = {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 30000
        };

        const finalOptions = { ...defaultOptions, ...options };

        this.watchId = navigator.geolocation.watchPosition(
            (position) => {
                const location = {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                    accuracy: position.coords.accuracy,
                    timestamp: position.timestamp
                };
                
                this.currentLocation = location;
                Utils.Storage.set(CONFIG.CACHE.LOCATION_KEY, location);
                
                callback(location);
            },
            (error) => {
                console.error('位置監聽錯誤:', error);
            },
            finalOptions
        );

        return this.watchId;
    }

    /**
     * 停止監聽位置變化
     */
    clearWatch() {
        if (this.watchId) {
            navigator.geolocation.clearWatch(this.watchId);
            this.watchId = null;
        }
    }

    /**
     * 取得最後已知位置
     * @returns {Object|null} 位置資訊
     */
    getLastKnownLocation() {
        if (this.currentLocation) {
            return this.currentLocation;
        }
        
        return Utils.Storage.get(CONFIG.CACHE.LOCATION_KEY);
    }
}

/**
 * 搜尋歷史服務類別
 */
class SearchHistoryService {
    constructor() {
        this.history = this.loadHistory();
        this.maxItems = 20;
    }

    /**
     * 載入搜尋歷史
     * @returns {Array} 搜尋歷史
     */
    loadHistory() {
        return Utils.Storage.get(CONFIG.CACHE.SEARCH_HISTORY_KEY) || [];
    }

    /**
     * 儲存搜尋歷史
     */
    saveHistory() {
        Utils.Storage.set(CONFIG.CACHE.SEARCH_HISTORY_KEY, this.history);
    }

    /**
     * 新增搜尋項目
     * @param {string} query - 搜尋查詢
     * @param {Object} filters - 篩選條件
     */
    addSearchItem(query, filters = {}) {
        if (!query || !query.trim()) return;

        const searchItem = {
            id: Utils.generateId(),
            query: query.trim(),
            filters: filters,
            timestamp: Date.now()
        };

        // 移除重複項目
        this.history = this.history.filter(item => item.query !== searchItem.query);
        
        // 新增到開頭
        this.history.unshift(searchItem);
        
        // 限制數量
        if (this.history.length > this.maxItems) {
            this.history = this.history.slice(0, this.maxItems);
        }
        
        this.saveHistory();
    }

    /**
     * 取得搜尋歷史
     * @param {number} limit - 限制數量
     * @returns {Array} 搜尋歷史
     */
    getHistory(limit = 10) {
        return this.history.slice(0, limit);
    }

    /**
     * 清除搜尋歷史
     */
    clearHistory() {
        this.history = [];
        this.saveHistory();
    }

    /**
     * 移除特定搜尋項目
     * @param {string} id - 項目ID
     */
    removeSearchItem(id) {
        this.history = this.history.filter(item => item.id !== id);
        this.saveHistory();
    }
}

/**
 * 收藏服務類別
 */
class FavoritesService {
    constructor() {
        this.favorites = this.loadFavorites();
    }

    /**
     * 載入收藏列表
     * @returns {Array} 收藏列表
     */
    loadFavorites() {
        return Utils.Storage.get(CONFIG.CACHE.FAVORITES_KEY) || [];
    }

    /**
     * 儲存收藏列表
     */
    saveFavorites() {
        Utils.Storage.set(CONFIG.CACHE.FAVORITES_KEY, this.favorites);
    }

    /**
     * 新增收藏
     * @param {string} toiletId - 廁所ID
     */
    addFavorite(toiletId) {
        if (!this.favorites.includes(toiletId)) {
            this.favorites.push(toiletId);
            this.saveFavorites();
        }
    }

    /**
     * 移除收藏
     * @param {string} toiletId - 廁所ID
     */
    removeFavorite(toiletId) {
        this.favorites = this.favorites.filter(id => id !== toiletId);
        this.saveFavorites();
    }

    /**
     * 檢查是否已收藏
     * @param {string} toiletId - 廁所ID
     * @returns {boolean} 是否已收藏
     */
    isFavorite(toiletId) {
        return this.favorites.includes(toiletId);
    }

    /**
     * 取得收藏列表
     * @returns {Array} 收藏列表
     */
    getFavorites() {
        return [...this.favorites];
    }

    /**
     * 清除所有收藏
     */
    clearFavorites() {
        this.favorites = [];
        this.saveFavorites();
    }
}

/**
 * 統計服務類別
 */
class StatisticsService {
    constructor() {
        this.stats = CONFIG.STATS;
    }

    /**
     * 取得統計資料
     * @returns {Object} 統計資料
     */
    getStats() {
        return { ...this.stats };
    }

    /**
     * 更新統計資料
     * @param {Object} newStats - 新的統計資料
     */
    updateStats(newStats) {
        this.stats = { ...this.stats, ...newStats };
    }

    /**
     * 取得廁所類型統計
     * @param {Array} toilets - 廁所列表
     * @returns {Object} 類型統計
     */
    getTypeStatistics(toilets) {
        const stats = {};
        Object.keys(CONFIG.TOILET_TYPES).forEach(type => {
            stats[type] = toilets.filter(t => t.type === type).length;
        });
        return stats;
    }

    /**
     * 取得等級統計
     * @param {Array} toilets - 廁所列表
     * @returns {Object} 等級統計
     */
    getGradeStatistics(toilets) {
        const stats = {};
        Object.keys(CONFIG.TOILET_GRADES).forEach(grade => {
            stats[grade] = toilets.filter(t => t.grade === grade).length;
        });
        return stats;
    }
}

// 建立全域實例
const apiService = new APIService();
const locationService = new LocationService();
const searchHistoryService = new SearchHistoryService();
const favoritesService = new FavoritesService();
const statisticsService = new StatisticsService();

// 全域匯出
window.API = {
    service: apiService,
    location: locationService,
    searchHistory: searchHistoryService,
    favorites: favoritesService,
    statistics: statisticsService
};
