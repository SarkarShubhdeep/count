import { View, Text, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import { getAvailableColors, ColorOption } from '../../data/colors';
import { Ionicons } from '@expo/vector-icons';
import { useState, useEffect, useRef } from 'react';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { CountData } from '../../types/count';
import { ColorDrawer } from '../colors';
import type { BottomSheetMethods } from '@gorhom/bottom-sheet/lib/typescript/types';

function ColorSwatch({
  bg,
  fg,
  selected,
  onPress,
}: {
  bg: string;
  fg: string;
  selected: boolean;
  onPress: () => void;
}) {
  const width = useSharedValue(selected ? 96 : 60);

  useEffect(() => {
    width.value = withTiming(selected ? 96 : 60, { duration: 150 });
  }, [selected]);

  const animatedStyle = useAnimatedStyle(() => ({
    width: width.value,
  }));

  return (
    <TouchableOpacity activeOpacity={1} onPress={onPress}>
      <Animated.View
        className={`h-16 items-center justify-center${selected ? ' rounded-3xl' : ''}`}
        style={[{ backgroundColor: bg }, animatedStyle]}>
        <Ionicons name="close" size={24} color={fg} />
      </Animated.View>
    </TouchableOpacity>
  );
}

const Index = () => {
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [targetCount, setTargetCount] = useState('');
  const [startValue, setStartValue] = useState('');
  const [availableColors, setAvailableColors] = useState<ColorOption[]>([]);
  const [loading, setLoading] = useState(true);
  const colorDrawerRef = useRef<BottomSheetMethods>(null);
  const [isDrawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    const loadColors = async () => {
      try {
        const colors = await getAvailableColors();
        setAvailableColors(colors);
      } catch (error) {
        console.error('Error loading colors:', error);
      } finally {
        setLoading(false);
      }
    };
    loadColors();
  }, []);

  const handleSave = async () => {
    const countsString = await AsyncStorage.getItem('counts');
    const counts: CountData[] = countsString ? JSON.parse(countsString) : [];
    const newId = counts.length > 0 ? Math.max(...counts.map((c: CountData) => c.id)) + 1 : 1;
    const newCount: CountData = {
      id: newId,
      countTitle: title,
      description,
      count: startValue ? Number(startValue) : 0,
      targetCount: Number(targetCount),
      color: availableColors[selectedIdx ?? 0]?.bg || '#000',
      fg: availableColors[selectedIdx ?? 0]?.fg || '#fff',
    };
    const updatedCounts = [...counts, newCount];
    await AsyncStorage.setItem('counts', JSON.stringify(updatedCounts));
    router.replace(`/count/${newId}`);
  };

  const isSaveDisabled = !title.trim() || !targetCount.trim() || loading;

  const defaultColors = availableColors.slice(0, 7); // adjust this based on your default colors count
  const customColors = availableColors.slice(7); // adjust this based on your default colors count

  if (loading) {
    return (
      <View className="flex h-full items-center justify-center">
        <Text className="text-lg">Loading colors...</Text>
      </View>
    );
  }

  return (
    <View className="flex h-full flex-col items-center justify-between gap-4">
      <View className="justify-left flex w-full flex-col  pt-10">
        <Text className="p-2 px-4 text-base font-medium uppercase">title</Text>
        <TextInput
          className="w-full rounded-md border-b border-gray-300 p-2 px-4 text-4xl font-semibold"
          placeholder="Keep it short "
          placeholderTextColor="gray"
          value={title}
          onChangeText={setTitle}
        />
        <Text className="mt-6 p-2 px-4 text-base font-medium uppercase">Description</Text>
        <TextInput
          className="w-full rounded-md border-b border-gray-300 p-2 px-4 text-lg"
          placeholder="Because it looks good"
          placeholderTextColor="gray"
          value={description}
          onChangeText={setDescription}
        />
        <Text className="mt-6 p-2 px-4 text-base font-medium uppercase">Target Count</Text>
        <TextInput
          className="w-full rounded-md border-b border-gray-300 p-2 px-4 text-4xl font-semibold"
          placeholder="00"
          placeholderTextColor="gray"
          keyboardType="numeric"
          value={targetCount}
          onChangeText={setTargetCount}
        />
        <Text className="mt-6 p-2 px-4 text-base font-medium uppercase">
          Start Value (Optional)
        </Text>
        <TextInput
          className="w-full rounded-md border-b border-gray-300 p-2 px-4 text-4xl font-semibold"
          placeholder="00"
          placeholderTextColor="gray"
          keyboardType="numeric"
          value={startValue}
          onChangeText={setStartValue}
        />
        <View className="mt-6 flex-row items-center justify-between gap-2  px-4">
          <Text className="text-base font-medium uppercase">Choose a color</Text>
          <TouchableOpacity
            onPress={() => {
              setDrawerOpen(true);
              setTimeout(() => colorDrawerRef.current?.expand(), 10);
            }}
            className="flex flex-row items-center gap-2">
            <Ionicons name="add" size={16} color="blue" />
            <Text className="text-base font-medium uppercase text-black text-blue-800">
              Add Color
            </Text>
          </TouchableOpacity>
        </View>
        <Text className="mt-4 px-4 text-xs font-semibold uppercase text-gray-500">
          Default Colors
        </Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="mt-2 flex flex-row gap-4 pe-10 ps-4">
          {defaultColors.map(({ bg, fg }, idx) => (
            <ColorSwatch
              key={idx}
              bg={bg}
              fg={fg}
              selected={selectedIdx === idx}
              onPress={() => setSelectedIdx(idx)}
            />
          ))}
        </ScrollView>
        {customColors.length > 0 && (
          <>
            <Text className="mt-4 px-4 text-xs font-semibold uppercase text-gray-500">
              Custom Colors
            </Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              className="mt-2 flex flex-row gap-4 pe-10 ps-4">
              {customColors.map(({ bg, fg }, idx) => (
                <ColorSwatch
                  key={idx + defaultColors.length}
                  bg={bg}
                  fg={fg}
                  selected={selectedIdx === idx + defaultColors.length}
                  onPress={() => setSelectedIdx(idx + defaultColors.length)}
                />
              ))}
            </ScrollView>
          </>
        )}
      </View>

      <View className="h-[100px] w-full items-center justify-center bg-neutral-900 p-5">
        <TouchableOpacity
          className="h-[100px] w-full items-center bg-neutral-900 p-5"
          onPress={isSaveDisabled ? undefined : handleSave}
          activeOpacity={isSaveDisabled ? 1 : 0.7}
          style={{ opacity: isSaveDisabled ? 0.5 : 1 }}>
          <Text className="text-2xl font-semibold text-white">Save</Text>
        </TouchableOpacity>
      </View>
      {isDrawerOpen && <ColorDrawer ref={colorDrawerRef} onClose={() => setDrawerOpen(false)} />}
    </View>
  );
};

export default Index;
