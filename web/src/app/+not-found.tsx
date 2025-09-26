import { Text } from '@/components/ui/text';
import { Link, Stack } from 'expo-router';
import { View } from 'react-native';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Oops!', contentStyle: { backgroundColor: '#d9cf85' } }} />
      <View>
        <Text>Essa tela não é válida.</Text>

        <Link href="/">
          <Text>Vá para tela inical!</Text>
        </Link>
      </View>
    </>
  );
}
