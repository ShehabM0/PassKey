import { useCountdown } from '@/context/CountdownContext';
import { Colors } from '@/components/common/colors';
import { useLocalSearchParams } from 'expo-router';
import React, { useState, useEffect } from 'react';
import Entypo from '@expo/vector-icons/Entypo';
import { authApi } from '@/api/auth';
import { userApi } from '@/api/user';
import {
    ActivityIndicator,
    TouchableOpacity,
    StyleSheet,
    Platform,
    Text,
    View,
    Alert
} from 'react-native';

export default function EmailSentScreen() {
  const { countdown, finishedCountdown, setCountdown } = useCountdown();
  const [isLoading, setIsLoading] = useState(false);
  const { fromScreen, data, email, subject } = useLocalSearchParams();
    
  const handlePasswordReset = async () => {
    setIsLoading(true);
    setCountdown(30);
    if(fromScreen === '/password-request-reset') {
      try {
        await authApi.requestPasswordReset(String(email));
      } catch (error: any) {
        Alert.alert('Password Reset Failed!', error.message);
      } finally {
        setIsLoading(false)
      }
    } else if(fromScreen === '/password-request-update') {
      const oldPassword = data[0];
      const newPassword = data[1];
      try {
        await userApi.requestPasswordUpdate({oldPassword, newPassword});
      } catch (error: any) {
        Alert.alert('Password Update Failed!', error.message);
      } finally {
        setIsLoading(false)
      }
    } else if(fromScreen === '/settings') {
      try {
        await authApi.requestPasswordReset(String(email));
      } catch (error: any) {
        Alert.alert('Email Verification Failed!', error.message);
      } finally {
        setIsLoading(false)
      }
    }
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

        <Text style={styles.subtitle}>Just click on the link in that email to {subject}. if you don't see it, you may need to <Text style={{fontWeight: 'bold'}}>check your spam folder.</Text></Text>

        <Text style={styles.subtitle}> Still can't find the email? No Problem.</Text>

        <TouchableOpacity
          style={[styles.button, (isLoading || !finishedCountdown) && styles.buttonDisabled]}
          onPress={handlePasswordReset}
          disabled={isLoading || !finishedCountdown}
        >
          {isLoading ? (
            <ActivityIndicator color={Colors.white} />
          ) : (
            <Text style={styles.buttonText}>Resend Email</Text>
          )}
        </TouchableOpacity>
        { !finishedCountdown && <Text style={styles.note}>Resend email in {countdown}s</Text> }

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
  note: {
    marginTop: 5,
    fontSize: 16,
    color: Colors.gray500,
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
