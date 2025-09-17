import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { SearchParams, UserLocation, SearchFilters } from '@/types';

interface SearchState {
  // 搜尋參數
  searchParams: SearchParams;
  
  // 使用者位置
  userLocation: UserLocation | null;
  
  // 位置獲取狀態
  locationLoading: boolean;
  locationError: string | null;
  
  // 搜尋歷史
  searchHistory: string[];
  
  // 收藏的廁所
  favoriteToilets: string[];
  
  // 搜尋結果
  lastSearchResults: {
    toilets: any[];
    total: number;
    timestamp: number;
  } | null;
}

const initialState: SearchState = {
  searchParams: {
    limit: 20,
    sortBy: 'distance',
  },
  userLocation: null,
  locationLoading: false,
  locationError: null,
  searchHistory: [],
  favoriteToilets: JSON.parse(localStorage.getItem('favoriteToilets') || '[]'),
  lastSearchResults: null,
};

const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    // 設定搜尋關鍵字
    setSearchKeyword: (state, action: PayloadAction<string>) => {
      state.searchParams.keyword = action.payload;
      
      // 加入搜尋歷史
      if (action.payload.trim()) {
        const keyword = action.payload.trim();
        state.searchHistory = [
          keyword,
          ...state.searchHistory.filter(item => item !== keyword)
        ].slice(0, 10); // 只保留最近10筆
      }
    },

    // 設定使用者位置
    setUserLocation: (state, action: PayloadAction<UserLocation>) => {
      state.userLocation = action.payload;
      state.locationError = null;
    },

    // 設定位置獲取狀態
    setLocationLoading: (state, action: PayloadAction<boolean>) => {
      state.locationLoading = action.payload;
    },

    // 設定位置獲取錯誤
    setLocationError: (state, action: PayloadAction<string>) => {
      state.locationError = action.payload;
      state.locationLoading = false;
    },

    // 設定搜尋篩選條件
    setSearchFilters: (state, action: PayloadAction<SearchFilters>) => {
      state.searchParams.filters = action.payload;
    },

    // 更新特定篩選條件
    updateFilter: (state, action: PayloadAction<{ key: keyof SearchFilters; value: any }>) => {
      if (!state.searchParams.filters) {
        state.searchParams.filters = {};
      }
      state.searchParams.filters[action.payload.key] = action.payload.value;
    },

    // 設定排序方式
    setSortBy: (state, action: PayloadAction<'distance' | 'grade' | 'name'>) => {
      state.searchParams.sortBy = action.payload;
    },

    // 設定搜尋限制數量
    setSearchLimit: (state, action: PayloadAction<number>) => {
      state.searchParams.limit = action.payload;
    },

    // 清除搜尋條件
    clearSearch: (state) => {
      state.searchParams = {
        limit: state.searchParams.limit,
        sortBy: state.searchParams.sortBy,
      };
    },

    // 清除搜尋歷史
    clearSearchHistory: (state) => {
      state.searchHistory = [];
    },

    // 新增收藏廁所
    addFavoriteToilet: (state, action: PayloadAction<string>) => {
      if (!state.favoriteToilets.includes(action.payload)) {
        state.favoriteToilets.push(action.payload);
        localStorage.setItem('favoriteToilets', JSON.stringify(state.favoriteToilets));
      }
    },

    // 移除收藏廁所
    removeFavoriteToilet: (state, action: PayloadAction<string>) => {
      state.favoriteToilets = state.favoriteToilets.filter(id => id !== action.payload);
      localStorage.setItem('favoriteToilets', JSON.stringify(state.favoriteToilets));
    },

    // 設定搜尋結果
    setSearchResults: (state, action: PayloadAction<{ toilets: any[]; total: number }>) => {
      state.lastSearchResults = {
        ...action.payload,
        timestamp: Date.now(),
      };
    },

    // 清除搜尋結果
    clearSearchResults: (state) => {
      state.lastSearchResults = null;
    },
  },
});

export const {
  setSearchKeyword,
  setUserLocation,
  setLocationLoading,
  setLocationError,
  setSearchFilters,
  updateFilter,
  setSortBy,
  setSearchLimit,
  clearSearch,
  clearSearchHistory,
  addFavoriteToilet,
  removeFavoriteToilet,
  setSearchResults,
  clearSearchResults,
} = searchSlice.actions;

export default searchSlice.reducer;
