import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { DrawerContentComponentProps } from '@react-navigation/drawer';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useMenuStore } from '../stores';

const { width } = Dimensions.get('window');
const DRAWER_WIDTH = width * 0.8;

interface MenuItemProps {
  icon: string;
  title: string;
  onPress?: () => void;
  showArrow?: boolean;
}

/**
 * 菜单项组件
 */
const MenuItem: React.FC<MenuItemProps> = ({
  icon,
  title,
  onPress,
  showArrow = false,
}) => (
  <TouchableOpacity style={styles.menuItem} onPress={onPress}>
    <View style={styles.menuItemLeft}>
      <Ionicons name={icon as any} size={22} color="#333" />
      <Text style={styles.menuItemText}>{title}</Text>
    </View>
    {showArrow && (
      <Ionicons name="chevron-forward" size={20} color="#999" />
    )}
  </TouchableOpacity>
);

/**
 * 主菜单视图 - 显示口味、偏好等选项
 */
const MainMenuView: React.FC<{
  onNavigateToProfile: () => void;
}> = ({ onNavigateToProfile }) => {
  const menuItems = [
    { icon: 'restaurant-outline', title: '口味' },
    { icon: 'heart-outline', title: '偏好' },
    { icon: 'footsteps-outline', title: '足迹' },
    { icon: 'card-outline', title: '美食卡' },
    { icon: 'trash-outline', title: '想法回收站' },
  ];

  return (
    <>
      {menuItems.map((item, index) => (
        <MenuItem
          key={index}
          icon={item.icon}
          title={item.title}
          onPress={() => console.log(`点击了: ${item.title}`)}
        />
      ))}
      <MenuItem
        icon="person-outline"
        title="我的信息"
        onPress={onNavigateToProfile}
        showArrow
      />
    </>
  );
};

/**
 * 个人信息视图 - 显示账号与安全、编辑资料等选项
 */
const ProfileMenuView: React.FC<{
  onBack: () => void;
}> = ({ onBack }) => {
  const profileItems = [
    { icon: 'shield-outline', title: '账号与安全' },
    { icon: 'create-outline', title: '编辑资料' },
    { icon: 'chatbubble-outline', title: '告诉我们' },
    { icon: 'information-circle-outline', title: '版本信息' },
    { icon: 'help-circle-outline', title: '关于' },
  ];

  return (
    <>
      <TouchableOpacity style={styles.backButton} onPress={onBack}>
        <Ionicons name="chevron-back" size={24} color="#333" />
        <Text style={styles.backButtonText}>返回</Text>
      </TouchableOpacity>
      <Text style={styles.sectionTitle}>我的信息</Text>
      {profileItems.map((item, index) => (
        <MenuItem
          key={index}
          icon={item.icon}
          title={item.title}
          onPress={() => console.log(`点击了: ${item.title}`)}
        />
      ))}
    </>
  );
};

/**
 * 搜索框组件
 */
const SearchBar: React.FC = () => (
  <TouchableOpacity style={styles.searchBar}>
    <Ionicons name="search-outline" size={20} color="#999" />
    <Text style={styles.searchPlaceholder}>搜索</Text>
  </TouchableOpacity>
);

/**
 * 抽屉菜单内容组件
 */
export const DrawerContent: React.FC<DrawerContentComponentProps> = () => {
  const insets = useSafeAreaInsets();
  const { drawerView, setDrawerView } = useMenuStore();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* 搜索框 */}
      <View style={styles.searchContainer}>
        <SearchBar />
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {drawerView === 'main' ? (
          <MainMenuView
            onNavigateToProfile={() => setDrawerView('profile')}
          />
        ) : (
          <ProfileMenuView onBack={() => setDrawerView('main')} />
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    width: DRAWER_WIDTH,
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchPlaceholder: {
    marginLeft: 12,
    fontSize: 16,
    color: '#999',
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#f0f0f0',
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuItemText: {
    marginLeft: 16,
    fontSize: 16,
    color: '#333',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    marginBottom: 8,
  },
  backButtonText: {
    marginLeft: 4,
    fontSize: 16,
    color: '#333',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
});
