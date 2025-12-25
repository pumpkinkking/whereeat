import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { DrawerActions, useNavigation } from '@react-navigation/native';
import { useTripStore } from '../stores';
import { TripCard } from '../components';
import { Trip } from '../types';

/**
 * 顶部Header组件
 */
const Header: React.FC = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();

  const handleOpenDrawer = () => {
    navigation.dispatch(DrawerActions.openDrawer());
  };

  return (
    <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
      <TouchableOpacity
        style={styles.menuButton}
        onPress={handleOpenDrawer}
      >
        <Ionicons name="menu" size={28} color="#333" />
      </TouchableOpacity>
      <View style={styles.headerCenter}>
        <Text style={styles.headerTitle}>行程</Text>
      </View>
      <View style={styles.headerRight} />
    </View>
  );
};

/**
 * 当天行程详情视图
 */
const TodayTripView: React.FC<{ trip: Trip }> = ({ trip }) => {
  const formatDate = (date: Date) => {
    const d = new Date(date);
    return `${d.getMonth() + 1}月${d.getDate()}日`;
  };

  return (
    <View style={styles.todayTripContainer}>
      <View style={styles.todayTripHeader}>
        <Text style={styles.todayTripLabel}>进行中的行程</Text>
      </View>
      <View style={styles.todayTripCard}>
        <Text style={styles.todayTripName}>{trip.name}</Text>
        <Text style={styles.todayTripDate}>
          {formatDate(trip.startDate)} - {formatDate(trip.endDate)}
        </Text>
        <View style={styles.todayTripDetails}>
          <View style={styles.detailItem}>
            <Ionicons name="location-outline" size={20} color="#007AFF" />
            <Text style={styles.detailText}>查看行程地点</Text>
          </View>
          <View style={styles.detailItem}>
            <Ionicons name="time-outline" size={20} color="#007AFF" />
            <Text style={styles.detailText}>查看日程安排</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

/**
 * 未来行程列表视图
 */
const FutureTripsView: React.FC<{ trips: Trip[] }> = ({ trips }) => {
  if (trips.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Ionicons name="calendar-outline" size={64} color="#ccc" />
        <Text style={styles.emptyText}>暂无未来行程</Text>
        <Text style={styles.emptySubText}>
          点击下方 + 按钮添加新的行程
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.futureTripsContainer}>
      <Text style={styles.sectionTitle}>即将到来</Text>
      <FlatList
        data={trips}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TripCard
            trip={item}
            onPress={() => console.log(`点击了行程: ${item.name}`)}
          />
        )}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.tripList}
      />
    </View>
  );
};

/**
 * 行程页面组件
 * 默认首页，根据日期判断显示当日行程或未来行程
 */
export const TripScreen: React.FC = () => {
  const { getTodayTrip, getFutureTrips } = useTripStore();
  
  const todayTrip = getTodayTrip();
  const futureTrips = getFutureTrips();

  return (
    <View style={styles.container}>
      <Header />
      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {todayTrip ? (
          <TodayTripView trip={todayTrip} />
        ) : (
          <FutureTripsView trips={futureTrips} />
        )}
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
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  headerRight: {
    width: 44,
  },
  content: {
    flex: 1,
  },
  // 当天行程样式
  todayTripContainer: {
    padding: 20,
  },
  todayTripHeader: {
    marginBottom: 16,
  },
  todayTripLabel: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '600',
  },
  todayTripCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  todayTripName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  todayTripDate: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
  },
  todayTripDetails: {
    gap: 12,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#f5f8ff',
    borderRadius: 12,
  },
  detailText: {
    marginLeft: 12,
    fontSize: 15,
    color: '#007AFF',
  },
  // 未来行程样式
  futureTripsContainer: {
    flex: 1,
    paddingTop: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
    marginLeft: 20,
    marginBottom: 8,
  },
  tripList: {
    paddingBottom: 20,
  },
  // 空状态样式
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 100,
  },
  emptyText: {
    fontSize: 18,
    color: '#999',
    marginTop: 16,
  },
  emptySubText: {
    fontSize: 14,
    color: '#bbb',
    marginTop: 8,
  },
});
