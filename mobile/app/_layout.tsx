import { CountdownProvider } from '../context/CountdownContext';
import { AuthProvider } from '@/context/AuthContext';
import { Stack } from 'expo-router';

function RootLayoutNav() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      <Stack.Screen name="(app)" options={{ headerShown: false }} />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <CountdownProvider>
      <AuthProvider>
        <RootLayoutNav />
      </AuthProvider>
    </CountdownProvider>
  );
}