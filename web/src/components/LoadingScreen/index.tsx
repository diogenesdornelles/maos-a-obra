import { useColorScheme } from 'nativewind';
import { ActivityIndicator, View } from 'react-native';

export function LoadingScreen({ size = 24 }: { size?: number }) {
  const { colorScheme } = useColorScheme();

  const scale = size / 24;

  return (
    <View className="w-full flex-1 items-center justify-center">
      <ActivityIndicator
        animating
        size="large"
        color={colorScheme === 'light' ? 'black' : 'white'}
        style={{ transform: [{ scale }] }}
      />
    </View>
  );
}