import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Colors } from '@/components/common/colors';
import Ionicons from '@expo/vector-icons/Ionicons';
import React, { useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
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
import { useAuth } from '@/context/AuthContext';
import SuccessMessage from '@/components/SuccessMessage';

export default function LoginScreen() {
  const params = useLocalSearchParams<{ navSuccessMessage: string }>();
  const router = useRouter();

  const [success, setSuccess] = useState(params?.navSuccessMessage?.length ? true : false);
  const { signin } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setshowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setIsLoading(true);
    try {
      await signin({ email, password });
      router.replace('/(app)/homepage');
    } catch (error: any) {
      Alert.alert('Login Failed', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleShowPassword = () => {
    setshowPassword(!showPassword);
  }

  const handleForgotPassPress = () => {
    router.push('/password-request-reset');
  };

  const handleRegisterPress = () => {
    router.push('/register');
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      { success &&
        <SuccessMessage message={params.navSuccessMessage} onClose={() => setSuccess(false)}/>
      }

      <View style={styles.header}>
        <Text style={styles.headTitle}>PassKey<Text style={styles.plus}>+</Text></Text>
      </View>

      <View style={styles.content}>

        <Text style={styles.title}>Welcome Back</Text>
        <Text style={styles.subtitle}>Sign in to continue</Text>

        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <MaterialIcons name="email" size={24} color="black" />
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

          <View style={styles.inputContainer}>
            <MaterialIcons name="lock" size={24} color="black" />
            <TextInput
              style={styles.input}
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              editable={!isLoading}
            />
            {password && 
            <Ionicons
                name={showPassword? "eye" : "eye-off"}
                size={24}
                color="grey"
                onPress={toggleShowPassword}
            />}
          </View>

          <TouchableOpacity
            style={[styles.button, isLoading && styles.buttonDisabled]}
            onPress={handleLogin}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color={Colors.white} />
            ) : (
              <Text style={styles.buttonText}>Sign In</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity style={styles.forgotPassword} onPress={handleForgotPassPress}>
            <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.forgotPassword} onPress={handleRegisterPress}>
            <Text style={styles.forgotPasswordText}>Don't have an account? <Text style={styles.signUpText}>Sign up</Text>
            </Text>
          </TouchableOpacity>

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
    color: Colors.gray900
  },
  subtitle: {
    fontSize: 16,
    color: Colors.gray500,
    marginBottom: 40,
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
  forgotPassword: {
    marginTop: 16,
    alignItems: 'center',
  },
  forgotPasswordText: {
    color: Colors.gray700,
    fontSize: 14,
  },
  signUpText: {
    textDecorationLine: 'underline',
    fontWeight: 'bold'
  },
  plus: {
    color: 'blue',
  },
});
