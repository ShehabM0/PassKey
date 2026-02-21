import { CountdownProvider } from '../context/CountdownContext';
import { ApolloProvider } from '@apollo/client/react';
import { AuthProvider } from '@/context/AuthContext';
import apolloClient from '@/api/config/graphql';
import { Stack } from 'expo-router';

function RootLayoutNav() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      <Stack.Screen name="(app)" options={{ headerShown: false }} />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <ApolloProvider client={apolloClient}>
      <CountdownProvider>
        <AuthProvider>
          <RootLayoutNav />
        </AuthProvider>
      </CountdownProvider>
    </ApolloProvider>
  );
}