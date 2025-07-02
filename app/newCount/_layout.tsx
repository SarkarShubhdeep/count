import { Ionicons } from '@expo/vector-icons';
import { router, Stack } from 'expo-router';
import { TouchableOpacity, View, Text } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';

export default function NewCountLayout() {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1 }} edges={['top']}>
        <Stack
          screenOptions={{
            headerShown: true,
            header: () => (
              <BlurView
                intensity={40}
                tint="light"
                style={{
                  width: '100%',
                  paddingTop: 10,
                  paddingBottom: 12,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'flex-start',
                  paddingHorizontal: 16,
                }}>
                <TouchableOpacity onPress={() => router.back()} style={{ marginRight: 16 }}>
                  <Ionicons name="arrow-back" size={24} color="black" />
                </TouchableOpacity>
                <Text
                  style={{
                    fontFamily: 'SpaceGrotesk-Bold',
                    fontSize: 18,
                    color: 'black',
                    fontWeight: 'bold',
                  }}>
                  Add New Count
                </Text>
              </BlurView>
            ),
            headerTransparent: true,
            headerTitle: '',
            headerStyle: {
              backgroundColor: 'transparent',
            },
            headerShadowVisible: false,
          }}
        />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
