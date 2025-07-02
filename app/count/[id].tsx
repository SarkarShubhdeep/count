import { useLocalSearchParams, useRouter } from 'expo-router';
import { View, Text, TouchableOpacity, Modal, TextInput, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import { CountData } from '../../types/count';
import { Ionicons } from '@expo/vector-icons';
import { useEditDrawer } from '../../components/EditDrawerContext';
import { BlurView } from 'expo-blur';

export default function CountDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [item, setItem] = useState<CountData | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editTarget, setEditTarget] = useState('');
  const { visible, close, open } = useEditDrawer();

  useEffect(() => {
    AsyncStorage.getItem('counts').then((countsString) => {
      if (countsString) {
        const counts: CountData[] = JSON.parse(countsString);
        const found = counts.find((c) => c.id === Number(id));
        setItem(found || null);
      }
    });
  }, [id]);

  // Prefill fields when opening drawer
  useEffect(() => {
    if (visible && item) {
      setEditTitle(item.countTitle);
      setEditDescription(item.description);
      setEditTarget(item.targetCount.toString());
    }
  }, [visible, item]);

  // Function to update count in AsyncStorage
  const updateCountInStorage = async (newCount: number) => {
    try {
      const countsString = await AsyncStorage.getItem('counts');
      if (countsString) {
        const counts: CountData[] = JSON.parse(countsString);
        const updatedCounts = counts.map((count) =>
          count.id === Number(id) ? { ...count, count: newCount } : count
        );
        await AsyncStorage.setItem('counts', JSON.stringify(updatedCounts));
      }
    } catch (error) {
      console.error('Error updating count in storage:', error);
    }
  };

  // Function to update count details in AsyncStorage
  const updateCountDetails = async (title: string, description: string, target: number) => {
    try {
      const countsString = await AsyncStorage.getItem('counts');
      if (countsString) {
        const counts: CountData[] = JSON.parse(countsString);
        const updatedCounts = counts.map((count) =>
          count.id === Number(id)
            ? { ...count, countTitle: title, description, targetCount: target }
            : count
        );
        await AsyncStorage.setItem('counts', JSON.stringify(updatedCounts));
        setItem((prev) =>
          prev ? { ...prev, countTitle: title, description, targetCount: target } : prev
        );
      }
    } catch (error) {
      console.error('Error updating count details:', error);
    }
  };

  // Function to handle increment
  const handleIncrement = () => {
    if (item) {
      const newCount = item.count + 1;
      setItem({ ...item, count: newCount });
      updateCountInStorage(newCount);
    }
  };

  // Function to handle decrement
  const handleDecrement = () => {
    if (item) {
      const newCount = Math.max(0, item.count - 1); // Prevent negative counts
      setItem({ ...item, count: newCount });
      updateCountInStorage(newCount);
    }
  };

  // Save edit changes
  const handleEditSave = () => {
    updateCountDetails(editTitle, editDescription, Number(editTarget));
    close();
  };

  if (!item) {
    return (
      <View className="flex-1 items-center justify-center bg-red-100">
        <Text className="mb-4 font-bold text-xl text-red-600">Not Found</Text>
        <TouchableOpacity
          className="mt-8 rounded-lg bg-white px-6 py-3"
          onPress={() => router.back()}>
          <Text className="font-semibold text-lg text-black">Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="flex-1 items-center justify-center" style={{ backgroundColor: item.color }}>
      <View className="flex h-1/2 w-full items-center justify-end ">
        <Text className=" leading-1 font-bold text-4xl" style={{ color: item.fg }}>
          {item.countTitle}
        </Text>
        <Text
          className=" leading-1 mt-2 px-5 text-center font-medium text-lg"
          style={{ color: item.fg, opacity: 0.7 }}>
          {item.description}
        </Text>
        <View className="mt-40 flex flex-row items-center justify-center">
          <Text className="leading-1 font-bold text-8xl" style={{ color: item.fg }}>
            {item.count}
          </Text>
        </View>
      </View>
      <View className="h-1 w-full " style={{ backgroundColor: item.fg, opacity: 0.5 }} />
      <View className="flex h-1/2 w-full flex-row justify-center  pt-6">
        <View className="flex flex-row justify-center">
          <Text className="leading-1 font-bold text-8xl" style={{ color: item.fg }}>
            {item.targetCount}
          </Text>
        </View>
      </View>

      {/* Target Achieved */}
      {item.count >= item.targetCount && (
        <View
          className="absolute bottom-[120px] w-fit flex-row items-center justify-center rounded-full p-2 px-4"
          style={{ backgroundColor: item.fg }}>
          <Text className="font-semibold text-xl" style={{ color: item.color }}>
            Target Achieved 🎉
          </Text>
        </View>
      )}

      {/* Bottom button container */}
      <View className="absolute bottom-0 w-full flex-row">
        <TouchableOpacity
          className="h-[100px] w-[50%] items-center justify-center"
          style={{ backgroundColor: item.fg, opacity: 0.7 }}
          onPress={handleDecrement}>
          <Ionicons name="remove" size={40} color={item.color} />
        </TouchableOpacity>
        <TouchableOpacity
          className="h-[100px] w-[50%] items-center justify-center"
          style={{ backgroundColor: item.fg }}
          onPress={handleIncrement}>
          <Ionicons name="add" size={40} color={item.color} />
        </TouchableOpacity>
      </View>

      {/* Edit Bottom Drawer */}
      <Modal visible={visible} animationType="slide" transparent onRequestClose={close}>
        <View style={{ flex: 1, justifyContent: 'flex-end' }}>
          {/* Dimming background */}
          <TouchableOpacity activeOpacity={1} onPress={close} />
          {/* Bottom sheet */}
          <View
            style={{
              overflow: 'hidden',
              borderTopLeftRadius: 30,
              borderTopRightRadius: 30,
              backgroundColor: 'transparent',
            }}>
            <BlurView
              intensity={80}
              tint="dark"
              style={{
                width: '100%',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <View className="w-full px-5 pb-20 pt-5">
                <View className="flex flex-row items-center justify-between">
                  <Text className="mb-2 font-bold text-2xl text-white">Edit Count Details</Text>
                  <View className="flex flex-row items-center gap-2">
                    <TouchableOpacity className={`rounded-full bg-white/10 p-4 `} onPress={close}>
                      <Ionicons name="close" size={20} color={item.color} />
                    </TouchableOpacity>
                    <TouchableOpacity
                      className={`rounded-full bg-white/10 p-4 `}
                      onPress={handleEditSave}>
                      <Ionicons name="checkmark" size={20} color={item.color} />
                    </TouchableOpacity>
                  </View>
                </View>
                <TextInput
                  className="w-full rounded-md border-b border-gray-300 p-2 px-4 font-semibold text-lg text-white"
                  placeholder="Title"
                  placeholderTextColor="gray"
                  value={editTitle}
                  onChangeText={setEditTitle}
                />
                <TextInput
                  className="w-full rounded-md border-b border-gray-300 p-2 px-4 font-semibold text-lg text-white"
                  placeholder="Description"
                  value={editDescription}
                  onChangeText={setEditDescription}
                />
                <TextInput
                  className="w-full rounded-md border-b border-gray-300 p-2 px-4 font-semibold text-lg text-white"
                  placeholder="Target Count"
                  value={editTarget}
                  onChangeText={setEditTarget}
                  keyboardType="numeric"
                />
              </View>
            </BlurView>
          </View>
        </View>
      </Modal>
    </View>
  );
}
