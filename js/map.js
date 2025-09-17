// 無障礙廁所GO V2 - 地圖服務

/**
 * 地圖服務類別
 */
class MapService {
    constructor() {
        this.map = null;
        this.markers = [];
        this.userMarker = null;
        this.infoWindow = null;
        this.isInitialized = false;
        this.userLocation = null;
    }

    /**
     * 初始化地圖
     * @param {string} mapId - 地圖容器ID
     * @param {Object} options - 地圖選項
     * @returns {Promise} 初始化結果
     */
    async initializeMap(mapId, options = {}) {
        try {
            if (!window.google || !window.google.maps) {
                throw new Error('Google Maps API 未載入');
            }

        const defaultOptions = {
            zoom: window.CONFIG.MAPS.DEFAULT_ZOOM,
            center: window.CONFIG.MAPS.DEFAULT_CENTER,
                mapTypeId: google.maps.MapTypeId.ROADMAP,
                styles: this.getMapStyles(),
                gestureHandling: 'cooperative',
                zoomControl: true,
                mapTypeControl: true,
                scaleControl: true,
                streetViewControl: true,
                rotateControl: true,
                fullscreenControl: true,
                clickableIcons: true,
                keyboardShortcuts: true,
                disableDoubleClickZoom: false,
                draggable: true,
                scrollwheel: true,
                disableDefaultUI: false
            };

            const mapOptions = { ...defaultOptions, ...options };

            this.map = new google.maps.Map(document.getElementById(mapId), mapOptions);
            this.infoWindow = new google.maps.InfoWindow();
            
            this.isInitialized = true;
            
            // 綁定地圖事件
            this.bindMapEvents();
            
            console.log('地圖初始化成功');
            return this.map;
        } catch (error) {
            console.error('地圖初始化失敗:', error);
            throw new Error(window.CONFIG.MESSAGES.MAPS_ERROR);
        }
    }

    /**
     * 取得地圖樣式
     * @returns {Array} 地圖樣式配置
     */
    getMapStyles() {
        return [
            {
                featureType: 'poi',
                elementType: 'labels',
                stylers: [{ visibility: 'off' }]
            },
            {
                featureType: 'transit',
                elementType: 'labels',
                stylers: [{ visibility: 'off' }]
            }
        ];
    }

    /**
     * 綁定地圖事件
     */
    bindMapEvents() {
        if (!this.map) return;

        // 地圖點擊事件
        this.map.addListener('click', (event) => {
            this.infoWindow.close();
        });

        // 地圖拖拽結束事件
        this.map.addListener('dragend', () => {
            this.onMapMove();
        });

        // 地圖縮放結束事件
        this.map.addListener('zoom_changed', () => {
            this.onMapZoom();
        });
    }

    /**
     * 地圖移動回調
     */
    onMapMove() {
        // 可以在這裡處理地圖移動後的邏輯
        console.log('地圖已移動');
    }

    /**
     * 地圖縮放回調
     */
    onMapZoom() {
        // 可以在這裡處理地圖縮放後的邏輯
        console.log('地圖已縮放');
    }

    /**
     * 設定地圖中心
     * @param {Object} center - 中心點座標
     * @param {number} zoom - 縮放級別
     */
    setMapCenter(center, zoom = null) {
        if (!this.map) return;

        this.map.setCenter(center);
        if (zoom !== null) {
            this.map.setZoom(zoom);
        }
    }

