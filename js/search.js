// 無障礙廁所GO V2 - 搜尋功能

/**
 * 搜尋服務類別
 */
class SearchService {
    constructor() {
        this.currentResults = [];
        this.currentFilters = {};
        this.currentSortBy = 'distance';
        this.currentPage = 1;
        this.isSearching = false;
        this.userLocation = null;
    }

    /**
     * 初始化搜尋功能
     */
    initialize() {
        this.setupSearchInputs();
        this.setupFilters();
        this.setupSearchButtons();
        this.setupSortOptions();
        this.setupResultsDisplay();
        this.loadUserLocation();
        
        // 監聽頁面變化事件
        document.addEventListener('pageChanged', (e) => {
            if (e.detail.to === 'search') {
                this.onSearchPageActivated();
            }
        });

        // 監聽搜尋結果顯示事件
        document.addEventListener('showSearchResults', (e) => {
            this.displaySearchResults(e.detail.toilets, e.detail.location);
        });

        console.log('搜尋功能已初始化');
    }

    /**
     * 設定搜尋輸入框
     */
    setupSearchInputs() {
        const searchInputs = document.querySelectorAll('#searchInput, #searchInputPage');
        searchInputs.forEach(input => {
            // 防抖搜尋
            const debouncedSearch = Utils.debounce((query) => {
                this.performSearch(query);
            }, window.CONFIG.PERFORMANCE.DEBOUNCE_DELAY);

            input.addEventListener('input', (e) => {
                debouncedSearch(e.target.value);
            });

            input.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    this.performSearch(e.target.value);
                }
            });
        });
    }

    /**
     * 設定篩選器
     */
    setupFilters() {
        // 類型篩選
        const typeFilter = document.querySelector('#typeFilter');
        if (typeFilter) {
            typeFilter.addEventListener('change', (e) => {
                this.updateFilters({ type: e.target.value ? [e.target.value] : [] });
            });
        }

        // 等級篩選
        const gradeFilter = document.querySelector('#gradeFilter');
        if (gradeFilter) {
            gradeFilter.addEventListener('change', (e) => {
                this.updateFilters({ grade: e.target.value ? [e.target.value] : [] });
            });
        }

        // 排序選項
        const sortBy = document.querySelector('#sortBy');
        if (sortBy) {
            sortBy.addEventListener('change', (e) => {
                this.currentSortBy = e.target.value;
                this.refreshResults();
            });
        }
    }

    /**
     * 設定搜尋按鈕
     */
    setupSearchButtons() {
        // 搜尋按鈕
        const searchButtons = document.querySelectorAll('.search-btn');
        searchButtons.forEach(button => {
            button.addEventListener('click', () => {
                const searchInput = button.parentElement.querySelector('.search-input');
                if (searchInput) {
                    this.performSearch(searchInput.value);
                }
            });
        });

        // 取得位置按鈕
        const getLocationBtn = document.querySelector('#getLocationBtn');
        if (getLocationBtn) {
            getLocationBtn.addEventListener('click', () => {
                this.getLocationAndSearch();
            });
        }

        // 瀏覽所有廁所按鈕
        const browseAllBtn = document.querySelector('#browseAllBtn');
        if (browseAllBtn) {
            browseAllBtn.addEventListener('click', () => {
                this.browseAllToilets();
            });
        }

        // 重新整理按鈕
        const refreshBtn = document.querySelector('#refreshBtn');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => {
                this.refreshResults();
            });
        }
    }

    /**
     * 設定排序選項
     */
    setupSortOptions() {
        // 排序選項已在上方 setupFilters 中處理
    }

    /**
     * 設定結果顯示
     */
    setupResultsDisplay() {
        const toiletsList = document.querySelector('#toiletsList');
        if (toiletsList) {
            // 監聽廁所卡片點擊事件
            toiletsList.addEventListener('click', (e) => {
                const toiletCard = e.target.closest('.toilet-card');
                if (toiletCard) {
                    const toiletId = toiletCard.dataset.toiletId;
                    this.showToiletDetails(toiletId);
                }
            });

            // 監聽鍵盤事件
            toiletsList.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    const toiletCard = e.target.closest('.toilet-card');
                    if (toiletCard) {
                        e.preventDefault();
                        const toiletId = toiletCard.dataset.toiletId;
                        this.showToiletDetails(toiletId);
                    }
                }
            });
        }
    }

    /**
     * 載入使用者位置
     */
    async loadUserLocation() {
        try {
            this.userLocation = API.location.getLastKnownLocation();
        } catch (error) {
            console.log('無法載入使用者位置:', error);
        }
    }

    /**
     * 執行搜尋
     * @param {string} query - 搜尋查詢
     */
    async performSearch(query) {
        if (this.isSearching) return;

        this.isSearching = true;
        this.showLoading(true);

        try {
            // 加入搜尋歷史
            if (query && query.trim() && window.API && window.API.searchHistory) {
                window.API.searchHistory.addSearchItem(query.trim(), this.currentFilters);
            }

            const searchParams = {
                keyword: query,
                filters: this.currentFilters,
                sortBy: this.currentSortBy,
                location: this.userLocation,
                limit: 20,
                page: 1
            };

            const result = await window.API.service.searchNearbyToilets(searchParams);
            this.currentResults = result.toilets || [];
            this.currentPage = 1;

            this.displaySearchResults(result.toilets || [], this.userLocation);
            this.updateResultsCount(result.total || 0);

        } catch (error) {
            console.error('搜尋失敗:', error);
            if (window.Utils && window.Utils.showMessage) {
                window.Utils.showMessage('搜尋失敗，請稍後再試', 'error');
            }
            this.showNoResults();
        } finally {
            this.isSearching = false;
            this.showLoading(false);
        }
    }

    /**
     * 更新篩選條件
     * @param {Object} newFilters - 新的篩選條件
     */
    updateFilters(newFilters) {
        this.currentFilters = { ...this.currentFilters, ...newFilters };
        this.refreshResults();
    }

    /**
     * 重新整理結果
     */
    async refreshResults() {
        const searchInput = document.querySelector('#searchInputPage');
        const query = searchInput ? searchInput.value : '';
        await this.performSearch(query);
    }

    /**
     * 取得位置並搜尋
     */
    async getLocationAndSearch() {
        try {
            if (window.Utils && window.Utils.showMessage) {
                window.Utils.showMessage('正在取得位置資訊...', 'info');
            }
            
            const location = await window.API.location.getCurrentPosition();
            this.userLocation = location;
            
            // 搜尋附近廁所
            const searchParams = {
                location: location,
                filters: this.currentFilters,
                sortBy: 'distance',
                limit: 20,
                page: 1
            };

            const result = await window.API.service.searchNearbyToilets(searchParams);
            this.currentResults = result.toilets || [];
            this.currentPage = 1;

            this.displaySearchResults(result.toilets || [], location);
            this.updateResultsCount(result.total || 0);

            if (window.Utils && window.Utils.showMessage) {
                window.Utils.showMessage('已找到附近廁所', 'success');
            }

        } catch (error) {
            console.error('位置搜尋失敗:', error);
            if (window.Utils && window.Utils.showMessage) {
                window.Utils.showMessage(error.message, 'error');
            }
        }
    }

    /**
     * 瀏覽所有廁所
     */
    async browseAllToilets() {
        try {
            this.showLoading(true);
            
            const result = await API.service.searchNearbyToilets({
                filters: this.currentFilters,
                sortBy: this.currentSortBy,
                limit: window.CONFIG.SEARCH.DEFAULT_LIMIT,
                page: 1
            });

            this.currentResults = result.toilets;
            this.currentPage = 1;

            this.displaySearchResults(result.toilets, this.userLocation);
            this.updateResultsCount(result.total);

            // 切換到搜尋頁面
            window.NavigationService.navigateToPage('search');

        } catch (error) {
            console.error('瀏覽廁所失敗:', error);
            Utils.showMessage(window.CONFIG.MESSAGES.SEARCH_ERROR, 'error');
        } finally {
            this.showLoading(false);
        }
    }

    /**
     * 顯示搜尋結果
     * @param {Array} toilets - 廁所列表
     * @param {Object} location - 使用者位置
     */
    displaySearchResults(toilets, location = null) {
        const toiletsList = document.querySelector('#toiletsList');
        const noResults = document.querySelector('#noResults');
        
        if (!toiletsList) return;

        if (toilets.length === 0) {
            this.showNoResults();
            return;
        }

        // 隱藏無結果提示
        if (noResults) {
            noResults.style.display = 'none';
        }

        // 生成廁所卡片HTML
        const toiletsHTML = toilets.map(toilet => this.createToiletCard(toilet, location)).join('');
        toiletsList.innerHTML = toiletsHTML;

        // 顯示地圖預覽
        this.showMapPreview(toilets, location);

        // 觸發結果顯示事件
        const event = new CustomEvent('searchResultsDisplayed', {
            detail: { toilets, location }
        });
        document.dispatchEvent(event);
    }

    /**
     * 建立廁所卡片HTML
     * @param {Object} toilet - 廁所資料
     * @param {Object} location - 使用者位置
     * @returns {string} 卡片HTML
     */
    createToiletCard(toilet, location = null) {
        const distance = location && toilet.distance ? 
            (window.Utils && window.Utils.formatDistance ? 
                window.Utils.formatDistance(toilet.distance) : 
                `${Math.round(toilet.distance)}m`) : '';
        
        const gradeStars = window.Utils && window.Utils.getToiletGradeStars ? 
            window.Utils.getToiletGradeStars(toilet.grade) : 3;
        const starIcons = '★'.repeat(gradeStars) + '☆'.repeat(5 - gradeStars);
        
        const typeColor = window.Utils && window.Utils.getToiletTypeColor ? 
            window.Utils.getToiletTypeColor(toilet.type) : '#1976d2';
        const gradeColor = window.Utils && window.Utils.getToiletGradeColor ? 
            window.Utils.getToiletGradeColor(toilet.grade) : '#4caf50';
        
        return `
            <div class="toilet-card" data-toilet-id="${toilet.id}" tabindex="0" role="button" aria-label="查看 ${toilet.name} 詳細資訊">
                <div class="toilet-header">
                    <h3 class="toilet-title">
                        <i class="fas fa-restroom" style="color: ${typeColor}" aria-hidden="true"></i>
                        ${toilet.name}
                    </h3>
                    ${distance ? `<span class="distance-badge">${distance}</span>` : ''}
                </div>
                
                <p class="toilet-address">
                    <i class="fas fa-map-marker-alt" aria-hidden="true"></i>
                    ${toilet.address}
                </p>
                
                <div class="toilet-tags">
                    <span class="tag" style="color: ${typeColor}; border-color: ${typeColor}">
                        ${toilet.type}
                    </span>
                    <span class="tag grade" style="color: ${gradeColor}; border-color: ${gradeColor}">
                        ${starIcons} ${toilet.grade}
                    </span>
                    ${toilet.hasDiaperTable ? '<span class="tag accessible"><i class="fas fa-baby" aria-hidden="true"></i> 尿布檯</span>' : ''}
                </div>
                
                <div class="toilet-info">
                    <span class="toilet-management">
                        <i class="fas fa-building" aria-hidden="true"></i>
                        ${toilet.management}
                    </span>
                </div>
            </div>
        `;
    }

    /**
     * 顯示無結果提示
     */
    showNoResults() {
        const toiletsList = document.querySelector('#toiletsList');
        const noResults = document.querySelector('#noResults');
        
        if (toiletsList) {
            toiletsList.innerHTML = '';
        }
        
        if (noResults) {
            noResults.style.display = 'block';
        }

        // 隱藏地圖預覽
        this.hideMapPreview();
    }

    /**
     * 顯示載入指示器
     * @param {boolean} show - 是否顯示
     */
    showLoading(show) {
        if (window.Utils && window.Utils.toggleLoading) {
            window.Utils.toggleLoading('loadingIndicator', show);
        } else {
            const element = document.getElementById('loadingIndicator');
            if (element) {
                element.style.display = show ? 'block' : 'none';
            }
        }
    }

    /**
     * 更新結果數量
     * @param {number} count - 結果數量
     */
    updateResultsCount(count) {
        const resultsCount = document.querySelector('#resultsCount');
        if (resultsCount) {
            const formattedCount = window.Utils && window.Utils.formatNumber ? 
                window.Utils.formatNumber(count) : count.toString();
            resultsCount.textContent = `找到 ${formattedCount} 間廁所`;
        }
    }

    /**
     * 顯示廁所詳細資訊
     * @param {string} toiletId - 廁所ID
     */
    async showToiletDetails(toiletId) {
        try {
            const toilet = await window.API.service.getToiletById(toiletId);
            if (toilet) {
                this.openToiletModal(toilet);
            } else {
                if (window.Utils && window.Utils.showMessage) {
                    window.Utils.showMessage('找不到廁所資訊', 'error');
                }
            }
        } catch (error) {
            console.error('取得廁所詳情失敗:', error);
            if (window.Utils && window.Utils.showMessage) {
                window.Utils.showMessage('無法取得廁所詳情', 'error');
            }
        }
    }

    /**
     * 開啟廁所詳情模態框
     * @param {Object} toilet - 廁所資料
     */
    openToiletModal(toilet) {
        const modal = document.querySelector('#toiletModal');
        const modalTitle = document.querySelector('#modalTitle');
        const modalContent = document.querySelector('#modalContent');
        
        if (!modal || !modalTitle || !modalContent) return;

        // 設定標題
        modalTitle.textContent = toilet.name;

        // 建立詳細資訊內容
        modalContent.innerHTML = this.createToiletDetailsContent(toilet);

        // 顯示模態框
        modal.classList.add('show');
        modal.setAttribute('aria-hidden', 'false');

        // 聚焦到模態框
        const firstFocusable = modal.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
        if (firstFocusable) {
            firstFocusable.focus();
        }

        // 綁定關閉事件
        this.bindModalCloseEvents(modal);
    }

    /**
     * 建立廁所詳情內容
     * @param {Object} toilet - 廁所資料
     * @returns {string} 詳情HTML
     */
    createToiletDetailsContent(toilet) {
        const distance = toilet.distance ? 
            (window.Utils && window.Utils.formatDistance ? 
                window.Utils.formatDistance(toilet.distance) : 
                `${Math.round(toilet.distance)}m`) : '';
        
        const gradeStars = window.Utils && window.Utils.getToiletGradeStars ? 
            window.Utils.getToiletGradeStars(toilet.grade) : 3;
        const starIcons = '★'.repeat(gradeStars) + '☆'.repeat(5 - gradeStars);
        
        const typeColor = window.Utils && window.Utils.getToiletTypeColor ? 
            window.Utils.getToiletTypeColor(toilet.type) : '#1976d2';
        const gradeColor = window.Utils && window.Utils.getToiletGradeColor ? 
            window.Utils.getToiletGradeColor(toilet.grade) : '#4caf50';
        
        const isFavorite = window.API && window.API.favorites ? 
            window.API.favorites.isFavorite(toilet.id) : false;

        return `
            <div class="toilet-details">
                <div class="details-header">
                    <div class="details-title">
                        <h4>${toilet.name}</h4>
                        <div class="details-grade">
                            <span class="grade-stars" style="color: ${gradeColor}">${starIcons}</span>
                            <span class="grade-text">${toilet.grade}</span>
                        </div>
                    </div>
                    <div class="details-actions">
                        <button class="btn-favorite ${isFavorite ? 'favorited' : ''}" onclick="toggleFavorite('${toilet.id}')">
                            <i class="fas fa-heart" aria-hidden="true"></i>
                            <span>${isFavorite ? '已收藏' : '收藏'}</span>
                        </button>
                    </div>
                </div>

                <div class="details-content">
                    <div class="detail-item">
                        <i class="fas fa-map-marker-alt" aria-hidden="true"></i>
                        <div>
                            <strong>地址：</strong>
                            <span>${toilet.address}</span>
                        </div>
                    </div>

                    <div class="detail-item">
                        <i class="fas fa-restroom" aria-hidden="true"></i>
                        <div>
                            <strong>類型：</strong>
                            <span style="color: ${typeColor}">${toilet.type}</span>
                        </div>
                    </div>

                    <div class="detail-item">
                        <i class="fas fa-building" aria-hidden="true"></i>
                        <div>
                            <strong>管理單位：</strong>
                            <span>${toilet.management}</span>
                        </div>
                    </div>

                    <div class="detail-item">
                        <i class="fas fa-map" aria-hidden="true"></i>
                        <div>
                            <strong>位置：</strong>
                            <span>${toilet.county} ${toilet.city} ${toilet.village}</span>
                        </div>
                    </div>

                    ${distance ? `
                        <div class="detail-item">
                            <i class="fas fa-route" aria-hidden="true"></i>
                            <div>
                                <strong>距離：</strong>
                                <span>${distance}</span>
                            </div>
                        </div>
                    ` : ''}

                    <div class="detail-item">
                        <i class="fas fa-baby" aria-hidden="true"></i>
                        <div>
                            <strong>尿布檯：</strong>
                            <span>${toilet.hasDiaperTable ? '有' : '無'}</span>
                        </div>
                    </div>
                </div>

                <div class="details-actions">
                    <button class="btn-primary" onclick="navigateToToilet('${toilet.id}')">
                        <i class="fas fa-directions" aria-hidden="true"></i>
                        導航前往
                    </button>
                    <button class="btn-secondary" onclick="copyToiletInfo('${toilet.id}')">
                        <i class="fas fa-copy" aria-hidden="true"></i>
                        複製資訊
                    </button>
                </div>
            </div>
        `;
    }

    /**
     * 綁定模態框關閉事件
     * @param {Element} modal - 模態框元素
     */
    bindModalCloseEvents(modal) {
        const closeBtn = modal.querySelector('.modal-close');
        
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                this.closeModal(modal);
            });
        }

        // 點擊背景關閉
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.closeModal(modal);
            }
        });

        // ESC 鍵關閉
        const escHandler = (e) => {
            if (e.key === 'Escape') {
                this.closeModal(modal);
                document.removeEventListener('keydown', escHandler);
            }
        };
        document.addEventListener('keydown', escHandler);
    }

    /**
     * 關閉模態框
     * @param {Element} modal - 模態框元素
     */
    closeModal(modal) {
        modal.classList.remove('show');
        modal.setAttribute('aria-hidden', 'true');
    }

    /**
     * 顯示地圖預覽
     * @param {Array} toilets - 廁所列表
     * @param {Object} location - 使用者位置
     */
    showMapPreview(toilets, location = null) {
        const mapPreview = document.querySelector('#mapPreview');
        if (!mapPreview) return;

        mapPreview.style.display = 'block';

        // 地圖功能維護中，只顯示維護訊息
        console.log('地圖功能維護中，顯示維護訊息');
    }

    /**
     * 隱藏地圖預覽
     */
    hideMapPreview() {
        const mapPreview = document.querySelector('#mapPreview');
        if (mapPreview) {
            mapPreview.style.display = 'none';
        }
    }

    /**
     * 在地圖上新增廁所標記
     * @param {Array} toilets - 廁所列表
     * @param {Object} location - 使用者位置
     */
    addToiletsToMap(toilets, location = null) {
        // 地圖功能維護中，不執行地圖相關操作
        console.log('地圖功能維護中，跳過地圖標記操作');
    }

    /**
     * 搜尋頁面啟用時的回調
     */
    onSearchPageActivated() {
        // 如果沒有搜尋結果，顯示載入指示器並載入初始資料
        if (this.currentResults.length === 0) {
            this.browseAllToilets();
        }
    }

    /**
     * 取得當前搜尋結果
     * @returns {Array} 搜尋結果
     */
    getCurrentResults() {
        return [...this.currentResults];
    }

    /**
     * 取得當前篩選條件
     * @returns {Object} 篩選條件
     */
    getCurrentFilters() {
        return { ...this.currentFilters };
    }

    /**
     * 清除搜尋結果
     */
    clearResults() {
        this.currentResults = [];
        this.currentFilters = {};
        this.currentPage = 1;
        
        const toiletsList = document.querySelector('#toiletsList');
        if (toiletsList) {
            toiletsList.innerHTML = '';
        }
        
        this.showNoResults();
        this.updateResultsCount(0);
    }
}

