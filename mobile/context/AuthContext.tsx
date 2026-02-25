import { User, SigninCredentials, AuthContextType, SignupCredentials } from '../types';
import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authApi } from '../api/rest/auth';

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

      console.log("---------------Tokens---------------")
      console.log(accessToken)
      console.log(refreshToken)
      console.log("---------------######---------------")

      try {
        const me = await authApi.currentUser();
        setUser(me);
        await AsyncStorage.setItem('userData', JSON.stringify(me));
        return;
      } catch (err) {
        console.warn('Stored access token invalid, attempting refresh...', err);
      }

      // Access token missing or invalid.
      try {
        const refreshed = await authApi.refresh();
        await AsyncStorage.setItem('accessToken', refreshed.accessToken);
        await AsyncStorage.setItem('refreshToken', refreshed.refreshToken);
        console.log("---------------Refresh-Tokens---------------")
        console.log(refreshed.accessToken)
        console.log(refreshed.refreshToken)
        console.log("---------------######---------------")

        const me = await authApi.currentUser();
        setUser(me);
        await AsyncStorage.setItem('userData', JSON.stringify(me));
      } catch (err) {
        console.error('Refresh token flow failed:', err);
        await signout();
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
      const message = error.response?.data?.error || 'Login failed';
      throw new Error(message);
    }
  };

  const signin = async (credentials: SigninCredentials) => {
    try {
      const response = await authApi.signin(credentials);

      await AsyncStorage.setItem('accessToken', response.accessToken);
      await AsyncStorage.setItem('refreshToken', response.refreshToken);
      await AsyncStorage.setItem('userData', JSON.stringify(response.user));

      setUser(response.user);
    } catch (error: any) {
      const message = error.response?.data?.error || 'Login failed';
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
    const response = await authApi.refresh();
    await AsyncStorage.setItem('accessToken', response.accessToken);
    await AsyncStorage.setItem('refreshToken', response.refreshToken);
    return response;
  };

  const refreshUser = async () => {
    const data = await authApi.currentUser();
    setUser(data);
    return data;
  };


  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticating: isLoading,
        isAuthenticated: !!user,
        refreshUser,
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