import { User, SigninCredentials, AuthContextType, SignupCredentials } from '../types';
import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authApi } from '../api/auth';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const accessToken = await AsyncStorage.getItem('accessToken');
      const refreshToken = await AsyncStorage.getItem('refreshToken');
      const userData = await AsyncStorage.getItem('userData');

      if (accessToken && userData) {
        setUser(JSON.parse(userData));
        return;
      } 
    
      if(refreshToken) {
        refresh();
      }
      
    } catch (error) {
      console.error('Auth check failed:', error);
      await signout();
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (credentials: SignupCredentials) => {
    try {
      await authApi.signup(credentials);
    } catch (error: any) {
      const message = error.response?.data?.message || 'Login failed';
      throw new Error(message);
    }
  };

  const signin = async (credentials: SigninCredentials) => {
    try {
      const response = await authApi.signin(credentials);

      await AsyncStorage.setItem('accessToken', response.accessToken);
      await AsyncStorage.setItem('refreshToken', response.refreshToken);
    } catch (error: any) {
      const message = error.response?.data?.message || 'Login failed';
      throw new Error(message);
    }
  };

  const signout = async () => {
    try {
      await authApi.signout();
    } catch (error) {
      console.error('Logout API call failed:', error);
    } finally {
      await AsyncStorage.removeItem('accessToken');
      await AsyncStorage.removeItem('refreshToken');
      await AsyncStorage.removeItem('userData');
      setUser(null);
    }
  };

  const refresh = async () => {
    try {
      const response = await authApi.refresh();

      await AsyncStorage.setItem('accessToken', response.accessToken);
      await AsyncStorage.setItem('refreshToken', response.refreshToken);
    } catch (error) {
      console.error('Refresh token API call failed:', error);
    }
  };


  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticating: isLoading,
        isAuthenticated: !!user,
        signin,
        signup,
        signout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};