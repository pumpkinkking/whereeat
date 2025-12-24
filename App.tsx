import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RootNavigator } from './src/navigation/RootNavigator';

// 创建React Query客户端实例
const queryClient = new QueryClient();

/**
 * 应用主组件
 * 集成导航系统、React Query和状态管理
 */
export default function App() {
  return (
    // 提供React Query上下文
    <QueryClientProvider client={queryClient}>
      {/* 提供安全区域上下文 */}
      <SafeAreaProvider>
        {/* 主导航组件 */}
        <RootNavigator />
        {/* 状态栏配置 */}
        <StatusBar style="auto" />
      </SafeAreaProvider>
    </QueryClientProvider>
  );
}
