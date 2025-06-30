import { View, Text, TouchableOpacity } from 'react-native';
import { Link } from 'expo-router';

export type CountCardProps = {
  id: number;
  countTitle: string;
  count: number;
  targetCount: number;
  color: string;
};

export default function CountCard({ id, countTitle, count, targetCount, color }: CountCardProps) {
  return (
    <Link
      href={{
        pathname: '/count/[id]',
        params: { id },
      }}
      className="aspect-square w-[50%]">
      <View
        className="flex h-full w-full flex-1 flex-col justify-between p-6"
        style={{ backgroundColor: color }}>
        <Text className="text-3xl font-bold ">
          {count}/{targetCount}
        </Text>
        <Text className="mt-2 text-2xl font-semibold">{countTitle}</Text>
      </View>
    </Link>
  );
}
