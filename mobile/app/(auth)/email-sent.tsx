import { Colors } from '@/components/common/colors';
import { useLocalSearchParams } from 'expo-router';
import Entypo from '@expo/vector-icons/Entypo';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    TouchableOpacity,
    StyleSheet,
    Platform,
    Text,
    View
} from 'react-native';

export default function EmailSentScreen() {
  const [isLoading, setIsLoading] = useState(false);
  const { email } = useLocalSearchParams();

  const handlePasswordReset = async () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 5000); 
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headTitle}>PassKey<Text style={styles.plus}>+</Text></Text>
      </View>

      <View style={styles.content}>
        <Entypo name="mail-with-circle" size={35} color="black" />

        <Text style={styles.title}>Check your email</Text>
        <Text style={styles.subtitle}>Your'e almost there! we sent an email to <Text style={{fontWeight: 'bold'}}> {email} </Text></Text>

        <Text style={styles.subtitle}>Just click on the link in that email to reset your password. if you don't see it, you may need to <Text style={{fontWeight: 'bold'}}>check your spam folder.</Text></Text>

        <Text style={styles.subtitle}> Still can't find the email? No Problem.</Text>

        <TouchableOpacity
          style={[styles.button, isLoading && styles.buttonDisabled]}
          onPress={handlePasswordReset}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color={Colors.white} />
          ) : (
            <Text style={styles.buttonText}>Resend Email</Text>
          )}
        </TouchableOpacity>

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.gray100
  },
  header: {
    margin: 100,
    paddingTop: Platform.OS === 'ios' ? 48 : 32,
    justifyContent: 'center',
    alignItems: 'center'
  },
  content: {
    justifyContent: 'center',
    alignItems: 'center',
    margin: 20
  },
  headTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    fontStyle: 'italic',
    color: Colors.gray900
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 8,
    color: Colors.gray900,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
  },
  plus: {
    color: 'blue',
  },
  button: {
    width: '100%',
    backgroundColor: Colors.black,
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonDisabled: {
    backgroundColor: Colors.gray300
  },
  buttonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
});
