import AsyncStorage from '@react-native-async-storage/async-storage';
import { PasswordUpdate } from '../types'
import apiClient from './client';

export const userApi = {
  requestPasswordUpdate: async ({oldPassword, newPassword}: PasswordUpdate): Promise<void> => {
    const accessToken = await AsyncStorage.getItem('accessToken');
    const requestHeader = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    };

    const response = await apiClient.patch(
      '/users/password/update/',
      { oldPassword, newPassword },
      requestHeader
    );

    return response.data;
  },

  passwordUpdate: async (token: string): Promise<void> => {
    const accessToken = await AsyncStorage.getItem('accessToken');
    const requestHeader = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    };

    const response = await apiClient.post(`/users/password/update/${token}`, {}, requestHeader);

    return response.data;
  },

  requestEmailVerify: async (): Promise<void> => {
    const accessToken = await AsyncStorage.getItem('accessToken');
    const requestHeader = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    };

    const response = await apiClient.post(`/users/email/verify`, {}, requestHeader);

    return response.data;
  },

  emailVerify: async (token: string): Promise<void> => {
    const accessToken = await AsyncStorage.getItem('accessToken');
    const requestHeader = {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    };

    const response = await apiClient.post(`/users/email/verify/${token}`, {}, requestHeader);

    return response.data;
  }
};