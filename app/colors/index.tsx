import { View, Text, TouchableOpacity, ScrollView, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useState, useEffect } from 'react';
import { router } from 'expo-router';
import {
  getAvailableColors,
  addCustomColor,
  removeCustomColor,
  resetToDefaultColors,
  defaultColors,
  ColorOption,
} from '../../data/colors';

export default function ColorsScreen() {
  const [colors, setColors] = useState<ColorOption[]>([]);
  const [customColors, setCustomColors] = useState<ColorOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [newColorBg, setNewColorBg] = useState('#000000');
  const [newColorFg, setNewColorFg] = useState('#FFFFFF');

  useEffect(() => {
    loadColors();
  }, []);

  const loadColors = async () => {
    try {
      const allColors = await getAvailableColors();
      setColors(allColors);
      setCustomColors(allColors.slice(defaultColors.length));
    } catch (error) {
      console.error('Error loading colors:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddColor = async () => {
    if (newColorBg && newColorFg) {
      const newColor: ColorOption = { bg: newColorBg, fg: newColorFg };
      await addCustomColor(newColor);
      setNewColorBg('#000000');
      setNewColorFg('#FFFFFF');
      loadColors(); // Reload to show new color
    }
  };

  const handleRemoveColor = async (index: number) => {
    Alert.alert('Remove Color', 'Are you sure you want to remove this color?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Remove',
        style: 'destructive',
        onPress: async () => {
          await removeCustomColor(index);
          loadColors(); // Reload to update list
        },
      },
    ]);
  };

  const handleResetColors = async () => {
    Alert.alert('Reset Colors', 'This will remove all custom colors. Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Reset',
        style: 'destructive',
        onPress: async () => {
          await resetToDefaultColors();
          loadColors(); // Reload to show only defaults
        },
      },
    ]);
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50" edges={['top']}>
        <View className="flex-1 items-center justify-center">
          <Text className="text-lg">Loading colors...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={['top']}>
      <View className="flex-row items-center justify-between p-4">
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text className="text-xl font-bold">Color Management</Text>
        <TouchableOpacity onPress={handleResetColors}>
          <Ionicons name="refresh" size={24} color="red" />
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1 px-4">
        {/* Add New Color Section */}
        <View className="mb-6 rounded-lg bg-white p-4 shadow-sm">
          <Text className="mb-4 text-lg font-semibold">Add Custom Color</Text>
          <View className="flex-row items-center gap-4">
            <View className="flex-1">
              <Text className="mb-2 text-sm font-medium">Background Color</Text>
              <TextInput
                className="rounded border border-gray-300 p-2"
                value={newColorBg}
                onChangeText={setNewColorBg}
                placeholder="#000000"
              />
            </View>
            <View className="flex-1">
              <Text className="mb-2 text-sm font-medium">Text Color</Text>
              <TextInput
                className="rounded border border-gray-300 p-2"
                value={newColorFg}
                onChangeText={setNewColorFg}
                placeholder="#FFFFFF"
              />
            </View>
            <TouchableOpacity onPress={handleAddColor} className="rounded bg-blue-500 p-3">
              <Ionicons name="add" size={20} color="white" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Default Colors */}
        <View className="mb-6">
          <Text className="mb-4 text-lg font-semibold">Default Colors</Text>
          <View className="flex-row flex-wrap gap-3">
            {defaultColors.map((color, index) => (
              <View
                key={index}
                className="h-12 w-12 items-center justify-center rounded-lg"
                style={{ backgroundColor: color.bg }}>
                <Ionicons name="checkmark" size={20} color={color.fg} />
              </View>
            ))}
          </View>
        </View>

        {/* Custom Colors */}
        {customColors.length > 0 && (
          <View className="mb-6">
            <Text className="mb-4 text-lg font-semibold">Custom Colors</Text>
            <View className="flex-row flex-wrap gap-3">
              {customColors.map((color, index) => (
                <View key={index} className="relative">
                  <View
                    className="h-12 w-12 items-center justify-center rounded-lg"
                    style={{ backgroundColor: color.bg }}>
                    <Ionicons name="checkmark" size={20} color={color.fg} />
                  </View>
                  <TouchableOpacity
                    onPress={() => handleRemoveColor(index)}
                    className="absolute -right-2 -top-2 rounded-full bg-red-500 p-1">
                    <Ionicons name="close" size={12} color="white" />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
