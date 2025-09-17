import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { ToiletData, Toilet, SearchParams, ApiResponse, ToiletListResponse } from '@/types';

// 環保署公廁API基礎URL
const EPA_API_BASE_URL = 'https://data.moenv.gov.tw/api/v2/fac_p_07';
const EPA_API_KEY = '58d6040c-dca7-407f-a244-d0bfdfa8144a';

// 創建axios實例
const epaApi: AxiosInstance = axios.create({
  baseURL: EPA_API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 環保署API回應介面
interface EPAApiResponse {
  fields: Array<{
    id: string;
    type: string;
    info: {
      label: string;
    };
  }>;
  include_total: boolean;
  total: string;
  resource_format: string;
  limit: string;
  offset: string;
  _links: {
    start: string;
    next: string;
  };
  records: ToiletData[];
}

// 計算兩點間距離（公尺）
function calculateDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371e3; // 地球半徑（公尺）
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

// 轉換環保署資料格式為內部格式
function transformToiletData(data: ToiletData): Toilet {
  return {
    id: data.number,
    name: data.name,
    address: data.address,
    latitude: parseFloat(data.latitude),
    longitude: parseFloat(data.longitude),
    type: data.type as any,
    category: data.type2,
    grade: data.grade,
    management: data.exec,
    hasDiaperTable: data.diaper === '1',
  };
}

// 根據距離排序
function sortByDistance(toilets: Toilet[], userLocation: { latitude: number; longitude: number }): Toilet[] {
  return toilets
    .map(toilet => ({
      ...toilet,
      distance: calculateDistance(
        userLocation.latitude,
        userLocation.longitude,
        toilet.latitude,
        toilet.longitude
      ),
    }))
    .sort((a, b) => (a.distance || 0) - (b.distance || 0));
}

// 篩選廁所
function filterToilets(toilets: Toilet[], filters: any): Toilet[] {
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

// 關鍵字搜尋
function searchByKeyword(toilets: Toilet[], keyword: string): Toilet[] {
  if (!keyword.trim()) return toilets;
  
  const lowerKeyword = keyword.toLowerCase();
  return toilets.filter(toilet => 
    toilet.name.toLowerCase().includes(lowerKeyword) ||
    toilet.address.toLowerCase().includes(lowerKeyword) ||
    toilet.management.toLowerCase().includes(lowerKeyword)
  );
}

class ToiletApiService {
  // 取得所有公廁資料
  async getAllToilets(limit: number = 1000): Promise<ToiletData[]> {
    try {
      const response: AxiosResponse<EPAApiResponse> = await epaApi.get('', {
        params: {
          api_key: EPA_API_KEY,
          limit,
          sort: 'ImportDate desc',
          format: 'JSON',
        },
      });

      return response.data.records;
    } catch (error) {
      console.error('取得公廁資料失敗:', error);
      throw new Error('無法取得公廁資料，請稍後再試');
    }
  }

  // 搜尋附近廁所
  async searchNearbyToilets(params: SearchParams): Promise<ToiletListResponse> {
    try {
      // 先取得所有資料
      const allToilets = await this.getAllToilets();
      let toilets = allToilets.map(transformToiletData);

      // 關鍵字搜尋
      if (params.keyword) {
        toilets = searchByKeyword(toilets, params.keyword);
      }

      // 篩選
      if (params.filters) {
        toilets = filterToilets(toilets, params.filters);
      }

      // 根據位置計算距離並排序
      if (params.location) {
        toilets = sortByDistance(toilets, params.location);
      }

      // 其他排序方式
      if (params.sortBy === 'name') {
        toilets.sort((a, b) => a.name.localeCompare(b.name, 'zh-TW'));
      } else if (params.sortBy === 'grade') {
        const gradeOrder = ['特優級', '優級', '良級', '普通級', '不合格'];
        toilets.sort((a, b) => gradeOrder.indexOf(a.grade) - gradeOrder.indexOf(b.grade));
      }

      // 分頁
      const limit = params.limit || 20;
      const page = 1; // 目前只支援第一頁
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedToilets = toilets.slice(startIndex, endIndex);

      return {
        toilets: paginatedToilets,
        total: toilets.length,
        page,
        limit,
        hasMore: endIndex < toilets.length,
      };
    } catch (error) {
      console.error('搜尋附近廁所失敗:', error);
      throw new Error('搜尋失敗，請稍後再試');
    }
  }

  // 取得特定廁所詳情
  async getToiletById(id: string): Promise<Toilet | null> {
    try {
      const allToilets = await this.getAllToilets();
      const toiletData = allToilets.find(t => t.number === id);
      
      if (!toiletData) {
        return null;
      }

      return transformToiletData(toiletData);
    } catch (error) {
      console.error('取得廁所詳情失敗:', error);
      throw new Error('無法取得廁所詳情');
    }
  }

  // 取得縣市列表
  async getCounties(): Promise<string[]> {
    try {
      const allToilets = await this.getAllToilets();
      const counties = [...new Set(allToilets.map(t => t.county))];
      return counties.sort();
    } catch (error) {
      console.error('取得縣市列表失敗:', error);
      return [];
    }
  }

  // 取得公廁類型列表
  getToiletTypes(): string[] {
    return ['男廁所', '女廁所', '無障礙廁所', '混合廁所'];
  }

  // 取得公廁等級列表
  getToiletGrades(): string[] {
    return ['特優級', '優級', '良級', '普通級', '不合格'];
  }
}

// 匯出單例實例
export const toiletApiService = new ToiletApiService();
export default toiletApiService;
