import { PasswordUpdate } from '../../types'
import apiClient from '../config/client';

export const userApi = {
  requestPasswordUpdate: async ({oldPassword, newPassword}: PasswordUpdate): Promise<void> => {
    const response = await apiClient.patch(
      '/users/password/update',
      { oldPassword, newPassword },
    );
    return response.data;
  },

  passwordUpdate: async (token: string): Promise<void> => {
    const response = await apiClient.post(`/users/password/update/${token}`);
    return response.data;
  },

  passwordVerify: async (password: string): Promise<void> => {
    const response = await apiClient.post('/users/password/verify', { password });
    return response.data;
  },

  requestEmailVerify: async (): Promise<void> => {
    const response = await apiClient.post('/users/email/verify');
    return response.data;
  },

  emailVerify: async (token: string): Promise<void> => {
    const response = await apiClient.post(`/users/email/verify/${token}`);
    return response.data;
  }
};
