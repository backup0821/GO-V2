// 無障礙廁所GO V2 - 導航功能

/**
 * 導航服務類別
 */
class NavigationService {
    constructor() {
        this.currentPage = 'home';
        this.isInitialized = false;
        this.pageHistory = [];
        this.maxHistoryLength = 10;
    }

    /**
     * 初始化導航功能
     */
    initialize() {
        if (this.isInitialized) return;
        
        this.setupNavigation();
        this.setupPageTransitions();
        this.setupMobileMenu();
        this.setupBreadcrumbs();
        this.setupPageVisibility();
        
        // 初始化當前頁面
        this.initializeCurrentPage();
        
        this.isInitialized = true;
        console.log('導航功能已初始化');
    }

    /**
     * 設定導航
     */
    setupNavigation() {
        // 導航連結點擊事件
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const pageId = link.getAttribute('href').substring(1);
                this.navigateToPage(pageId);
            });
        });

        // 手機版選單切換
        const navToggle = document.querySelector('.nav-toggle');
        if (navToggle) {
            navToggle.addEventListener('click', () => {
                this.toggleMobileMenu();
            });
        }

        // 位置按鈕
        const locationBtn = document.querySelector('.btn-location');
        if (locationBtn) {
            locationBtn.addEventListener('click', () => {
                this.handleLocationRequest();
            });
        }

        // 無障礙設定按鈕
        const accessibilityBtn = document.querySelector('.btn-accessibility');
        if (accessibilityBtn) {
            accessibilityBtn.addEventListener('click', () => {
                this.navigateToPage('accessibility');
            });
        }

        // 浮動無障礙按鈕
        const floatBtn = document.querySelector('#accessibilityFloatBtn');
        if (floatBtn) {
            floatBtn.addEventListener('click', () => {
                this.navigateToPage('accessibility');
            });
        }
    }

    /**
     * 設定頁面轉場效果
     */
    setupPageTransitions() {
        // 為頁面區塊添加轉場類別
        const pageSections = document.querySelectorAll('.page-section');
        pageSections.forEach(section => {
            section.classList.add('page-transition');
        });
    }

    /**
     * 設定手機版選單
     */
    setupMobileMenu() {
        // 點擊外部關閉選單
        document.addEventListener('click', (e) => {
            const navMenu = document.querySelector('.nav-menu');
            const navToggle = document.querySelector('.nav-toggle');
            
            if (navMenu && navMenu.classList.contains('active') && 
                !navMenu.contains(e.target) && 
                !navToggle.contains(e.target)) {
                this.closeMobileMenu();
            }
        });

        // 視窗大小變化時調整選單
        window.addEventListener('resize', Utils.debounce(() => {
            if (window.innerWidth > 768) {
                this.closeMobileMenu();
            }
        }, 250));
    }

    /**
     * 設定麵包屑導航
     */
    setupBreadcrumbs() {
        // 動態生成麵包屑
        this.updateBreadcrumbs();
    }

    /**
     * 設定頁面可見性
     */
    setupPageVisibility() {
        // 監聽頁面可見性變化
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.onPageHidden();
            } else {
                this.onPageVisible();
            }
        });

        // 監聽頁面載入完成
        window.addEventListener('load', () => {
            this.onPageLoad();
        });

        // 監聽頁面卸載
        window.addEventListener('beforeunload', () => {
            this.onPageUnload();
        });
    }

    /**
     * 初始化當前頁面
     */
    initializeCurrentPage() {
        // 從 URL hash 或預設頁面開始
        const hash = window.location.hash.substring(1);
        const initialPage = hash || 'home';
        
        // 不觸發歷史記錄
        this.navigateToPage(initialPage, false);
    }

    /**
     * 導航到指定頁面
     * @param {string} pageId - 頁面ID
     * @param {boolean} addToHistory - 是否加入歷史記錄
     */
    navigateToPage(pageId, addToHistory = true) {
        if (!this.isValidPage(pageId)) {
            console.warn(`無效的頁面ID: ${pageId}`);
            return;
        }

        // 關閉手機版選單
        this.closeMobileMenu();

        // 隱藏當前頁面
        this.hideCurrentPage();

        // 顯示新頁面
        this.showPage(pageId);

        // 更新導航狀態
        this.updateNavigationState(pageId);

        // 加入歷史記錄
        if (addToHistory) {
            this.addToHistory(pageId);
        }

        // 更新 URL hash
        this.updateURL(pageId);

        // 更新麵包屑
        this.updateBreadcrumbs();

        // 聚焦到頁面標題
        this.focusPageTitle(pageId);

        // 觸發頁面變化事件
        this.triggerPageChangeEvent(pageId);

        this.currentPage = pageId;
    }

    /**
     * 檢查頁面ID是否有效
     * @param {string} pageId - 頁面ID
     * @returns {boolean} 是否有效
     */
    isValidPage(pageId) {
        const validPages = ['home', 'search', 'accessibility', 'about'];
        return validPages.includes(pageId);
    }

    /**
     * 隱藏當前頁面
     */
    hideCurrentPage() {
        const currentSection = document.querySelector(`#${this.currentPage}`);
        if (currentSection) {
            currentSection.classList.remove('active');
            currentSection.setAttribute('aria-hidden', 'true');
        }
    }

    /**
     * 顯示指定頁面
     * @param {string} pageId - 頁面ID
     */
    showPage(pageId) {
        const targetSection = document.querySelector(`#${pageId}`);
        if (targetSection) {
            targetSection.classList.add('active');
            targetSection.setAttribute('aria-hidden', 'false');
            
            // 滾動到頁面頂部
            targetSection.scrollIntoView({ behavior: 'smooth' });
        }
    }

    /**
     * 更新導航狀態
     * @param {string} pageId - 頁面ID
     */
    updateNavigationState(pageId) {
        // 移除所有導航連結的活動狀態
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.classList.remove('active');
            link.removeAttribute('aria-current');
        });

        // 設定當前頁面的導航連結為活動狀態
        const activeLink = document.querySelector(`.nav-link[href="#${pageId}"]`);
        if (activeLink) {
            activeLink.classList.add('active');
            activeLink.setAttribute('aria-current', 'page');
        }
    }

    /**
     * 加入歷史記錄
     * @param {string} pageId - 頁面ID
     */
    addToHistory(pageId) {
        if (this.pageHistory.length >= this.maxHistoryLength) {
            this.pageHistory.shift();
        }
        
        this.pageHistory.push(pageId);
    }

    /**
     * 更新 URL hash
     * @param {string} pageId - 頁面ID
     */
    updateURL(pageId) {
        if (window.location.hash !== `#${pageId}`) {
            window.history.pushState(null, null, `#${pageId}`);
        }
    }

    /**
     * 更新麵包屑導航
     */
    updateBreadcrumbs() {
        // 建立麵包屑容器
        let breadcrumbContainer = document.querySelector('.breadcrumb-container');
        if (!breadcrumbContainer) {
            breadcrumbContainer = document.createElement('nav');
            breadcrumbContainer.className = 'breadcrumb-container';
            breadcrumbContainer.setAttribute('aria-label', '麵包屑導航');
            
            const mainContent = document.querySelector('#main-content');
            if (mainContent) {
                mainContent.insertBefore(breadcrumbContainer, mainContent.firstChild);
            }
        }

        // 生成麵包屑
        const breadcrumbs = this.generateBreadcrumbs();
        breadcrumbContainer.innerHTML = breadcrumbs;
    }

    /**
     * 生成麵包屑HTML
     * @returns {string} 麵包屑HTML
     */
    generateBreadcrumbs() {
        const breadcrumbItems = [
            { id: 'home', label: '首頁' },
            { id: this.currentPage, label: this.getPageTitle(this.currentPage) }
        ];

        if (this.currentPage === 'home') {
            return '';
        }

        const breadcrumbHTML = breadcrumbItems.map((item, index) => {
            const isLast = index === breadcrumbItems.length - 1;
            const separator = isLast ? '' : '<span class="breadcrumb-separator" aria-hidden="true">></span>';
            
            return `
                <a href="#${item.id}" class="breadcrumb-item ${isLast ? 'current' : ''}" 
                   ${isLast ? 'aria-current="page"' : ''}>
                    ${item.label}
                </a>
                ${separator}
            `;
        }).join('');

        return `
            <ol class="breadcrumb">
                ${breadcrumbHTML}
            </ol>
        `;
    }

    /**
     * 取得頁面標題
     * @param {string} pageId - 頁面ID
     * @returns {string} 頁面標題
     */
    getPageTitle(pageId) {
        const titles = {
            home: '首頁',
            search: '搜尋廁所',
            accessibility: '無障礙設定',
            about: '關於我們'
        };
        return titles[pageId] || pageId;
    }

    /**
     * 聚焦頁面標題
     * @param {string} pageId - 頁面ID
     */
    focusPageTitle(pageId) {
        setTimeout(() => {
            const pageTitle = document.querySelector(`#${pageId} .page-title, #${pageId} h2, #${pageId} h1`);
            if (pageTitle) {
                pageTitle.focus();
                pageTitle.scrollIntoView({ behavior: 'smooth' });
            }
        }, 100);
    }

    /**
     * 觸發頁面變化事件
     * @param {string} pageId - 頁面ID
     */
    triggerPageChangeEvent(pageId) {
        const event = new CustomEvent('pageChanged', {
            detail: {
                from: this.currentPage,
                to: pageId,
                timestamp: Date.now()
            }
        });
        document.dispatchEvent(event);
    }

    /**
     * 切換手機版選單
     */
    toggleMobileMenu() {
        const navMenu = document.querySelector('.nav-menu');
        const navToggle = document.querySelector('.nav-toggle');
        
        if (navMenu && navToggle) {
            const isOpen = navMenu.classList.contains('active');
            
            if (isOpen) {
                this.closeMobileMenu();
            } else {
                this.openMobileMenu();
            }
        }
    }

    /**
     * 開啟手機版選單
     */
    openMobileMenu() {
        const navMenu = document.querySelector('.nav-menu');
        const navToggle = document.querySelector('.nav-toggle');
        
        if (navMenu && navToggle) {
            navMenu.classList.add('active');
            navToggle.setAttribute('aria-expanded', 'true');
            
            // 聚焦到第一個導航項目
            const firstNavLink = navMenu.querySelector('.nav-link');
            if (firstNavLink) {
                firstNavLink.focus();
            }
        }
    }

    /**
     * 關閉手機版選單
     */
    closeMobileMenu() {
        const navMenu = document.querySelector('.nav-menu');
        const navToggle = document.querySelector('.nav-toggle');
        
        if (navMenu && navToggle) {
            navMenu.classList.remove('active');
            navToggle.setAttribute('aria-expanded', 'false');
        }
    }

    /**
     * 處理位置請求
     */
    async handleLocationRequest() {
        try {
            if (window.Utils && window.Utils.showMessage) {
                window.Utils.showMessage('正在取得位置資訊...', 'info');
            }
            
            const location = await window.API.location.getCurrentPosition();
            
            // 搜尋附近廁所（不使用地圖功能）
            const nearbyToilets = await window.API.service.searchNearbyToilets({
                location: location,
                limit: 20
            });
            
            if (window.Utils && window.Utils.showMessage) {
                window.Utils.showMessage('位置資訊已取得（地圖功能維護中）', 'success');
            }
            
            // 切換到搜尋頁面並顯示結果
            this.navigateToPage('search');
            
            // 觸發搜尋結果顯示事件
            const event = new CustomEvent('showSearchResults', {
                detail: {
                    toilets: nearbyToilets.toilets || [],
                    location: location
                }
            });
            document.dispatchEvent(event);
            
        } catch (error) {
            console.error('位置請求失敗:', error);
            if (window.Utils && window.Utils.showMessage) {
                window.Utils.showMessage(error.message, 'error');
            }
        }
    }

    /**
     * 返回上一頁
     */
    goBack() {
        if (this.pageHistory.length > 1) {
            this.pageHistory.pop(); // 移除當前頁面
            const previousPage = this.pageHistory[this.pageHistory.length - 1];
            this.navigateToPage(previousPage, false);
        }
    }

    /**
     * 重新載入當前頁面
     */
    reload() {
        this.navigateToPage(this.currentPage, false);
    }

    /**
     * 取得當前頁面
     * @returns {string} 當前頁面ID
     */
    getCurrentPage() {
        return this.currentPage;
    }

    /**
     * 取得頁面歷史
     * @returns {Array} 頁面歷史
     */
    getHistory() {
        return [...this.pageHistory];
    }

    /**
     * 頁面隱藏時的回調
     */
    onPageHidden() {
        // 暫停動畫和計時器
        console.log('頁面已隱藏');
    }

    /**
     * 頁面可見時的回調
     */
    onPageVisible() {
        // 恢復動畫和計時器
        console.log('頁面已可見');
    }

    /**
     * 頁面載入完成的回調
     */
    onPageLoad() {
        // 頁面載入完成後的初始化
        console.log('頁面載入完成');
    }

    /**
     * 頁面卸載時的回調
     */
    onPageUnload() {
        // 清理資源
        console.log('頁面卸載');
    }

    /**
     * 銷毀導航服務
     */
    destroy() {
        this.isInitialized = false;
        this.pageHistory = [];
    }
}

// 建立全域實例
const navigationService = new NavigationService();

// 全域匯出
window.NavigationService = navigationService;
window.navigateToPage = (pageId) => navigationService.navigateToPage(pageId);
