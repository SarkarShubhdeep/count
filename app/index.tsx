import { View, Text, FlatList, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CountCard from '../components/CountCard';
import { Link, router, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState, useCallback } from 'react';
import { CountData, DataItem, isPlaceholderItem } from '../types/count';

export default function HomeScreen() {
  const [counts, setCounts] = useState<CountData[]>([]);
  const [loading, setLoading] = useState(true);

  const loadCounts = async () => {
    try {
      const countsString = await AsyncStorage.getItem('counts');
      const savedCounts = countsString ? JSON.parse(countsString) : [];
      setCounts(savedCounts);
    } catch (error) {
      console.error('Error loading counts:', error);
    } finally {
      setLoading(false);
    }
  };

  // Load counts on initial mount
  useEffect(() => {
    loadCounts();
  }, []);

  // Refresh counts when screen comes into focus (e.g., after adding new count)
  useFocusEffect(
    useCallback(() => {
      loadCounts();
    }, [])
  );

  // Add placeholder for odd number of cards
  const paddedData: DataItem[] =
    counts.length % 2 === 0 ? counts : [...counts, { isPlaceholder: true }];

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50" edges={['top']}>
        <View className="flex-1 items-center justify-center">
          <Text className="text-lg">Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={['top']}>
      <View className="flex-row items-center justify-center p-4">
        <Text className="text-4xl font-bold uppercase">count</Text>
      </View>
      <View className="flex-1 pb-[100px] ">
        <FlatList
          data={paddedData}
          keyExtractor={(item, idx) =>
            isPlaceholderItem(item) ? `placeholder-${idx}` : item.id.toString()
          }
          numColumns={2}
          renderItem={({ item }) =>
            isPlaceholderItem(item) ? (
              <View
                style={{
                  flex: 1,
                  height: 180,
                  backgroundColor: 'transparent',
                }}
              />
            ) : (
              <CountCard
                id={item.id}
                countTitle={item.countTitle}
                count={item.count}
                targetCount={item.targetCount}
                color={item.color}
              />
            )
          }
          showsVerticalScrollIndicator={false}
        />
      </View>
      <View className="absolute bottom-0 w-full items-center justify-center">
        <TouchableOpacity className="h-[100px] w-full items-center bg-neutral-900 p-5">
          <Link href="/newCount">
            <Text className="text-2xl font-semibold text-white">New Count</Text>
          </Link>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
