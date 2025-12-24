import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import { usePlanStore } from '../../stores/planStore';
import { Ionicons } from '@expo/vector-icons';

// 定义导航属性类型
 type PlansScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'MainTabs'>;

/**
 * 旅行计划列表页面组件
 * 显示用户的所有旅行计划，支持创建新计划和查看计划详情
 */
export const PlansScreen: React.FC = () => {
  const navigation = useNavigation<PlansScreenNavigationProp>();
  const { plans, currentPlan, setCurrentPlan, deletePlan } = usePlanStore();
  
  /**
   * 处理创建新计划
   */
  const handleCreatePlan = () => {
    // 导航到创建计划页面
    navigation.navigate('CreatePlan');
  };
  
  /**
   * 处理查看计划详情
   * @param planId 计划ID
   */
  const handleViewPlanDetail = (planId: string) => {
    navigation.navigate('PlanDetail', { planId });
  };
  
  /**
   * 处理设置当前计划
   * @param planId 计划ID
   */
  const handleSetCurrentPlan = (planId: string) => {
    setCurrentPlan(planId);
  };
  
  /**
   * 处理删除计划
   * @param planId 计划ID
   */
  const handleDeletePlan = (planId: string) => {
    deletePlan(planId);
  };
  
  /**
   * 渲染计划项
   * @param item 计划数据
   */
  const renderPlanItem = ({ item }: { item: any }) => (
    <Card 
      style={styles.planCard}
      onPress={() => handleViewPlanDetail(item.id)}
      shadowSize="medium"
    >
      <View style={styles.planHeader}>
        <View style={styles.planInfo}>
          <Text style={styles.planName}>{item.name}</Text>
          <Text style={styles.planDestination}>{item.destination}</Text>
        </View>
        {item.isCurrent && (
          <View style={styles.currentPlanBadge}>
            <Text style={styles.currentPlanText}>当前</Text>
          </View>
        )}
      </View>
      
      <View style={styles.planDateContainer}>
        <Ionicons name="calendar-outline" size={16} color="#666666" />
        <Text style={styles.planDate}>
          {item.startDate} 至 {item.endDate}
        </Text>
      </View>
      
      <View style={styles.planFooter}>
        <View style={styles.planStats}>
          <Text style={styles.planStatItem}>
            <Ionicons name="people-outline" size={14} color="#666666" />
            <Text style={styles.planStatText}> {item.peopleCount}人</Text>
          </Text>
          <Text style={styles.planStatItem}>
            <Ionicons name="time-outline" size={14} color="#666666" />
            <Text style={styles.planStatText}> {item.activities.length}个活动</Text>
          </Text>
          {item.theme && (
            <Text style={styles.planStatItem}>
              <Ionicons name="sparkles-outline" size={14} color="#666666" />
              <Text style={styles.planStatText}> {item.theme}</Text>
            </Text>
          )}
        </View>
        
        <View style={styles.planActions}>
          {!item.isCurrent && (
            <TouchableOpacity 
              style={styles.actionButton} 
              onPress={() => handleSetCurrentPlan(item.id)}
            >
              <Ionicons name="flag-outline" size={18} color="#1e90ff" />
            </TouchableOpacity>
          )}
          <TouchableOpacity 
            style={styles.actionButton} 
            onPress={() => handleDeletePlan(item.id)}
          >
            <Ionicons name="trash-outline" size={18} color="#ff4444" />
          </TouchableOpacity>
        </View>
      </View>
    </Card>
  );
  
  /**
   * 渲染空状态
   */
  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Ionicons name="calendar-outline" size={64} color="#cccccc" />
      <Text style={styles.emptyStateText}>还没有创建旅行计划</Text>
      <Text style={styles.emptyStateSubText}>创建一个计划，开始您的美食之旅</Text>
      <Button 
        title="创建第一个计划" 
        onPress={handleCreatePlan}
        style={styles.createFirstPlanButton}
      />
    </View>
  );
  
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>我的旅行计划</Text>
        <Button 
          title="创建计划" 
          onPress={handleCreatePlan}
          size="small"
          type="primary"
        />
      </View>
      
      <FlatList
        data={plans}
        renderItem={renderPlanItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={renderEmptyState}
        showsVerticalScrollIndicator={false}
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
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    backgroundColor: '#ffffff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
  },
  listContent: {
    padding: 20,
    paddingBottom: 40,
  },
  planCard: {
    marginBottom: 16,
    padding: 16,
  },
  planHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  planInfo: {
    flex: 1,
  },
  planName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 4,
  },
  planDestination: {
    fontSize: 14,
    color: '#666666',
  },
  currentPlanBadge: {
    backgroundColor: '#1e90ff',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  currentPlanText: {
    fontSize: 12,
    color: '#ffffff',
    fontWeight: '600',
  },
  planDateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  planDate: {
    fontSize: 14,
    color: '#666666',
    marginLeft: 8,
  },
  planFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  planStats: {
    flexDirection: 'row',
    flex: 1,
  },
  planStatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  planStatText: {
    fontSize: 12,
    color: '#666666',
    marginLeft: 4,
  },
  planActions: {
    flexDirection: 'row',
  },
  actionButton: {
    marginLeft: 16,
    padding: 8,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateSubText: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 24,
  },
  createFirstPlanButton: {
    width: 200,
  },
});
