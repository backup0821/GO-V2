// 無障礙廁所GO V2 - 主要應用程式

/**
 * 主要應用程式類別
 */
class App {
    constructor() {
        this.isInitialized = false;
        this.services = {};
        this.version = '2.0.0';
    }

    /**
     * 初始化應用程式
     */
    async initialize() {
        if (this.isInitialized) {
            console.warn('應用程式已經初始化');
            return;
        }

        try {
            console.log(`無障礙廁所GO V2 v${this.version} 正在初始化...`);

            // 檢查維護狀態
            await this.checkMaintenanceStatus();

            // 初始化服務
            await this.initializeServices();

            // 設定事件監聽器
            this.setupEventListeners();

            // 初始化統計動畫
            this.initializeStatsAnimation();

            // 檢查網路狀態
            this.setupNetworkStatus();

            // 設定錯誤處理
            this.setupErrorHandling();

            // 設定效能監控
            this.setupPerformanceMonitoring();

            this.isInitialized = true;
            console.log('應用程式初始化完成');

            // 觸發應用程式就緒事件
            this.triggerAppReadyEvent();

        } catch (error) {
            console.error('應用程式初始化失敗:', error);
            this.handleInitializationError(error);
        }
    }

    /**
     * 檢查維護狀態
     */
    async checkMaintenanceStatus() {
        try {
            const response = await fetch('maintenance-status.json');
            if (response.ok) {
                const data = await response.json();
                if (data.maintenance === true) {
                    console.log('系統正在維護中，但當前頁面已經是維護頁面，不需要跳轉');
                    // 不再自動跳轉，因為維護模式時 index.html 已經被替換成維護頁面
                    return;
                }
            }
        } catch (error) {
            console.log('無法檢查維護狀態，繼續正常初始化');
        }
    }

    /**
     * 初始化服務
     */
    async initializeServices() {
        // 等待所有腳本載入完成
        await this.waitForServices();
        
        // 檢查並初始化無障礙服務
        if (window.AccessibilityService && typeof window.AccessibilityService.initialize === 'function') {
            window.AccessibilityService.initialize();
            this.services.accessibility = window.AccessibilityService;
            console.log('✅ 無障礙服務已初始化');
        } else {
            console.warn('⚠️ 無障礙服務載入失敗，將使用基本功能');
        }

        // 檢查並初始化導航服務
        if (window.NavigationService && typeof window.NavigationService.initialize === 'function') {
            window.NavigationService.initialize();
            this.services.navigation = window.NavigationService;
            console.log('✅ 導航服務已初始化');
        } else {
            console.warn('⚠️ 導航服務載入失敗，將使用基本功能');
        }

        // 檢查並初始化搜尋服務
        if (window.SearchService && typeof window.SearchService.initialize === 'function') {
            window.SearchService.initialize();
            this.services.search = window.SearchService;
            console.log('✅ 搜尋服務已初始化');
        } else {
            console.warn('⚠️ 搜尋服務載入失敗，將使用基本功能');
        }

        // 檢查並初始化地圖服務（延遲初始化）
        if (window.MapService) {
            this.services.map = window.MapService;
            console.log('✅ 地圖服務已載入');
        } else {
            console.warn('⚠️ 地圖服務載入失敗，地圖功能將不可用');
        }

        console.log('服務初始化完成');
    }

    /**
     * 等待服務載入完成
     */
    async waitForServices() {
        return new Promise((resolve) => {
            const checkServices = () => {
                if (window.CONFIG && window.Utils && window.API) {
                    resolve();
                } else {
                    setTimeout(checkServices, 50);
                }
            };
            checkServices();
        });
    }

    /**
     * 設定事件監聽器
     */
    setupEventListeners() {
        // 無障礙設定變更事件
        document.addEventListener('accessibilitySettingsChanged', (e) => {
            this.onAccessibilitySettingsChanged(e.detail);
        });

        // 頁面變化事件
        document.addEventListener('pageChanged', (e) => {
            this.onPageChanged(e.detail);
        });

        // 搜尋結果顯示事件
        document.addEventListener('searchResultsDisplayed', (e) => {
            this.onSearchResultsDisplayed(e.detail);
        });

        // 視窗大小變化事件
        window.addEventListener('resize', window.Utils && window.Utils.debounce ? 
            window.Utils.debounce(() => {
                this.onWindowResize();
            }, 250) : 
            () => {
                this.onWindowResize();
            });

        // 視窗滾動事件
        window.addEventListener('scroll', window.Utils && window.Utils.throttle ? 
            window.Utils.throttle(() => {
                this.onWindowScroll();
            }, 100) : 
            () => {
                this.onWindowScroll();
            });

        // 鍵盤事件
        document.addEventListener('keydown', (e) => {
            this.handleGlobalKeyboardEvents(e);
        });

        console.log('事件監聽器已設定');
    }

