import { ListMenu } from '@/components/ListMenu';
import { CardMenuProps } from '@/components/ListMenu/CardMenu';
import { router, Stack } from 'expo-router';
import { ShoppingBasket } from 'lucide-react-native';
import { View } from 'react-native';

export default function ConsultasScreen() {
  const menu: CardMenuProps[] = [
    {
      label: 'Itens',
      icon: ShoppingBasket,
      onPress: () => {
        router.push('/(platform)/consultas/itens');
      },
    },
  ];
  return (
    <>
      <Stack.Screen options={{ headerTitle: 'Consultas' }} />
      <View>
        <ListMenu className="pl-10 pt-5" dataMenu={menu} />
      </View>
    </>
  );
}
