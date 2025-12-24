import React from 'react';
import { View, StyleSheet, ViewStyle, TouchableOpacity } from 'react-native';

/**
 * Card组件属性类型定义
 */
interface CardProps {
  /**
   * 卡片内容
   */
  children: React.ReactNode;
  /**
   * 自定义卡片样式
   */
  style?: ViewStyle;
  /**
   * 是否可点击
   */
  onPress?: () => void;
  /**
   * 卡片阴影大小，默认medium
   */
  shadowSize?: 'small' | 'medium' | 'large';
  /**
   * 卡片圆角大小，默认8
   */
  borderRadius?: number;
}

/**
 * 通用卡片组件
 * 支持点击事件、自定义样式和阴影大小
 */
export const Card: React.FC<CardProps> = ({
  children,
  style,
  onPress,
  shadowSize = 'medium',
  borderRadius = 8,
}) => {
  const CardContainer = onPress ? TouchableOpacity : View;
  
  return (
    <CardContainer
      style={[
        styles.card,
        styles[`${shadowSize}Shadow`],
        { borderRadius },
        style,
      ]}
      onPress={onPress}
      activeOpacity={onPress ? 0.7 : 1}
    >
      {children}
    </CardContainer>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    padding: 16,
  },
  // 阴影样式
  smallShadow: {
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  mediumShadow: {
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  largeShadow: {
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
});
