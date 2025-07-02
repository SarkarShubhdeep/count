import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
  StyleSheet,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useState, useEffect, useRef, forwardRef, useImperativeHandle, useMemo } from 'react';
import { router } from 'expo-router';
import {
  getAvailableColors,
  addCustomColor,
  removeCustomColor,
  resetToDefaultColors,
  defaultColors,
  ColorOption,
} from '../../data/colors';
import BottomSheet from '@gorhom/bottom-sheet';
import type { BottomSheetMethods } from '@gorhom/bottom-sheet/lib/typescript/types';
import type { ForwardedRef } from 'react';
import { BlurView } from 'expo-blur';
import type { LayoutChangeEvent } from 'react-native';
import ColorPicker, {
  colorKit,
  HueSlider,
  OpacitySlider,
  Panel1,
  PreviewText,
  Swatches,
} from 'reanimated-color-picker';
import PanelColorPicker from 'components/PanelColorPicker';

// Reusable ColorDrawer component
export const ColorDrawer = forwardRef<BottomSheetMethods, { onClose: () => void }>(
  function ColorDrawer({ onClose }, ref: ForwardedRef<BottomSheetMethods>) {
    const [colors, setColors] = useState<ColorOption[]>([]);
    const [customColors, setCustomColors] = useState<ColorOption[]>([]);
    const [loading, setLoading] = useState(true);
    const [newColorBg, setNewColorBg] = useState('#000000');
    const [newColorFg, setNewColorFg] = useState('#FFFFFF');
    const bottomSheetRef = useRef<BottomSheet>(null);
    const animationConfigs = useMemo(
      () => ({
        damping: 30,
        stiffness: 200,
        mass: 1,
        overshootClamping: false,
        restDisplacementThreshold: 0.1,
        restSpeedThreshold: 0.1,
      }),
      []
    );
    const [colorTab, setColorTab] = useState<'bg' | 'fg'>('bg');
    const [containerWidth, setContainerWidth] = useState(0);
    const pillAnim = useRef(new Animated.Value(0)).current;

    useImperativeHandle(ref, () => ({
      open: () => bottomSheetRef.current?.expand(),
      close: () => bottomSheetRef.current?.close(),
      snapToIndex: (...args) => bottomSheetRef.current?.snapToIndex?.(...args),
      snapToPosition: (...args) => bottomSheetRef.current?.snapToPosition?.(...args),
      expand: (...args) => bottomSheetRef.current?.expand?.(...args),
      collapse: (...args) => bottomSheetRef.current?.collapse?.(...args),
      forceClose: (...args) => bottomSheetRef.current?.forceClose?.(...args),
    }));

    useEffect(() => {
      loadColors();
    }, []);

    const handleContainerLayout = (e: LayoutChangeEvent) => {
      const width = e.nativeEvent.layout.width;
      if (width !== containerWidth) {
        setContainerWidth(width);
        // Set initial value after width is measured
        pillAnim.setValue(colorTab === 'bg' ? 0 : 1);
      }
    };

    useEffect(() => {
      if (containerWidth > 0) {
        Animated.timing(pillAnim, {
          toValue: colorTab === 'bg' ? 0 : 1,
          duration: 250,
          useNativeDriver: true,
        }).start();
      }
    }, [colorTab, containerWidth]);

    const tabWidth = containerWidth / 2;
    const pillTranslateX = pillAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [0, tabWidth],
    });

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
      return null;
    }

    // Custom backdrop with blur and smooth transition
    const BlurredBackdrop = ({ animatedIndex }: { animatedIndex: any }) => {
      return (
        <Animated.View
          style={[StyleSheet.absoluteFillObject, { opacity: animatedIndex.value }]}
          pointerEvents="auto">
          <BlurView intensity={40} tint="light" style={StyleSheet.absoluteFill} />
        </Animated.View>
      );
    };

    return (
      <BottomSheet
        ref={bottomSheetRef}
        index={0}
        snapPoints={['90%']}
        enablePanDownToClose={false}
        enableContentPanningGesture={false}
        enableHandlePanningGesture={false}
        onClose={onClose}
        backdropComponent={BlurredBackdrop}
        animationConfigs={animationConfigs}>
        <View style={{ flex: 1 }}>
          <View className="flex-row items-center justify-between p-4">
            <View style={{ width: 24 }} />
            <Text className="text-xl font-bold">Color Management</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={28} color="black" />
            </TouchableOpacity>
          </View>
          <ScrollView className="flex-1 px-4" contentContainerStyle={{ paddingBottom: 80 }}>
            {/* Add New Color Section */}
            <View className="mb-6 rounded-lg bg-white ">
              <View
                className="relative mb-4 flex-row items-center "
                style={{
                  height: 44,
                  borderRadius: 22,
                  backgroundColor: '#f3f3f3',
                  overflow: 'hidden',
                }}
                onLayout={handleContainerLayout}>
                {containerWidth > 0 && (
                  <Animated.View
                    style={{
                      position: 'absolute',
                      height: 44,
                      width: tabWidth,
                      backgroundColor: '#111222',
                      borderRadius: 22,
                      transform: [{ translateX: pillTranslateX }],
                    }}
                  />
                )}
                <TouchableOpacity
                  style={{
                    flex: 1,
                    height: 44,
                    zIndex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    paddingHorizontal: 8,
                  }}
                  onPress={() => setColorTab('bg')}
                  activeOpacity={1}>
                  <Text
                    className={`text-base font-bold ${colorTab === 'bg' ? 'text-white' : 'text-neutral-900'}`}>
                    Background
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    flex: 1,
                    height: 44,
                    zIndex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    paddingHorizontal: 8,
                  }}
                  onPress={() => setColorTab('fg')}
                  activeOpacity={1}>
                  <Text
                    className={`text-base font-bold ${colorTab === 'fg' ? 'text-white' : 'text-neutral-900'}`}>
                    Foreground
                  </Text>
                </TouchableOpacity>
              </View>
              {colorTab === 'bg' && (
                <View className="flex-col items-start gap-5">
                  <PanelColorPicker value={newColorBg} onChange={setNewColorBg} />
                  <View className="w-full flex-1">
                    <Text className=" font-medium text-gray-500">Background Color</Text>
                    <TextInput
                      className="border-b border-gray-300 p-2 text-2xl  font-medium"
                      value={newColorBg}
                      onChangeText={setNewColorBg}
                      placeholder="#000000"
                    />
                  </View>
                </View>
              )}
              {colorTab === 'fg' && (
                <View className="flex-col items-start gap-5">
                  <View className="w-full flex-1">
                    <Text className="font-medium text-gray-500">Text Color</Text>
                    <TextInput
                      className="border-b border-gray-300 p-2 text-2xl font-medium"
                      value={newColorFg}
                      onChangeText={setNewColorFg}
                      placeholder="#FFFFFF"
                    />
                  </View>
                </View>
              )}
            </View>
            {/* Default Colors */}
          </ScrollView>
          <View
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              bottom: 0,
            }}>
            <TouchableOpacity
              onPress={handleAddColor}
              className="h-[100px] w-full items-center justify-start  bg-neutral-900 p-4">
              <Text className="text-2xl font-semibold text-white">Add Color</Text>
            </TouchableOpacity>
          </View>
        </View>
      </BottomSheet>
    );
  }
);

// Keep the default export for the /colors route
export default function ColorsScreen() {
  return null; // We'll handle the drawer in the parent screen now
}
