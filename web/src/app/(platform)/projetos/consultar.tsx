import { Stack } from 'expo-router';
import { View } from 'react-native';

export default function ProjetosConsultarScreen() {
  return (
    <>
      <Stack.Screen options={{ headerTitle: 'Projetos / consultar' }} />
      <View className="m-5"></View>
    </>
  );
}
