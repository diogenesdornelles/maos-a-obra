import { ListMenu } from '@/components/ListMenu';
import { CardMenuProps } from '@/components/ListMenu/CardMenu';
import { Modal } from '@/components/Modal';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { signOut } from '@/contexts/authStore';
import { router, Stack } from 'expo-router';
import {
  Calculator,
  FileText,
  LayoutDashboard,
  LogOut,
  MapPin,
  Search,
  User,
  Users,
} from 'lucide-react-native';
import { useState } from 'react';
import { View } from 'react-native';

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const menu: CardMenuProps[] = [
    {
      label: 'Projetos',
      icon: LayoutDashboard,
      onPress: () => {
        router.push('/(platform)/projetos');
      },
    },
    {
      label: 'Estimativas',
      icon: Calculator,
      onPress: () => {
        setIsModalOpen(true);
      },
    },
    { label: 'Perfil', icon: User, onPress: () => router.push('/(platform)/perfil') },
    {
      label: 'Clientes',
      icon: Users,
      onPress: () => {
        router.push('/(platform)/clientes');
      },
    },
    {
      label: 'Consultas',
      icon: Search,
      onPress: () => {
        router.push('/(platform)/consultas');
      },
    },
    {
      label: 'Relatórios',
      icon: FileText,
      onPress: () => {
        setIsModalOpen(true);
      },
    },
    {
      label: 'Endereços',
      icon: MapPin,
      onPress: () => {
        router.push('/(platform)/enderecos');
      },
    },
    {
      label: 'Logout',
      icon: LogOut,
      onPress: () => {
        signOut();
        router.replace('/');
      },
    },
  ];

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: 'Menu',
          headerRight: () => undefined,
        }}
      />
      <View className="h-full w-full">
        <ListMenu dataMenu={menu ?? []} />
      </View>
      {isModalOpen && (
        <Modal
          height={150}
          width={300}
          title="Em breve..."
          isOpen={isModalOpen}
          footerButtons={
            <View className="flex w-full flex-row justify-end">
              <Button onPress={() => setIsModalOpen(false)}>
                <Text>Fechar</Text>
              </Button>
            </View>
          }
        />
      )}
    </>
  );
}