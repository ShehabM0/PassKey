import { View, TextInput, Text, TouchableOpacity, StyleSheet, Modal, FlatList, } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Colors } from '@/components/common/colors';
import PlatformRow from './PlatformRow';
import { useState } from 'react';

const PLATFORMS = [
  { id: 'github', name: 'GitHub', icon: 'code' },
  { id: 'google', name: 'Google', icon: 'public' },
  { id: 'notion', name: 'Notion', icon: 'edit' },
  { id: 'facebook', name: 'Facebook', icon: 'facebook' },
  { id: 'apple', name: 'Apple', icon: 'thumb-up' },
];

export default function PlatfromPicker({onClose, onSelect}: any) {
  const [query, setQuery] = useState('');

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
              data={PLATFORMS}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <PlatformRow item={item} onPress={() => onPick(item)} />
              )}
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

});

