import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors } from '@/components/common/colors';
import Svg, { Path } from 'react-native-svg';

export default function PlatformRow({ item, onPress }: any) {
  return (
    <TouchableOpacity style={styles.row} onPress={() => onPress(item)}>
      <View style={styles.iconContainer}>
        <Svg width={20} height={20} viewBox="0 0 24 24" >
          <Path d={item.path} fill={`#${item.color}`} />
        </Svg>
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
