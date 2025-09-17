// 無障礙廁所GO V2 - 工具函數

/**
 * 計算兩點間的距離 (使用 Haversine 公式)
 * @param {number} lat1 - 第一個點的緯度
 * @param {number} lng1 - 第一個點的經度
 * @param {number} lat2 - 第二個點的緯度
 * @param {number} lng2 - 第二個點的經度
 * @returns {number} 距離 (公尺)
 */
function calculateDistance(lat1, lng1, lat2, lng2) {
    const R = 6371e3; // 地球半徑 (公尺)
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lng2 - lng1) * Math.PI) / 180;

    const a =
        Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
        Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
}

/**
 * 格式化距離顯示
 * @param {number} distance - 距離 (公尺)
 * @returns {string} 格式化後的距離字串
 */
function formatDistance(distance) {
    if (!distance || distance === 0) return '';
    
    if (distance < 1000) {
        return `${Math.round(distance)}m`;
    } else {
        return `${(distance / 1000).toFixed(1)}km`;
    }
}

/**
 * 格式化數字顯示
 * @param {number} num - 數字
 * @returns {string} 格式化後的數字字串
 */
function formatNumber(num) {
    if (typeof num !== 'number') return '0';
    return num.toLocaleString('zh-TW');
}

/**
 * 防抖函數
 * @param {Function} func - 要執行的函數
 * @param {number} wait - 等待時間 (毫秒)
 * @returns {Function} 防抖後的函數
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * 節流函數
 * @param {Function} func - 要執行的函數
 * @param {number} limit - 限制時間 (毫秒)
 * @returns {Function} 節流後的函數
 */
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

/**
 * 深拷貝物件
 * @param {*} obj - 要拷貝的物件
 * @returns {*} 深拷貝後的物件
 */
function deepClone(obj) {
    if (obj === null || typeof obj !== 'object') return obj;
    if (obj instanceof Date) return new Date(obj.getTime());
    if (obj instanceof Array) return obj.map(item => deepClone(item));
    if (typeof obj === 'object') {
        const clonedObj = {};
        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                clonedObj[key] = deepClone(obj[key]);
            }
        }
        return clonedObj;
    }
}

/**
 * 生成唯一ID
 * @returns {string} 唯一ID
 */
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

/**
 * 驗證電子郵件格式
 * @param {string} email - 電子郵件地址
 * @returns {boolean} 是否為有效格式
 */
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * 驗證電話號碼格式
 * @param {string} phone - 電話號碼
 * @returns {boolean} 是否為有效格式
 */
function isValidPhone(phone) {
    const phoneRegex = /^[\d\-\+\(\)\s]+$/;
    return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 8;
}

/**
 * 取得廁所類型的顏色
 * @param {string} type - 廁所類型
 * @returns {string} 顏色代碼
 */
function getToiletTypeColor(type) {
    return window.CONFIG.TOILET_TYPES[type]?.color || '#757575';
}

/**
 * 取得廁所等級的顏色
 * @param {string} grade - 廁所等級
 * @returns {string} 顏色代碼
 */
function getToiletGradeColor(grade) {
    return CONFIG.TOILET_GRADES[grade]?.color || '#757575';
}

/**
 * 取得廁所等級的星星數量
 * @param {string} grade - 廁所等級
 * @returns {number} 星星數量
 */
function getToiletGradeStars(grade) {
    return CONFIG.TOILET_GRADES[grade]?.stars || 0;
}

/**
 * 排序廁所列表
 * @param {Array} toilets - 廁所列表
 * @param {string} sortBy - 排序方式
 * @param {Object} userLocation - 使用者位置
 * @returns {Array} 排序後的廁所列表
 */
