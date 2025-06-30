import AsyncStorage from '@react-native-async-storage/async-storage';

// Default colors that come with the app
export const defaultColors = [
  { bg: '#292929', fg: '#FFFFFF' },
  { bg: '#458C6A', fg: '#FFFFFF' },
  { bg: '#7466FF', fg: '#FFFFFF' },
  { bg: '#BDF0DC', fg: '#292929' },
  { bg: '#DE5C2F', fg: '#292929' },
  { bg: '#D0D85A', fg: '#292929' },
  { bg: '#D192CA', fg: '#292929' },
  { bg: '#F1E987', fg: '#292929' },
  { bg: '#F4F4F4', fg: '#292929' },
  { bg: '#D18665', fg: '#292929' },
];

export interface ColorOption {
  bg: string;
  fg: string;
}

// Get all available colors (default + custom)
export const getAvailableColors = async (): Promise<ColorOption[]> => {
  try {
    const customColorsString = await AsyncStorage.getItem('customColors');
    const customColors: ColorOption[] = customColorsString ? JSON.parse(customColorsString) : [];
    return [...defaultColors, ...customColors];
  } catch (error) {
    console.error('Error loading colors:', error);
    return defaultColors;
  }
};

// Add a custom color
export const addCustomColor = async (color: ColorOption): Promise<void> => {
  try {
    const customColorsString = await AsyncStorage.getItem('customColors');
    const customColors: ColorOption[] = customColorsString ? JSON.parse(customColorsString) : [];
    const updatedColors = [...customColors, color];
    await AsyncStorage.setItem('customColors', JSON.stringify(updatedColors));
  } catch (error) {
    console.error('Error saving custom color:', error);
  }
};

// Remove a custom color
export const removeCustomColor = async (colorIndex: number): Promise<void> => {
  try {
    const customColorsString = await AsyncStorage.getItem('customColors');
    const customColors: ColorOption[] = customColorsString ? JSON.parse(customColorsString) : [];
    const updatedColors = customColors.filter((_, index) => index !== colorIndex);
    await AsyncStorage.setItem('customColors', JSON.stringify(updatedColors));
  } catch (error) {
    console.error('Error removing custom color:', error);
  }
};

// Reset to default colors only
export const resetToDefaultColors = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem('customColors');
  } catch (error) {
    console.error('Error resetting colors:', error);
  }
};

// For backward compatibility - returns default colors synchronously
export const availableColors = defaultColors;
