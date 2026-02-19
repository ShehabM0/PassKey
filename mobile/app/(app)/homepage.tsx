import { FlatList, View, Text, StyleSheet } from 'react-native';
import CredentialCard from '@/components/CredentialCard';
import { Colors } from '@/components/common/colors';
import HomeHeader from '@/components/HomeHeader';
import { DATA } from '@/components/common/data';
import { useRouter } from 'expo-router';

export default function HomeScreen() {
  const router = useRouter();

  console.log("AAAAAAAAAAAAAAA")
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
    backgroundColor: Colors.white,
    marginBottom: 200,
  },

  textBody: {
    fontSize: 25,
    fontWeight: 'bold',
    marginBottom: 12,
    color: Colors.gray900,
  },
});
