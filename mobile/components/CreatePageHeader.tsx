import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Colors } from '@/components/common/colors';
import { router } from 'expo-router';

export default function CreatePageHeader() {
  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
          <TouchableOpacity onPress={()=> { router.back() }}>
            <MaterialIcons name="arrow-back" size={24} color={Colors.black} />
          </TouchableOpacity>

          <Text style={styles.title}>PassKey<Text style={styles.plus}>+</Text></Text>

          <View/>
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
    justifyContent: 'space-between',
    alignItems: 'center',
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
});