    /**
     * 初始化統計動畫
     */
    initializeStatsAnimation() {
        const statNumbers = document.querySelectorAll('.stat-number[data-target]');
        
        const animateStats = () => {
            statNumbers.forEach(stat => {
                const target = parseInt(stat.getAttribute('data-target'));
                const duration = 2000; // 2秒
                const increment = target / (duration / 16); // 60fps
                let current = 0;
                
                const timer = setInterval(() => {
                    current += increment;
                    if (current >= target) {
                        current = target;
                        clearInterval(timer);
                    }
                    stat.textContent = Utils.formatNumber(Math.floor(current));
                }, 16);
            });
        };

        // 當統計區塊進入視窗時開始動畫
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateStats();
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        const statsSection = document.querySelector('.stats-section');
        if (statsSection) {
            observer.observe(statsSection);
        }
    }

    /**
     * 設定網路狀態監控
     */
    setupNetworkStatus() {
        // 監聽線上/離線狀態
        window.addEventListener('online', () => {
            Utils.showMessage('網路連線已恢復', 'success');
            this.onNetworkStatusChanged(true);
        });

        window.addEventListener('offline', () => {
            Utils.showMessage('網路連線已中斷', 'warning');
            this.onNetworkStatusChanged(false);
        });

        // 初始檢查網路狀態
        this.onNetworkStatusChanged(navigator.onLine);
    }

    /**
     * 設定錯誤處理
     */
    setupErrorHandling() {
        // 全域錯誤處理
        window.addEventListener('error', (e) => {
            this.handleGlobalError(e.error, e.filename, e.lineno);
        });

        // Promise 拒絕處理
        window.addEventListener('unhandledrejection', (e) => {
            this.handlePromiseRejection(e.reason);
        });
    }

    /**
     * 設定效能監控
     */
    setupPerformanceMonitoring() {
        // 頁面載入效能
        window.addEventListener('load', () => {
            setTimeout(() => {
                this.measurePerformance();
            }, 1000);
        });
    }

    /**
     * 無障礙設定變更處理
     * @param {Object} settings - 新的設定
     */
    onAccessibilitySettingsChanged(settings) {
        console.log('無障礙設定已更新:', settings);
        
        // 更新設定介面
        this.updateAccessibilitySettingsUI(settings);
        
        // 通知其他模組
        this.notifyServicesOfSettingsChange(settings);
    }

    /**
     * 更新無障礙設定介面
     * @param {Object} settings - 設定
     */
    updateAccessibilitySettingsUI(settings) {
        // 更新開關狀態
        const toggles = {
            highContrastToggle: settings.highContrast,
            largeTextToggle: settings.largeText,
            keyboardNavToggle: settings.keyboardNavigation,
            reducedMotionToggle: settings.reducedMotion,
            screenReaderToggle: settings.screenReader
        };

        Object.entries(toggles).forEach(([id, value]) => {
            const toggle = document.querySelector(`#${id}`);
            if (toggle) {
                toggle.checked = value;
            }
        });

        // 更新字體大小滑桿
        const fontSizeSlider = document.querySelector('#fontSizeSlider');
        const fontSizeValue = document.querySelector('#fontSizeValue');
        if (fontSizeSlider && fontSizeValue) {
            fontSizeSlider.value = settings.fontSize;
            fontSizeValue.textContent = `${settings.fontSize}%`;
        }
    }

    /**
     * 通知服務設定變更
     * @param {Object} settings - 設定
     */
    notifyServicesOfSettingsChange(settings) {
        // 可以在此處通知其他需要響應設定變更的服務
        console.log('通知服務設定變更:', settings);
    }

    /**
     * 頁面變化處理
     * @param {Object} detail - 頁面變化詳情
     */
    onPageChanged(detail) {
        console.log('頁面已變更:', detail);
        
        // 更新頁面標題
        this.updatePageTitle(detail.to);
        
        // 追蹤頁面瀏覽
        this.trackPageView(detail.to);
        
        // 清理上一頁的資源
        this.cleanupPreviousPage(detail.from);
    }

    /**
     * 更新頁面標題
     * @param {string} pageId - 頁面ID
     */
    updatePageTitle(pageId) {
        const titles = {
            home: '首頁',
            search: '搜尋廁所',
            accessibility: '無障礙設定',
            about: '關於我們'
        };
        
        const pageTitle = titles[pageId] || '無障礙廁所GO V2';
        document.title = `${pageTitle} - 無障礙廁所GO V2`;
    }

