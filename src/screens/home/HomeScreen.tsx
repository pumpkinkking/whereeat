import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
import { Card } from '../../components/Card';
import { Input } from '../../components/Input';
import { useFoodStore } from '../../stores/foodStore';
import { Ionicons } from '@expo/vector-icons';

// 定义导航属性类型
 type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'MainTabs'>;

/**
 * 首页（美食推荐）页面组件
 * 展示推荐美食、附近美食和搜索功能
 */
export const HomeScreen: React.FC = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const { recommendedFoods, nearbyFoods, addSearchHistory } = useFoodStore();
  
  // 搜索状态
  const [searchKeyword, setSearchKeyword] = useState('');
  
  // 分类筛选状态
  const [activeCategory, setActiveCategory] = useState('全部');
  
  // 分类列表
  const categories = ['全部', '中餐', '西餐', '日料', '快餐', '甜品', '咖啡', '其他'];
  
  /**
   * 处理搜索
   */
  const handleSearch = () => {
    if (searchKeyword.trim()) {
      // 添加搜索历史
      addSearchHistory(searchKeyword);
      // 导航到搜索结果页面
      navigation.navigate('FoodSearch');
    }
  };
  
  /**
   * 处理查看美食详情
   * @param foodId 美食ID
   */
  const handleViewFoodDetail = (foodId: string) => {
    navigation.navigate('FoodDetail', { foodId });
  };
  
  /**
   * 处理分类筛选
   * @param category 分类名称
   */
  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
  };
  
  /**
   * 渲染美食项
   * @param item 美食数据
   */
  const renderFoodItem = ({ item }: { item: any }) => (
    <Card 
      style={styles.foodCard}
      onPress={() => handleViewFoodDetail(item.id)}
      shadowSize="small"
    >
      <Image 
        source={{ uri: item.images?.[0] || 'https://via.placeholder.com/200' }} 
        style={styles.foodImage}
      />
      <View style={styles.foodInfo}>
        <View style={styles.foodHeader}>
          <Text style={styles.foodName}>{item.name}</Text>
          <View style={styles.ratingContainer}>
            <Ionicons name="star" size={14} color="#ffc107" />
            <Text style={styles.rating}>{item.rating}</Text>
          </View>
        </View>
        
        <View style={styles.foodMeta}>
          <Text style={styles.categories}>
            {item.categories.join(' · ')}
          </Text>
          <Text style={styles.price}>¥{item.averagePrice}/人</Text>
        </View>
        
        <View style={styles.foodFooter}>
          <View style={styles.locationContainer}>
            <Ionicons name="location-outline" size={12} color="#666666" />
            <Text style={styles.location} numberOfLines={1}>
              {item.distance ? `${(item.distance / 1000).toFixed(1)}km` : item.address}
            </Text>
          </View>
          {item.isOpen && (
            <View style={styles.openBadge}>
              <Text style={styles.openText}>营业中</Text>
            </View>
          )}
        </View>
        
        {item.recommendationReason && (
          <Text style={styles.recommendationReason} numberOfLines={2}>
            推荐理由：{item.recommendationReason}
          </Text>
        )}
      </View>
    </Card>
  );
  
  /**
   * 渲染分类标签
   */
  const renderCategoryItem = (category: string) => (
    <TouchableOpacity
      key={category}
      style={[
        styles.categoryItem,
        activeCategory === category && styles.activeCategoryItem
      ]}
      onPress={() => handleCategoryChange(category)}
    >
      <Text 
        style={[
          styles.categoryText,
          activeCategory === category && styles.activeCategoryText
        ]}
      >
        {category}
      </Text>
    </TouchableOpacity>
  );
  
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.userInfo}>
          <Text style={styles.greeting}>你好！</Text>
          <Text style={styles.subGreeting}>今天想吃点什么？</Text>
        </View>
        <TouchableOpacity style={styles.profileButton}>
          <Image 
            source={{ uri: 'https://via.placeholder.com/40' }} 
            style={styles.avatar}
          />
        </TouchableOpacity>
      </View>
      
      {/* 搜索栏 */}
      <View style={styles.searchContainer}>
        <Input
          placeholder="搜索美食、餐厅..."
          value={searchKeyword}
          onChangeText={setSearchKeyword}
          onSubmitEditing={handleSearch}
          containerStyle={styles.searchInputContainer}
          showClearButton
          onClear={() => setSearchKeyword('')}
          leftIcon={<Ionicons name="search" size={20} color="#999999" style={styles.searchIcon} />}
        />
      </View>
      
      {/* 分类筛选 */}
      <View style={styles.categoriesContainer}>
        <FlatList
          data={categories}
          renderItem={({ item }) => renderCategoryItem(item)}
          keyExtractor={(item) => item}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesList}
        />
      </View>
      
      <FlatList
        data={[
          { key: 'recommended', title: '为你推荐', data: recommendedFoods },
          { key: 'nearby', title: '附近美食', data: nearbyFoods },
        ]}
        renderItem={({ item }) => (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>{item.title}</Text>
              <TouchableOpacity style={styles.seeAllButton}>
                <Text style={styles.seeAllText}>查看全部</Text>
                <Ionicons name="chevron-forward" size={16} color="#1e90ff" />
              </TouchableOpacity>
            </View>
            
            <FlatList
              data={item.data}
              renderItem={renderFoodItem}
              keyExtractor={(food) => food.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.foodList}
              ListEmptyComponent={(
                <View style={styles.emptyList}>
                  <Text style={styles.emptyListText}>暂无推荐内容</Text>
                </View>
              )}
            />
          </View>
        )}
        keyExtractor={(item) => item.key}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.mainContent}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
  },
  userInfo: {
    flex: 1,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 4,
  },
  subGreeting: {
    fontSize: 14,
    color: '#666666',
  },
  profileButton: {
    marginLeft: 16,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  searchContainer: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  searchInputContainer: {
    marginBottom: 0,
  },
  searchIcon: {
    marginRight: 8,
  },
  categoriesContainer: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  categoriesList: {
    paddingVertical: 8,
  },
  categoryItem: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#ffffff',
    marginRight: 12,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  activeCategoryItem: {
    backgroundColor: '#1e90ff',
  },
  categoryText: {
    fontSize: 14,
    color: '#666666',
    fontWeight: '500',
  },
  activeCategoryText: {
    color: '#ffffff',
  },
  mainContent: {
    paddingBottom: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
  },
  seeAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  seeAllText: {
    fontSize: 14,
    color: '#1e90ff',
    marginRight: 4,
  },
  foodList: {
    paddingHorizontal: 20,
  },
  foodCard: {
    width: 280,
    marginRight: 16,
    padding: 0,
    overflow: 'hidden',
  },
  foodImage: {
    width: '100%',
    height: 160,
    resizeMode: 'cover',
  },
  foodInfo: {
    padding: 12,
  },
  foodHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  foodName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    flex: 1,
    marginRight: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    fontSize: 14,
    color: '#ffc107',
    marginLeft: 4,
    fontWeight: '600',
  },
  foodMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  categories: {
    fontSize: 12,
    color: '#666666',
    flex: 1,
  },
  price: {
    fontSize: 14,
    color: '#ff4444',
    fontWeight: '600',
    marginLeft: 8,
  },
  foodFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  location: {
    fontSize: 12,
    color: '#666666',
    marginLeft: 4,
    flex: 1,
  },
  openBadge: {
    backgroundColor: '#52c41a',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    marginLeft: 8,
  },
  openText: {
    fontSize: 10,
    color: '#ffffff',
    fontWeight: '600',
  },
  recommendationReason: {
    fontSize: 12,
    color: '#999999',
    lineHeight: 16,
  },
  emptyList: {
    width: 280,
    height: 160,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
  },
  emptyListText: {
    fontSize: 14,
    color: '#999999',
  },
});
