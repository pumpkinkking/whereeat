// 定义导航参数类型
export type RootStackParamList = {
  // 主标签页导航
  MainTabs: undefined;
  
  // 用户相关页面
  Login: undefined;
  Register: undefined;
  Profile: undefined;
  EditProfile: undefined;
  
  // 旅行计划相关页面
  CreatePlan: undefined;
  EditPlan: { planId: string };
  PlanDetail: { planId: string };
  
  // 美食相关页面
  FoodDetail: { foodId: string };
  FoodSearch: undefined;
  FoodRecommendations: undefined;
  
  // 地图相关页面
  MapView: undefined;
  
  // 设置页面
  Settings: undefined;
};
