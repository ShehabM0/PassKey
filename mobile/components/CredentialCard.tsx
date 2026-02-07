import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '@/components/common/colors';

type Credential = {
  name: string;
  slug?: string;
  email: string;
  password?: string;
};

export default function CredentialCard({ name, email }: Credential) {
  return (
    <View style={styles.card}>
      <View style={styles.leftColumn}>
        <View style={styles.iconContainer}>
          <MaterialIcons name="facebook" size={40} color={'blue'} />
        </View>
      </View>

      <View style={styles.rightColumn}>
        <Text style={styles.platformName}>{name}</Text>
        <Text style={styles.slug}>{email}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: Colors.gray100,
    borderRadius: 12,
    paddingVertical: 10,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.gray200
  },
  iconContainer: {
    padding: 5,
    borderRadius: 10,
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
    marginBottom: 10,
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
