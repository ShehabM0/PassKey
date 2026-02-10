import CreatePageHeader from '@/components/PageHeader';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import SuccessMessage from '@/components/SuccessMessage';
import PlatfromPicker from '@/components/PlatformPicker';
import { Colors } from '@/components/common/colors';
import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { useState } from 'react';
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

interface PlatformDAO{
  name: string;
  icon: string;
}

export default function CreateCredential() {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setshowPassword] = useState(false);

  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [platform, setPlatform] = useState<PlatformDAO>();
  const [platfromPicker, setPlatformPicker] = useState(false);

  const handleSubmit = async () => {
    console.log(platform);

    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setSuccess(true);
    setIsLoading(true);
    setTimeout(() => {
      setSuccess(false);
      setIsLoading(false);
      router.back();
    }, 3000); 
  };

  const toggleShowPassword = () => {
    setshowPassword(!showPassword);
  }

  const openPlatformPicker = () => {
    setPlatformPicker(true);
  }

  const closePlatformPicker = () => {
    setPlatformPicker(false);
  }

  const platformSelect = (platform: any) => {
    setPlatform(platform);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <CreatePageHeader/>

      { success &&
        <SuccessMessage message='Your credential has been added'/> }

      { platfromPicker &&
        <PlatfromPicker onClose={closePlatformPicker} onSelect={platformSelect}/> }

      <View style={styles.content}>

        <Text style={styles.title}>Add a new credential</Text>

        <View style={styles.form}>
          { platform ? (
              <TouchableOpacity style={styles.platformInputContainer} onPress={openPlatformPicker} disabled={isLoading}>
                <MaterialIcons name={platform.icon} size={30} color={Colors.black} />
                <Text style={styles.platformInputText}>{platform.name}</Text>
                <MaterialIcons name="edit" size={18} color={Colors.black} />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity style={styles.platformInputContainer} onPress={openPlatformPicker} disabled={isLoading}>
                <Text style={styles.selectPlatformInputText}>Select Platform</Text>
                <Ionicons name="arrow-forward" size={24} color="black" />
              </TouchableOpacity>
            )
          }

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
            onPress={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color={Colors.white} />
            ) : (
              <Text style={styles.buttonText}>Add</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white
  },
  content: {
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
    marginBottom: 20,
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
    flexDirection: 'row',
  },
  platformInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    height: 50,
    backgroundColor: '#f1f1f1',
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  platformInputText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: Colors.gray900,
    marginLeft: 5,
  },
  selectPlatformInputText: {
    fontWeight: '500',
    color: Colors.gray700
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


