import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { BlurView } from 'expo-blur';
import { View, Text } from 'react-native';

import '../global.css';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded, error] = useFonts({
    'SpaceGrotesk-Regular': require('../assets/fonts/SpaceGrotesk-Regular.ttf'),
    'SpaceGrotesk-Bold': require('../assets/fonts/SpaceGrotesk-Bold.ttf'),
    'SpaceGrotesk-Medium': require('../assets/fonts/SpaceGrotesk-Medium.ttf'),
    'SpaceGrotesk-SemiBold': require('../assets/fonts/SpaceGrotesk-SemiBold.ttf'),
  });

  useEffect(() => {
    if (fontsLoaded || error) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, error]);

  if (!fontsLoaded && !error) {
    return null; // or a loading spinner
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <Stack
          screenOptions={{
            headerShown: false,
            headerBlurEffect: 'light',
            headerStyle: {
              backgroundColor: 'transparent',
            },
            headerShadowVisible: false,
          }}>
          <Stack.Screen
            name="index"
            options={{
              headerShown: true,
              header: () => (
                <View style={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10 }}>
                  <BlurView
                    intensity={40}
                    tint="light"
                    style={{
                      width: '100%',
                      paddingTop: 70,
                      paddingBottom: 12,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    <Text
                      className="text-4xl font-bold uppercase"
                      style={{ color: 'rgba(0,0,0,0.85)' }}>
                      count
                    </Text>
                  </BlurView>
                </View>
              ),
              headerTransparent: true,
              headerTitle: '',
              headerStyle: {
                backgroundColor: 'transparent',
              },
              headerShadowVisible: false,
            }}
          />
        </Stack>
        <StatusBar style="auto" />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
