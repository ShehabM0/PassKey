import { Stack } from 'expo-router';

export default function AuthLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="login" />
      <Stack.Screen name="register" />
      <Stack.Screen name="email-sent" />
      <Stack.Screen name="password-reset" />
      <Stack.Screen name="password-update" />
      <Stack.Screen name="password-request-reset" />
    </Stack>
  );
}
