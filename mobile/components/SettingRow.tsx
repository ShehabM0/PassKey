import { TouchableOpacity, StyleSheet, Text } from 'react-native';
import { Colors } from '@/components/common/colors';
import { Ionicons } from '@expo/vector-icons';

export default function SettingRow({ label, red, onPress }: any) {
  return (
    <TouchableOpacity style={styles.rowContainer} onPress={() => onPress()}>
      <Text style={[styles.rowText, red && { color: Colors.red }]}>
        {label}
      </Text>

      <Ionicons name="chevron-forward" size={18} color={Colors.gray300} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  rowContainer: {
    padding: 15,
    borderBottomWidth: 1,
    borderColor: Colors.gray200,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  rowText: {
    fontSize: 16,
    fontWeight: 'bold'
  },
});
