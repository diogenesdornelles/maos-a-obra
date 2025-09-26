import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { router, Stack } from 'expo-router';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function InitialScreen() {
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View className="flex h-full w-full justify-between">
        <SafeAreaView>
          <View className="w-full flex-row justify-center pt-20">
            <Text className="text-2xl">Mãos à obra</Text>
          </View>
        </SafeAreaView>
        <View className="h-1/4 justify-center gap-5 bg-gray-300 px-5">
          <Button variant="default" onPress={() => router.push('/(auth)/login')}>
            <Text>Login</Text>
          </Button>
          <Button variant="default" onPress={() => router.push('/(auth)/signUp')}>
            <Text>Registrar</Text>
          </Button>
        </View>
      </View>
    </>
  );
}
