import { GET_CREDENTIAL_PASSWORD } from '@/api/graphql/queries';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { GetCredentialPasswordData } from '@/types/graphql';
import { Colors } from '@/components/common/colors';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useQuery } from '@apollo/client/react';
import { userApi } from '@/api/rest/user';
import { useState } from 'react';
import {
  ActivityIndicator,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  View,
  Text,
  Modal,
  Alert,
} from 'react-native';

export default function PasswordPIN({ credentialId, onClose, setVerification, setPassword }: any) {
  const [pin, setPin] = useState('');

  const { data, loading } = useQuery<GetCredentialPasswordData>
    (
      GET_CREDENTIAL_PASSWORD,
      {
        variables: { id: credentialId },
      }
    );
  
  const password = data?.revealCredentialPassword;

  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setshowPassword] = useState(false);

  const toggleShowPassword = () => {
    setshowPassword(!showPassword);
  }

  const handleSubmit = async () => {
    if (!pin) {
      Alert.alert('Error', 'Please enter password');
      return;
    }

    setIsLoading(true);
    try {
      await userApi.passwordVerify(pin);
      if(!loading) {
        setPassword(password);
        setVerification(true);
        setIsLoading(false);
      }
    } catch (error: any) {
      const message = error?.response?.data?.message || 
      error?.response?.data?.error ||
      error.message;
      Alert.alert('Password Verification Failed!', message);
      setIsLoading(false);
    }
  };

  return (
    <Modal visible={true} transparent animationType="slide">
      <TouchableOpacity activeOpacity={1} onPress={()=> onClose()} style={styles.overlay}>
        <TouchableOpacity activeOpacity={1} style={styles.sheet}>

          <Text style={styles.title}>Account verification</Text>
          <Text style={styles.subtitle}>Enter account password</Text>

          {/* Password */}
          <View style={styles.inputContainer}>
            <MaterialIcons name="lock" size={24} color="black" />
            <TextInput
              style={styles.input}
              placeholder="Password"
              value={pin}
              onChangeText={setPin}
              secureTextEntry={!showPassword}
              editable={!isLoading}
              autoFocus
            />
            {pin && 
            <Ionicons
              name={showPassword? "eye" : "eye-off"}
              size={24}
              color="grey"
              onPress={toggleShowPassword}
            />}
          </View>

          <TouchableOpacity
            style={[styles.button, isLoading && styles.buttonDisabled]}
            onPress={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color={Colors.white} />
            ) : (
              <Text style={styles.buttonText}>Submit</Text>
            )}
          </TouchableOpacity>

        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.25)',
    justifyContent: 'center',
    padding: 20,
  },

  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: Colors.gray900,
    textAlign: 'center',
  },

  subtitle: {
    fontSize: 15,
    color: Colors.gray500,
    textAlign: 'center',
  },

  sheet: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 20,
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
    marginVertical: 20,
  },

  button: {
    backgroundColor: Colors.black,
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
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


