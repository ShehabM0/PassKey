import { FlatList, View, Text, StyleSheet } from 'react-native';
import CredentialCard from '@/components/CredentialCard';
import { Colors } from '@/components/common/colors';
import HomeHeader from '@/components/HomeHeader';
import { DATA } from '@/components/common/data';
import { useRouter } from 'expo-router';

export default function HomeScreen() {
  const router = useRouter();

  const credentialPage = (cred: any) => {
    router.push({
      pathname: '/credential',
      params: cred
    });
  }

  return (
      <View style={{flex: 1}}>
        <HomeHeader/>
        <View style={styles.bodyContainer}>
          <FlatList
            data={DATA}
            ListHeaderComponent={
              <Text style={styles.textBody}>Your vaults</Text>
            }
            ListEmptyComponent={
              <View style={styles.nocredentialsContainer}>
                <Text style={styles.emptyTitle}>No vaults yet</Text>
                <Text style={styles.emptySubtitle}>
                  Added credentials will appear here
                </Text>
              </View>
            }
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ padding: 20 }}
            renderItem={({ item }) => (
              <CredentialCard {...item} onPress={() => credentialPage(item)}  />
            )}
          />
        </View>
      </View>
  );
}

const styles = StyleSheet.create({
  bodyContainer: {
    flex: DATA.length === 0 ? 1 : 0,
    backgroundColor: Colors.gray100,
    marginBottom: 150,
  },

  textBody: {
    fontSize: 25,
    fontWeight: 'bold',
    marginBottom: 12,
    color: Colors.gray900,
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
