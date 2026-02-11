import CreatePageHeader from '@/components/PageHeader';
import { EMAIL_VERIFY_STR } from '@/components/common/data';
import { useCountdown } from '@/context/CountdownContext';
import { StyleSheet, Text, View } from 'react-native';
import { Colors } from '@/components/common/colors';
import SettingRow from '@/components/SettingRow';
import { router } from 'expo-router';
import { useState } from 'react';

export default function SettingsScreen() {
  const [username, setUsername] = useState('Shehab Mohamed');
  const [email, setEmail] = useState('shehab@gmail.com');

  const { finishedCountdown, setCountdown } = useCountdown();

  const updatePass = () => {
    router.push('/(auth)/password-update');
  }

  const sendEmail = () => {
    if(finishedCountdown)
      setCountdown(30);
    router.push({
      pathname: '/(auth)/email-sent',
      params: { email: email, subject: EMAIL_VERIFY_STR }
    });
  }

  const logout = () => {
    router.push('/(auth)/login');
  }

  return (
    <View style={styles.container}>
      <CreatePageHeader />

      <View style={styles.content}>
        {/* Profile */}
        <View style={styles.profile}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{username[0]}</Text>
          </View>

          <Text style={styles.username}>Shehab Mohamed</Text>
          <Text style={styles.email}>{email}</Text>
        </View>

        {/* Section */}
        <Text style={styles.bodyHeader}>Profile</Text>

        <View style={styles.body}>
          <SettingRow label="Update password" onPress={() => updatePass()} />
          <SettingRow label="Verify email" onPress={() => sendEmail()}/>
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

  email: {
    fontSize: 15,
    color: Colors.gray500,
    marginTop: 5,
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