function sortToilets(toilets, sortBy = 'distance', userLocation = null) {
    const sortedToilets = [...toilets];
    
    switch (sortBy) {
        case 'distance':
            if (userLocation) {
                sortedToilets.forEach(toilet => {
                    toilet.distance = calculateDistance(
                        userLocation.latitude,
                        userLocation.longitude,
                        toilet.latitude,
                        toilet.longitude
                    );
                });
                return sortedToilets.sort((a, b) => (a.distance || 0) - (b.distance || 0));
            }
            return sortedToilets;
            
        case 'grade':
            return sortedToilets.sort((a, b) => {
                const aPriority = CONFIG.TOILET_GRADES[a.grade]?.priority || 999;
                const bPriority = CONFIG.TOILET_GRADES[b.grade]?.priority || 999;
                return aPriority - bPriority;
            });
            
        case 'name':
            return sortedToilets.sort((a, b) => a.name.localeCompare(b.name, 'zh-TW'));
            
        default:
            return sortedToilets;
    }
}

/**
 * 篩選廁所列表
 * @param {Array} toilets - 廁所列表
 * @param {Object} filters - 篩選條件
 * @returns {Array} 篩選後的廁所列表
 */
function filterToilets(toilets, filters) {
    return toilets.filter(toilet => {
        // 類型篩選
        if (filters.type && filters.type.length > 0 && !filters.type.includes(toilet.type)) {
            return false;
        }
        
        // 等級篩選
        if (filters.grade && filters.grade.length > 0 && !filters.grade.includes(toilet.grade)) {
            return false;
        }
        
        // 類別篩選
        if (filters.category && filters.category.length > 0 && !filters.category.includes(toilet.category)) {
            return false;
        }
        
        // 尿布檯篩選
        if (filters.hasDiaperTable !== undefined && toilet.hasDiaperTable !== filters.hasDiaperTable) {
            return false;
        }
        
        // 距離篩選
        if (filters.maxDistance && toilet.distance && toilet.distance > filters.maxDistance) {
            return false;
        }
        
        return true;
    });
}

/**
 * 關鍵字搜尋
 * @param {Array} toilets - 廁所列表
 * @param {string} keyword - 搜尋關鍵字
 * @returns {Array} 搜尋結果
 */
function searchToilets(toilets, keyword) {
    if (!keyword || !keyword.trim()) return toilets;
    
    const lowerKeyword = keyword.toLowerCase().trim();
    
    return toilets.filter(toilet => 
        toilet.name.toLowerCase().includes(lowerKeyword) ||
        toilet.address.toLowerCase().includes(lowerKeyword) ||
        toilet.management.toLowerCase().includes(lowerKeyword) ||
        toilet.category.toLowerCase().includes(lowerKeyword)
    );
}

/**
 * 顯示載入指示器
 * @param {string} elementId - 元素ID
 * @param {boolean} show - 是否顯示
 */
function toggleLoading(elementId, show = true) {
    const element = document.getElementById(elementId);
    if (element) {
        element.style.display = show ? 'block' : 'none';
    }
}

/**
 * 顯示訊息
 * @param {string} message - 訊息內容
 * @param {string} type - 訊息類型 (success, error, warning, info)
 * @param {number} duration - 顯示時間 (毫秒)
 */
