import { View, Text, TouchableOpacity } from 'react-native';
import { Link } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export type CountCardProps = {
  id: number;
  countTitle: string;
  count: number;
  targetCount: number;
  backgroundColor: string;
  foregroundColor: string;
};

export default function CountCard({
  id,
  countTitle,
  count,
  targetCount,
  backgroundColor,
  foregroundColor,
}: CountCardProps) {
  return (
    <Link
      href={{
        pathname: '/count/[id]',
        params: { id },
      }}
      className="aspect-square w-[50%]">
      <View
        className="flex h-full w-full flex-1 flex-col justify-between p-6"
        style={{ backgroundColor: backgroundColor }}>
        {/* Count */}
        <View className="flex-row items-center justify-between">
          <Text className="font-bold text-3xl " style={{ color: foregroundColor }}>
            {count}/{targetCount}
          </Text>
          {count >= targetCount && (
            <Ionicons name="checkmark-circle" size={30} color={foregroundColor} />
          )}
        </View>
        <Text className="mt-2 font-semibold text-2xl" style={{ color: foregroundColor }}>
          {countTitle}
        </Text>
      </View>
    </Link>
  );
}
