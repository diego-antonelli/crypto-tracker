import { StyleSheet, Text, View } from 'react-native';
import Toast from 'react-native-toast-message';
import React from 'react';
import { useTheme } from '@/hooks';

export function ThemedToast() {
  const { theme } = useTheme();

  return (
    <Toast
      config={{
        error: ({ text1, text2 }) => (
          <View style={[styles.toastContainer, { backgroundColor: theme.error }]}>
            <Text style={styles.toastTitle}>{text1}</Text>
            {text2 ? <Text style={styles.toastMessage}>{text2}</Text> : null}
          </View>
        ),
        success: ({ text1, text2 }) => (
          <View style={[styles.toastContainer, { backgroundColor: theme.success }]}>
            <Text style={styles.toastTitle}>{text1}</Text>
            {text2 ? <Text style={styles.toastMessage}>{text2}</Text> : null}
          </View>
        ),
      }}
    />
  );
}

const styles = StyleSheet.create({
  toastContainer: {
    flex: 1,
    padding: 12,
    borderRadius: 10,
    marginTop: 16,
  },
  toastTitle: { color: '#fff', fontWeight: 'bold' },
  toastMessage: { color: '#fff', opacity: 0.9 },
});