function showMessage(message, type = 'info', duration = 3000) {
    // 建立訊息元素
    const messageElement = document.createElement('div');
    messageElement.className = `message message-${type}`;
    messageElement.setAttribute('role', 'alert');
    messageElement.setAttribute('aria-live', 'polite');
    messageElement.innerHTML = `
        <div class="message-content">
            <i class="fas fa-${getMessageIcon(type)}" aria-hidden="true"></i>
            <span>${message}</span>
        </div>
    `;
    
    // 添加樣式
    messageElement.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 10000;
        padding: 16px 24px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        color: white;
        font-weight: 500;
        max-width: 400px;
        animation: slideInRight 0.3s ease-out;
    `;
    
    // 設定背景色
    const colors = {
        success: '#4caf50',
        error: '#f44336',
        warning: '#ff9800',
        info: '#2196f3'
    };
    messageElement.style.backgroundColor = colors[type] || colors.info;
    
    // 添加到頁面
    document.body.appendChild(messageElement);
    
    // 自動移除
    setTimeout(() => {
        messageElement.style.animation = 'slideOutRight 0.3s ease-in';
        setTimeout(() => {
            if (messageElement.parentNode) {
                messageElement.parentNode.removeChild(messageElement);
            }
        }, 300);
    }, duration);
}

/**
 * 取得訊息圖示
 * @param {string} type - 訊息類型
 * @returns {string} 圖示類別
 */
function getMessageIcon(type) {
    const icons = {
        success: 'check-circle',
        error: 'exclamation-circle',
        warning: 'exclamation-triangle',
        info: 'info-circle'
    };
    return icons[type] || icons.info;
}

/**
 * 確認對話框
 * @param {string} message - 確認訊息
 * @param {string} title - 標題
 * @returns {Promise<boolean>} 使用者選擇結果
 */
function confirmDialog(message, title = '確認') {
    return new Promise((resolve) => {
        // 建立遮罩層
        const overlay = document.createElement('div');
        overlay.className = 'modal-overlay';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.5);
            z-index: 10000;
            display: flex;
            align-items: center;
            justify-content: center;
        `;
        
        // 建立對話框
        const dialog = document.createElement('div');
        dialog.className = 'confirm-dialog';
        dialog.style.cssText = `
            background-color: white;
            border-radius: 8px;
            padding: 24px;
            max-width: 400px;
            width: 90%;
            box-shadow: 0 8px 32px rgba(0,0,0,0.2);
        `;
        
        dialog.innerHTML = `
            <h3 style="margin: 0 0 16px 0; color: #333;">${title}</h3>
            <p style="margin: 0 0 24px 0; color: #666; line-height: 1.5;">${message}</p>
            <div style="display: flex; gap: 12px; justify-content: flex-end;">
                <button class="btn-cancel" style="
                    padding: 8px 16px;
                    border: 1px solid #ddd;
                    background: white;
                    border-radius: 4px;
                    cursor: pointer;
                ">取消</button>
                <button class="btn-confirm" style="
                    padding: 8px 16px;
                    border: none;
                    background: #1976d2;
                    color: white;
                    border-radius: 4px;
                    cursor: pointer;
                ">確認</button>
            </div>
        `;
        
        overlay.appendChild(dialog);
        document.body.appendChild(overlay);
        
        // 綁定事件
        const cancelBtn = dialog.querySelector('.btn-cancel');
        const confirmBtn = dialog.querySelector('.btn-confirm');
        
        const cleanup = () => {
            document.body.removeChild(overlay);
        };
        
        cancelBtn.addEventListener('click', () => {
            cleanup();
            resolve(false);
        });
        
        confirmBtn.addEventListener('click', () => {
            cleanup();
            resolve(true);
        });
        
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                cleanup();
                resolve(false);
            }
        });
        
        // 聚焦到確認按鈕
        confirmBtn.focus();
    });
}

/**
 * 複製文字到剪貼板
 * @param {string} text - 要複製的文字
 * @returns {Promise<boolean>} 是否成功複製
 */
async function copyToClipboard(text) {
    try {
        if (navigator.clipboard && window.isSecureContext) {
            await navigator.clipboard.writeText(text);
            return true;
        } else {
            // 降級方案
            const textArea = document.createElement('textarea');
            textArea.value = text;
            textArea.style.position = 'fixed';
            textArea.style.left = '-999999px';
            textArea.style.top = '-999999px';
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            
            const result = document.execCommand('copy');
            document.body.removeChild(textArea);
            return result;
        }
    } catch (error) {
        console.error('複製失敗:', error);
        return false;
    }
}

/**
 * 格式化日期
 * @param {Date|string} date - 日期
 * @param {string} format - 格式
 * @returns {string} 格式化後的日期字串
 */
function formatDate(date, format = 'YYYY-MM-DD') {
    const d = new Date(date);
    if (isNaN(d.getTime())) return '';
    
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    const seconds = String(d.getSeconds()).padStart(2, '0');
    
    return format
        .replace('YYYY', year)
        .replace('MM', month)
        .replace('DD', day)
        .replace('HH', hours)
        .replace('mm', minutes)
        .replace('ss', seconds);
}

