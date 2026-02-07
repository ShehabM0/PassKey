import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Colors } from '@/components/common/colors';
import { router } from 'expo-router';
import { useState } from 'react';

export default function HomeHeader() {
  const [query, setQuery] = useState('');

  const createCredentialNav = () => {
    router.push('/create-credential')
  }

  return (
    <View style={styles.container}>
      
      <View style={styles.topBar}>
        <TouchableOpacity>
          <MaterialIcons name="settings" size={24} color={Colors.black} />
        </TouchableOpacity>

        <Text style={styles.title}>PassKey<Text style={styles.plus}>+</Text></Text>

        <TouchableOpacity onPress={createCredentialNav}>
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
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 16,
  },

  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },

  title: {
    fontSize: 22,
    fontWeight: 'bold',
    fontStyle: 'italic',
    letterSpacing: 1,
    color: Colors.black,
  },

  plus: {
    color: 'blue'
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