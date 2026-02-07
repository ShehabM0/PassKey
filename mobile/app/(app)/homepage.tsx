import { FlatList, View, Text, StyleSheet } from 'react-native';
import CredentialCard from '@/components/CredentialCard';
import { Colors } from '@/components/common/colors';
import HomeHeader from '@/components/HomeHeader';

const DATA = [
  {
    id: '1',
    name: 'GitHub',
    slug: 'github.com',
    email: 'user@gmail.com',
    password: '••••••••',
  },
  {
    id: '2',
    name: 'Notion',
    slug: 'notion.so',
    email: 'work@mail.com',
    password: '••••••••',
  },
  {
    id: '3',
    name: 'Notion',
    slug: 'notion.so',
    email: 'work@mail.com',
    password: '••••••••',
  },
  {
    id: '4',
    name: 'Notion',
    slug: 'notion.so',
    email: 'work@mail.com',
    password: '••••••••',
  },
  {
    id: '5',
    name: 'Notion',
    slug: 'notion.so',
    email: 'work@mail.com',
    password: '••••••••',
  },
  {
    id: '6',
    name: 'Notion',
    slug: 'notion.so',
    email: 'work@mail.com',
    password: '••••••••',
  },
  {
    id: '7',
    name: 'Notion',
    slug: 'notion.so',
    email: 'work@mail.com',
    password: '••••••••',
  },
  {
    id: '8',
    name: 'Notion',
    slug: 'notion.so',
    email: 'work@mail.com',
    password: '••••••••',
  },
  {
    id: '9',
    name: 'Notion',
    slug: 'notion.so',
    email: 'work@mail.com',
    password: '••••••••',
  },
  {
    id: '10',
    name: 'Notion',
    slug: 'notion.so',
    email: 'work@mail.com',
    password: '••••••••',
  },
  {
    id: '11',
    name: 'Notion',
    slug: 'notion.so',
    email: 'work@mail.com',
    password: '••••••••',
  },
  {
    id: '12',
    name: 'Notion',
    slug: 'notion.so',
    email: 'work@mail.com',
    password: '••••••••',
  },
  {
    id: '13',
    name: 'Github',
    slug: 'notion.so',
    email: 'work@mail.com',
    password: '••••••••',
  },
];

export default function HomeScreen() {
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
              <CredentialCard {...item} />
            )}
          />
        </View>
      </View>
  );
}

const styles = StyleSheet.create({
  bodyContainer: {
    backgroundColor: Colors.white
  },

  textBody: {
    fontSize: 25,
    fontWeight: 'bold',
    marginBottom: 12,
    color: Colors.gray900,
  },
});
