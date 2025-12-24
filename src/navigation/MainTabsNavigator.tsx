import React, { useState } from 'react';
import { 
  createBottomTabNavigator,
  BottomTabNavigationProp,
  BottomTabBarProps
} from '@react-navigation/bottom-tabs';
import { MainTabParamList } from './tabTypes';
import { Ionicons } from '@expo/vector-icons';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity,
  Animated,
  Dimensions
} from 'react-native';

// 导入实际的屏幕组件
import { HomeScreen } from '../screens/home/HomeScreen';
import { PlansScreen } from '../screens/plans/PlansScreen';
import { ExploreScreen } from '../screens/explore/ExploreScreen';
import { MessagesScreen } from '../screens/messages/MessagesScreen';
import { ProfileScreen } from '../screens/profile/ProfileScreen';

const Tab = createBottomTabNavigator<MainTabParamList>();
const { width } = Dimensions.get('window');

/**
 * 自定义底部标签栏组件
 * 实现左边行程、中间+号、右边雷达的布局
 */
const CustomTabBar: React.FC<BottomTabBarProps> = (props) => {
  const { state, descriptors, navigation } = props;
  const [menuVisible, setMenuVisible] = useState(false);
  const menuScale = useState(new Animated.Value(0))[0];
  const menuOpacity = useState(new Animated.Value(0))[0];

  /**
   * 处理+号按钮点击
   */
  const handlePlusPress = () => {
    if (menuVisible) {
      // 关闭菜单动画
      Animated.parallel([
        Animated.timing(menuScale, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(menuOpacity, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setMenuVisible(false);
      });
    } else {
      // 打开菜单动画
      setMenuVisible(true);
      Animated.parallel([
        Animated.spring(menuScale, {
          toValue: 1,
          friction: 6,
          useNativeDriver: true,
        }),
        Animated.timing(menuOpacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  };

  /**
   * 处理菜单项点击
   * @param action 菜单项动作
   */
  const handleMenuItemPress = (action: string) => {
    // 关闭菜单
    handlePlusPress();
    
    // 根据动作执行相应操作
    if (action === 'food') {
      // 导航到找吃的页面
      navigation.navigate('Home' as any);
    } else if (action === 'play') {
      // 导航到出去玩页面
      navigation.navigate('Explore' as any);
    }
  };

  return (
    <View style={styles.tabBarContainer}>
      {/* 左侧标签：行程 */}
      <TouchableOpacity
        accessibilityRole="button"
        accessibilityState={state.index === state.routes.findIndex(route => route.name === 'Plans') ? { selected: true } : {}}
        onPress={() => navigation.navigate('Plans')}
        style={styles.tabBarItem}
      >
        <View style={styles.tabItemContent}>
          <Ionicons
            name={state.index === state.routes.findIndex(route => route.name === 'Plans') ? 'calendar' : 'calendar-outline'}
            size={24}
            color={state.index === state.routes.findIndex(route => route.name === 'Plans') ? '#1e90ff' : '#666666'}
          />
          <Text style={[
            styles.tabItemText,
            state.index === state.routes.findIndex(route => route.name === 'Plans') ? styles.tabItemTextFocused : null
          ]}>
            行程
          </Text>
        </View>
      </TouchableOpacity>
      
      {/* 中间+号按钮 */}
      <TouchableOpacity
        style={[styles.tabBarItem, styles.plusButtonContainer]}
        onPress={handlePlusPress}
      >
        <View>
          <TouchableOpacity
            style={styles.plusButton}
            onPress={handlePlusPress}
          >
            <Ionicons name="add" size={24} color="#ffffff" />
          </TouchableOpacity>
          
          {/* 弹出菜单 */}
          {menuVisible && (
            <Animated.View
              style={[
                styles.menuContainer,
                {
                  opacity: menuOpacity,
                  transform: [{ scale: menuScale }],
                }
              ]}
            >
              <TouchableOpacity
                style={[styles.menuItem, styles.foodItem]}
                onPress={() => handleMenuItemPress('food')}
              >
                <Ionicons name="restaurant" size={20} color="#ffffff" />
                <Text style={styles.menuItemText}>找吃的</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.menuItem, styles.playItem]}
                onPress={() => handleMenuItemPress('play')}
              >
                <Ionicons name="compass" size={20} color="#ffffff" />
                <Text style={styles.menuItemText}>出去玩</Text>
              </TouchableOpacity>
            </Animated.View>
          )}
        </View>
      </TouchableOpacity>
      
      {/* 右侧标签：雷达 */}
      <TouchableOpacity
        accessibilityRole="button"
        accessibilityState={state.index === state.routes.findIndex(route => route.name === 'Explore') ? { selected: true } : {}}
        onPress={() => navigation.navigate('Explore')}
        style={styles.tabBarItem}
      >
        <View style={styles.tabItemContent}>
          <Ionicons
            name={state.index === state.routes.findIndex(route => route.name === 'Explore') ? 'compass' : 'compass-outline'}
            size={24}
            color={state.index === state.routes.findIndex(route => route.name === 'Explore') ? '#1e90ff' : '#666666'}
          />
          <Text style={[
            styles.tabItemText,
            state.index === state.routes.findIndex(route => route.name === 'Explore') ? styles.tabItemTextFocused : null
          ]}>
            雷达
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

/**
 * 主标签页导航组件
 * 包含首页、旅行计划、探索地图、消息和个人中心五个标签页
 */
export const MainTabsNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
      }}
      tabBar={(props) => <CustomTabBar {...props} />}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Plans" component={PlansScreen} />
      <Tab.Screen name="Explore" component={ExploreScreen} />
      <Tab.Screen name="Messages" component={MessagesScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    height: 80,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    paddingBottom: 10,
    paddingTop: 10,
  },
  tabBarContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: '100%',
  },
  tabBarItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },
  tabItemContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabItemText: {
    fontSize: 12,
    color: '#666666',
    marginTop: 4,
  },
  tabItemTextFocused: {
    color: '#1e90ff',
    fontWeight: '600',
  },
  plusButtonContainer: {
    justifyContent: 'flex-start',
  },
  plusButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#1e90ff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#1e90ff',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  menuContainer: {
    position: 'absolute',
    bottom: 70,
    left: width / 2 - 90,
    width: 180,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    borderRadius: 12,
    padding: 8,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    marginVertical: 4,
  },
  foodItem: {
    backgroundColor: '#ff6b6b',
  },
  playItem: {
    backgroundColor: '#4ecdc4',
  },
  menuItemText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
});
