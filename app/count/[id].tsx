import { useLocalSearchParams, useRouter } from 'expo-router';
import { View, Text, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import { CountData } from '../../types/count';

export default function CountDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [item, setItem] = useState<CountData | null>(null);

  useEffect(() => {
    AsyncStorage.getItem('counts').then((countsString) => {
      if (countsString) {
        const counts: CountData[] = JSON.parse(countsString);
        const found = counts.find((c) => c.id === Number(id));
        setItem(found || null);
      }
    });
  }, [id]);

  if (!item) {
    return (
      <View className="flex-1 items-center justify-center bg-red-100">
        <Text className="mb-4 text-xl font-bold text-red-600">Not Found</Text>
        <TouchableOpacity
          className="mt-8 rounded-lg bg-white px-6 py-3"
          onPress={() => router.back()}>
          <Text className="text-lg font-semibold text-black">Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="flex-1 items-center justify-center" style={{ backgroundColor: item.color }}>
      <Text className="mb-4 text-4xl font-bold" style={{ color: item.fg }}>
        {item.countTitle}
      </Text>
      <Text className="mb-2 text-2xl" style={{ color: item.fg }}>
        {item.count}/{item.targetCount}
      </Text>
      <TouchableOpacity
        className="mt-8 rounded-lg bg-white px-6 py-3"
        onPress={() => router.back()}>
        <Text className="text-lg font-semibold text-black">Go Back</Text>
      </TouchableOpacity>
    </View>
  );
}
