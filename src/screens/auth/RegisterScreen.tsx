import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import { useUserStore } from '../../stores/userStore';

// 定义导航属性类型
type RegisterScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Register'>;

/**
 * 注册页面组件
 * 处理用户注册逻辑，包括邮箱、密码和确认密码验证
 */
export const RegisterScreen: React.FC = () => {
  const navigation = useNavigation<RegisterScreenNavigationProp>();
  const { login } = useUserStore();
  
  // 表单状态
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  
  // 错误状态
  const [errors, setErrors] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
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
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: '',
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
      email: '',
      password: '',
      confirmPassword: '',
    };
    
    // 验证姓名
    if (!formData.name.trim()) {
      newErrors.name = '请输入姓名';
    }
    
    // 验证邮箱
    if (!formData.email.trim()) {
      newErrors.email = '请输入邮箱';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = '请输入有效的邮箱地址';
    }
    
    // 验证密码
    if (!formData.password.trim()) {
      newErrors.password = '请输入密码';
    } else if (formData.password.length < 6) {
      newErrors.password = '密码长度不能少于6个字符';
    }
    
    // 验证确认密码
    if (!formData.confirmPassword.trim()) {
      newErrors.confirmPassword = '请确认密码';
    } else if (formData.confirmPassword !== formData.password) {
      newErrors.confirmPassword = '两次输入的密码不一致';
    }
    
    setErrors(newErrors);
    
    // 检查是否有错误
    return !Object.values(newErrors).some(error => error !== '');
  };
  
  /**
   * 处理注册
   */
  const handleRegister = async () => {
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    
    try {
      // 模拟注册请求
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // 注册成功，创建用户数据
      const userData = {
        id: `user-${Date.now()}`,
        name: formData.name,
        email: formData.email,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        preferences: {
          cuisinePreferences: [],
          priceRange: [50, 200],
          dietaryRestrictions: [],
          likesExploring: true,
          preferredDistance: 5000,
        },
      };
      
      // 调用登录状态管理
      login(userData);
      
      // 注册成功，返回上一页或导航到主页
      navigation.goBack();
    } catch (error) {
      console.error('注册失败:', error);
      setErrors(prev => ({
        ...prev,
        email: '该邮箱已被注册',
      }));
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Logo区域 */}
        <View style={styles.logoContainer}>
          <Image
            source={{ uri: 'https://via.placeholder.com/120' }}
            style={styles.logo}
          />
          <Text style={styles.appName}>WhereEat</Text>
          <Text style={styles.slogan}>发现美食，享受旅行</Text>
        </View>
        
        {/* 注册表单 */}
        <View style={styles.formContainer}>
          <Text style={styles.formTitle}>注册</Text>
          
          <Input
            label="姓名"
            placeholder="请输入您的姓名"
            value={formData.name}
            onChangeText={(value) => handleInputChange('name', value)}
            error={errors.name}
            showClearButton
            onClear={() => handleInputChange('name', '')}
          />
          
          <Input
            label="邮箱"
            placeholder="请输入您的邮箱"
            keyboardType="email-address"
            autoCapitalize="none"
            value={formData.email}
            onChangeText={(value) => handleInputChange('email', value)}
            error={errors.email}
            showClearButton
            onClear={() => handleInputChange('email', '')}
          />
          
          <Input
            label="密码"
            placeholder="请输入您的密码"
            secureTextEntry
            value={formData.password}
            onChangeText={(value) => handleInputChange('password', value)}
            error={errors.password}
            showClearButton
            onClear={() => handleInputChange('password', '')}
          />
          
          <Input
            label="确认密码"
            placeholder="请确认您的密码"
            secureTextEntry
            value={formData.confirmPassword}
            onChangeText={(value) => handleInputChange('confirmPassword', value)}
            error={errors.confirmPassword}
            showClearButton
            onClear={() => handleInputChange('confirmPassword', '')}
          />
          
          {/* 注册按钮 */}
          <Button
            title="注册"
            onPress={handleRegister}
            loading={loading}
            style={styles.registerButton}
            type="primary"
          />
          
          {/* 登录入口 */}
          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>已有账号？</Text>
            <Text 
              style={styles.loginLink} 
              onPress={() => navigation.navigate('Login')}
            >
              立即登录
            </Text>
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
  scrollContent: {
    flexGrow: 1,
    padding: 20,
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 40,
  },
  logo: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 16,
  },
  appName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1e90ff',
    marginBottom: 8,
  },
  slogan: {
    fontSize: 16,
    color: '#666666',
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
  formTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 24,
    textAlign: 'center',
  },
  registerButton: {
    marginBottom: 20,
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginText: {
    fontSize: 14,
    color: '#666666',
  },
  loginLink: {
    fontSize: 14,
    color: '#1e90ff',
    fontWeight: '600',
    marginLeft: 8,
  },
});
