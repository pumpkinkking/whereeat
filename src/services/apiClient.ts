import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { Platform } from 'react-native';

/**
 * API响应基础结构
 */
export interface ApiResponse<T = any> {
  /** 响应数据 */
  data: T;
  /** 响应状态码 */
  status: number;
  /** 响应状态消息 */
  message: string;
  /** 响应时间戳 */
  timestamp: string;
}

/**
 * API请求错误结构
 */
export interface ApiError {
  /** 错误代码 */
  code: string;
  /** 错误消息 */
  message: string;
  /** 错误详情 */
  details?: any;
  /** 响应状态码 */
  status?: number;
}

/**
 * API客户端配置选项
 */
interface ApiClientConfig {
  /** API基础URL */
  baseURL: string;
  /** 请求超时时间（毫秒） */
  timeout: number;
  /** 默认请求头 */
  headers: Record<string, string>;
}

/**
 * 创建API客户端实例
 * @returns 配置好的axios实例
 */
export const createApiClient = (): AxiosInstance => {
  // 根据平台和环境确定API基础URL
  const baseURL = __DEV__
    ? 'http://localhost:3000/api'
    : 'https://api.whereeat.com/api';

  // 创建axios实例
  const apiClient = axios.create({
    baseURL,
    timeout: 15000, // 15秒超时
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'X-Platform': Platform.OS,
      'X-App-Version': '1.0.0',
    },
  });

  // 请求拦截器
  apiClient.interceptors.request.use(
    (config) => {
      // 在这里可以添加认证信息，如token
      // const token = getAuthToken();
      // if (token && config.headers) {
      //   config.headers['Authorization'] = `Bearer ${token}`;
      // }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // 响应拦截器
  apiClient.interceptors.response.use(
    (response) => {
      // 直接返回响应数据中的data部分
      return response;
    },
    (error) => {
      // 统一处理错误
      let apiError: ApiError = {
        code: 'UNKNOWN_ERROR',
        message: '网络请求失败，请稍后重试',
      };

      if (error.response) {
        // 服务器返回了错误状态码
        const responseData = error.response.data as ApiResponse;
        apiError = {
          code: error.response.status.toString(),
          message: responseData?.message || '服务器错误',
          details: responseData?.data,
          status: error.response.status,
        };
      } else if (error.request) {
        // 请求已发送但没有收到响应
        apiError = {
          code: 'NETWORK_ERROR',
          message: '网络连接失败，请检查网络设置',
        };
      } else {
        // 请求配置出错
        apiError = {
          code: 'REQUEST_ERROR',
          message: error.message || '请求失败',
        };
      }

      return Promise.reject(apiError);
    }
  );

  return apiClient;
};

// 导出API客户端实例
export const apiClient = createApiClient();
