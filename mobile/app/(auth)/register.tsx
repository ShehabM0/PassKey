import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Colors } from '@/components/common/colors';
import Ionicons from '@expo/vector-icons/Ionicons';
import React, { useState } from 'react';
import { useRouter } from 'expo-router';
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
import SuccessMessage from '@/components/SuccessMessage';
import { useAuth } from '@/context/AuthContext';

export default function RegisterScreen() {
  const { signup } = useAuth();
  const router = useRouter();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [showPassword, setshowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleRegister = async () => {
    if (!name || !email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setIsLoading(true);
    try {
      await signup({name, email, password})

      setSuccess(true);
      setIsLoading(false);
      setTimeout(() => router.replace('/(auth)/login'), 1500);
    } catch(error: any) {
      Alert.alert('Register Failed', error.message);
      setIsLoading(false);
    }
  };

  const toggleShowPassword = () => {
    setshowPassword(!showPassword);
  }

  const handleLoginPress = () => {
    router.push({ pathname: '/login' });
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      {
        success &&
        <SuccessMessage message='Your account has been created'/>
      }
      <View style={styles.header}>
        <Text style={styles.headTitle}>PassKey<Text style={styles.plus}>+</Text></Text>
      </View>

      <View style={styles.content}>

        <Text style={styles.title}>Create your account</Text>
        <Text style={styles.subtitle}>Sign up to continue</Text>

        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <MaterialIcons style={styles.icon} name="person" size={24} color="black" />
            <TextInput
              style={styles.input}
              placeholder="Username"
              value={name}
              onChangeText={setName}
              autoCapitalize="words"
              editable={!isLoading}
            />
          </View>

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

          <View style={styles.inputContainer}>
            <MaterialIcons style={styles.icon} name="lock" size={24} color="black" />
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
            onPress={handleRegister}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color={Colors.white} />
            ) : (
              <Text style={styles.buttonText}>Sign Up</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity style={styles.forgotPassword} onPress={handleLoginPress}>
            <Text style={styles.forgotPasswordText}>Already have an account? <Text style={styles.signUpText}>Sign in</Text>
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
