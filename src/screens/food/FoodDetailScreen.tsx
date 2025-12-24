import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp, NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import { useFoodStore } from '../../stores/foodStore';
import { Ionicons } from '@expo/vector-icons';

// 定义导航属性类型
type FoodDetailScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'FoodDetail'>;

/**
 * 美食详情页面组件
 * 展示美食商家的详细信息，包括评分、地址、营业时间、推荐理由等
 */
export const FoodDetailScreen: React.FC = () => {
  const navigation = useNavigation<FoodDetailScreenNavigationProp>();
  // 使用any类型避免TypeScript错误，实际开发中应使用正确的类型
  const route = useRoute<any>();
  const { foodId } = route.params;
  const { favoriteFoods, addToFavorites, removeFromFavorites, isFavorite } = useFoodStore();
  
  // 模拟美食详情数据
  const foodDetail = {
    id: foodId,
    name: '老北京炸酱面',
    rating: 4.8,
    address: '北京市朝阳区建国路88号',
    phone: '010-12345678',
    images: [
      'https://via.placeholder.com/400x300',
      'https://via.placeholder.com/400x300',
      'https://via.placeholder.com/400x300',
    ],
    categories: ['中餐', '北京菜', '面食'],
    averagePrice: 68,
    distance: 1500,
    openingHours: ['周一至周日 10:00-22:00'],
    isOpen: true,
    recommendationReason: '正宗老北京风味，炸酱香味浓郁，面条筋道，配菜丰富，性价比高。',
    coordinates: {
      latitude: 39.9042,
      longitude: 116.4074,
    },
    description: '老北京炸酱面是一道传统的北京美食，以面条为主料，配以炸酱和各种蔬菜丁，口感丰富，味道独特。我们的炸酱面采用传统工艺制作，选用优质食材，保证每一碗都正宗美味。',
    popularDishes: [
      { id: '1', name: '招牌炸酱面', price: 38 },
      { id: '2', name: '红烧肉', price: 58 },
      { id: '3', name: '拍黄瓜', price: 18 },
      { id: '4', name: '豆汁儿', price: 8 },
    ],
  };
  
  // 是否收藏
  const [isFavorited, setIsFavorited] = useState(isFavorite(foodId));
  
  /**
   * 处理收藏/取消收藏
   */
  const handleToggleFavorite = () => {
    if (isFavorited) {
      removeFromFavorites(foodId);
      setIsFavorited(false);
    } else {
      addToFavorites(foodId);
      setIsFavorited(true);
    }
  };
  
  /**
   * 处理拨打电话
   */
  const handleCall = () => {
    // 这里可以集成电话拨打功能
    console.log('拨打电话:', foodDetail.phone);
  };
  
  /**
   * 处理查看地图
   */
  const handleViewMap = () => {
    navigation.navigate('MapView');
  };
  
  /**
   * 渲染轮播图项
   */
  const renderCarouselItem = ({ item }: { item: string }) => (
    <Image 
      source={{ uri: item }} 
      style={styles.carouselImage}
      resizeMode="cover"
    />
  );
  
  /**
   * 渲染热门菜品项
   */
  const renderPopularDishItem = ({ item }: { item: any }) => (
    <View style={styles.dishItem}>
      <Text style={styles.dishName}>{item.name}</Text>
      <Text style={styles.dishPrice}>¥{item.price}</Text>
    </View>
  );
  
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* 轮播图 */}
        <FlatList
          data={foodDetail.images}
          renderItem={renderCarouselItem}
          keyExtractor={(item, index) => index.toString()}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          style={styles.carousel}
        />
        
        {/* 头部信息 */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.name}>{foodDetail.name}</Text>
            <View style={styles.ratingContainer}>
              <Ionicons name="star" size={16} color="#ffc107" />
              <Text style={styles.rating}>{foodDetail.rating}</Text>
              <Text style={styles.ratingCount}>(128条评价)</Text>
            </View>
          </View>
          <TouchableOpacity 
            style={styles.favoriteButton} 
            onPress={handleToggleFavorite}
          >
            <Ionicons 
              name={isFavorited ? 'heart' : 'heart-outline'} 
              size={24} 
              color={isFavorited ? '#ff4444' : '#666666'} 
            />
          </TouchableOpacity>
        </View>
        
        {/* 分类标签 */}
        <View style={styles.categoriesContainer}>
          {foodDetail.categories.map((category, index) => (
            <View key={index} style={styles.categoryTag}>
              <Text style={styles.categoryText}>{category}</Text>
            </View>
          ))}
        </View>
        
        {/* 推荐理由 */}
        <Card style={styles.recommendationCard}>
          <Text style={styles.sectionTitle}>推荐理由</Text>
          <Text style={styles.recommendationText}>{foodDetail.recommendationReason}</Text>
        </Card>
        
        {/* 商家信息 */}
        <Card style={styles.infoCard}>
          <Text style={styles.sectionTitle}>商家信息</Text>
          
          <View style={styles.infoItem}>
            <Ionicons name="location-outline" size={20} color="#666666" />
            <Text style={styles.infoText}>{foodDetail.address}</Text>
            <TouchableOpacity 
              style={styles.infoAction} 
              onPress={handleViewMap}
            >
              <Ionicons name="map-outline" size={18} color="#1e90ff" />
              <Text style={styles.infoActionText}>查看地图</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.infoItem}>
            <Ionicons name="call-outline" size={20} color="#666666" />
            <Text style={styles.infoText}>{foodDetail.phone}</Text>
            <TouchableOpacity 
              style={styles.infoAction} 
              onPress={handleCall}
            >
              <Ionicons name="call" size={18} color="#1e90ff" />
              <Text style={styles.infoActionText}>拨打电话</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.infoItem}>
            <Ionicons name="time-outline" size={20} color="#666666" />
            <View style={styles.infoTextContainer}>
              <Text style={styles.infoText}>{foodDetail.openingHours.join(' ')}</Text>
              {foodDetail.isOpen && (
                <View style={styles.openBadge}>
                  <Text style={styles.openText}>营业中</Text>
                </View>
              )}
            </View>
          </View>
          
          <View style={styles.infoItem}>
            <Ionicons name="cash-outline" size={20} color="#666666" />
            <Text style={styles.infoText}>人均消费: ¥{foodDetail.averagePrice}</Text>
          </View>
        </Card>
        
        {/* 商家描述 */}
        <Card style={styles.descriptionCard}>
          <Text style={styles.sectionTitle}>商家描述</Text>
          <Text style={styles.descriptionText}>{foodDetail.description}</Text>
        </Card>
        
        {/* 热门菜品 */}
        <Card style={styles.popularDishesCard}>
          <Text style={styles.sectionTitle}>热门菜品</Text>
          <FlatList
            data={foodDetail.popularDishes}
            renderItem={renderPopularDishItem}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
          />
        </Card>
      </ScrollView>
      
      {/* 底部操作栏 */}
      <View style={styles.bottomBar}>
        <View style={styles.bottomLeft}>
          <Text style={styles.priceLabel}>人均</Text>
          <Text style={styles.price}>¥{foodDetail.averagePrice}</Text>
        </View>
        <View style={styles.bottomRight}>
          <Button 
            title="查看地图" 
            onPress={handleViewMap}
            type="outline"
            style={styles.mapButton}
            size="medium"
          />
          <Button 
            title="立即预订" 
            onPress={() => {}}
            type="primary"
            style={styles.bookButton}
            size="medium"
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  carousel: {
    height: 240,
  },
  carouselImage: {
    width: 400,
    height: 240,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerLeft: {
    flex: 1,
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    fontSize: 16,
    color: '#ffc107',
    marginLeft: 4,
    fontWeight: '600',
  },
  ratingCount: {
    fontSize: 14,
    color: '#999999',
    marginLeft: 8,
  },
  favoriteButton: {
    padding: 8,
  },
  categoriesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  categoryTag: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  categoryText: {
    fontSize: 14,
    color: '#666666',
  },
  recommendationCard: {
    margin: 16,
  },
  infoCard: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
  descriptionCard: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
  popularDishesCard: {
    marginHorizontal: 16,
    marginBottom: 80,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 12,
  },
  recommendationText: {
    fontSize: 14,
    color: '#666666',
    lineHeight: 20,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoTextContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  infoText: {
    fontSize: 14,
    color: '#666666',
    marginLeft: 12,
    flex: 1,
  },
  infoAction: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoActionText: {
    fontSize: 14,
    color: '#1e90ff',
    marginLeft: 4,
  },
  openBadge: {
    backgroundColor: '#52c41a',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  openText: {
    fontSize: 12,
    color: '#ffffff',
    fontWeight: '600',
  },
  descriptionText: {
    fontSize: 14,
    color: '#666666',
    lineHeight: 20,
  },
  dishItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  dishName: {
    fontSize: 14,
    color: '#333333',
  },
  dishPrice: {
    fontSize: 16,
    color: '#ff4444',
    fontWeight: '600',
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  bottomLeft: {
    flexDirection: 'column',
  },
  priceLabel: {
    fontSize: 12,
    color: '#999999',
  },
  price: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ff4444',
  },
  bottomRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  mapButton: {
    marginRight: 12,
    width: 100,
  },
  bookButton: {
    width: 120,
  },
});
