import { ApolloClient, InMemoryCache, createHttpLink, from, fromPromise } from '@apollo/client';
import { onError } from '@apollo/client/link/error';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { setContext } from '@apollo/client/link/context';
import { authApi } from '../rest/auth';

const httpLink = createHttpLink({
  uri: 'http://10.0.2.2:3000/graphql',
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

const errorLink = onError(({ graphQLErrors, operation, forward }) => {
  if (graphQLErrors?.some((err: any) => err.message === 'Authentication required!')) {
    return fromPromise(
      (async () => {
        try {
          const refreshed = await authApi.refresh();
          await AsyncStorage.setItem('accessToken', refreshed.accessToken);
          await AsyncStorage.setItem('refreshToken', refreshed.refreshToken);

          operation.setContext(({ headers = {} }) => ({
            headers: {
              ...headers,
              authorization: `Bearer ${refreshed.accessToken}`,
            },
          }));

          return true;
        } catch (err) {
          await AsyncStorage.multiRemove(['accessToken', 'refreshToken', 'userData']);
          return false;
        }
      })()
    ).flatMap((ok: any) => {
      return forward(operation);
    });
  }

  return undefined;
});

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
