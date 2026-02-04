import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useCountdown } from '@/context/CountdownContext';
import { Colors } from '@/components/common/colors';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  ActivityIndicator,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Platform,
  Alert,
  Text,
  View,
} from 'react-native';

export default function RequestPasswordResetScreen() {
  const router = useRouter();

  const { countdown, finishedCountdown, setCountdown } = useCountdown();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handlePasswordReset = async () => {
    if (!email) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setCountdown(30);
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 5000); 

    router.push({
      pathname: '/email-sent',
      params: { email: email }
    });
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.header}>
        <Text style={styles.headTitle}>PassKey<Text style={styles.plus}>+</Text></Text>
      </View>

      <View style={styles.content}>

        <Text style={styles.title}>Restore your account</Text>
        <Text style={styles.subtitle}>Enter the email associated with your account to change your password.</Text>

        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <MaterialIcons style={styles.icon} name="email" size={24} color="black" />
            <TextInput
              style={styles.input}
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              editable={!isLoading}
            />
          </View>

          <TouchableOpacity
            style={[styles.button, (isLoading || !finishedCountdown) && styles.buttonDisabled]}
            onPress={handlePasswordReset}
            disabled={isLoading || !finishedCountdown}
          >
            {isLoading ? (
              <ActivityIndicator color={Colors.white} />
            ) : (
              <Text style={styles.buttonText}>Next</Text>
            )}
          </TouchableOpacity>
          { !finishedCountdown && <Text style={styles.note}>Resend email in {countdown}s</Text> }

        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.gray100
  },
  header: {
    flex: 1,
    paddingTop: Platform.OS === 'ios' ? 48 : 32,
    justifyContent: 'center',
    alignItems: 'center'
  },
  content: {
    flex: 3,
    paddingHorizontal: 24
  },
  headTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    fontStyle: 'italic',
    color: Colors.gray900
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 8,
    color: Colors.gray900,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: Colors.gray500,
    marginBottom: 40,
    textAlign: 'center',
  },
  note: {
    textAlign: 'center',
    marginTop: 5,
    fontSize: 16,
    color: Colors.gray500,
  },
  form: {
    width: '100%',
  },
  input: {
    flex: 1,
    height: '100%',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    height: 50,
    backgroundColor: '#f1f1f1',
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  icon: {
    marginRight: 3
  },
  button: {
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
  plus: {
    color: 'blue',
  },
});
