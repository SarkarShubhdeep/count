import { Ionicons } from '@expo/vector-icons';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import { TouchableOpacity, View, Alert } from 'react-native';
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

  const handleDelete = async () => {
    Alert.alert('Delete Count', 'Are you sure you want to delete this count?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            const countsString = await AsyncStorage.getItem('counts');
            if (countsString) {
              let counts: CountData[] = JSON.parse(countsString);
              counts = counts.filter((c) => c.id !== Number(id));
              await AsyncStorage.setItem('counts', JSON.stringify(counts));
              router.back();
            }
          } catch (error) {
            console.error('Error deleting count:', error);
          }
        },
      },
    ]);
  };

  return (
    <SafeAreaProvider>
      <Stack
        screenOptions={{
          headerTitle: count?.countTitle || 'Count Details',
          headerLargeTitle: true,

          headerRight: () => (
            <View className="h-16 w-40 flex-row items-center justify-end gap-3 ">
              <TouchableOpacity
                onPress={() => router.push('/newCount')}
                className={`rounded-full bg-white/5 p-4 `}>
                <Ionicons name="pencil-outline" size={20} color={count?.fg || 'black'} />
              </TouchableOpacity>
              <TouchableOpacity onPress={handleDelete} className="rounded-full bg-white/5 p-4">
                <Ionicons name="trash" size={20} color={count?.fg || 'black'} />
              </TouchableOpacity>
            </View>
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
