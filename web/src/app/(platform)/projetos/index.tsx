import { ListMenu } from '@/components/ListMenu';
import { CardMenuProps } from '@/components/ListMenu/CardMenu';
import { Stack } from 'expo-router';
import { CirclePlus, Search } from 'lucide-react-native';

export default function ProjectScreen() {
  const menu: CardMenuProps[] = [
    { label: 'Adicionar', icon: CirclePlus, onPress: () => {} },
    { label: 'Consultar', icon: Search, onPress: () => {} },
  ];
  return (
    <>
      <Stack.Screen options={{ headerShown: true, headerTitle: 'Projetos' }} />
      <ListMenu dataMenu={menu} />
    </>
  );
}