// 建立全域實例
const searchService = new SearchService();

// 全域匯出
window.SearchService = searchService;

// 全域函數
window.showToiletDetailsModal = (toilet) => {
    searchService.openToiletModal(toilet);
};

window.toggleFavorite = (toiletId) => {
    if (window.API && window.API.favorites) {
        if (window.API.favorites.isFavorite(toiletId)) {
            window.API.favorites.removeFavorite(toiletId);
            if (window.Utils && window.Utils.showMessage) {
                window.Utils.showMessage('已取消收藏', 'info');
            }
        } else {
            window.API.favorites.addFavorite(toiletId);
            if (window.Utils && window.Utils.showMessage) {
                window.Utils.showMessage('已加入收藏', 'success');
            }
        }
        
        // 重新整理模態框內容
        const modal = document.querySelector('#toiletModal');
        if (modal && modal.classList.contains('show')) {
            const toilet = searchService.currentResults.find(t => t.id === toiletId);
            if (toilet) {
                searchService.openToiletModal(toilet);
            }
        }
    }
};

window.navigateToToilet = (toiletId) => {
    if (window.Utils && window.Utils.showMessage) {
        window.Utils.showMessage('導航功能維護中，請稍後再試', 'warning');
    }
};

window.copyToiletInfo = async (toiletId) => {
    const toilet = searchService.currentResults.find(t => t.id === toiletId);
    if (toilet) {
        const info = `${toilet.name}\n${toilet.address}\n${toilet.type} - ${toilet.grade}\n管理單位: ${toilet.management}`;
        if (window.Utils && window.Utils.copyToClipboard) {
            const success = await window.Utils.copyToClipboard(info);
            if (success) {
                if (window.Utils.showMessage) {
                    window.Utils.showMessage('廁所資訊已複製到剪貼板', 'success');
                }
            } else {
                if (window.Utils.showMessage) {
                    window.Utils.showMessage('複製失敗', 'error');
                }
            }
        }
    }
};
