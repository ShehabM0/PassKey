import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Colors } from '@/components/common/colors';
import Svg, { Path } from 'react-native-svg';

type Credential = {
  platformTitle: string;
  platformIcon: string;
  platformColor: string;
  slug?: string;
  email: string;
  password?: string;
  onPress: () => void
};

export default function CredentialCard({ platformTitle, platformIcon, platformColor, email, onPress }: Credential) {
  return (
    <TouchableOpacity onPress={onPress} style={styles.card}>
      <View style={styles.leftColumn}>
        <View style={styles.iconContainer}>
          <Svg width={24} height={24} viewBox="0 0 24 24" >
            <Path d={platformIcon} fill={`#${platformColor}`} />
          </Svg>
        </View>
      </View>

      <View style={styles.rightColumn}>
        <Text style={styles.platformName}>{platformTitle}</Text>
        <Text style={styles.slug}>{email}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    borderRadius: 12,
    paddingVertical: 10,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.gray200
  },
  iconContainer: {
    padding: 5,
    borderRadius: 10,
    backgroundColor: Colors.gray100
  },
  leftColumn: {
    width: '20%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rightColumn: {
    flex: 1,
    justifyContent: 'center'
  },
  platformName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.gray900,
  },
  slug: {
    fontSize: 13,
    color: Colors.gray500,
  },
  infoBlock: {
    marginTop: 6,
  },
  label: {
    fontSize: 12,
    color: Colors.gray500,
  },
  value: {
    fontSize: 14,
    color: Colors.gray900,
  },
});
