import { ListMenu } from '@/components/ListMenu';
import { CardMenuProps } from '@/components/ListMenu/CardMenu';
import { router, Stack } from 'expo-router';
import { CirclePlus, Search } from 'lucide-react-native';

export default function EnderecosScreen() {
  const menu: CardMenuProps[] = [
    {
      label: 'Adicionar',
      icon: CirclePlus,
      onPress: () => {
        router.push('/(platform)/enderecos/adicionar');
      },
    },
    {
      label: 'Consultar',
      icon: Search,
      onPress: () => {
        router.push('/(platform)/enderecos/consultar');
      },
    },
  ];
  return (
    <>
      <Stack.Screen options={{ headerTitle: 'Endereços' }} />
      <ListMenu dataMenu={menu} />
    </>
  );
}