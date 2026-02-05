import { FlatList, View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import CredentialCard from '@/components/CredentialCard';
import { Colors } from '@/components/common/colors';
import { useState } from 'react';

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
];


export default function HomeScreen() {
  const [query, setQuery] = useState('');

  return (
    <View style={styles.container}>
      
      <View style={styles.topBar}>
        <TouchableOpacity>
          <MaterialIcons name="settings" size={24} color={Colors.black} />
        </TouchableOpacity>

        <Text style={styles.title}>PassKey<Text style={styles.plus}>+</Text></Text>

        <TouchableOpacity>
          <MaterialIcons name="add-circle" size={28} color={Colors.black} />
        </TouchableOpacity>
      </View>

      <View style={styles.searchRow}>
        <View style={styles.searchBar}>
          <MaterialIcons name="search" size={20} color={Colors.gray500} />

          <TextInput
            style={styles.input}
            placeholder="Search"
            value={query}
            onChangeText={setQuery}
            placeholderTextColor={Colors.gray500}
          />

          {
            query.length > 0 && 
            (
              <TouchableOpacity onPress={() => setQuery('')}>
                <MaterialIcons name="cancel" size={20} color={Colors.gray700} />
              </TouchableOpacity>
            )
          }
        </View>

        <TouchableOpacity style={styles.filterButton}>
          <MaterialIcons name="filter-list" size={24} color={Colors.black} />
        </TouchableOpacity>
      </View>

      <Text style={styles.textBody}>Your accounts</Text>

      <View style={styles.bodyConatiner}>
        <FlatList
          data={DATA}
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
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  bodyConatiner: {
    marginTop: 10,
    backgroundColor: Colors.gray100,
    borderRadius: 10,
    height: '75%',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  title: {
    fontWeight: 'bold',
    fontStyle: 'italic',
    letterSpacing: 1,
    fontSize: 25,
    color: Colors.black,
  },
  plus: {
    color: 'blue',
  },
  textBody: {
    fontSize: 25,
    fontWeight: 'bold',
    margin: 5,
    color: Colors.gray900
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.gray100,
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 44,
  },
  input: {
    flex: 1,
    marginHorizontal: 8,
    color: Colors.black,
  },
  filterButton: {
    marginLeft: 12,
  },
});
