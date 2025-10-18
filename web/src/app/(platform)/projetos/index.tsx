import { ListMenu } from '@/components/ListMenu';
import { CardMenuProps } from '@/components/ListMenu/CardMenu';
import { router, Stack } from 'expo-router';
import { CirclePlus, Search } from 'lucide-react-native';

export default function ProjectScreen() {
  const menu: CardMenuProps[] = [
    {
      label: 'Adicionar',
      icon: CirclePlus,
      onPress: () => {
        router.push('/(platform)/projetos/adicionar');
      },
    },
    {
      label: 'Consultar',
      icon: Search,
      onPress: () => {
        router.push('/(platform)/projetos/consultar');
      },
    },
  ];
  return (
    <>
      <Stack.Screen options={{ headerShown: true, headerTitle: 'Projetos' }} />
      <ListMenu dataMenu={menu} />
    </>
  );
}
