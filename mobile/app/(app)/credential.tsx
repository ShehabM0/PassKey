import { PlatformDAO, CredentialDAO } from '@/components/common/types';
import CreatePageHeader from '@/components/CreatePageHeader';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import SuccessMessage from '@/components/SuccessMessage';
import CredentialCard from '@/components/CredentialCard';
import { Colors } from '@/components/common/colors';
import { useLocalSearchParams } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import Feather from '@expo/vector-icons/Feather';
import { DATA } from '@/components/common/data';
import { router } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  TextInput,
  Alert,
  Text,
  View,
} from 'react-native';

export default function CreateCredential() {
  const params = useLocalSearchParams<{ name?: string, email?: string; password?: string; }>();

  const credentialPage = (cred: any) => {
    router.push({
      pathname: '/credential',
      params: cred
    });
  }

  const credential: CredentialDAO = {
    email: params.email ?? '',
    password: params.password ?? '',
  };

  const [email, setEmail] = useState(credential.email)
  const [password, setPassword] = useState(credential.password)
  const [showPassword, setshowPassword] = useState(false);

  const [edit, setEdit] = useState(false);
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const onSaveEdit = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setSuccess(true);
    setIsLoading(true);
    setTimeout(() => {
      setSuccess(false);
      setIsLoading(false);
      setEdit(false);
    }, 3000); 
  };

  const onEdit = () => {
    setEdit(true);
  }

  const toggleShowPassword = () => {
    setshowPassword(!showPassword);
  }

  return (
    <View style={styles.container} >
      <CreatePageHeader/>

      { success &&
        <SuccessMessage message='Your credential has been edited'/> }

      <ScrollView style={styles.content}>

        {/* Platform */}
        <View style={styles.platformContainer}>
          <MaterialIcons name='code' size={40} color={Colors.black} style={{marginRight: 10}}/>
          <Text style={styles.title}>{params.name}</Text>
        </View>

        {/* Credential details & form */}
        <View style={styles.form}>

          {/* email */}
          <View style={styles.inputContainer}>
            <MaterialIcons name="email" size={24} color="black" />
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              editable={edit}
            />
            <MaterialIcons name="content-copy" size={24} color="black" />
          </View>

          {/* password */}
          <View style={styles.inputContainer}>
            <MaterialIcons name="lock" size={24} color="black" />
            <TextInput
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              editable={edit}
            />
            <Ionicons
                name={showPassword? "eye" : "eye-off"}
                size={24}
                color="black"
                onPress={toggleShowPassword}
                style={{marginRight: 10}}
            />
            <MaterialIcons name="content-copy" size={24} color="black" />
          </View>

          {/* Buttons */}
          {
            !edit ? (
              <View style={styles.buttonsContainer}>
                <TouchableOpacity
                  style={[styles.button, styles.editButton, isLoading && styles.buttonDisabled]}
                  onPress={onEdit}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <ActivityIndicator color={Colors.white} />
                  ) : (
                    <Text style={styles.buttonText}>Edit</Text>
                  )}
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.button, styles.deleteButton, isLoading && styles.buttonDisabled]}
                  onPress={onEdit}
                  disabled={isLoading}
                >
                  <Feather name="trash" size={18} color="black" />
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity
                style={[styles.button, isLoading && styles.buttonDisabled]}
                onPress={onSaveEdit}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color={Colors.white} />
                ) : (
                  <Text style={styles.buttonText}>Save</Text>
                )}
              </TouchableOpacity>
            )
          }
        </View>

        {/* Horzinotal line */}
        <View style={styles.horzLineContainer}>
          <View style={styles.horzLine}/>
        </View>

        {/* Credetnial history */}
        <View style={styles.credentialsContainer}>
        {
            DATA? (
              DATA.map((item) => (
                <View key={item.id}>
                  <CredentialCard {...item} onPress={() => credentialPage(item)}  />
                </View>
              ))
            ) : (
              <View style={styles.nocredentialsContainer}>
                <Text style={styles.emptyTitle}>No credential history</Text>
                <Text style={styles.emptySubtitle}>
                  Changes to this credential will appear here
                </Text>
              </View>
            )
        }
        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white
  },

  content: {
    flex: 1,
    paddingHorizontal: 24
  },
  
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: Colors.gray900,
  },

  plus: {
    color: 'blue',
  },

  platformContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20
  },

  form: {
    width: '100%',
  },

  input: {
    flex: 1,
    flexDirection: 'row',
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
    backgroundColor: Colors.gray900,
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

  editButton: {
    width: '75%',
  },

  deleteButton: {
    width: '20%',
    backgroundColor: Colors.red
  },

  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },

  horzLineContainer: {
    alignItems: 'center',
    justifyContent: 'center'
  },

  horzLine: {
    backgroundColor: Colors.gray500,
    marginVertical: 20,
    height: 1,
    width: '80%',
  },

  credentialsContainer: {
    marginBottom: 50
  },

  nocredentialsContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20
  },

  emptyTitle: {
    marginTop: 12,
    fontSize: 18,
    fontWeight: '600',
    color: Colors.gray700,
  },

  emptySubtitle: {
    marginTop: 4,
    fontSize: 14,
    color: Colors.gray500,
    textAlign: 'center',
  },
});

