import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Colors } from '@/components/common/colors';

export default function PlatformRow({ item, onPress }: any) {
  return (
    <TouchableOpacity style={styles.row} onPress={() => onPress(item)}>
      <View style={styles.iconContainer}>
        <MaterialIcons name={item.icon} size={22} color={Colors.black} />
      </View>

      <Text style={styles.name}>{item.name}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderColor: Colors.gray200,
  },

  iconContainer: {
    width: 36,
    alignItems: 'center',
    marginRight: 10,
  },

  name: {
    fontSize: 16,
    color: Colors.gray900,
  },
});
