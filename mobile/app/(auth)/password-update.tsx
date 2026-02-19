import { PASSWORD_UPDATE_STR } from '@/components/common/data';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import SuccessMessage from '@/components/SuccessMessage';
import { Colors } from '@/components/common/colors';
import Ionicons from '@expo/vector-icons/Ionicons';
import PageHeader from '@/components/PageHeader';
import { useAuth } from '@/context/AuthContext';
import React, { useEffect, useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { userApi } from '@/api/user';
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
import { useCountdown } from '@/context/CountdownContext';

export default function PasswordUpdateScreen() {
  const { token } = useLocalSearchParams<{ token: string }>();
  const { user } = useAuth();
  const router = useRouter();

  const { setCountdown } = useCountdown();
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setshowNewPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    console.log(token);
    if(!token) return;
    passwordUpdate();
  }, [token])

  const requestPasswordUpdate  = async () => {
    if (!oldPassword || !newPassword) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setCountdown(30);
    setIsLoading(true);
    try {
      await userApi.requestPasswordUpdate({oldPassword, newPassword});

      router.push({
        pathname: '/email-sent',
        params: {
          fromScreen: '/password-request-update',
          data: [
            oldPassword,
            newPassword
          ],
          email: user?.email,
          subject: PASSWORD_UPDATE_STR
        }
      });
    } catch(error: any) {
      const message = error?.response?.data?.error || 'Something went wrong';
      Alert.alert('Password Request Update Failed!', message);
      setIsLoading(false);
    }
  };

  const passwordUpdate = async () => {
    setIsLoading(true);
    try {
      await userApi.passwordUpdate(token);
      setSuccess(true);
      setIsLoading(false);
      setTimeout(() => router.replace('/(app)/settings'), 1500);
    } catch(error: any) {
      const message = error?.response?.data?.message || error.message;
      Alert.alert(`${token}`, message);
      setIsLoading(false);
    }
  };

  const toggleShowPassword = () => {
    setShowOldPassword(!showOldPassword);
    setshowNewPassword(!showNewPassword);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <PageHeader/>

      { success &&
        <SuccessMessage message='Your passwrod has been updated'/> }

      <View style={styles.content}>
        <Text style={styles.title}>Update your password</Text>

          <View style={styles.inputContainer}>
            <MaterialIcons name="lock" size={24} color="black" />
            <TextInput
              style={styles.input}
              placeholder="Old Password"
              value={oldPassword}
              onChangeText={setOldPassword}
              secureTextEntry={!showOldPassword}
              editable={!isLoading}
            />
            {oldPassword && 
            <Ionicons
                name={showOldPassword? "eye" : "eye-off"}
                size={24}
                color="grey"
                onPress={toggleShowPassword}
            />}
          </View>

          <View style={styles.inputContainer}>
            <MaterialIcons name="lock" size={24} color="black" />
            <TextInput
              style={styles.input}
              placeholder="New Password"
              value={newPassword}
              onChangeText={setNewPassword}
              secureTextEntry={!showNewPassword}
              editable={!isLoading}
            />
            {oldPassword && 
            <Ionicons
                name={showNewPassword? "eye" : "eye-off"}
                size={24}
                color="grey"
                onPress={toggleShowPassword}
            />}
          </View>

          <TouchableOpacity
            style={[styles.button, isLoading && styles.buttonDisabled]}
            onPress={requestPasswordUpdate}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color={Colors.white} />
            ) : (
              <Text style={styles.buttonText}>Update Password</Text>
            )}
          </TouchableOpacity>

        </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.gray100
  },

  content: {
    marginTop: 20,
    flex: 1,
    paddingHorizontal: 24
  },

  title: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 20,
    color: Colors.gray900
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

});
