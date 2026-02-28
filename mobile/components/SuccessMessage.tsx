import { Modal, StyleSheet, Text, View } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Colors } from '@/components/common/colors';
import { SuccessMessageProps } from '../types';
import React, { useEffect } from 'react';

export default function SuccessMessage({ message, onClose }: SuccessMessageProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Modal transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.toast}>
          <View style={styles.iconContainer}>
            <FontAwesome name="check" size={16} color="#fff" />
          </View>

          <Text style={styles.message} numberOfLines={2}>
            {message}
          </Text>
        </View>
      </View>
    </Modal>
  );
}
const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 80,
  },

  toast: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.green100,
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderRadius: 16,
    minWidth: '85%',
    elevation: 6,
  },

  iconContainer: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#22C55E',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },

  message: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: Colors.gray900,
  },
});