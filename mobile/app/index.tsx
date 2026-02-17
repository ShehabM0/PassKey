import SplashScreen from '@/components/SplashScreen';
import { useAuth } from '@/context/AuthContext';
import { Redirect } from 'expo-router';
import { useEffect, useState } from 'react';

export default function Index() {
  const { isAuthenticated, isAuthenticating } = useAuth();
  const [ready, isReady] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => isReady(false), 3000);

    return () => clearTimeout(timer);
  }, []);

  if (isAuthenticating || ready) {
    return <SplashScreen />;
  }

  if (!isAuthenticated) {
    return <Redirect href="/(auth)/login" />;
  }

  return <Redirect href="/(app)/homepage" />;
}