    /**
     * 新增使用者位置標記
     * @param {Object} location - 位置資訊
     */
    addUserLocationMarker(location) {
        if (!this.map) return;

        // 移除舊的使用者標記
        if (this.userMarker) {
            this.userMarker.setMap(null);
        }

        const position = {
            lat: location.latitude,
            lng: location.longitude
        };

        this.userMarker = new google.maps.Marker({
            position: position,
            map: this.map,
            title: '我的位置',
            icon: {
                path: window.CONFIG.MAP_MARKERS.USER_LOCATION.path,
                fillColor: window.CONFIG.MAP_MARKERS.USER_LOCATION.fillColor,
                fillOpacity: window.CONFIG.MAP_MARKERS.USER_LOCATION.fillOpacity,
                strokeColor: window.CONFIG.MAP_MARKERS.USER_LOCATION.strokeColor,
                strokeWeight: window.CONFIG.MAP_MARKERS.USER_LOCATION.strokeWeight,
                scale: window.CONFIG.MAP_MARKERS.USER_LOCATION.scale,
                anchor: new google.maps.Point(12, 12)
            },
            animation: google.maps.Animation.BOUNCE,
            zIndex: 1000
        });

        this.userLocation = location;

        // 設定地圖中心到使用者位置
        this.setMapCenter(position, window.CONFIG.MAPS.DEFAULT_ZOOM);

        // 停止動畫
        setTimeout(() => {
            if (this.userMarker) {
                this.userMarker.setAnimation(null);
            }
        }, 2000);
    }

    /**
     * 新增廁所標記
     * @param {Object} toilet - 廁所資料
     * @param {Function} onClick - 點擊回調
     */
    addToiletMarker(toilet, onClick = null) {
        if (!this.map) return;

        const position = {
            lat: toilet.latitude,
            lng: toilet.longitude
        };

        const marker = new google.maps.Marker({
            position: position,
            map: this.map,
            title: toilet.name,
            icon: this.getToiletMarkerIcon(toilet),
            animation: google.maps.Animation.DROP,
            zIndex: 100
        });

        // 綁定點擊事件
        marker.addListener('click', () => {
            if (onClick) {
                onClick(toilet, marker);
            } else {
                this.showToiletInfo(toilet, marker);
            }
        });

        this.markers.push(marker);
        return marker;
    }

    /**
     * 取得廁所標記圖示
     * @param {Object} toilet - 廁所資料
     * @returns {Object} 標記圖示配置
     */
    getToiletMarkerIcon(toilet) {
        const color = Utils.getToiletTypeColor(toilet.type);
        const isAccessible = toilet.type === '無障礙廁所';
        
        return {
            path: window.CONFIG.MAP_MARKERS.TOILET.path,
            fillColor: color,
            fillOpacity: window.CONFIG.MAP_MARKERS.TOILET.fillOpacity,
            strokeColor: window.CONFIG.MAP_MARKERS.TOILET.strokeColor,
            strokeWeight: window.CONFIG.MAP_MARKERS.TOILET.strokeWeight,
            scale: isAccessible ? window.CONFIG.MAP_MARKERS.TOILET.scale + 0.2 : window.CONFIG.MAP_MARKERS.TOILET.scale,
            anchor: new google.maps.Point(12, 12)
        };
    }

    /**
     * 顯示廁所資訊視窗
     * @param {Object} toilet - 廁所資料
     * @param {Object} marker - 標記物件
     */
    showToiletInfo(toilet, marker) {
        if (!this.infoWindow) return;

        const content = this.createInfoWindowContent(toilet);
        
        this.infoWindow.setContent(content);
        this.infoWindow.open(this.map, marker);

        // 綁定資訊視窗內的事件
        this.bindInfoWindowEvents(toilet);
    }

