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
 type LoginScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Login'>;

/**
 * 登录页面组件
 * 处理用户登录逻辑，包括邮箱和密码验证
 */
export const LoginScreen: React.FC = () => {
  const navigation = useNavigation<LoginScreenNavigationProp>();
  const { login } = useUserStore();
  
  // 表单状态
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  
  // 错误状态
  const [errors, setErrors] = useState({
    email: '',
    password: '',
  });
  
  // 加载状态
  const [loading, setLoading] = useState(false);
  
  /**
   * 处理表单输入变化
   * @param field 字段名
   * @param value 字段值
   */
  const handleInputChange = (field: 'email' | 'password', value: string) => {
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
      email: '',
      password: '',
    };
    
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
    
    setErrors(newErrors);
    
    // 检查是否有错误
    return !Object.values(newErrors).some(error => error !== '');
  };
  
  /**
   * 处理登录
   */
  const handleLogin = async () => {
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    
    try {
      // 模拟登录请求
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // 登录成功，创建用户数据
      const userData = {
        id: `user-${Date.now()}`,
        name: '测试用户',
        email: formData.email,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        preferences: {
          cuisinePreferences: ['中餐', '西餐', '日料'],
          priceRange: [50, 200],
          dietaryRestrictions: [],
          likesExploring: true,
          preferredDistance: 5000,
        },
      };
      
      // 调用登录状态管理
      login(userData);
      
      // 登录成功，返回上一页或导航到主页
      navigation.goBack();
    } catch (error) {
      console.error('登录失败:', error);
      setErrors(prev => ({
        ...prev,
        email: '邮箱或密码错误',
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
        
        {/* 登录表单 */}
        <View style={styles.formContainer}>
          <Text style={styles.formTitle}>登录</Text>
          
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
          
          {/* 忘记密码 */}
          <Text 
            style={styles.forgotPassword} 
            onPress={() => {}}
          >
            忘记密码？
          </Text>
          
          {/* 登录按钮 */}
          <Button
            title="登录"
            onPress={handleLogin}
            loading={loading}
            style={styles.loginButton}
            type="primary"
          />
          
          {/* 注册入口 */}
          <View style={styles.registerContainer}>
            <Text style={styles.registerText}>还没有账号？</Text>
            <Text 
              style={styles.registerLink} 
              onPress={() => navigation.navigate('Register')}
            >
              立即注册
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
  forgotPassword: {
    fontSize: 14,
    color: '#1e90ff',
    textAlign: 'right',
    marginBottom: 24,
  },
  loginButton: {
    marginBottom: 20,
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  registerText: {
    fontSize: 14,
    color: '#666666',
  },
  registerLink: {
    fontSize: 14,
    color: '#1e90ff',
    fontWeight: '600',
    marginLeft: 8,
  },
});
