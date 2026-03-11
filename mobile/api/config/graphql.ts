import AsyncStorage from '@react-native-async-storage/async-storage';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';
import { authApi } from '../rest/auth';
import { router } from 'expo-router';
import {
  createHttpLink,
  InMemoryCache,
  ApolloClient,
  Observable,
  from,
} from '@apollo/client';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL;

const httpLink = createHttpLink({
  uri: `${API_BASE_URL}/graphql`
});

const authLink = setContext(async (_, { headers }) => {
  const token = await AsyncStorage.getItem('accessToken');
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

const errorLink = onError(({ error, operation, forward }) => {
  if (!error) return;

  const isUnauthenticated = error.message === 'Authentication required!';

  if (isUnauthenticated) {
    return new Observable((observer) => {
      authApi
        .refresh()
        .then(async (refreshed) => {
          await AsyncStorage.setItem('accessToken', refreshed.accessToken);
          await AsyncStorage.setItem('refreshToken', refreshed.refreshToken);

          operation.setContext(({ headers = {} }) => ({
            headers: {
              ...headers,
              authorization: `Bearer ${refreshed.accessToken}`,
            },
          }));

          forward(operation).subscribe({
            next: observer.next.bind(observer),
            error: observer.error.bind(observer),
            complete: observer.complete.bind(observer),
          });
        })
        .catch(async (err) => {
          await AsyncStorage.multiRemove([
            'accessToken',
            'refreshToken',
            'userData',
          ]);
          router.replace('/(auth)/login');

          observer.error(err);
        });
      });
    }
  }
);

const apolloClient = new ApolloClient({
  link: from([errorLink, authLink, httpLink]),
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'cache-and-network',
    },
  },
});

export default apolloClient;
