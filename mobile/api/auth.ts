import { SignupCredentials, SigninCredentials, AuthResponse } from '../types'
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
    await apiClient.post('/auth/logout');
  },
};