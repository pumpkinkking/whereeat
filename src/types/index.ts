/**
 * 行程类型定义
 */
export interface Trip {
  id: string;
  name: string;
  startDate: Date;
  endDate: Date;
  imageUrl?: string;
  isActive: boolean;
}

/**
 * 菜单项类型
 */
export interface MenuItem {
  id: string;
  title: string;
  icon: string;
  onPress?: () => void;
}

/**
 * 雷达搜索模式
 */
export type RadarMode = 'route' | 'topic';

/**
 * 雷达筛选类型
 */
export type RadarFilterType = 'eat' | 'play';

/**
 * 侧边栏菜单状态
 */
export type DrawerMenuView = 'main' | 'profile';

/**
 * 底部导航Tab类型
 */
export type TabName = 'Trip' | 'Add' | 'Radar';

/**
 * 导航参数类型
 */
export type RootStackParamList = {
  MainTabs: undefined;
  TripDetail: { tripId: string };
};

export type MainTabParamList = {
  Trip: undefined;
  Add: undefined;
  Radar: undefined;
};