    /**
     * 建立資訊視窗內容
     * @param {Object} toilet - 廁所資料
     * @returns {string} HTML 內容
     */
    createInfoWindowContent(toilet) {
        const distance = toilet.distance ? Utils.formatDistance(toilet.distance) : '';
        const gradeStars = Utils.getToiletGradeStars(toilet.grade);
        const starIcons = '★'.repeat(gradeStars) + '☆'.repeat(5 - gradeStars);
        const diaperIcon = toilet.hasDiaperTable ? '<i class="fas fa-baby" title="有尿布檯"></i>' : '';
        
        return `
            <div class="info-window">
                <div class="info-header">
                    <h3 class="info-title">${toilet.name}</h3>
                    <div class="info-grade">
                        <span class="grade-stars">${starIcons}</span>
                        <span class="grade-text">${toilet.grade}</span>
                    </div>
                </div>
                <div class="info-content">
                    <p class="info-address">
                        <i class="fas fa-map-marker-alt"></i>
                        ${toilet.address}
                    </p>
                    <p class="info-type">
                        <i class="fas fa-restroom"></i>
                        ${toilet.type}
                    </p>
                    <p class="info-management">
                        <i class="fas fa-building"></i>
                        ${toilet.management}
                    </p>
                    ${distance ? `<p class="info-distance"><i class="fas fa-route"></i> ${distance}</p>` : ''}
                    <div class="info-features">
                        ${toilet.type === '無障礙廁所' ? '<span class="feature-tag accessible">無障礙</span>' : ''}
                        ${diaperIcon}
                    </div>
                </div>
                <div class="info-actions">
                    <button class="btn-details" onclick="showToiletDetails('${toilet.id}')">
                        <i class="fas fa-info-circle"></i> 詳細資訊
                    </button>
                    <button class="btn-navigate" onclick="navigateToToilet('${toilet.id}')">
                        <i class="fas fa-directions"></i> 導航
                    </button>
                </div>
            </div>
        `;
    }

