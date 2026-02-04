import { Image, StyleSheet, Text, View } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import React from 'react';

interface SuccessMessageProps {
  message?: string;
}

export default function SuccessMessage({ message }: SuccessMessageProps) {
  return (
    <>
    <View style={styles.layout}/>
    <View style={styles.centered}>
      <View style={styles.messageCont}>
        <FontAwesome name="check-circle" size={40} color="green" />
        {
          message && 
          <Text style={styles.message}>
            {message}
          </Text>
        }
        {
          !message &&
          <Text style={styles.message}>
            Your request has been done
          </Text>
        }
        <Text style={styles.successMessage}>Successfully</Text>
      </View>
    </View>
    </>
  );
}

const styles = StyleSheet.create({
  layout: {
    position: 'absolute',
    zIndex: 1,
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: "rgba(0, 0, 0, 0.6)",
  },
  centered: {
    position: "absolute",
    zIndex: 1,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 20,
  },
  messageCont: {
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    borderRadius: 15,
  },
  message: {
    fontSize: 18,
    marginTop: 15,
    textAlign: 'center',
  },
  successMessage: {
    fontSize: 18,
    color: 'green',
    fontWeight: 'bold',
  }
});