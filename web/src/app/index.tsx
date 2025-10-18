import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { useSession } from '@/hooks/useSession';
import { router, Stack } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function InitialScreen() {
  const { getSession, restoreSession } = useSession();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function init() {
      try {
        await restoreSession();

        const session = getSession();

        if (session?.token) {
          router.replace('/(platform)/home');
          return;
        }
      } catch (error) {
        console.error('Error restoring session:', error);
      } finally {
        setLoading(false);
      }
    }

    init();
  }, []);

  if (loading) {
    return (
      <View className="flex h-full w-full items-center justify-center bg-white">
        <ActivityIndicator size="large" />
        <Text className="mt-4">Carregando...</Text>
      </View>
    );
  }

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View className="flex h-full w-full justify-between">
        <SafeAreaView>
          <View className="w-full flex-row justify-center pt-20">
            <Text className="text-2xl">Mãos à obra</Text>
          </View>
        </SafeAreaView>
        <View className="h-[300px] justify-center gap-5 bg-gray-300 px-5">
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