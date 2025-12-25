import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  FlatList,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { DrawerActions, useNavigation } from '@react-navigation/native';
import { RadarMode, RadarFilterType } from '../types';

const { width } = Dimensions.get('window');

/**
 * 下拉选择器组件
 */
interface DropdownProps {
  value: RadarMode;
  onChange: (value: RadarMode) => void;
}

const ModeDropdown: React.FC<DropdownProps> = ({ value, onChange }) => {
  const [visible, setVisible] = useState(false);

  const options: { value: RadarMode; label: string }[] = [
    { value: 'route', label: '沿途搜' },
    { value: 'topic', label: '专题' },
  ];

  const currentLabel = options.find((opt) => opt.value === value)?.label || '沿途搜';

  return (
    <View>
      <TouchableOpacity
        style={styles.dropdown}
        onPress={() => setVisible(true)}
      >
        <Text style={styles.dropdownText}>{currentLabel}</Text>
        <Ionicons name="chevron-down" size={16} color="#333" />
      </TouchableOpacity>

      <Modal
        visible={visible}
        transparent
        animationType="fade"
        onRequestClose={() => setVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setVisible(false)}
        >
          <View style={styles.dropdownMenu}>
            {options.map((option) => (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.dropdownItem,
                  value === option.value && styles.dropdownItemActive,
                ]}
                onPress={() => {
                  onChange(option.value);
                  setVisible(false);
                }}
              >
                <Text
                  style={[
                    styles.dropdownItemText,
                    value === option.value && styles.dropdownItemTextActive,
                  ]}
                >
                  {option.label}
                </Text>
                {value === option.value && (
                  <Ionicons name="checkmark" size={18} color="#007AFF" />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

/**
 * 地点选择器组件
 */
const LocationSelector: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState('当前位置');

  const locations = ['当前位置', '北京', '上海', '杭州', '深圳', '广州'];

  return (
    <View>
      <TouchableOpacity
        style={styles.locationButton}
        onPress={() => setVisible(true)}
      >
        <Ionicons name="location-outline" size={18} color="#007AFF" />
        <Text style={styles.locationText}>{selectedLocation}</Text>
        <Ionicons name="chevron-down" size={14} color="#007AFF" />
      </TouchableOpacity>

      <Modal
        visible={visible}
        transparent
        animationType="slide"
        onRequestClose={() => setVisible(false)}
      >
        <View style={styles.locationModalContainer}>
          <TouchableOpacity
            style={styles.locationModalOverlay}
            onPress={() => setVisible(false)}
          />
          <View style={styles.locationModal}>
            <View style={styles.locationModalHeader}>
              <Text style={styles.locationModalTitle}>选择地点</Text>
              <TouchableOpacity onPress={() => setVisible(false)}>
                <Ionicons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>
            <FlatList
              data={locations}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.locationItem,
                    selectedLocation === item && styles.locationItemActive,
                  ]}
                  onPress={() => {
                    setSelectedLocation(item);
                    setVisible(false);
                  }}
                >
                  <Text
                    style={[
                      styles.locationItemText,
                      selectedLocation === item && styles.locationItemTextActive,
                    ]}
                  >
                    {item}
                  </Text>
                  {selectedLocation === item && (
                    <Ionicons name="checkmark" size={20} color="#007AFF" />
                  )}
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

/**
 * 筛选按钮组件
 */
interface FilterButtonsProps {
  selected: RadarFilterType | null;
  onSelect: (type: RadarFilterType) => void;
}

const FilterButtons: React.FC<FilterButtonsProps> = ({ selected, onSelect }) => {
  const filters: { type: RadarFilterType; label: string; icon: string }[] = [
    { type: 'eat', label: '吃的', icon: 'restaurant-outline' },
    { type: 'play', label: '玩的', icon: 'game-controller-outline' },
  ];

  return (
    <View style={styles.filterContainer}>
      {filters.map((filter) => (
        <TouchableOpacity
          key={filter.type}
          style={[
            styles.filterButton,
            selected === filter.type && styles.filterButtonActive,
          ]}
          onPress={() => onSelect(filter.type)}
        >
          <Ionicons
            name={filter.icon as any}
            size={20}
            color={selected === filter.type ? '#fff' : '#007AFF'}
          />
          <Text
            style={[
              styles.filterButtonText,
              selected === filter.type && styles.filterButtonTextActive,
            ]}
          >
            {filter.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

/**
 * 沿途搜视图
 */
const RouteSearchView: React.FC = () => {
  const [selectedFilter, setSelectedFilter] = useState<RadarFilterType | null>(null);

  return (
    <View style={styles.searchViewContainer}>
      <FilterButtons selected={selectedFilter} onSelect={setSelectedFilter} />
      
      <View style={styles.resultContainer}>
        {selectedFilter ? (
          <View style={styles.resultPlaceholder}>
            <Ionicons
              name={selectedFilter === 'eat' ? 'restaurant' : 'game-controller'}
              size={48}
              color="#ccc"
            />
            <Text style={styles.resultPlaceholderText}>
              正在搜索附近的{selectedFilter === 'eat' ? '美食' : '娱乐'}...
            </Text>
          </View>
        ) : (
          <View style={styles.resultPlaceholder}>
            <Ionicons name="search" size={48} color="#ccc" />
            <Text style={styles.resultPlaceholderText}>
              选择想要搜索的类型
            </Text>
          </View>
        )}
      </View>
    </View>
  );
};

/**
 * 专题视图
 */
const TopicView: React.FC = () => {
  const topics = [
    { id: '1', title: '网红打卡地', icon: 'flame-outline' },
    { id: '2', title: '本地美食', icon: 'restaurant-outline' },
    { id: '3', title: '亲子活动', icon: 'people-outline' },
    { id: '4', title: '户外探险', icon: 'compass-outline' },
  ];

  return (
    <View style={styles.topicContainer}>
      <Text style={styles.topicTitle}>热门专题</Text>
      <View style={styles.topicGrid}>
        {topics.map((topic) => (
          <TouchableOpacity key={topic.id} style={styles.topicItem}>
            <View style={styles.topicIconContainer}>
              <Ionicons name={topic.icon as any} size={28} color="#007AFF" />
            </View>
            <Text style={styles.topicItemText}>{topic.title}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

/**
 * 雷达页面组件
 */
export const RadarScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const [mode, setMode] = useState<RadarMode>('route');

  const handleOpenDrawer = () => {
    navigation.dispatch(DrawerActions.openDrawer());
  };

  return (
    <View style={styles.container}>
      {/* 顶部导航栏 */}
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <TouchableOpacity
          style={styles.menuButton}
          onPress={handleOpenDrawer}
        >
          <Ionicons name="menu" size={28} color="#333" />
        </TouchableOpacity>

        <View style={styles.headerCenter}>
          <ModeDropdown value={mode} onChange={setMode} />
        </View>

        <LocationSelector />
      </View>

      {/* 内容区域 */}
      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {mode === 'route' ? <RouteSearchView /> : <TopicView />}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 12,
    backgroundColor: '#fff',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#e0e0e0',
  },
  menuButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  content: {
    flex: 1,
  },
  // 下拉选择器样式
  dropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#f5f5f5',
    borderRadius: 20,
  },
  dropdownText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginRight: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dropdownMenu: {
    backgroundColor: '#fff',
    borderRadius: 12,
    width: width * 0.6,
    paddingVertical: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  dropdownItemActive: {
    backgroundColor: '#f5f8ff',
  },
  dropdownItemText: {
    fontSize: 16,
    color: '#333',
  },
  dropdownItemTextActive: {
    color: '#007AFF',
    fontWeight: '600',
  },
  // 地点选择器样式
  locationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  locationText: {
    fontSize: 14,
    color: '#007AFF',
    marginHorizontal: 4,
  },
  locationModalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  locationModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  locationModal: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '50%',
  },
  locationModalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#e0e0e0',
  },
  locationModalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  locationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#f0f0f0',
  },
  locationItemActive: {
    backgroundColor: '#f5f8ff',
  },
  locationItemText: {
    fontSize: 16,
    color: '#333',
  },
  locationItemTextActive: {
    color: '#007AFF',
    fontWeight: '600',
  },
  // 筛选按钮样式
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 20,
    gap: 16,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#007AFF',
  },
  filterButtonActive: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  filterButtonText: {
    marginLeft: 8,
    fontSize: 15,
    color: '#007AFF',
    fontWeight: '600',
  },
  filterButtonTextActive: {
    color: '#fff',
  },
  // 搜索视图样式
  searchViewContainer: {
    flex: 1,
  },
  resultContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  resultPlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 60,
  },
  resultPlaceholderText: {
    marginTop: 16,
    fontSize: 16,
    color: '#999',
  },
  // 专题视图样式
  topicContainer: {
    padding: 20,
  },
  topicTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  topicGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  topicItem: {
    width: (width - 56) / 2,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  topicIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#f5f8ff',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  topicItemText: {
    fontSize: 15,
    color: '#333',
    fontWeight: '500',
  },
});
