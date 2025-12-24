import React from 'react';
import { 
  View, 
  TextInput, 
  Text, 
  StyleSheet, 
  TextInputProps, 
  ViewStyle, 
  TextStyle 
} from 'react-native';

/**
 * Input组件属性类型定义
 */
interface InputProps extends TextInputProps {
  /**
   * 输入框标签
   */
  label?: string;
  /**
   * 错误信息
   */
  error?: string;
  /**
   * 自定义容器样式
   */
  containerStyle?: ViewStyle;
  /**
   * 自定义输入框样式
   */
  inputStyle?: TextStyle;
  /**
   * 自定义标签样式
   */
  labelStyle?: TextStyle;
  /**
   * 自定义错误信息样式
   */
  errorStyle?: TextStyle;
  /**
   * 是否显示清除按钮
   */
  showClearButton?: boolean;
  /**
   * 清除按钮点击事件
   */
  onClear?: () => void;
  /**
   * 左侧图标
   */
  leftIcon?: React.ReactNode;
}

/**
 * 通用输入框组件
 * 支持标签、错误信息、清除按钮等功能
 */
export const Input: React.FC<InputProps> = ({
  label,
  error,
  containerStyle,
  inputStyle,
  labelStyle,
  errorStyle,
  showClearButton = false,
  onClear,
  leftIcon,
  value,
  ...props
}) => {
  return (
    <View style={[styles.container, containerStyle]}>
      {/* 输入框标签 */}
      {label && (
        <Text style={[styles.label, labelStyle]}>
          {label}
        </Text>
      )}
      
      {/* 输入框容器 */}
      <View style={[styles.inputContainer, error ? styles.errorInputContainer : {}]}>
        {/* 左侧图标 */}
        {leftIcon && leftIcon}
        <TextInput
          style={[styles.input, leftIcon ? styles.inputWithLeftIcon : {}, inputStyle]}
          placeholderTextColor="#999999"
          value={value}
          {...props}
        />
        
        {/* 清除按钮 */}
        {showClearButton && value && onClear && (
          <Text 
            style={styles.clearButton} 
            onPress={onClear}
          >
            ×
          </Text>
        )}
      </View>
      
      {/* 错误信息 */}
      {error && (
        <Text style={[styles.error, errorStyle]}>
          {error}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333333',
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  errorInputContainer: {
    borderWidth: 1,
    borderColor: '#ff4d4f',
  },
  input: {
    flex: 1,
    height: 48,
    fontSize: 16,
    color: '#333333',
  },
  inputWithLeftIcon: {
    marginLeft: 8,
  },
  clearButton: {
    fontSize: 24,
    color: '#999999',
    padding: 4,
  },
  error: {
    fontSize: 12,
    color: '#ff4d4f',
    marginTop: 4,
  },
});
