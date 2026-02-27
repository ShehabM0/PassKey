import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors } from '@/components/common/colors';
import Svg, { Path } from 'react-native-svg';

type Credential = {
  id: string;
  platformTitle: string;
  platformIcon: string;
  platformColor: string;
  email: string;
  updated_at?: string;
  onPress: () => void
};

export default function CredentialCard({ platformTitle, platformIcon, platformColor, email, updated_at, onPress }: Credential) {

  const getRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();

    const diffMs = now.getTime() - date.getTime();

    const seconds = Math.floor(diffMs / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (seconds < 60) return 'just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;

    return date.toLocaleDateString(); // fallback
  };

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
        <Text style={styles.email}>{email}</Text>

        {
          updated_at && (
            <View style={styles.metaRow}>
              <Text style={styles.updatedText}>
                Updated {getRelativeTime(updated_at)}
              </Text>
            </View>
          )
        }
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

  email: {
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

  metaRow: {
    marginTop: 6,
    alignItems: 'flex-start',
  },

  updatedText: {
    fontSize: 11,
    color: Colors.gray300,
    fontWeight: '500',
  },
});
