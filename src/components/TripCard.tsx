import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { Trip } from '../types';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width - 40;

interface TripCardProps {
  trip: Trip;
  onPress?: () => void;
}

/**
 * 计算距离出发还有几天
 */
const getDaysUntilStart = (startDate: Date): number => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const start = new Date(startDate);
  start.setHours(0, 0, 0, 0);
  const diffTime = start.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

/**
 * 格式化日期显示
 */
const formatDateRange = (startDate: Date, endDate: Date): string => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const startMonth = start.getMonth() + 1;
  const startDay = start.getDate();
  const endMonth = end.getMonth() + 1;
  const endDay = end.getDate();
  
  if (startMonth === endMonth) {
    return `${startMonth}月${startDay}日 - ${endDay}日`;
  }
  return `${startMonth}月${startDay}日 - ${endMonth}月${endDay}日`;
};

/**
 * 行程卡片组件
 */
export const TripCard: React.FC<TripCardProps> = ({ trip, onPress }) => {
  const daysUntil = getDaysUntilStart(trip.startDate);
  
  const getDaysText = () => {
    if (daysUntil === 0) return '今天出发';
    if (daysUntil === 1) return '明天出发';
    if (daysUntil < 0) return '已结束';
    return `${daysUntil}天后出发`;
  };

  return (
    <TouchableOpacity 
      style={styles.container} 
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.contentWrapper}>
        {/* 左侧文字内容 */}
        <View style={styles.textContent}>
          <Text style={styles.daysText}>{getDaysText()}</Text>
          <Text style={styles.tripName} numberOfLines={2}>
            {trip.name}
          </Text>
          <Text style={styles.dateRange}>
            {formatDateRange(trip.startDate, trip.endDate)}
          </Text>
        </View>
        
        {/* 右下角图片 */}
        <View style={styles.imageContainer}>
          {trip.imageUrl ? (
            <Image
              source={{ uri: trip.imageUrl }}
              style={styles.image}
              resizeMode="cover"
            />
          ) : (
            <View style={styles.imagePlaceholder}>
              <Text style={styles.placeholderText}>🏞️</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: CARD_WIDTH,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 20,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  contentWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    minHeight: 120,
  },
  textContent: {
    flex: 1,
    paddingRight: 16,
  },
  daysText: {
    fontSize: 12,
    color: '#999',
    marginBottom: 8,
  },
  tripName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  dateRange: {
    fontSize: 14,
    color: '#666',
  },
  imageContainer: {
    width: 80,
    height: 80,
    borderRadius: 12,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imagePlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 32,
  },
});
