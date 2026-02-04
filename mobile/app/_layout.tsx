import { CountdownProvider } from '../context/CountdownContext';
import { Stack } from 'expo-router';

function RootLayoutNav() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <CountdownProvider>
      <RootLayoutNav />
    </CountdownProvider>
  );
}