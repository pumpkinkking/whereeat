import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import { usePlanStore } from '../../stores/planStore';

// 定义导航属性类型
type CreatePlanScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'CreatePlan'>;

/**
 * 创建旅行计划页面组件
 * 处理用户创建新旅行计划的逻辑，包括表单验证和提交
 */
export const CreatePlanScreen: React.FC = () => {
  const navigation = useNavigation<CreatePlanScreenNavigationProp>();
  const { createPlan } = usePlanStore();
  
  // 表单状态
  const [formData, setFormData] = useState({
    name: '',
    destination: '',
    startDate: '',
    endDate: '',
    peopleCount: '1',
    theme: '',
  });
  
  // 错误状态
  const [errors, setErrors] = useState({
    name: '',
    destination: '',
    startDate: '',
    endDate: '',
    peopleCount: '',
  });
  
  // 加载状态
  const [loading, setLoading] = useState(false);
  
  /**
   * 处理表单输入变化
   * @param field 字段名
   * @param value 字段值
   */
  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
    
    // 清除对应字段的错误
    if (errors[field as keyof typeof errors]) {
      setErrors(prev => ({
        ...prev,
        [field as keyof typeof errors]: '',
      }));
    }
  };
  
  /**
   * 验证表单
   * @returns 是否验证通过
   */
  const validateForm = (): boolean => {
    const newErrors = {
      name: '',
      destination: '',
      startDate: '',
      endDate: '',
      peopleCount: '',
    };
    
    // 验证计划名称
    if (!formData.name.trim()) {
      newErrors.name = '请输入计划名称';
    }
    
    // 验证目的地
    if (!formData.destination.trim()) {
      newErrors.destination = '请输入目的地';
    }
    
    // 验证出发日期
    if (!formData.startDate.trim()) {
      newErrors.startDate = '请输入出发日期';
    }
    
    // 验证结束日期
    if (!formData.endDate.trim()) {
      newErrors.endDate = '请输入结束日期';
    } else if (formData.endDate < formData.startDate) {
      newErrors.endDate = '结束日期不能早于出发日期';
    }
    
    // 验证旅行人数
    const peopleCount = parseInt(formData.peopleCount);
    if (isNaN(peopleCount) || peopleCount < 1) {
      newErrors.peopleCount = '请输入有效的旅行人数';
    }
    
    setErrors(newErrors);
    
    // 检查是否有错误
    return !Object.values(newErrors).some(error => error !== '');
  };
  
  /**
   * 处理创建计划
   */
  const handleCreatePlan = async () => {
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    
    try {
      // 模拟创建计划请求
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // 创建计划
      createPlan({
        name: formData.name,
        destination: formData.destination,
        startDate: formData.startDate,
        endDate: formData.endDate,
        peopleCount: parseInt(formData.peopleCount),
        theme: formData.theme || undefined,
        activities: [],
        isCurrent: false,
      });
      
      // 创建成功，返回上一页
      navigation.goBack();
    } catch (error) {
      console.error('创建计划失败:', error);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>创建旅行计划</Text>
      </View>
      
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.formContainer}>
          <Input
            label="计划名称"
            placeholder="请输入计划名称"
            value={formData.name}
            onChangeText={(value) => handleInputChange('name', value)}
            error={errors.name}
            showClearButton
            onClear={() => handleInputChange('name', '')}
          />
          
          <Input
            label="目的地"
            placeholder="请输入目的地"
            value={formData.destination}
            onChangeText={(value) => handleInputChange('destination', value)}
            error={errors.destination}
            showClearButton
            onClear={() => handleInputChange('destination', '')}
          />
          
          <Input
            label="出发日期"
            placeholder="YYYY-MM-DD"
            value={formData.startDate}
            onChangeText={(value) => handleInputChange('startDate', value)}
            error={errors.startDate}
            showClearButton
            onClear={() => handleInputChange('startDate', '')}
          />
          
          <Input
            label="结束日期"
            placeholder="YYYY-MM-DD"
            value={formData.endDate}
            onChangeText={(value) => handleInputChange('endDate', value)}
            error={errors.endDate}
            showClearButton
            onClear={() => handleInputChange('endDate', '')}
          />
          
          <Input
            label="旅行人数"
            placeholder="请输入旅行人数"
            keyboardType="number-pad"
            value={formData.peopleCount}
            onChangeText={(value) => handleInputChange('peopleCount', value)}
            error={errors.peopleCount}
            showClearButton
            onClear={() => handleInputChange('peopleCount', '')}
          />
          
          <Input
            label="旅行主题（可选）"
            placeholder="例如：美食之旅、文化探索"
            value={formData.theme}
            onChangeText={(value) => handleInputChange('theme', value)}
            showClearButton
            onClear={() => handleInputChange('theme', '')}
          />
          
          <View style={styles.buttonContainer}>
            <Button
              title="取消"
              onPress={() => navigation.goBack()}
              style={styles.cancelButton}
              type="secondary"
            />
            <Button
              title="创建计划"
              onPress={handleCreatePlan}
              loading={loading}
              style={styles.createButton}
              type="primary"
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
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
  scrollContent: {
    padding: 20,
  },
  formContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 24,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  cancelButton: {
    flex: 1,
    marginRight: 8,
  },
  createButton: {
    flex: 1,
    marginLeft: 8,
  },
});
