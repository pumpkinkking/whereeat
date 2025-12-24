import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/**
 * 旅行计划中的活动类型定义
 */
export interface PlanActivity {
  /** 活动ID */
  id: string;
  /** 活动名称 */
  name: string;
  /** 活动类型 */
  type: 'sightseeing' | 'food' | 'shopping' | 'other';
  /** 活动地点 */
  location: string;
  /** 活动时间 */
  time: string;
  /** 活动描述 */
  description?: string;
  /** 活动预算 */
  budget?: number;
}

/**
 * 旅行计划类型定义
 */
export interface TravelPlan {
  /** 计划ID */
  id: string;
  /** 计划名称 */
  name: string;
  /** 目的地 */
  destination: string;
  /** 出发日期 */
  startDate: string;
  /** 结束日期 */
  endDate: string;
  /** 旅行人数 */
  peopleCount: number;
  /** 旅行主题 */
  theme?: string;
  /** 活动列表 */
  activities: PlanActivity[];
  /** 创建时间 */
  createdAt: string;
  /** 更新时间 */
  updatedAt: string;
  /** 是否为当前计划 */
  isCurrent: boolean;
}

/**
 * 旅行计划状态管理类型定义
 */
interface PlanState {
  /** 所有旅行计划 */
  plans: TravelPlan[];
  /** 当前选中的旅行计划 */
  currentPlan: TravelPlan | null;
  /** 创建旅行计划 */
  createPlan: (plan: Omit<TravelPlan, 'id' | 'createdAt' | 'updatedAt'>) => void;
  /** 更新旅行计划 */
  updatePlan: (id: string, updates: Partial<TravelPlan>) => void;
  /** 删除旅行计划 */
  deletePlan: (id: string) => void;
  /** 设置当前旅行计划 */
  setCurrentPlan: (id: string) => void;
  /** 添加活动到旅行计划 */
  addActivity: (planId: string, activity: Omit<PlanActivity, 'id'>) => void;
  /** 更新旅行计划中的活动 */
  updateActivity: (planId: string, activityId: string, updates: Partial<PlanActivity>) => void;
  /** 从旅行计划中删除活动 */
  removeActivity: (planId: string, activityId: string) => void;
}

/**
 * 旅行计划状态管理Store
 * 使用Zustand创建，支持持久化存储
 */
export const usePlanStore = create<PlanState>()(
  persist(
    (set) => ({
      // 初始状态
      plans: [],
      currentPlan: null,
      
      /**
       * 创建旅行计划
       * @param plan 旅行计划信息（不包含id和时间戳）
       */
      createPlan: (plan) => set((state) => {
        const newPlan: TravelPlan = {
          ...plan,
          id: `plan-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        
        const updatedPlans = [...state.plans, newPlan];
        
        return {
          plans: updatedPlans,
          // 如果是第一个计划，自动设为当前计划
          currentPlan: state.currentPlan || newPlan,
        };
      }),
      
      /**
       * 更新旅行计划
       * @param id 旅行计划ID
       * @param updates 旅行计划更新内容
       */
      updatePlan: (id, updates) => set((state) => {
        const updatedPlans = state.plans.map((plan) =>
          plan.id === id
            ? { ...plan, ...updates, updatedAt: new Date().toISOString() }
            : plan
        );
        
        return {
          plans: updatedPlans,
          currentPlan: state.currentPlan?.id === id
            ? { ...state.currentPlan, ...updates, updatedAt: new Date().toISOString() }
            : state.currentPlan,
        };
      }),
      
      /**
       * 删除旅行计划
       * @param id 旅行计划ID
       */
      deletePlan: (id) => set((state) => {
        const updatedPlans = state.plans.filter((plan) => plan.id !== id);
        
        return {
          plans: updatedPlans,
          currentPlan: state.currentPlan?.id === id
            ? updatedPlans[0] || null
            : state.currentPlan,
        };
      }),
      
      /**
       * 设置当前旅行计划
       * @param id 旅行计划ID
       */
      setCurrentPlan: (id) => set((state) => {
        const plan = state.plans.find((p) => p.id === id) || null;
        
        // 更新所有计划的isCurrent状态
        const updatedPlans = state.plans.map((p) => ({
          ...p,
          isCurrent: p.id === id,
        }));
        
        return {
          plans: updatedPlans,
          currentPlan: plan,
        };
      }),
      
      /**
       * 添加活动到旅行计划
       * @param planId 旅行计划ID
       * @param activity 活动信息（不包含id）
       */
      addActivity: (planId, activity) => set((state) => {
        const updatedPlans = state.plans.map((plan) => {
          if (plan.id === planId) {
            const newActivity: PlanActivity = {
              ...activity,
              id: `activity-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            };
            
            return {
              ...plan,
              activities: [...plan.activities, newActivity],
              updatedAt: new Date().toISOString(),
            };
          }
          return plan;
        });
        
        return {
          plans: updatedPlans,
          currentPlan: state.currentPlan?.id === planId
            ? {
                ...state.currentPlan,
                activities: [...(state.currentPlan.activities || []), {
                  ...activity,
                  id: `activity-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                }],
                updatedAt: new Date().toISOString(),
              }
            : state.currentPlan,
        };
      }),
      
      /**
       * 更新旅行计划中的活动
       * @param planId 旅行计划ID
       * @param activityId 活动ID
       * @param updates 活动更新内容
       */
      updateActivity: (planId, activityId, updates) => set((state) => {
        const updatedPlans = state.plans.map((plan) => {
          if (plan.id === planId) {
            const updatedActivities = plan.activities.map((activity) =>
              activity.id === activityId
                ? { ...activity, ...updates }
                : activity
            );
            
            return {
              ...plan,
              activities: updatedActivities,
              updatedAt: new Date().toISOString(),
            };
          }
          return plan;
        });
        
        return {
          plans: updatedPlans,
          currentPlan: state.currentPlan?.id === planId
            ? {
                ...state.currentPlan,
                activities: state.currentPlan.activities.map((activity) =>
                  activity.id === activityId
                    ? { ...activity, ...updates }
                    : activity
                ),
                updatedAt: new Date().toISOString(),
              }
            : state.currentPlan,
        };
      }),
      
      /**
       * 从旅行计划中删除活动
       * @param planId 旅行计划ID
       * @param activityId 活动ID
       */
      removeActivity: (planId, activityId) => set((state) => {
        const updatedPlans = state.plans.map((plan) => {
          if (plan.id === planId) {
            const updatedActivities = plan.activities.filter(
              (activity) => activity.id !== activityId
            );
            
            return {
              ...plan,
              activities: updatedActivities,
              updatedAt: new Date().toISOString(),
            };
          }
          return plan;
        });
        
        return {
          plans: updatedPlans,
          currentPlan: state.currentPlan?.id === planId
            ? {
                ...state.currentPlan,
                activities: state.currentPlan.activities.filter(
                  (activity) => activity.id !== activityId
                ),
                updatedAt: new Date().toISOString(),
              }
            : state.currentPlan,
        };
      }),
    }),
    {
      name: 'whereeat-plan-storage', // 本地存储键名
    }
  )
);
