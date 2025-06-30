import { Ionicons } from '@expo/vector-icons';
import { router, Stack } from 'expo-router';
import { TouchableOpacity } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function NewCountLayout() {
  return (
    <SafeAreaProvider>
      <Stack
        screenOptions={{
          title: 'Add New Count',
          headerShown: true,
          headerTitle: 'Add New Count',
          headerTitleStyle: {
            fontFamily: 'SpaceGrotesk-Bold',
            fontSize: 18,
            color: 'black',
          },
          headerStyle: {
            backgroundColor: 'transparent',
          },
          headerShadowVisible: false,
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={24} color="black" />
            </TouchableOpacity>
          ),
        }}
      />
    </SafeAreaProvider>
  );
}
