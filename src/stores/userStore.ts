import { create } from 'zustand';

/**
 * 用户信息类型定义
 */
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  phone?: string;
  gender?: 'male' | 'female' | 'other';
  birthDate?: string;
  location?: string;
  preferences?: UserPreferences;
  createdAt: string;
  updatedAt: string;
}

/**
 * 用户偏好设置类型定义
 */
export interface UserPreferences {
  // 口味偏好
  cuisinePreferences: string[];
  // 价格范围偏好
  priceRange: number[];
  // 饮食限制
  dietaryRestrictions: string[];
  // 是否喜欢探索新餐厅
  likesExploring: boolean;
  // 优先推荐距离
  preferredDistance: number;
}

/**
 * 用户状态类型定义
 */
interface UserState {
  // 用户信息
  user: User | null;
  // 是否已登录
  isLoggedIn: boolean;
  // 登录状态
  login: (userData: User) => void;
  // 退出登录
  logout: () => void;
  // 更新用户信息
  updateUser: (updates: Partial<User>) => void;
  // 更新用户偏好
  updatePreferences: (preferences: UserPreferences) => void;
}

/**
 * 用户状态管理Store
 * 处理用户登录、退出、信息更新等操作
 */
export const useUserStore = create<UserState>((set) => ({
  // 初始状态
  user: null,
  isLoggedIn: false,
  
  /**
   * 用户登录
   * @param userData 用户数据
   */
  login: (userData) => {
    set({
      user: userData,
      isLoggedIn: true,
    });
  },
  
  /**
   * 用户退出登录
   */
  logout: () => {
    set({
      user: null,
      isLoggedIn: false,
    });
  },
  
  /**
   * 更新用户信息
   * @param updates 要更新的用户信息部分
   */
  updateUser: (updates) => {
    set((state) => ({
      user: state.user ? { ...state.user, ...updates, updatedAt: new Date().toISOString() } : null,
    }));
  },
  
  /**
   * 更新用户偏好设置
   * @param preferences 用户偏好设置
   */
  updatePreferences: (preferences) => {
    set((state) => ({
      user: state.user ? {
        ...state.user,
        preferences,
        updatedAt: new Date().toISOString(),
      } : null,
    }));
  },
}));