/**
 * 取得相對時間
 * @param {Date|string} date - 日期
 * @returns {string} 相對時間字串
 */
function getRelativeTime(date) {
    const now = new Date();
    const targetDate = new Date(date);
    const diffInSeconds = Math.floor((now - targetDate) / 1000);
    
    if (diffInSeconds < 60) return '剛剛';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}分鐘前`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}小時前`;
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}天前`;
    if (diffInSeconds < 31536000) return `${Math.floor(diffInSeconds / 2592000)}個月前`;
    return `${Math.floor(diffInSeconds / 31536000)}年前`;
}

/**
 * 檢查是否為行動裝置
 * @returns {boolean} 是否為行動裝置
 */
function isMobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

/**
 * 檢查是否支援觸控
 * @returns {boolean} 是否支援觸控
 */
function isTouchDevice() {
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
}

/**
 * 取得瀏覽器資訊
 * @returns {Object} 瀏覽器資訊
 */
function getBrowserInfo() {
    const userAgent = navigator.userAgent;
    let browserName = 'Unknown';
    let browserVersion = 'Unknown';
    
    if (userAgent.indexOf('Chrome') > -1) {
        browserName = 'Chrome';
        browserVersion = userAgent.match(/Chrome\/(\d+)/)?.[1] || 'Unknown';
    } else if (userAgent.indexOf('Firefox') > -1) {
        browserName = 'Firefox';
        browserVersion = userAgent.match(/Firefox\/(\d+)/)?.[1] || 'Unknown';
    } else if (userAgent.indexOf('Safari') > -1) {
        browserName = 'Safari';
        browserVersion = userAgent.match(/Version\/(\d+)/)?.[1] || 'Unknown';
    } else if (userAgent.indexOf('Edge') > -1) {
        browserName = 'Edge';
        browserVersion = userAgent.match(/Edge\/(\d+)/)?.[1] || 'Unknown';
    }
    
    return {
        name: browserName,
        version: browserVersion,
        userAgent: userAgent,
        isMobile: isMobile(),
        isTouch: isTouchDevice()
    };
}

/**
 * 本地儲存工具
 */
const Storage = {
    /**
     * 儲存資料
     * @param {string} key - 鍵值
     * @param {*} value - 資料
     * @param {number} expiration - 過期時間 (毫秒)
     */
    set(key, value, expiration = null) {
        const data = {
            value: value,
            timestamp: Date.now(),
            expiration: expiration
        };
        localStorage.setItem(key, JSON.stringify(data));
    },
    
    /**
     * 取得資料
     * @param {string} key - 鍵值
     * @returns {*} 資料
     */
    get(key) {
        try {
            const item = localStorage.getItem(key);
            if (!item) return null;
            
            const data = JSON.parse(item);
            
            // 檢查是否過期
            if (data.expiration && Date.now() - data.timestamp > data.expiration) {
                localStorage.removeItem(key);
                return null;
            }
            
            return data.value;
        } catch (error) {
            console.error('儲存讀取錯誤:', error);
            return null;
        }
    },
    
    /**
     * 移除資料
     * @param {string} key - 鍵值
     */
    remove(key) {
        localStorage.removeItem(key);
    },
    
    /**
     * 清除所有資料
     */
    clear() {
        localStorage.clear();
    }
};

// 全域匯出
window.Utils = {
    calculateDistance,
    formatDistance,
    formatNumber,
    debounce,
    throttle,
    deepClone,
    generateId,
    isValidEmail,
    isValidPhone,
    getToiletTypeColor,
    getToiletGradeColor,
    getToiletGradeStars,
    sortToilets,
    filterToilets,
    searchToilets,
    toggleLoading,
    showMessage,
    confirmDialog,
    copyToClipboard,
    formatDate,
    getRelativeTime,
    isMobile,
    isTouchDevice,
    getBrowserInfo,
    Storage
};
