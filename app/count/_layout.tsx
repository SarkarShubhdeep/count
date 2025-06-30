import { Ionicons } from '@expo/vector-icons';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import { TouchableOpacity } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import { CountData } from '../../types/count';

export default function CountLayout() {
  const { id } = useLocalSearchParams();
  const [count, setCount] = useState<CountData | null>(null);

  useEffect(() => {
    const loadCount = async () => {
      try {
        const countsString = await AsyncStorage.getItem('counts');
        if (countsString) {
          const counts: CountData[] = JSON.parse(countsString);
          const found = counts.find((c) => c.id === Number(id));
          setCount(found || null);
        }
      } catch (error) {
        console.error('Error loading count:', error);
      }
    };

    if (id) {
      loadCount();
    }
  }, [id]);

  return (
    <SafeAreaProvider>
      <Stack
        screenOptions={{
          headerTitle: count?.countTitle || 'Count Details',
          headerLargeTitle: true,
          headerRight: () => (
            <TouchableOpacity onPress={() => router.push('/newCount')}>
              <Ionicons name="ellipsis-vertical" size={24} color={count?.fg || 'black'} />
            </TouchableOpacity>
          ),
          headerLargeTitleStyle: {
            fontFamily: 'SpaceGrotesk-Bold',
            color: count?.fg || 'black',
          },
          headerStyle: {
            backgroundColor: 'transparent',
          },
          headerShadowVisible: false,
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={24} color={count?.fg || 'black'} />
            </TouchableOpacity>
          ),
        }}
      />
    </SafeAreaProvider>
  );
}
