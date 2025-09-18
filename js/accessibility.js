// 無障礙廁所GO V2 - 無障礙功能

/**
 * 無障礙服務類別
 */
class AccessibilityService {
    constructor() {
        this.settings = this.loadSettings();
        this.isInitialized = false;
        this.observers = [];
    }

    /**
     * 初始化無障礙功能
     */
    initialize() {
        if (this.isInitialized) return;
        
        this.setupKeyboardNavigation();
        this.setupScreenReader();
        this.setupFocusManagement();
        this.setupARIALabels();
        this.setupHighContrast();
        this.setupFontSize();
        this.setupReducedMotion();
        this.setupColorBlindSupport();
        
        this.applySettings();
        this.isInitialized = true;
        
        console.log('無障礙功能已初始化');
    }

    /**
     * 載入無障礙設定
     * @returns {Object} 無障礙設定
     */
    loadSettings() {
        const defaultSettings = {
            highContrast: false,
            largeText: false,
            fontSize: 100,
            keyboardNavigation: false,
            reducedMotion: false,
            screenReader: false,
            colorBlindSupport: false
        };

        // 安全地載入設定，避免在初始化時出錯
        try {
            if (window.Utils && window.Utils.Storage) {
                const savedSettings = window.Utils.Storage.get('accessibility_settings');
                return savedSettings ? { ...defaultSettings, ...savedSettings } : defaultSettings;
            }
        } catch (error) {
            console.warn('載入無障礙設定時發生錯誤，使用預設設定:', error);
        }
        
        return defaultSettings;
    }

    /**
     * 儲存無障礙設定
     */
    saveSettings() {
        if (window.Utils && window.Utils.Storage) {
            window.Utils.Storage.set('accessibility_settings', this.settings);
        }
    }

    /**
     * 更新無障礙設定
     * @param {Object} newSettings - 新的設定
     */
    updateSettings(newSettings) {
        this.settings = { ...this.settings, ...newSettings };
        this.applySettings();
        this.saveSettings();
        
        // 通知其他模組設定已更新
        this.notifySettingsChanged();
    }

    /**
     * 應用無障礙設定
     */
    applySettings() {
        this.applyHighContrast();
        this.applyFontSize();
        this.applyKeyboardNavigation();
        this.applyReducedMotion();
        this.applyScreenReader();
        this.applyColorBlindSupport();
    }

    /**
     * 設定鍵盤導航
     */
    setupKeyboardNavigation() {
        // 跳過連結
        const skipLink = document.querySelector('.skip-link');
        if (skipLink) {
            skipLink.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(skipLink.getAttribute('href'));
                if (target) {
                    target.focus();
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            });
        }

        // 鍵盤快捷鍵
        document.addEventListener('keydown', (e) => {
            this.handleKeyboardShortcuts(e);
        });

