import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Toilet } from '@/types';

interface MapState {
  // 地圖中心位置
  center: {
    lat: number;
    lng: number;
  };
  
  // 地圖縮放級別
  zoom: number;
  
  // 地圖標記
  markers: Array<{
    id: string;
    position: {
      lat: number;
      lng: number;
    };
    title: string;
    type: string;
    grade: string;
    data: Toilet;
  }>;
  
  // 選中的標記
  selectedMarker: string | null;
  
  // 地圖載入狀態
  mapLoading: boolean;
  mapError: string | null;
  
  // 地圖類型
  mapType: 'roadmap' | 'satellite' | 'hybrid' | 'terrain';
  
  // 是否顯示交通資訊
  showTraffic: boolean;
  
  // 是否顯示衛星圖
  showSatellite: boolean;
}

// 預設中心位置（台北車站）
const DEFAULT_CENTER = {
  lat: 25.047924,
  lng: 121.517081,
};

const initialState: MapState = {
  center: DEFAULT_CENTER,
  zoom: 15,
  markers: [],
  selectedMarker: null,
  mapLoading: false,
  mapError: null,
  mapType: 'roadmap',
  showTraffic: false,
  showSatellite: false,
};

const mapSlice = createSlice({
  name: 'map',
  initialState,
  reducers: {
    // 設定地圖中心位置
    setMapCenter: (state, action: PayloadAction<{ lat: number; lng: number }>) => {
      state.center = action.payload;
    },

    // 設定地圖縮放級別
    setMapZoom: (state, action: PayloadAction<number>) => {
      state.zoom = action.payload;
    },

    // 設定地圖標記
    setMapMarkers: (state, action: PayloadAction<Toilet[]>) => {
      state.markers = action.payload.map(toilet => ({
        id: toilet.id,
        position: {
          lat: toilet.latitude,
          lng: toilet.longitude,
        },
        title: toilet.name,
        type: toilet.type,
        grade: toilet.grade,
        data: toilet,
      }));
    },

    // 新增地圖標記
    addMapMarker: (state, action: PayloadAction<Toilet>) => {
      const toilet = action.payload;
      const marker = {
        id: toilet.id,
        position: {
          lat: toilet.latitude,
          lng: toilet.longitude,
        },
        title: toilet.name,
        type: toilet.type,
        grade: toilet.grade,
        data: toilet,
      };
      
      // 避免重複標記
      if (!state.markers.find(m => m.id === marker.id)) {
        state.markers.push(marker);
      }
    },

    // 移除地圖標記
    removeMapMarker: (state, action: PayloadAction<string>) => {
      state.markers = state.markers.filter(marker => marker.id !== action.payload);
    },

    // 清除所有地圖標記
    clearMapMarkers: (state) => {
      state.markers = [];
    },

    // 選中地圖標記
    selectMapMarker: (state, action: PayloadAction<string | null>) => {
      state.selectedMarker = action.payload;
    },

    // 設定地圖載入狀態
    setMapLoading: (state, action: PayloadAction<boolean>) => {
      state.mapLoading = action.payload;
    },

    // 設定地圖錯誤
    setMapError: (state, action: PayloadAction<string | null>) => {
      state.mapError = action.payload;
      state.mapLoading = false;
    },

    // 設定地圖類型
    setMapType: (state, action: PayloadAction<'roadmap' | 'satellite' | 'hybrid' | 'terrain'>) => {
      state.mapType = action.payload;
    },

    // 切換交通資訊顯示
    toggleTraffic: (state) => {
      state.showTraffic = !state.showTraffic;
    },

    // 切換衛星圖顯示
    toggleSatellite: (state) => {
      state.showSatellite = !state.showSatellite;
      state.mapType = state.showSatellite ? 'satellite' : 'roadmap';
    },

    // 重置地圖到預設狀態
    resetMap: (state) => {
      state.center = DEFAULT_CENTER;
      state.zoom = 15;
      state.markers = [];
      state.selectedMarker = null;
      state.mapLoading = false;
      state.mapError = null;
      state.mapType = 'roadmap';
      state.showTraffic = false;
      state.showSatellite = false;
    },

    // 根據使用者位置設定地圖中心
    setMapCenterToUserLocation: (state, action: PayloadAction<{ lat: number; lng: number }>) => {
      state.center = action.payload;
      state.zoom = 16; // 放大一點顯示附近區域
    },

    // 縮放到顯示所有標記
    fitMapToMarkers: (state) => {
      if (state.markers.length === 0) return;
      
      // 計算所有標記的邊界
      const lats = state.markers.map(m => m.position.lat);
      const lngs = state.markers.map(m => m.position.lng);
      
      const minLat = Math.min(...lats);
      const maxLat = Math.max(...lats);
      const minLng = Math.min(...lngs);
      const maxLng = Math.max(...lngs);
      
      // 設定地圖中心為標記的中心點
      state.center = {
        lat: (minLat + maxLat) / 2,
        lng: (minLng + maxLng) / 2,
      };
      
      // 根據標記分佈調整縮放級別
      const latDiff = maxLat - minLat;
      const lngDiff = maxLng - minLng;
      const maxDiff = Math.max(latDiff, lngDiff);
      
      if (maxDiff > 0.1) {
        state.zoom = 10;
      } else if (maxDiff > 0.05) {
        state.zoom = 12;
      } else if (maxDiff > 0.01) {
        state.zoom = 14;
      } else {
        state.zoom = 16;
      }
    },
  },
});

export const {
  setMapCenter,
  setMapZoom,
  setMapMarkers,
  addMapMarker,
  removeMapMarker,
  clearMapMarkers,
  selectMapMarker,
  setMapLoading,
  setMapError,
  setMapType,
  toggleTraffic,
  toggleSatellite,
  resetMap,
  setMapCenterToUserLocation,
  fitMapToMarkers,
} = mapSlice.actions;

export default mapSlice.reducer;
