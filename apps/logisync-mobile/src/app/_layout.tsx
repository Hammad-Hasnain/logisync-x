import '../services/backgroundTask';

import { DarkTheme, DefaultTheme, ThemeProvider, Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useColorScheme } from 'react-native';

import { AnimatedSplashOverlay } from '@/components/animated-icon';
// import AppTabs from '@/components/app-tabs';

SplashScreen.preventAutoHideAsync();

export default function TabLayout() {
  const colorScheme = useColorScheme();
  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <AnimatedSplashOverlay />
      <Stack screenOptions={{ headerShown: false }}>
        {/* 1. Main App Base (Your dashboard & general content setup) */}
        <Stack.Screen name="index" />

        {/* 2. Login Gateway Node */}
        <Stack.Screen name="login" />

        {/* 3. New Order Detail Gateway - Loads full screen right over everything else */}
        <Stack.Screen
          name="orders/[id]"
          options={{
            animation: 'slide_from_right' // Clean, modern sliding transition effect
          }}
        />
      </Stack>
      {/* <AppTabs /> */}
    </ThemeProvider>
  );
}
