import { CardMenuProps } from '@/components/ListMenu/CardMenu';
import { ListMenu } from '@/components/ListMenu';
import { Separator } from '@/components/ui/separator';
import { Text } from '@/components/ui/text';
import { Button } from '@/components/ui/button';
import { signOut } from '@/contexts/authStore';
import { useGetMe } from '@/hooks/queries/usuarios/useGetMe';
import { router, Stack } from 'expo-router';
import { Building2, Calendar, Folder, LogOut, Mail, User } from 'lucide-react-native';
import moment from 'moment';
import { ActivityIndicator, Pressable, ScrollView, View } from 'react-native';

export default function PerfilScreen() {
  const { data: usuario, isLoading } = useGetMe();

  function handleLogout() {
    signOut();
    router.replace('/');
  }

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  const projetosMenu: CardMenuProps[] =
    usuario?.projetos?.map((projeto, idx) => ({
      label: projeto.nome,
      icon: Folder,
      description: projeto.descricao || idx,
      onPress: () => router.push(`/(platform)/projetos/${projeto.id}`),
      badge: projeto.status === 'EM_ANDAMENTO'
        ? 'Em Andamento'
        : projeto.status === 'CONCLUIDO'
          ? 'Concluído'
          : projeto.status === 'CANCELADO'
            ? 'Cancelado'
            : 'Pendente',
    })) || [];

  return (
    <>
      <Stack.Screen
        options={{
          headerTitle: 'Perfil',
          headerRight: () => (
            <Pressable onPress={handleLogout} className="mr-4">
              <LogOut size={24} className="text-destructive" />
            </Pressable>
          ),
        }}
      />
      <ScrollView className="flex-1">
        {/* Meus Dados */}
        <View className="m-5 rounded-lg border border-border bg-card p-5">
          <Text className="mb-4 text-xl font-bold">Meus Dados</Text>

          <View className="gap-3">
            <View className="flex-row items-center gap-3">
              <User size={20} className="text-muted-foreground" />
              <View className="flex-1">
                <Text className="text-xs text-muted-foreground">Nome Completo</Text>
                <Text className="text-base font-medium">
                  {usuario?.nome} {usuario?.sobrenome}
                </Text>
              </View>
            </View>

            <Separator />

            <View className="flex-row items-center gap-3">
              <Mail size={20} className="text-muted-foreground" />
              <View className="flex-1">
                <Text className="text-xs text-muted-foreground">Email</Text>
                <Text className="text-base font-medium">{usuario?.email}</Text>
              </View>
            </View>

            <Separator />

            <View className="flex-row items-center gap-3">
              <User size={20} className="text-muted-foreground" />
              <View className="flex-1">
                <Text className="text-xs text-muted-foreground">CPF</Text>
                <Text className="text-base font-medium">{usuario?.cpf}</Text>
              </View>
            </View>

            <Separator />

            <View className="flex-row items-center gap-3">
              <Calendar size={20} className="text-muted-foreground" />
              <View className="flex-1">
                <Text className="text-xs text-muted-foreground">Data de Nascimento</Text>
                <Text className="text-base font-medium">
                  {usuario?.nascimento
                    ? moment(usuario.nascimento).format('DD/MM/YYYY')
                    : 'Não informado'}
                </Text>
              </View>
            </View>

            <Separator />

            <View className="flex-row items-center gap-3">
              <Building2 size={20} className="text-muted-foreground" />
              <View className="flex-1">
                <Text className="text-xs text-muted-foreground">Função</Text>
                <Text className="text-base font-medium">
                  {usuario?.funcao === 'ADMIN' ? 'Administrador' : 'Comum'}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Meus Projetos */}
        <View className="mx-5 mb-5">
          <Text className="mb-3 text-xl font-bold">Meus Projetos</Text>

          {projetosMenu.length === 0 ? (
            <View className="rounded-lg border border-border bg-card p-8">
              <Text className="text-center text-muted-foreground">
                Você ainda não possui projetos
              </Text>
            </View>
          ) : (
            <ListMenu dataMenu={projetosMenu} />
          )}
        </View>

        <View className="mx-5 mb-10">
          <Button variant="destructive" onPress={handleLogout} className="w-full">
            <LogOut size={20} className="text-destructive-foreground" />
            <Text className="ml-2">Sair da conta</Text>
          </Button>
        </View>
      </ScrollView>
    </>
  );
}