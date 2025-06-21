import { useTheme } from '@/hooks';
import { StatusBar, StyleSheet, Text, View } from 'react-native';
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider as NavigationThemeProvider,
} from '@react-navigation/native';
import React, { PropsWithChildren, useMemo } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import { ThemedToast } from '@/components/Toast';

export function ThemedProviders({ children }: PropsWithChildren) {
  const { themeName } = useTheme();

  const isDarkMode = useMemo(() => themeName === 'dark', [themeName]);

  return (
    <>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor="transparent"
        translucent={true}
      />
      <SafeAreaProvider>
        <NavigationThemeProvider value={isDarkMode ? DarkTheme : DefaultTheme}>
          {children}
        </NavigationThemeProvider>
      </SafeAreaProvider>
      <ThemedToast />
    </>
  );
}
