import FontAwesome from '@expo/vector-icons/FontAwesome';
import { DarkTheme, DefaultTheme, ThemeProvider as NavigationThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import {Stack} from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';
import {ThemeProvider} from '@/providers';
import {Appearance, StatusBar, useColorScheme} from 'react-native';
import {SafeAreaProvider} from "react-native-safe-area-context";
import {Provider} from "react-redux";
import {store} from "@/stores";

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: '(tabs)',
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync().catch(console.error);

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync().catch(console.error);
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const isDarkMode = useColorScheme() === 'dark';
  return (
      <Provider store={store}>
        <StatusBar
            barStyle={isDarkMode ? 'light-content' : 'dark-content'}
            backgroundColor="transparent"
            translucent={true}
        />
        <SafeAreaProvider>
          <ThemeProvider>
            <NavigationThemeProvider value={isDarkMode ? DarkTheme : DefaultTheme}>
              <Stack>
                <Stack.Screen name="index" options={{headerShown: false, headerTitle: "Home"}} />
                <Stack.Screen name="coin/[id]" options={{ headerTitle: 'Coin details' }} />
              </Stack>
            </NavigationThemeProvider>
          </ThemeProvider>
        </SafeAreaProvider>
      </Provider>
  );
}
