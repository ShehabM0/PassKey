import { ListPaginationVars, PlatformResponse } from '@/types/graphql';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { GET_PLATFORMS } from '@/api/graphql/queries';
import { Colors } from '@/components/common/colors';
import { useQuery } from '@apollo/client/react';
import PlatformRow from './PlatformRow';
import { useEffect, useState } from 'react';
import { View,
  ActivityIndicator,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  FlatList,
  Modal,
  Text,
} from 'react-native';

export default function PlatfromPicker({onClose, onSelect}: any) {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState(query);

  const limit = 20;
  const { data, loading, fetchMore, refetch } = useQuery<
  PlatformResponse,
  ListPaginationVars>(
    GET_PLATFORMS, {
    variables: { query: debouncedQuery, offset: 0,  limit }
  });

  const platforms = data?.platform?.fetch?.data;
  const pagination = data?.platform?.fetch?.pagination;

  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(query), 300);
    return () => clearTimeout(t);
  }, [query]);

  useEffect(() => {
    refetch({ offset: 0, limit, query: debouncedQuery });
  }, [debouncedQuery]);

  const handleLoadMore = () => {
    if (!pagination?.hasNextPage || loading) return;

    fetchMore({
      variables: {
        query,
        offset: pagination.nextOffset,
        limit
      },
      updateQuery: (prev, { fetchMoreResult }) => {
        if (!fetchMoreResult) return prev;

        return {
          platform: {
            ...prev.platform,
            fetch: {
              data: [
                ...prev.platform.fetch.data,
                ...fetchMoreResult.platform.fetch.data,
              ],
              pagination: fetchMoreResult.platform.fetch.pagination,
            },
          },
        };
      },
    });
  };

  const onPick = (item: any) => {
    onSelect(item);
    onClose();
  }

  return (
    <>
      <Modal visible={true} transparent animationType="slide">
        <TouchableOpacity activeOpacity={1} onPress={()=> onClose()} style={styles.overlay}>
          <TouchableOpacity activeOpacity={1} style={styles.sheet}>

            {/* List header */}
            <View style={styles.header}>
                <Text style={styles.title}>Select Platform</Text>
                <TouchableOpacity onPress={() => onClose()}>
                  <MaterialIcons name="close" size={20} color={Colors.gray700} />
                </TouchableOpacity>
            </View>

            {/* Search bar */}
            <View style={styles.searchBar}>
              <MaterialIcons name="search" size={20} color={Colors.gray500} />
              <TextInput
                placeholder="Search platform"
                style={{ flex: 1, marginLeft: 8 }}
                value={query}
                onChangeText={setQuery}
              />
              {query.length > 0 && (
                <TouchableOpacity onPress={() => setQuery('')}>
                  <MaterialIcons name="cancel" size={20} color={Colors.gray700} />
                </TouchableOpacity>
              )}
            </View>

            {/* Platform list */}
              <FlatList
                data={platforms}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <PlatformRow item={item} onPress={() => onPick(item)} />
                )}
                ListEmptyComponent={
                  loading ? (
                  <View style={styles.emptyContainer}>
                    <ActivityIndicator size="large" color={Colors.gray700} />
                  </View>
                ) : (
                  <View style={styles.emptyContainer}>
                    <Text>No platforms found</Text>
                  </View>
                )
                }
                onEndReached={handleLoadMore}
                onEndReachedThreshold={0.5}
              />

          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.25)',
    justifyContent: 'center',
    padding: 20,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },

  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: Colors.gray900,
  },

  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.gray100,
    borderRadius: 10,
    paddingHorizontal: 10,
    height: 44,
    marginBottom: 12,
  },

  sheet: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 20,
    maxHeight: '80%',
  },

  platformItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderColor: Colors.gray200,
  },

  emptyContainer: {
    paddingVertical: 150,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