    /**
     * 綁定資訊視窗事件
     * @param {Object} toilet - 廁所資料
     */
    bindInfoWindowEvents(toilet) {
        // 延遲綁定，確保 DOM 元素已建立
        setTimeout(() => {
            const detailsBtn = document.querySelector('.btn-details');
            const navigateBtn = document.querySelector('.btn-navigate');
            
            if (detailsBtn) {
                detailsBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.showToiletDetailsModal(toilet);
                });
            }
            
            if (navigateBtn) {
                navigateBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.navigateToToilet(toilet);
                });
            }
        }, 100);
    }

    /**
     * 顯示廁所詳細資訊模態框
     * @param {Object} toilet - 廁所資料
     */
    showToiletDetailsModal(toilet) {
        // 這個函數會在 main.js 中實作
        if (window.showToiletDetailsModal) {
            window.showToiletDetailsModal(toilet);
        }
    }

    /**
     * 導航到廁所
     * @param {Object} toilet - 廁所資料
     */
    navigateToToilet(toilet) {
        const url = `https://www.google.com/maps/dir/?api=1&destination=${toilet.latitude},${toilet.longitude}`;
        window.open(url, '_blank');
    }

    /**
     * 清除所有標記
     */
    clearMarkers() {
        this.markers.forEach(marker => {
            marker.setMap(null);
        });
        this.markers = [];
    }

    /**
     * 清除使用者位置標記
     */
    clearUserMarker() {
        if (this.userMarker) {
            this.userMarker.setMap(null);
            this.userMarker = null;
        }
    }

    /**
     * 顯示多個廁所標記
     * @param {Array} toilets - 廁所列表
     * @param {Function} onClick - 點擊回調
     */
    showToiletMarkers(toilets, onClick = null) {
        this.clearMarkers();
        
        toilets.forEach(toilet => {
            this.addToiletMarker(toilet, onClick);
        });

        // 自動調整地圖視窗以包含所有標記
        if (toilets.length > 0) {
            this.fitBounds(toilets);
        }
    }

    /**
     * 調整地圖視窗以包含所有標記
     * @param {Array} toilets - 廁所列表
     */
    fitBounds(toilets) {
        if (!this.map || toilets.length === 0) return;

        const bounds = new google.maps.LatLngBounds();
        
        toilets.forEach(toilet => {
            bounds.extend({
                lat: toilet.latitude,
                lng: toilet.longitude
            });
        });

        // 如果有使用者位置，也包含進去
        if (this.userLocation) {
            bounds.extend({
                lat: this.userLocation.latitude,
                lng: this.userLocation.longitude
            });
        }

        this.map.fitBounds(bounds);
        
        // 確保縮放級別不會太小
        const listener = google.maps.event.addListener(this.map, 'idle', () => {
            if (this.map.getZoom() > window.CONFIG.MAPS.MAX_ZOOM) {
                this.map.setZoom(window.CONFIG.MAPS.MAX_ZOOM);
            }
            google.maps.event.removeListener(listener);
        });
    }

    /**
     * 搜尋附近廁所並顯示在地圖上
     * @param {Object} location - 位置資訊
     * @param {Object} filters - 篩選條件
     * @param {number} radius - 搜尋半徑
     */
    async searchAndShowNearbyToilets(location, filters = {}, radius = window.CONFIG.SEARCH.DEFAULT_RADIUS) {
        try {
            const searchParams = {
                location: location,
                filters: filters,
                limit: 50
            };

            const result = await API.service.searchNearbyToilets(searchParams);
            const nearbyToilets = result.toilets.filter(toilet => 
                toilet.distance <= radius
            );

            this.showToiletMarkers(nearbyToilets);
            
            return nearbyToilets;
        } catch (error) {
            console.error('搜尋附近廁所失敗:', error);
            Utils.showMessage(window.CONFIG.MESSAGES.SEARCH_ERROR, 'error');
        }
    }

    /**
     * 取得地圖當前視窗範圍
     * @returns {Object} 視窗範圍
     */
    getMapBounds() {
        if (!this.map) return null;

        const bounds = this.map.getBounds();
        return {
            north: bounds.getNorthEast().lat(),
            south: bounds.getSouthWest().lat(),
            east: bounds.getNorthEast().lng(),
            west: bounds.getSouthWest().lng()
        };
    }

    /**
     * 取得地圖中心點
     * @returns {Object} 中心點座標
     */
    getMapCenter() {
        if (!this.map) return null;

        const center = this.map.getCenter();
        return {
            latitude: center.lat(),
            longitude: center.lng()
        };
    }

    /**
     * 取得地圖縮放級別
     * @returns {number} 縮放級別
     */
    getMapZoom() {
        if (!this.map) return null;
        return this.map.getZoom();
    }

    /**
     * 設定地圖縮放級別
     * @param {number} zoom - 縮放級別
     */
    setMapZoom(zoom) {
        if (!this.map) return;
        
        const clampedZoom = Math.max(window.CONFIG.MAPS.MIN_ZOOM, Math.min(window.CONFIG.MAPS.MAX_ZOOM, zoom));
        this.map.setZoom(clampedZoom);
    }

    /**
     * 切換地圖類型
     * @param {string} mapType - 地圖類型
     */
    setMapType(mapType) {
        if (!this.map) return;
        
        const mapTypes = {
            roadmap: google.maps.MapTypeId.ROADMAP,
            satellite: google.maps.MapTypeId.SATELLITE,
            hybrid: google.maps.MapTypeId.HYBRID,
            terrain: google.maps.MapTypeId.TERRAIN
        };
        
        if (mapTypes[mapType]) {
            this.map.setMapTypeId(mapTypes[mapType]);
        }
    }

    /**
     * 啟用/停用地圖控制項
     * @param {Object} controls - 控制項配置
     */
    setMapControls(controls) {
        if (!this.map) return;
        
        this.map.setOptions({
            zoomControl: controls.zoomControl !== false,
            mapTypeControl: controls.mapTypeControl !== false,
            scaleControl: controls.scaleControl !== false,
            streetViewControl: controls.streetViewControl !== false,
            rotateControl: controls.rotateControl !== false,
            fullscreenControl: controls.fullscreenControl !== false,
            clickableIcons: controls.clickableIcons !== false
        });
    }

    /**
     * 銷毀地圖實例
     */
    destroy() {
        this.clearMarkers();
        this.clearUserMarker();
        
        if (this.infoWindow) {
            this.infoWindow.close();
            this.infoWindow = null;
        }
        
        if (this.map) {
            google.maps.event.clearInstanceListeners(this.map);
            this.map = null;
        }
        
        this.isInitialized = false;
    }
}

// 建立全域實例
const mapService = new MapService();

// 全域匯出
window.MapService = mapService;

// Google Maps API 回調函數
window.initMap = function() {
    console.log('Google Maps API 已載入');
    // 地圖將在需要時初始化
};
