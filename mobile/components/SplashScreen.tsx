import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Colors } from './common/colors';
import {
  ActivityIndicator,
  StyleSheet,
  View,
  Text,
} from 'react-native';

export default function SplashScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.logoBlock} >
        <View style={styles.iconContainer}>
          <MaterialCommunityIcons name="shield-key-outline" size={50} color="white" />
        </View>

        <Text style={styles.appName}>Passkey<Text style={styles.plus}>+</Text></Text>
      </View>

      <View style={styles.loaderContainer}>
        <ActivityIndicator size={30} color={Colors.gray700} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.gray100
  },

  logoBlock: {
    alignItems: 'center',
  },

  iconContainer: {
    width: 96,
    height: 96,
    borderRadius: 28,
    backgroundColor: Colors.black,
    justifyContent: 'center',
    alignItems: 'center',
  },

  appName: {
    fontSize: 36,
    fontWeight: '700',
    color: Colors.black,
    fontStyle: 'italic' 
  },

  plus: {
    color: 'blue'
  },

  loaderContainer: {
    position: 'absolute',
    bottom: 80,
    alignItems: 'center',
  },
});