    /**
     * 追蹤頁面瀏覽
     * @param {string} pageId - 頁面ID
     */
    trackPageView(pageId) {
        // 這裡可以整合分析工具
        console.log(`頁面瀏覽: ${pageId}`);
    }

    /**
     * 清理上一頁資源
     * @param {string} pageId - 頁面ID
     */
    cleanupPreviousPage(pageId) {
        // 清理不需要的資源
        switch (pageId) {
            case 'search':
                // 清理搜尋相關資源
                break;
            case 'accessibility':
                // 清理無障礙設定相關資源
                break;
        }
    }

    /**
     * 搜尋結果顯示處理
     * @param {Object} detail - 搜尋結果詳情
     */
    onSearchResultsDisplayed(detail) {
        console.log('搜尋結果已顯示:', detail.toilets.length, '個結果');
        
        // 追蹤搜尋行為
        this.trackSearch(detail);
        
        // 更新地圖（如果需要）
        if (detail.toilets.length > 0 && window.MapService && window.MapService.isInitialized) {
            // 地圖更新邏輯
        }
    }

    /**
     * 追蹤搜尋行為
     * @param {Object} detail - 搜尋詳情
     */
    trackSearch(detail) {
        // 這裡可以整合分析工具
        console.log('搜尋追蹤:', {
            resultsCount: detail.toilets.length,
            hasLocation: !!detail.location
        });
    }

    /**
     * 視窗大小變化處理
     */
    onWindowResize() {
        // 調整地圖大小
        if (window.MapService && window.MapService.isInitialized && window.MapService.map) {
            setTimeout(() => {
                if (window.google && window.google.maps) {
                    window.google.maps.event.trigger(window.MapService.map, 'resize');
                }
            }, 100);
        }
        
        // 調整其他響應式元素
        this.adjustResponsiveElements();
    }

    /**
     * 調整響應式元素
     */
    adjustResponsiveElements() {
        // 調整模態框大小
        const modals = document.querySelectorAll('.modal.show');
        modals.forEach(modal => {
            const modalContent = modal.querySelector('.modal-content');
            if (modalContent) {
                // 確保模態框在視窗內
                const maxHeight = window.innerHeight * 0.9;
                modalContent.style.maxHeight = `${maxHeight}px`;
            }
        });
    }

    /**
     * 視窗滾動處理
     */
    onWindowScroll() {
        // 滾動時的行為
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // 浮動按鈕顯示/隱藏
        this.toggleFloatingButton(scrollTop);
        
        // 導航列陰影
        this.toggleNavbarShadow(scrollTop);
    }

    /**
     * 切換浮動按鈕顯示
     * @param {number} scrollTop - 滾動位置
     */
    toggleFloatingButton(scrollTop) {
        const floatBtn = document.querySelector('#accessibilityFloatBtn');
        if (floatBtn) {
            if (scrollTop > 100) {
                floatBtn.style.opacity = '1';
                floatBtn.style.visibility = 'visible';
            } else {
                floatBtn.style.opacity = '0';
                floatBtn.style.visibility = 'hidden';
            }
        }
    }

    /**
     * 切換導航列陰影
     * @param {number} scrollTop - 滾動位置
     */
    toggleNavbarShadow(scrollTop) {
        const header = document.querySelector('.header');
        if (header) {
            if (scrollTop > 10) {
                header.style.boxShadow = 'var(--shadow-md)';
            } else {
                header.style.boxShadow = 'var(--shadow-sm)';
            }
        }
    }

    /**
     * 處理全域鍵盤事件
     * @param {KeyboardEvent} e - 鍵盤事件
     */
    handleGlobalKeyboardEvents(e) {
        // 全域快捷鍵處理
        if (e.ctrlKey && e.key === 'k') {
            e.preventDefault();
            this.focusSearchInput();
        }
    }

    /**
     * 聚焦搜尋輸入框
     */
    focusSearchInput() {
        const searchInput = document.querySelector('#searchInput, #searchInputPage');
        if (searchInput) {
            searchInput.focus();
            searchInput.select();
        }
    }

    /**
     * 網路狀態變化處理
     * @param {boolean} isOnline - 是否線上
     */
    onNetworkStatusChanged(isOnline) {
        // 更新 UI 狀態
        const body = document.body;
        if (isOnline) {
            body.classList.remove('offline');
            body.classList.add('online');
        } else {
            body.classList.remove('online');
            body.classList.add('offline');
        }
        
        // 通知服務網路狀態變化
        if (window.API && window.API.service) {
            // API 服務可以根據網路狀態調整行為
        }
    }

