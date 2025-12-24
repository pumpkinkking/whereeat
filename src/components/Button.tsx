import React from 'react';
import { 
  TouchableOpacity, 
  Text, 
  StyleSheet, 
  TouchableOpacityProps, 
  ViewStyle, 
  TextStyle 
} from 'react-native';

/**
 * Button组件属性类型定义
 */
interface ButtonProps extends TouchableOpacityProps {
  /**
   * 按钮文本
   */
  title: string;
  /**
   * 按钮类型：primary, secondary, outline
   */
  type?: 'primary' | 'secondary' | 'outline';
  /**
   * 按钮尺寸：small, medium, large
   */
  size?: 'small' | 'medium' | 'large';
  /**
   * 自定义按钮样式
   */
  style?: ViewStyle;
  /**
   * 自定义文本样式
   */
  textStyle?: TextStyle;
  /**
   * 是否显示加载状态
   */
  loading?: boolean;
}

/**
 * 通用按钮组件
 * 支持多种类型和尺寸，可自定义样式
 */
export const Button: React.FC<ButtonProps> = ({
  title,
  type = 'primary',
  size = 'medium',
  style,
  textStyle,
  loading = false,
  disabled,
  ...props
}) => {
  // 根据按钮类型和尺寸计算样式
  const getButtonStyle = (): ViewStyle[] => {
    const baseStyle = styles.button;
    const typeStyle = styles[`${type}Button`];
    const sizeStyle = styles[`${size}Button`];
    const disabledStyle = disabled || loading ? styles.disabledButton : {};
    
    // 只返回非undefined的样式
    const buttonStyles: ViewStyle[] = [baseStyle, typeStyle, sizeStyle, disabledStyle];
    if (style) {
      buttonStyles.push(style);
    }
    
    return buttonStyles;
  };

  const getTextStyle = (): TextStyle[] => {
    const baseStyle = styles.text;
    const typeTextStyle = styles[`${type}Text`];
    const sizeTextStyle = styles[`${size}Text`];
    const disabledTextStyle = disabled || loading ? styles.disabledText : {};
    
    // 只返回非undefined的样式
    const textStyles: TextStyle[] = [baseStyle, typeTextStyle, sizeTextStyle, disabledTextStyle];
    if (textStyle) {
      textStyles.push(textStyle);
    }
    
    return textStyles;
  };

  return (
    <TouchableOpacity
      style={getButtonStyle()}
      disabled={disabled || loading}
      {...props}
    >
      <Text style={getTextStyle()}>
        {loading ? '加载中...' : title}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  // 按钮类型样式
  primaryButton: {
    backgroundColor: '#1e90ff',
  },
  secondaryButton: {
    backgroundColor: '#f0f0f0',
  },
  outlineButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#1e90ff',
  },
  // 按钮尺寸样式
  smallButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  mediumButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  largeButton: {
    paddingHorizontal: 28,
    paddingVertical: 14,
  },
  // 禁用状态样式
  disabledButton: {
    opacity: 0.6,
  },
  // 文本基础样式
  text: {
    fontWeight: '600',
  },
  // 文本类型样式
  primaryText: {
    color: '#ffffff',
  },
  secondaryText: {
    color: '#333333',
  },
  outlineText: {
    color: '#1e90ff',
  },
  // 文本尺寸样式
  smallText: {
    fontSize: 12,
  },
  mediumText: {
    fontSize: 14,
  },
  largeText: {
    fontSize: 16,
  },
  // 文本禁用状态样式
  disabledText: {
    opacity: 0.8,
  },
});
