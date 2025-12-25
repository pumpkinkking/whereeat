import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useMenuStore } from '../stores';

const { width } = Dimensions.get('window');

/**
 * 自定义底部导航栏组件
 * 包含行程、+按钮、雷达三个选项
 */
export const CustomTabBar: React.FC<BottomTabBarProps> = ({
  state,
  descriptors,
  navigation,
}) => {
  const { isAddMenuOpen, toggleAddMenu, closeAddMenu } = useMenuStore();
  const [animation] = React.useState(new Animated.Value(0));

  // 处理添加菜单动画
  React.useEffect(() => {
    Animated.spring(animation, {
      toValue: isAddMenuOpen ? 1 : 0,
      useNativeDriver: true,
      friction: 8,
    }).start();
  }, [isAddMenuOpen, animation]);

  const handleTabPress = (routeName: string, isFocused: boolean) => {
    if (routeName === 'Add') {
      toggleAddMenu();
      return;
    }
    
    closeAddMenu();
    
    if (!isFocused) {
      navigation.navigate(routeName);
    }
  };

  const handleAddOption = (type: 'eat' | 'play') => {
    closeAddMenu();
    // 这里可以导航到对应的页面或执行其他操作
    console.log(`选择了: ${type === 'eat' ? '出去吃' : '出去玩'}`);
  };

  // 菜单按钮动画
  const eatButtonStyle = {
    transform: [
      {
        translateY: animation.interpolate({
          inputRange: [0, 1],
          outputRange: [0, -70],
        }),
      },
      {
        translateX: animation.interpolate({
          inputRange: [0, 1],
          outputRange: [0, -50],
        }),
      },
      {
        scale: animation.interpolate({
          inputRange: [0, 1],
          outputRange: [0, 1],
        }),
      },
    ],
    opacity: animation,
  };

  const playButtonStyle = {
    transform: [
      {
        translateY: animation.interpolate({
          inputRange: [0, 1],
          outputRange: [0, -70],
        }),
      },
      {
        translateX: animation.interpolate({
          inputRange: [0, 1],
          outputRange: [0, 50],
        }),
      },
      {
        scale: animation.interpolate({
          inputRange: [0, 1],
          outputRange: [0, 1],
        }),
      },
    ],
    opacity: animation,
  };

  const plusRotation = {
    transform: [
      {
        rotate: animation.interpolate({
          inputRange: [0, 1],
          outputRange: ['0deg', '45deg'],
        }),
      },
    ],
  };

  return (
    <View style={styles.container}>
      {/* 弹出菜单 - 出去吃和出去玩 */}
      {isAddMenuOpen && (
        <View style={styles.menuOverlay}>
          <Animated.View style={[styles.menuButton, eatButtonStyle]}>
            <TouchableOpacity
              style={styles.menuButtonInner}
              onPress={() => handleAddOption('eat')}
            >
              <Ionicons name="restaurant-outline" size={24} color="#fff" />
              <Text style={styles.menuButtonText}>出去吃</Text>
            </TouchableOpacity>
          </Animated.View>

          <Animated.View style={[styles.menuButton, playButtonStyle]}>
            <TouchableOpacity
              style={styles.menuButtonInner}
              onPress={() => handleAddOption('play')}
            >
              <Ionicons name="game-controller-outline" size={24} color="#fff" />
              <Text style={styles.menuButtonText}>出去玩</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      )}

      {/* 底部导航栏 */}
      <View style={styles.tabBar}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const isFocused = state.index === index;

          // 中间的添加按钮特殊处理
          if (route.name === 'Add') {
            return (
              <TouchableOpacity
                key={route.key}
                style={styles.addButton}
                onPress={() => handleTabPress(route.name, isFocused)}
              >
                <Animated.View style={[styles.addButtonInner, plusRotation]}>
                  <Ionicons name="add" size={32} color="#fff" />
                </Animated.View>
              </TouchableOpacity>
            );
          }

          // 获取图标名称
          const getIconName = () => {
            if (route.name === 'Trip') {
              return isFocused ? 'calendar' : 'calendar-outline';
            }
            if (route.name === 'Radar') {
              return isFocused ? 'radio' : 'radio-outline';
            }
            return 'ellipse-outline';
          };

          return (
            <TouchableOpacity
              key={route.key}
              style={styles.tabButton}
              onPress={() => handleTabPress(route.name, isFocused)}
            >
              <Ionicons
                name={getIconName()}
                size={24}
                color={isFocused ? '#007AFF' : '#999'}
              />
              <Text
                style={[
                  styles.tabLabel,
                  { color: isFocused ? '#007AFF' : '#999' },
                ]}
              >
                {route.name === 'Trip' ? '行程' : '雷达'}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* 遮罩层 */}
      {isAddMenuOpen && (
        <TouchableOpacity
          style={styles.backdrop}
          activeOpacity={1}
          onPress={closeAddMenu}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#f8f8f8',
    height: 60,
    paddingBottom: 5,
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },
  tabLabel: {
    fontSize: 11,
    marginTop: 4,
  },
  addButton: {
    width: 60,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonInner: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#007AFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#007AFF',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  menuOverlay: {
    position: 'absolute',
    bottom: 60,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 10,
  },
  menuButton: {
    position: 'absolute',
    bottom: 10,
  },
  menuButtonInner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#007AFF',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  menuButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
  backdrop: {
    position: 'absolute',
    top: -1000,
    left: 0,
    right: 0,
    bottom: 60,
    zIndex: 5,
  },
});