    /**
     * 處理全域錯誤
     * @param {Error} error - 錯誤物件
     * @param {string} filename - 檔案名稱
     * @param {number} lineno - 行號
     */
    handleGlobalError(error, filename, lineno) {
        console.error('全域錯誤:', error, filename, lineno);
        
        // 記錄錯誤
        this.logError(error, { filename, lineno });
        
        // 顯示使用者友善的錯誤訊息
        if (window.Utils && window.Utils.showMessage) {
            window.Utils.showMessage('發生錯誤，請重新整理頁面', 'error');
        }
    }

    /**
     * 處理 Promise 拒絕
     * @param {*} reason - 拒絕原因
     */
    handlePromiseRejection(reason) {
        console.error('未處理的 Promise 拒絕:', reason);
        
        // 記錄錯誤
        this.logError(reason);
        
        // 顯示使用者友善的錯誤訊息
        if (window.Utils && window.Utils.showMessage) {
            window.Utils.showMessage('發生錯誤，請稍後再試', 'error');
        }
    }

    /**
     * 記錄錯誤
     * @param {*} error - 錯誤
     * @param {Object} context - 錯誤上下文
     */
    logError(error, context = {}) {
        const errorInfo = {
            message: error.message || error.toString(),
            stack: error.stack,
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent,
            url: window.location.href,
            ...context
        };
        
        // 這裡可以將錯誤發送到錯誤追蹤服務
        console.log('錯誤記錄:', errorInfo);
    }

    /**
     * 測量效能
     */
    measurePerformance() {
        if (window.performance && window.performance.timing) {
            const timing = window.performance.timing;
            const loadTime = timing.loadEventEnd - timing.navigationStart;
            
            console.log(`頁面載入時間: ${loadTime}ms`);
            
            // 這裡可以將效能資料發送到分析服務
        }
    }

    /**
     * 處理初始化錯誤
     * @param {Error} error - 錯誤
     */
    handleInitializationError(error) {
        console.error('初始化錯誤:', error);
        
        // 顯示錯誤頁面或降級處理
        this.showErrorPage(error);
    }

    /**
     * 顯示錯誤頁面
     * @param {Error} error - 錯誤
     */
    showErrorPage(error) {
        const mainContent = document.querySelector('#main-content');
        if (mainContent) {
            mainContent.innerHTML = `
                <div class="error-page">
                    <div class="container">
                        <h1>應用程式載入失敗</h1>
                        <p>很抱歉，應用程式無法正常載入。請重新整理頁面或稍後再試。</p>
                        <button class="btn-primary" onclick="location.reload()">
                            <i class="fas fa-refresh" aria-hidden="true"></i>
                            重新整理頁面
                        </button>
                        <details class="error-details">
                            <summary>技術詳情</summary>
                            <pre>${error.message}</pre>
                        </details>
                    </div>
                </div>
            `;
        }
    }

    /**
     * 觸發應用程式就緒事件
     */
    triggerAppReadyEvent() {
        const event = new CustomEvent('appReady', {
            detail: {
                version: this.version,
                timestamp: Date.now()
            }
        });
        document.dispatchEvent(event);
    }

    /**
     * 取得應用程式資訊
     * @returns {Object} 應用程式資訊
     */
    getAppInfo() {
        return {
            version: this.version,
            isInitialized: this.isInitialized,
            services: Object.keys(this.services),
            userAgent: navigator.userAgent,
            language: navigator.language,
            online: navigator.onLine
        };
    }

    /**
     * 銷毀應用程式
     */
    destroy() {
        // 清理服務
        Object.values(this.services).forEach(service => {
            if (service && typeof service.destroy === 'function') {
                service.destroy();
            }
        });
        
        // 清理事件監聽器
        // (這裡可以添加更多清理邏輯)
        
        this.isInitialized = false;
        console.log('應用程式已銷毀');
    }
}

// 建立應用程式實例
const app = new App();

// 當 DOM 載入完成時初始化應用程式
document.addEventListener('DOMContentLoaded', () => {
    // 延遲初始化以確保所有腳本都已載入
    setTimeout(() => {
        app.initialize();
    }, 100);
});

// 全域匯出
window.App = app;

// 全域應用程式就緒事件監聽器
document.addEventListener('appReady', () => {
    console.log('應用程式已就緒');
    
    // 可以在此處添加應用程式就緒後的初始化邏輯
    // 例如：載入初始資料、顯示歡迎訊息等
    
    // 顯示歡迎訊息
    setTimeout(() => {
        if (window.Utils && window.Utils.showMessage) {
            window.Utils.showMessage('歡迎使用無障礙廁所GO V2！', 'info', 3000);
        }
    }, 1000);
});
