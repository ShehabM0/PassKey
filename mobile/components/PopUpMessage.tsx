import { StyleSheet, Text, View } from 'react-native';
import { SuccessMessageProps } from '../types';
import { Colors } from './common/colors';
import { useEffect } from 'react';

export default function PopupMessage({ message, onClose }: SuccessMessageProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
        <Text style={styles.text}>{message}</Text>
    </View>
  )
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: '10%',
    zIndex: 1,
    backgroundColor: Colors.gray700,
    borderRadius: 20,
    padding: 10,
    alignSelf: 'center',
  },

  text: {
    color: 'white',
  }
});