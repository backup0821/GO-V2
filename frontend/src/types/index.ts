// 環保署公廁API資料型別
export interface ToiletData {
  county: string;        // 縣市名稱
  city: string;          // 鄉鎮市名稱
  village: string;       // 村里名稱
  number: string;        // 建檔編號
  name: string;          // 建檔名稱
  address: string;       // 地址
  administration: string; // 主管機關
  latitude: string;      // 緯度
  longitude: string;     // 經度
  grade: string;         // 等級
  type2: string;         // 公廁類別
  type: string;          // 公廁類型
  exec: string;          // 管理單位
  diaper: string;        // 尿布檯組
}

// 處理後的廁所資料
export interface Toilet {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  type: ToiletType;
  category: string;
  grade: string;
  management: string;
  hasDiaperTable: boolean;
  distance?: number; // 距離使用者位置的距離（公尺）
}

export type ToiletType = '男廁所' | '女廁所' | '無障礙廁所' | '混合廁所';

export type ToiletGrade = '特優級' | '優級' | '良級' | '普通級' | '不合格';

export interface UserLocation {
  latitude: number;
  longitude: number;
  address?: string;
}

export interface SearchFilters {
  type?: ToiletType[];
  grade?: ToiletGrade[];
  category?: string[];
  hasDiaperTable?: boolean;
  maxDistance?: number;
}

export interface SearchParams {
  keyword?: string;
  location?: UserLocation;
  filters?: SearchFilters;
  sortBy?: 'distance' | 'grade' | 'name';
  limit?: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  timestamp: string;
}

export interface ToiletListResponse {
  toilets: Toilet[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

// 地圖相關型別
export interface MapMarker {
  id: string;
  position: {
    lat: number;
    lng: number;
  };
  title: string;
  type: ToiletType;
  grade: string;
  data: Toilet;
}

// 無障礙功能相關型別
export interface AccessibilitySettings {
  highContrast: boolean;
  largeText: boolean;
  screenReader: boolean;
  keyboardNavigation: boolean;
}

// 使用者偏好設定
export interface UserPreferences {
  accessibility: AccessibilitySettings;
  defaultSearchRadius: number;
  favoriteToilets: string[];
  searchHistory: string[];
}
