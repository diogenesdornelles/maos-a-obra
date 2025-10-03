import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { signOut } from '@/contexts/authStore';
import { router, Stack } from 'expo-router';
import { View } from 'react-native';

export default function Home() {
  return (
    <>
      <View>
        <Stack.Screen
          options={{
            headerShown: true,
            headerTitle: 'Menu',
            headerBackButtonDisplayMode: 'minimal',
          }}
        />
        <Text>Teste</Text>
        <Button
          onPress={async () => {
            await signOut();
            router.replace('/');
          }}>
          <Text>LogOut</Text>
        </Button>
      </View>
    </>
  );
}
