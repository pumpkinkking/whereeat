import React from 'react';
import { View, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { TripScreen, RadarScreen } from '../screens';
import { CustomTabBar, DrawerContent } from '../components';

const Drawer = createDrawerNavigator();
const Tab = createBottomTabNavigator();

/**
 * 空白占位页面（用于中间的+按钮）
 */
const AddPlaceholder: React.FC = () => <View style={styles.placeholder} />;

/**
 * 底部Tab导航器
 */
const TabNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tab.Screen name="Trip" component={TripScreen} />
      <Tab.Screen name="Add" component={AddPlaceholder} />
      <Tab.Screen name="Radar" component={RadarScreen} />
    </Tab.Navigator>
  );
};

/**
 * 抽屉导航器（包含侧边栏）
 */
const DrawerNavigator: React.FC = () => {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <DrawerContent {...props} />}
      screenOptions={{
        headerShown: false,
        drawerType: 'front',
        drawerStyle: {
          width: '80%',
        },
        swipeEnabled: true,
        swipeEdgeWidth: 50,
      }}
    >
      <Drawer.Screen name="Main" component={TabNavigator} />
    </Drawer.Navigator>
  );
};

/**
 * 根导航器
 * 集成抽屉导航和手势处理
 */
export const RootNavigator: React.FC = () => {
  return (
    <GestureHandlerRootView style={styles.container}>
      <NavigationContainer>
        <DrawerNavigator />
      </NavigationContainer>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  placeholder: {
    flex: 1,
  },
});
