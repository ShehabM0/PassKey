import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL;

const apiClient = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

apiClient.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('accessToken');
    const rtoken = await AsyncStorage.getItem('refreshToken');
    console.log("------------")
    console.log("aT", token);
    console.log("rT", rtoken);
    console.log("------------")
    if (token)
      config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean; };

    if (error.response?.status !== 401) {
      return Promise.reject(error);
    }

    const refreshToken = await AsyncStorage.getItem('refreshToken');
    if (!refreshToken) {
      router.replace('/(auth)/login');
      throw new Error('No refresh token available');
    }
    if (
      originalRequest.url?.includes('/auth/refresh') ||
      originalRequest.url?.includes('/auth/sign-out')
    ) {
      await AsyncStorage.removeItem('accessToken');
      await AsyncStorage.removeItem('refreshToken');
      await AsyncStorage.removeItem('userData');
      router.replace('/(auth)/login');
      return Promise.reject(error);
    }

    try {
      const response = await axios.post(
        `${API_BASE_URL}/auth/refresh`,
        { refreshToken },
        {
          headers: { 'Content-Type': 'application/json' },
        }
      );
      const { accessToken, refreshToken: newRefreshToken } = response.data;
      await AsyncStorage.setItem('accessToken', accessToken);
      await AsyncStorage.setItem('refreshToken', newRefreshToken);

      if (originalRequest.headers) {
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
      }

      return apiClient(originalRequest);
    } catch (error: any) {
      const message = error?.response?.data?.message || 
        error?.response?.data?.error ||
        error.message;
      console.error('Token refresh failed:', message);

      await AsyncStorage.removeItem('accessToken');
      await AsyncStorage.removeItem('refreshToken');
      await AsyncStorage.removeItem('userData');
      router.replace('/(auth)/login');

      return Promise.reject(error);
    }
  }
);

export default apiClient
