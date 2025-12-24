import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from './types';
import { MainTabsNavigator } from './MainTabsNavigator';

// 导入实际的屏幕组件
import { LoginScreen } from '../screens/auth/LoginScreen';
import { RegisterScreen } from '../screens/auth/RegisterScreen';
import { FoodDetailScreen } from '../screens/food/FoodDetailScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

/**
 * 应用根导航组件
 * 包含主标签页导航和其他全屏页面导航
 */
export const RootNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        {/* 主标签页导航 */}
        <Stack.Screen name="MainTabs" component={MainTabsNavigator} />
        {/* 认证相关页面 */}
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        {/* 详情页面 */}
        <Stack.Screen name="FoodDetail" component={FoodDetailScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
