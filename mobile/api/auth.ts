import { SignupCredentials, SigninCredentials, AuthResponse, RefreshResponse, PasswordReset } from '../types'
import AsyncStorage from '@react-native-async-storage/async-storage';
import apiClient from './client';

export const authApi = {
  signup: async (userData: SignupCredentials): Promise<AuthResponse> => {
    const response = await apiClient.post('/auth/sign-up', userData);
    return response.data;
  },

  signin: async (credentials: SigninCredentials): Promise<AuthResponse> => {
    const response = await apiClient.post('/auth/sign-in', credentials);
    return response.data;
  },

  signout: async (): Promise<void> => {
    const refreshToken = await AsyncStorage.getItem('refreshToken');
    await apiClient.post('/auth/sign-out', { refreshToken });
  },

  refresh: async (): Promise<RefreshResponse> => {
    const refreshToken = await AsyncStorage.getItem('refreshToken');
    const response = await apiClient.post('/auth/refresh', { refreshToken });
    return response.data;
  },


  requestPasswordReset: async (email: string): Promise<void> => {
    await apiClient.post('/users/password/request-reset', { email });
  },
  passwordReset: async ({token, password}: PasswordReset): Promise<void> => {
    await apiClient.post(`/users/password/reset/${token}`, { password });
  }
};