        // Tab 鍵導航
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                this.handleTabNavigation(e);
            }
        });

        // 焦點管理
        this.setupFocusTrapping();
    }

    /**
     * 處理鍵盤快捷鍵
     * @param {KeyboardEvent} e - 鍵盤事件
     */
    handleKeyboardShortcuts(e) {
        // Alt + 數字鍵導航
        if (e.altKey && e.key >= '1' && e.key <= '4') {
            e.preventDefault();
            const pageIndex = parseInt(e.key) - 1;
            const pages = ['home', 'search', 'accessibility', 'about'];
            if (pages[pageIndex]) {
                this.navigateToPage(pages[pageIndex]);
            }
        }

        // Ctrl + / 搜尋
        if (e.ctrlKey && e.key === '/') {
            e.preventDefault();
            this.focusSearchInput();
        }

        // Alt + A 無障礙設定
        if (e.altKey && e.key.toLowerCase() === 'a') {
            e.preventDefault();
            this.openAccessibilitySettings();
        }

        // Esc 關閉模態框
        if (e.key === 'Escape') {
            this.closeModals();
        }
    }

    /**
     * 處理 Tab 鍵導航
     * @param {KeyboardEvent} e - 鍵盤事件
     */
    handleTabNavigation(e) {
        const focusableElements = this.getFocusableElements();
        const currentIndex = focusableElements.indexOf(document.activeElement);
        
        if (e.shiftKey) {
            // Shift + Tab (向後)
            if (currentIndex <= 0) {
                e.preventDefault();
                focusableElements[focusableElements.length - 1].focus();
            }
        } else {
            // Tab (向前)
            if (currentIndex >= focusableElements.length - 1) {
                e.preventDefault();
                focusableElements[0].focus();
            }
        }
    }

    /**
     * 取得可聚焦元素列表
     * @returns {Array} 可聚焦元素列表
     */
    getFocusableElements() {
        const focusableSelectors = [
            'a[href]',
            'button:not([disabled])',
            'input:not([disabled])',
            'select:not([disabled])',
            'textarea:not([disabled])',
            '[tabindex]:not([tabindex="-1"])',
            'area[href]',
            'iframe',
            'object',
            'embed'
        ].join(', ');

        return Array.from(document.querySelectorAll(focusableSelectors))
            .filter(element => {
                return element.offsetParent !== null && 
                       !element.hasAttribute('aria-hidden') &&
                       element.style.display !== 'none';
            });
    }

    /**
     * 設定焦點陷阱
     */
    setupFocusTrapping() {
        // 為模態框設定焦點陷阱
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => {
            const focusableElements = modal.querySelectorAll(
                'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
            );
            
            if (focusableElements.length > 0) {
                const firstElement = focusableElements[0];
                const lastElement = focusableElements[focusableElements.length - 1];

                modal.addEventListener('keydown', (e) => {
                    if (e.key === 'Tab') {
                        if (e.shiftKey) {
                            if (document.activeElement === firstElement) {
                                e.preventDefault();
                                lastElement.focus();
                            }
                        } else {
                            if (document.activeElement === lastElement) {
                                e.preventDefault();
                                firstElement.focus();
                            }
                        }
                    }
                });
            }
        });
    }

    /**
     * 設定螢幕閱讀器支援
     */
    setupScreenReader() {
        // 建立 ARIA 即時區域
        this.createLiveRegion();
        
        // 為動態內容設定 ARIA 標籤
        this.setupDynamicARIA();
        
        // 為圖片設定替代文字
        this.setupImageAltText();
    }

    /**
     * 建立 ARIA 即時區域
     */
    createLiveRegion() {
        if (!document.querySelector('.aria-live')) {
            const liveRegion = document.createElement('div');
            liveRegion.className = 'aria-live';
            liveRegion.setAttribute('aria-live', 'polite');
            liveRegion.setAttribute('aria-atomic', 'true');
            document.body.appendChild(liveRegion);
        }
    }

    /**
     * 設定動態 ARIA 標籤
     */
    setupDynamicARIA() {
        // 為搜尋結果設定 ARIA 標籤
        const searchResults = document.querySelector('#toiletsList');
        if (searchResults) {
            searchResults.setAttribute('aria-live', 'polite');
            searchResults.setAttribute('aria-label', '搜尋結果列表');
        }

        // 為載入指示器設定 ARIA 標籤
        const loadingIndicator = document.querySelector('#loadingIndicator');
        if (loadingIndicator) {
            loadingIndicator.setAttribute('aria-live', 'assertive');
            loadingIndicator.setAttribute('aria-label', '載入中');
        }
    }

    /**
     * 設定圖片替代文字
     */
    setupImageAltText() {
        const images = document.querySelectorAll('img');
        images.forEach(img => {
            if (!img.hasAttribute('alt')) {
                img.setAttribute('alt', '');
            }
        });
    }

    /**
     * 設定焦點管理
     */
    setupFocusManagement() {
        // 監聽焦點變化
        document.addEventListener('focusin', (e) => {
            this.handleFocusIn(e);
        });

        document.addEventListener('focusout', (e) => {
            this.handleFocusOut(e);
        });
    }

    /**
     * 處理焦點進入事件
     * @param {FocusEvent} e - 焦點事件
     */
    handleFocusIn(e) {
        const element = e.target;
        
        // 為焦點元素添加視覺指示
        if (this.settings.keyboardNavigation) {
            element.classList.add('keyboard-focused');
        }

        // 螢幕閱讀器提示
        if (this.settings.screenReader) {
            this.announceToScreenReader(element);
        }
    }

    /**
     * 處理焦點離開事件
     * @param {FocusEvent} e - 焦點事件
     */
    handleFocusOut(e) {
        const element = e.target;
        element.classList.remove('keyboard-focused');
    }

    /**
     * 向螢幕閱讀器播報內容
     * @param {Element} element - 元素
     */
    announceToScreenReader(element) {
        const liveRegion = document.querySelector('.aria-live');
        if (liveRegion) {
            const text = element.getAttribute('aria-label') || 
                        element.textContent || 
                        element.getAttribute('title') || 
                        element.getAttribute('alt') || '';
            
            if (text.trim()) {
                liveRegion.textContent = text;
                setTimeout(() => {
                    liveRegion.textContent = '';
                }, 1000);
            }
        }
    }

    /**
     * 設定 ARIA 標籤
     */
    setupARIALabels() {
        // 為按鈕設定 ARIA 標籤
        const buttons = document.querySelectorAll('button');
        buttons.forEach(button => {
            if (!button.getAttribute('aria-label') && !button.textContent.trim()) {
                button.setAttribute('aria-label', '按鈕');
            }
        });

        // 為表單元素設定 ARIA 標籤
        const inputs = document.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            if (!input.getAttribute('aria-label') && !input.getAttribute('aria-labelledby')) {
                const label = document.querySelector(`label[for="${input.id}"]`);
                if (label) {
                    input.setAttribute('aria-labelledby', label.id || 'label-' + input.id);
                }
            }
        });

        // 為導航設定 ARIA 標籤
        const nav = document.querySelector('nav');
        if (nav && !nav.getAttribute('aria-label')) {
            nav.setAttribute('aria-label', '主要導航');
        }
    }

    /**
     * 設定高對比模式
     */
    setupHighContrast() {
        // 監聽系統偏好設定
        if (window.matchMedia) {
            const highContrastQuery = window.matchMedia('(prefers-contrast: high)');
            highContrastQuery.addListener((e) => {
                if (!this.settings.highContrast) {
                    this.updateSettings({ highContrast: e.matches });
                }
            });
        }
    }

    /**
     * 應用高對比模式
     */
    applyHighContrast() {
        const root = document.documentElement;
        if (this.settings.highContrast) {
            root.setAttribute('data-contrast', 'high');
        } else {
            root.removeAttribute('data-contrast');
        }
    }

    /**
     * 設定字體大小
     */
    setupFontSize() {
        // 監聽系統偏好設定
        if (window.matchMedia) {
            const largeTextQuery = window.matchMedia('(prefers-font-size: large)');
            largeTextQuery.addListener((e) => {
                if (!this.settings.largeText) {
                    this.updateSettings({ largeText: e.matches });
                }
            });
        }
    }

    /**
     * 應用字體大小設定
     */
    applyFontSize() {
        const root = document.documentElement;
        
        if (this.settings.largeText) {
            root.setAttribute('data-font-size', 'large');
            root.style.setProperty('--font-size-multiplier', '1.25');
        } else {
            const multiplier = this.settings.fontSize / 100;
            root.setAttribute('data-font-size', this.getFontSizeLevel(this.settings.fontSize));
            root.style.setProperty('--font-size-multiplier', multiplier.toString());
        }
    }

    /**
     * 取得字體大小等級
     * @param {number} fontSize - 字體大小百分比
     * @returns {string} 字體大小等級
     */
    getFontSizeLevel(fontSize) {
        if (fontSize >= 150) return 'huge';
        if (fontSize >= 125) return 'extra-large';
        if (fontSize >= 110) return 'large';
        return 'normal';
    }

    /**
     * 設定減少動畫
     */
    setupReducedMotion() {
        // 監聽系統偏好設定
        if (window.matchMedia) {
            const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
            reducedMotionQuery.addListener((e) => {
                if (!this.settings.reducedMotion) {
                    this.updateSettings({ reducedMotion: e.matches });
                }
            });
        }
    }

    /**
     * 應用減少動畫設定
     */
    applyReducedMotion() {
        const root = document.documentElement;
        if (this.settings.reducedMotion) {
            root.setAttribute('data-reduced-motion', 'true');
        } else {
            root.removeAttribute('data-reduced-motion');
        }
    }

    /**
     * 應用鍵盤導航設定
     */
    applyKeyboardNavigation() {
        const root = document.documentElement;
        if (this.settings.keyboardNavigation) {
            root.setAttribute('data-keyboard-nav', 'true');
        } else {
            root.removeAttribute('data-keyboard-nav');
        }
    }

    /**
     * 應用螢幕閱讀器設定
     */
    applyScreenReader() {
        const root = document.documentElement;
        if (this.settings.screenReader) {
            root.setAttribute('data-screen-reader', 'true');
        } else {
            root.removeAttribute('data-screen-reader');
        }
    }

    /**
     * 設定色盲支援
     */
    setupColorBlindSupport() {
        // 為色盲使用者提供額外的視覺提示
        this.addColorBlindIndicators();
    }

    /**
     * 應用色盲支援
     */
    applyColorBlindSupport() {
        const root = document.documentElement;
        if (this.settings.colorBlindSupport) {
            root.setAttribute('data-color-blind', 'true');
        } else {
            root.removeAttribute('data-color-blind');
        }
    }

    /**
     * 添加色盲指示器
     */
    addColorBlindIndicators() {
        // 為狀態標記添加文字標籤
        const tags = document.querySelectorAll('.tag');
        tags.forEach(tag => {
            if (!tag.getAttribute('aria-label')) {
                tag.setAttribute('aria-label', tag.textContent);
            }
        });
    }

    /**
     * 導航到指定頁面
     * @param {string} pageId - 頁面ID
     */
    navigateToPage(pageId) {
        // 這個函數會在 navigation.js 中實作
        if (window.navigateToPage) {
            window.navigateToPage(pageId);
        }
    }

    /**
     * 聚焦搜尋輸入框
     */
    focusSearchInput() {
        const searchInput = document.querySelector('#searchInput, #searchInputPage');
        if (searchInput) {
            searchInput.focus();
        }
    }

    /**
     * 開啟無障礙設定
     */
    openAccessibilitySettings() {
        // 這個函數會在 navigation.js 中實作
        if (window.navigateToPage) {
            window.navigateToPage('accessibility');
        }
    }

    /**
     * 關閉所有模態框
     */
    closeModals() {
        const modals = document.querySelectorAll('.modal.show');
        modals.forEach(modal => {
            modal.classList.remove('show');
            modal.setAttribute('aria-hidden', 'true');
        });
    }

    /**
     * 通知設定已變更
     */
    notifySettingsChanged() {
        // 觸發自訂事件
        const event = new CustomEvent('accessibilitySettingsChanged', {
            detail: this.settings
        });
        document.dispatchEvent(event);
    }

    /**
     * 重置所有設定
     */
    resetSettings() {
        const defaultSettings = {
            highContrast: false,
            largeText: false,
            fontSize: 100,
            keyboardNavigation: false,
            reducedMotion: false,
            screenReader: false,
            colorBlindSupport: false
        };

        this.updateSettings(defaultSettings);
        if (window.Utils && window.Utils.showMessage) {
            window.Utils.showMessage('無障礙設定已重置', 'success');
        }
    }

    /**
     * 取得當前設定
     * @returns {Object} 當前設定
     */
    getSettings() {
        return { ...this.settings };
    }

    /**
     * 檢查特定設定是否啟用
     * @param {string} setting - 設定名稱
     * @returns {boolean} 是否啟用
     */
    isEnabled(setting) {
        return this.settings[setting] === true;
    }

    /**
     * 切換特定設定
     * @param {string} setting - 設定名稱
     */
    toggleSetting(setting) {
        const newValue = !this.settings[setting];
        this.updateSettings({ [setting]: newValue });
        
        const status = newValue ? '已啟用' : '已停用';
        Utils.showMessage(`${this.getSettingLabel(setting)} ${status}`, 'info');
    }

    /**
     * 取得設定標籤
     * @param {string} setting - 設定名稱
     * @returns {string} 設定標籤
     */
    getSettingLabel(setting) {
        const labels = {
            highContrast: '高對比模式',
            largeText: '大字體模式',
            keyboardNavigation: '強化鍵盤導航',
            reducedMotion: '減少動畫效果',
            screenReader: '螢幕閱讀器模式',
            colorBlindSupport: '色盲支援'
        };
        return labels[setting] || setting;
    }

    /**
     * 銷毀無障礙服務
     */
    destroy() {
        this.observers.forEach(observer => observer.disconnect());
        this.observers = [];
        this.isInitialized = false;
    }
}

// 建立全域實例
const accessibilityService = new AccessibilityService();

// 全域匯出
window.AccessibilityService = accessibilityService;
