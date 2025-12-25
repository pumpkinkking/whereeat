import { create } from 'zustand';
import { Trip } from '../types';

/**
 * 模拟行程数据
 */
const mockTrips: Trip[] = [
  {
    id: '1',
    name: '杭州西湖之旅',
    startDate: new Date('2025-12-28'),
    endDate: new Date('2025-12-30'),
    imageUrl: 'https://picsum.photos/200/150?random=1',
    isActive: false,
  },
  {
    id: '2',
    name: '上海迪士尼乐园',
    startDate: new Date('2026-01-05'),
    endDate: new Date('2026-01-07'),
    imageUrl: 'https://picsum.photos/200/150?random=2',
    isActive: false,
  },
  {
    id: '3',
    name: '苏州园林游',
    startDate: new Date('2026-01-15'),
    endDate: new Date('2026-01-17'),
    imageUrl: 'https://picsum.photos/200/150?random=3',
    isActive: false,
  },
];

interface TripState {
  trips: Trip[];
  currentTrip: Trip | null;
  setTrips: (trips: Trip[]) => void;
  setCurrentTrip: (trip: Trip | null) => void;
  addTrip: (trip: Trip) => void;
  getTodayTrip: () => Trip | null;
  getFutureTrips: () => Trip[];
}

/**
 * 行程状态管理Store
 */
export const useTripStore = create<TripState>((set, get) => ({
  trips: mockTrips,
  currentTrip: null,
  
  setTrips: (trips) => set({ trips }),
  
  setCurrentTrip: (trip) => set({ currentTrip: trip }),
  
  addTrip: (trip) => set((state) => ({ trips: [...state.trips, trip] })),
  
  /**
   * 获取当天正在进行的行程
   */
  getTodayTrip: () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayTime = today.getTime();
    
    return get().trips.find((trip) => {
      const startTime = new Date(trip.startDate).setHours(0, 0, 0, 0);
      const endTime = new Date(trip.endDate).setHours(23, 59, 59, 999);
      return todayTime >= startTime && todayTime <= endTime;
    }) || null;
  },
  
  /**
   * 获取未来的行程列表
   */
  getFutureTrips: () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayTime = today.getTime();
    
    return get().trips
      .filter((trip) => {
        const startTime = new Date(trip.startDate).setHours(0, 0, 0, 0);
        return startTime > todayTime;
      })
      .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
  },
}));
