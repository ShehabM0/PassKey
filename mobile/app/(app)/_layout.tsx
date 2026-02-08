import { Stack } from 'expo-router';

export default function AppLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="homepage" />
      <Stack.Screen name="credential" />
      <Stack.Screen name="create-credential" />
    </Stack>
  );
}