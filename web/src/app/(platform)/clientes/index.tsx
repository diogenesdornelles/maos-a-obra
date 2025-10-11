import { ListMenu } from '@/components/ListMenu';
import { CardMenuProps } from '@/components/ListMenu/CardMenu';
import { router, Stack } from 'expo-router';
import { CirclePlus, Search } from 'lucide-react-native';

export default function ClientesScreen() {
  const menu: CardMenuProps[] = [
    {
      label: 'Adicionar',
      icon: CirclePlus,
      onPress: () => {
        router.push('/(platform)/clientes/adicionar');
      },
    },
    {
      label: 'Consultar',
      icon: Search,
      onPress: () => {
        router.push('/(platform)/clientes/consultar');
      },
    },
  ];
  return (
    <>
      <Stack.Screen options={{ headerTitle: 'Clientes' }} />
      <ListMenu dataMenu={menu} />
    </>
  );
}
