import { Alert, StyleSheet, Text, View } from 'react-native';
import { EMAIL_VERIFY_STR } from '@/components/common/data';
import { router, useLocalSearchParams } from 'expo-router';
import { useCountdown } from '@/context/CountdownContext';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import SuccessMessage from '@/components/SuccessMessage';
import CreatePageHeader from '@/components/PageHeader';
import PopupMessage from '@/components/PopUpMessage';
import { Colors } from '@/components/common/colors';
import SettingRow from '@/components/SettingRow';
import { useAuth } from '@/context/AuthContext';
import { useEffect, useState } from 'react';
import { authApi } from '@/api/auth';
import { userApi } from '@/api/user';

export default function SettingsScreen() {
  const { token } = useLocalSearchParams<{ token: string }>();
  const { user, refreshUser } = useAuth();

  const [success, setSuccess] = useState(false);
  const [popup, setPopup] = useState(false);

  const { finishedCountdown, setCountdown } = useCountdown();

  useEffect(() => {
    if(token)
      verifyEmail();
  }, [token])

  const updatePass = () => {
    router.push('/(auth)/password-update');
  }

  const verifyEmail = async () => {
    if(user?.email_confirm) {
      setPopup(true);
      setTimeout(() => setPopup(false), 5000); 
      return;
    }

    if(token) {
      try {
        await userApi.emailVerify(token);
        await refreshUser();
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000); 
      } catch(error: any) {
        const message = error?.response?.data?.message || 
        error?.response?.data?.error ||
        error.message;
        Alert.alert('Email Verification Failed!', message);
      }
      return;
    }

    if(finishedCountdown)
      setCountdown(30);
    await userApi.requestEmailVerify();
    router.push({
      pathname: '/(auth)/email-sent',
      params: { 
        fromScreen: '/settings',
        email: user?.email,
        subject: EMAIL_VERIFY_STR
      }
    });
  }

  const logout = async () => {
    await authApi.signout();
    router.push('/(auth)/login');
  }

  return (
    <View style={styles.container}>
      <CreatePageHeader color={Colors.gray100} />

      { success &&
        <SuccessMessage message='Email verified.'/> }

      { popup &&
        <PopupMessage message='Email is already verified.'/> }

      <View style={styles.content}>
        {/* Profile */}
        <View style={styles.profile}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{user?.name? user.name[0] : '?'}</Text>
          </View>

          <Text style={styles.username}>{user?.name}</Text>
          <View style={styles.emailContainer}>
            <Text style={styles.email}>{user?.email}</Text>
            { user?.email_confirm && 
              <FontAwesome name="check-circle" size={15} color="green" style={styles.verifyIcon}/> }
          </View>
        </View>

        {/* Section */}
        <Text style={styles.bodyHeader}>Profile</Text>

        <View style={styles.body}>
          <SettingRow label="Update password" onPress={() => updatePass()} />
          <SettingRow label="Verify email" onPress={() => verifyEmail()}/>
          <SettingRow label="Logout" red onPress={() => logout()}/>
        </View>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.gray100,
  },

  content: {
    flex: 1,
    paddingHorizontal: 24,
  },

  profile: {
    alignItems: 'center',
    marginVertical: 24,
  },

  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: Colors.gray900,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },

  avatarText: {
    color: Colors.white,
    fontSize: 28,
    fontWeight: 'bold',
  },

  username: {
    fontSize: 24,
    fontWeight: 'bold',
  },

  emailContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 5,
  },

  email: {
    fontSize: 15,
    color: Colors.gray500,
  },

  verifyIcon: {
    marginLeft: 5,
  },

  bodyHeader: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },

  body: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    overflow: 'hidden',
  },
});
