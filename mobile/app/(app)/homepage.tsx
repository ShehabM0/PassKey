import { GetUserCredentialsData, PaginationVars } from '@/types/graphql';
import { FlatList, View, Text, StyleSheet } from 'react-native';
import { GET_USER_CREDENTIALS } from '@/api/graphql/queries';
import CredentialCard from '@/components/CredentialCard';
import SplashScreen from '@/components/SplashScreen';
import { Colors } from '@/components/common/colors';
import HomeHeader from '@/components/HomeHeader';
import { useQuery } from '@apollo/client/react';
import { useRouter } from 'expo-router';
import { useState } from 'react';

export default function HomeScreen() {
  const router = useRouter();
  const limit = 20;

  const [page, setPage] = useState(1);
  const { data, loading, error, fetchMore } = useQuery<
    GetUserCredentialsData,
    PaginationVars>
    (
      GET_USER_CREDENTIALS,
      {
        variables: { page, limit },
      }
    );
  
    console.log(error)
  
  const credentials = data?.me?.credentials?.data || [];
  const pagination = data?.me?.credentials?.pagination;

  const credentialPage = (cred: any) => {
    router.push({
      pathname: '/credential',
      params: cred
    });
  }

  const headerList = () => {
    return (
      <View style={styles.listHeader}>
        <Text style={styles.textBody}>Your vaults</Text>
        <Text style={styles.countText}>
          {pagination?.totalItems || 0} total
        </Text>
      </View>
    )
  }

  const emptyList = () => {
    return (
      <View style={styles.nocredentialsContainer}>
        <Text style={styles.emptyTitle}>No vaults yet</Text>
        <Text style={styles.emptySubtitle}>
          Added credentials will appear here
        </Text>
      </View>
    )
  }

  const handleLoadMore = () => {
    if (!pagination?.hasNextPage || loading) return;

    fetchMore({
      variables: {
        page: pagination.currentPage + 1,
        limit
      },
      updateQuery: (prev: any, { fetchMoreResult }) => {
        if (!fetchMoreResult) return prev;

        return {
          me: {
            ...prev.me,
            credentials: {
              ...fetchMoreResult.me.credentials,
              data: [
                ...prev.me.credentials.data,
                ...fetchMoreResult.me.credentials.data,
              ],
            },
          },
        };
      },
    });
  };

  if(loading && !data)
    return <SplashScreen/>

  return (
      <View style={{flex: 1}}>
        <HomeHeader/>
        <View style={styles.bodyContainer}>
          <FlatList
            data={credentials}
            ListHeaderComponent={ headerList }
            ListEmptyComponent={ emptyList }
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ padding: 20 }}
            renderItem={({ item }) => (
              <CredentialCard {...item} onPress={() => credentialPage(item)}  />
            )}
            onEndReached={handleLoadMore}
            onEndReachedThreshold={0.5}
          />
        </View>
      </View>
  );
}

const styles = StyleSheet.create({
  bodyContainer: {
    flex: 1,
    backgroundColor: Colors.gray100,
  },

  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },

  textBody: {
    fontSize: 25,
    fontWeight: 'bold',
    marginBottom: 12,
    color: Colors.gray900,
  },

  countText: {
    fontSize: 14,
    color: Colors.gray500,
    fontWeight: '600',
  },

  nocredentialsContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20
  },

  emptyTitle: {
    marginTop: 12,
    fontSize: 18,
    fontWeight: '600',
    color: Colors.gray700,
  },

  emptySubtitle: {
    marginTop: 4,
    fontSize: 14,
    color: Colors.gray500,
    textAlign: 'center',
  },
});
