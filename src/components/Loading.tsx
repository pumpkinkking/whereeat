import React from 'react';
import { 
  View, 
  ActivityIndicator, 
  Text, 
  StyleSheet, 
  ViewStyle, 
  TextStyle 
} from 'react-native';

/**
 * Loading组件属性类型定义
 */
interface LoadingProps {
  /**
   * 加载文本
   */
  text?: string;
  /**
   * 加载指示器颜色
   */
  color?: string;
  /**
   * 加载指示器大小
   */
  size?: 'small' | 'large';
  /**
   * 自定义容器样式
   */
  style?: ViewStyle;
  /**
   * 自定义文本样式
   */
  textStyle?: TextStyle;
}

/**
 * 通用加载指示器组件
 * 支持文本、自定义颜色和大小
 */
export const Loading: React.FC<LoadingProps> = ({
  text,
  color = '#1e90ff',
  size = 'large',
  style,
  textStyle,
}) => {
  return (
    <View style={[styles.container, style]}>
      <ActivityIndicator 
        color={color} 
        size={size} 
      />
      {text && (
        <Text style={[styles.text, { color }, textStyle]}>
          {text}
        </Text>
      )}
    </View>
  );
};

/**
 * 全屏加载组件
 */
export const FullScreenLoading: React.FC<LoadingProps> = (props) => {
  return (
    <View style={[styles.fullScreenContainer, styles.container]}>
      <Loading {...props} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  fullScreenContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    zIndex: 9999,
  },
  text: {
    marginTop: 12,
    fontSize: 14,
    fontWeight: '500',
  },
});
