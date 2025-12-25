import { create } from 'zustand';
import { DrawerMenuView } from '../types';

interface MenuState {
  // 侧边栏是否展开
  isDrawerOpen: boolean;
  // 侧边栏当前视图
  drawerView: DrawerMenuView;
  // 添加按钮弹出菜单是否展开
  isAddMenuOpen: boolean;
  
  // Actions
  openDrawer: () => void;
  closeDrawer: () => void;
  toggleDrawer: () => void;
  setDrawerView: (view: DrawerMenuView) => void;
  toggleAddMenu: () => void;
  closeAddMenu: () => void;
}

/**
 * 菜单状态管理Store
 */
export const useMenuStore = create<MenuState>((set) => ({
  isDrawerOpen: false,
  drawerView: 'main',
  isAddMenuOpen: false,
  
  openDrawer: () => set({ isDrawerOpen: true }),
  closeDrawer: () => set({ isDrawerOpen: false, drawerView: 'main' }),
  toggleDrawer: () => set((state) => ({ isDrawerOpen: !state.isDrawerOpen })),
  setDrawerView: (view) => set({ drawerView: view }),
  toggleAddMenu: () => set((state) => ({ isAddMenuOpen: !state.isAddMenuOpen })),
  closeAddMenu: () => set({ isAddMenuOpen: false }),
}));
