import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import SuccessMessage from '@/components/SuccessMessage';
import CreatePageHeader from '@/components/PageHeader';
import PasswordPIN from '@/components/PopUpPassword';
import PopupMessage from '@/components/PopUpMessage';
import { Colors } from '@/components/common/colors';
import {  useLocalSearchParams } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import Feather from '@expo/vector-icons/Feather';
import Svg, { Path } from 'react-native-svg';
import { useEffect, useState } from 'react';
import * as Clipboard from 'expo-clipboard';
import { CredentialDAO } from '@/types';
import {
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  TextInput,
  Text,
  View,
} from 'react-native';

export default function CredentialPage() {
  const params = useLocalSearchParams<{
    id: string,
    platformIcon: string,
    platformTitle: string,
    platformColor: string,
    email: string;
    created_at: string;
    updated_at: string;
  }>();

  const credential: CredentialDAO = {
    email: params.email ?? '',
    password: '•••••••••••'
  };

  const [email, setEmail] = useState(credential.email)
  const [password, setPassword] = useState(credential.password)
  const [showPassword, setshowPassword] = useState(false);

  const [PIN, setPIN] = useState(false);
  const [verify, setVerification] = useState(false);

  const [popup, setPopup] = useState(false);
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if(verify)
      showPIN(false);
  }, [verify]);

  const onCopy = async (text: string) => {
    await Clipboard.setStringAsync(text);
    setPopup(true);
    setTimeout(() => setPopup(false), 5000); 
  }

  const onCopyEmail = () => {
    onCopy(email);
  }

  const onCopyPassword = () => {
    if(verify)
      onCopy(password);
    else
      showPIN(true);
  }

  const showPIN = (flag: boolean) => {
    setPIN(flag);
  }

  const toggleShowPassword = () => {
    if(showPassword)
      setshowPassword(false);
    else
      if(verify)
        setshowPassword(true);
      else
        showPIN(true);
  }

  const formatDate = (iso?: string) => {
    if (!iso) return '';

    return new Date(iso).toLocaleString(undefined, {
      dateStyle: 'medium',
      timeStyle: 'short',
    });
  };

  return (
    <View style={styles.container} >
      <CreatePageHeader color={Colors.white} />

      { success &&
        <SuccessMessage message='Your credential has been deleted'/> }

      { popup &&
        <PopupMessage message='Copied to clipboard.'/> }

      { PIN &&
        <PasswordPIN credentialId={params.id} onClose={showPIN} setVerification={setVerification} setPassword={setPassword}/>
      }
      
      <ScrollView style={styles.content}>

        {/* Platform */}
        <View style={styles.platformContainer}>
          <View style={styles.iconContainer}>
            <Svg width={30} height={30} viewBox="0 0 24 24" >
              <Path d={params.platformIcon} fill={`#${params.platformColor}`} />
            </Svg>
          </View>
          <Text style={styles.title}>{params.platformTitle}</Text>
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
              editable={false}
            />
            <MaterialIcons name="content-copy" size={24} color="black" onPress={onCopyEmail} />
          </View>

          {/* password */}
          <View style={styles.inputContainer}>
            <MaterialIcons name="lock" size={24} color="black" />
            <TextInput
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              editable={false}
            />
            <Ionicons
                name={showPassword? "eye" : "eye-off"}
                size={24}
                color="black"
                onPress={toggleShowPassword}
                style={{marginRight: 10}}
            />
            <MaterialIcons name="content-copy" size={24} color="black" onPress={onCopyPassword} />
          </View>

          {/* Buttons */}
          <View>
            <TouchableOpacity
              style={[styles.button, styles.deleteButton, isLoading && styles.buttonDisabled]}
              disabled={isLoading}
            >
              <Feather name="trash" size={18} color="black" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Timestamps */}
        <View style={styles.metaCard}>
          <View style={styles.metaRow}>
            <MaterialIcons name="schedule" size={18} color={Colors.gray500} />
            <View style={styles.metaTextContainer}>
              <Text style={styles.metaLabel}>Created</Text>
              <Text style={styles.metaValue}>{formatDate(params.created_at)}</Text>
            </View>
          </View>

          <View style={styles.metaDivider} />

          <View style={styles.metaRow}>
            <MaterialIcons name="update" size={18} color={Colors.gray500} />
            <View style={styles.metaTextContainer}>
              <Text style={styles.metaLabel}>Last updated</Text>
              <Text style={styles.metaValue}>{formatDate(params.updated_at)}</Text>
            </View>
          </View>
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

  iconContainer: {
    marginRight: 15,
    justifyContent: 'center',
    alignItems: 'center'
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
  },

  buttonDisabled: {
    backgroundColor: Colors.gray300
  },

  buttonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '600',
  },

  deleteButton: {
    backgroundColor: Colors.red
  },

  metaCard: {
    backgroundColor: Colors.gray100,
    borderRadius: 12,
    padding: 14,
    marginTop: 20,
  },

  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  metaTextContainer: {
    marginLeft: 10,
  },

  metaLabel: {
    fontSize: 12,
    color: Colors.gray500,
    fontWeight: '500',
  },

  metaValue: {
    fontSize: 14,
    color: Colors.gray900,
    fontWeight: '600',
  },

  metaDivider: {
    height: 1,
    backgroundColor: Colors.gray200,
    marginVertical: 10,
  },
});
