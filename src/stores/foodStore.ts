import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/**
 * 美食商家类型定义
 */
export interface FoodVendor {
  /** 商家ID */
  id: string;
  /** 商家名称 */
  name: string;
  /** 商家评分 */
  rating: number;
  /** 商家地址 */
  address: string;
  /** 商家电话 */
  phone?: string;
  /** 商家图片 */
  images?: string[];
  /** 商家类别 */
  categories: string[];
  /** 人均消费 */
  averagePrice: number;
  /** 距离当前位置的距离（米） */
  distance?: number;
  /** 营业时间 */
  openingHours?: string[];
  /** 是否营业 */
  isOpen?: boolean;
  /** 推荐理由 */
  recommendationReason?: string;
  /** 地理位置坐标 */
  coordinates?: {
    latitude: number;
    longitude: number;
  };
}

/**
 * 搜索历史记录类型定义
 */
export interface SearchHistory {
  /** 搜索关键词 */
  keyword: string;
  /** 搜索时间 */
  timestamp: string;
  /** 搜索结果数量 */
  resultCount?: number;
}

/**
 * 美食推荐状态管理类型定义
 */
interface FoodState {
  /** 推荐美食列表 */
  recommendedFoods: FoodVendor[];
  /** 附近美食列表 */
  nearbyFoods: FoodVendor[];
  /** 搜索历史记录 */
  searchHistory: SearchHistory[];
  /** 收藏的美食商家 */
  favoriteFoods: string[];
  /** 当前搜索关键词 */
  currentSearchKeyword: string;
  /** 搜索结果 */
  searchResults: FoodVendor[];
  /** 设置推荐美食列表 */
  setRecommendedFoods: (foods: FoodVendor[]) => void;
  /** 设置附近美食列表 */
  setNearbyFoods: (foods: FoodVendor[]) => void;
  /** 添加搜索历史记录 */
  addSearchHistory: (keyword: string, resultCount?: number) => void;
  /** 清除搜索历史记录 */
  clearSearchHistory: () => void;
  /** 添加美食商家到收藏 */
  addToFavorites: (foodId: string) => void;
  /** 从收藏中移除美食商家 */
  removeFromFavorites: (foodId: string) => void;
  /** 检查美食商家是否已收藏 */
  isFavorite: (foodId: string) => boolean;
  /** 设置当前搜索关键词 */
  setCurrentSearchKeyword: (keyword: string) => void;
  /** 设置搜索结果 */
  setSearchResults: (results: FoodVendor[]) => void;
}

/**
 * 美食推荐状态管理Store
 * 使用Zustand创建，支持持久化存储
 */
export const useFoodStore = create<FoodState>()(
  persist(
    (set, get) => ({
      // 初始状态
      recommendedFoods: [],
      nearbyFoods: [],
      searchHistory: [],
      favoriteFoods: [],
      currentSearchKeyword: '',
      searchResults: [],
      
      /**
       * 设置推荐美食列表
       * @param foods 美食列表
       */
      setRecommendedFoods: (foods) => set({ recommendedFoods: foods }),
      
      /**
       * 设置附近美食列表
       * @param foods 美食列表
       */
      setNearbyFoods: (foods) => set({ nearbyFoods: foods }),
      
      /**
       * 添加搜索历史记录
       * @param keyword 搜索关键词
       * @param resultCount 搜索结果数量
       */
      addSearchHistory: (keyword, resultCount) => set((state) => {
        // 移除重复的关键词
        const filteredHistory = state.searchHistory.filter(
          (item) => item.keyword !== keyword
        );
        
        // 添加新的搜索记录到开头
        const newHistory = [
          {
            keyword,
            timestamp: new Date().toISOString(),
            resultCount,
          },
          ...filteredHistory,
        ].slice(0, 20); // 只保留最近20条搜索记录
        
        return { searchHistory: newHistory };
      }),
      
      /**
       * 清除搜索历史记录
       */
      clearSearchHistory: () => set({ searchHistory: [] }),
      
      /**
       * 添加美食商家到收藏
       * @param foodId 美食商家ID
       */
      addToFavorites: (foodId) => set((state) => {
        if (!state.favoriteFoods.includes(foodId)) {
          return { favoriteFoods: [...state.favoriteFoods, foodId] };
        }
        return {};
      }),
      
      /**
       * 从收藏中移除美食商家
       * @param foodId 美食商家ID
       */
      removeFromFavorites: (foodId) => set((state) => ({
        favoriteFoods: state.favoriteFoods.filter((id) => id !== foodId),
      })),
      
      /**
       * 检查美食商家是否已收藏
       * @param foodId 美食商家ID
       * @returns 是否已收藏
       */
      isFavorite: (foodId) => get().favoriteFoods.includes(foodId),
      
      /**
       * 设置当前搜索关键词
       * @param keyword 搜索关键词
       */
      setCurrentSearchKeyword: (keyword) => set({ currentSearchKeyword: keyword }),
      
      /**
       * 设置搜索结果
       * @param results 搜索结果列表
       */
      setSearchResults: (results) => set({ searchResults: results }),
    }),
    {
      name: 'whereeat-food-storage', // 本地存储键名
      partialize: (state) => ({
        searchHistory: state.searchHistory,
        favoriteFoods: state.favoriteFoods,
      }), // 只持久化搜索历史和收藏数据
    }
  )
);
