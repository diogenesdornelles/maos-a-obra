import { InputText } from '@/components/Inputs/InputText';
import { ListMenu } from '@/components/ListMenu';
import { CardMenuProps } from '@/components/ListMenu/CardMenu';
import { Modal } from '@/components/Modal';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import {
  UpdateUsuarioFormData,
  updateUsuarioSchema,
} from '@/features/(platform)/usuarios/alterar/validations/alterarUsuarioForm';
import { useDeleteUser } from '@/hooks/queries/usuarios/useDeleteUser';
import { useGetMe } from '@/hooks/queries/usuarios/useGetMe';
import { useUpdateUser } from '@/hooks/queries/usuarios/useUpdateUser';
import { useSession } from '@/hooks/useSession';
import { ErrorResponse } from '@/types/errorParser';
import { arrayOfErrors } from '@/utils/errorsParser';
import { zodResolver } from '@hookform/resolvers/zod';
import { router, Stack } from 'expo-router';
import { Folder, LogOut } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { ActivityIndicator, Alert, Pressable, ScrollView, View } from 'react-native';

export default function PerfilScreen() {
  const { data: usuario, isLoading } = useGetMe();
  const { signOut } = useSession();
  const [isEditing, setIsEditing] = useState(false);

  const [isOpen, setIsOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'success' | 'error'>('error');
  const [error, setError] = useState<ErrorResponse>();

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors, isValid },
  } = useForm<Partial<UpdateUsuarioFormData>>({
    resolver: zodResolver(updateUsuarioSchema),
    mode: 'onChange',
  });

  const { mutate: updateUser } = useUpdateUser();
  const { mutate: deleteUser } = useDeleteUser();

  useEffect(() => {
    if (usuario) {
      setValue('nome', usuario.nome);
      setValue('sobrenome', usuario.sobrenome || '');
      setValue('cpf', usuario.cpf || '');
      setValue('nascimento', usuario.nascimento || '');
      setValue('email', usuario.email || '');
      setValue('funcao', usuario.funcao as 'ADMIN' | 'COMUM');
    }
  }, [usuario, setValue]);

  const modalInfo = {
    success: {
      title: 'Perfil atualizado com sucesso.',
      description: 'Suas informações foram atualizadas.',
      footer: (
        <View className="flex w-full flex-row items-end justify-end gap-2">
          <Button
            onPress={() => {
              setIsOpen(false);
              setIsEditing(false);
            }}>
            <Text>Continuar</Text>
          </Button>
        </View>
      ),
    },
    error: {
      title: 'Erro ao atualizar perfil.',
      description: arrayOfErrors(error?.data?.message),
      footer: (
        <View className="flex w-full flex-row items-end justify-end">
          <Button
            onPress={() => {
              setIsOpen(false);
            }}>
            <Text>Fechar</Text>
          </Button>
        </View>
      ),
    },
  };

  async function handleLogout() {
    await signOut();
    router.replace('/');
  }

  function handleEditToggle() {
    if (isEditing && usuario) {
      // Cancelar edição - restaurar valores originais
      setValue('nome', usuario.nome);
      setValue('sobrenome', usuario.sobrenome || '');
      setValue('cpf', usuario.cpf || '');
      setValue('nascimento', usuario.nascimento || '');
      setValue('email', usuario.email || '');
      setValue('funcao', usuario.funcao as 'ADMIN' | 'COMUM');
    }
    setIsEditing(!isEditing);
  }

  function handleDeleteConfirm() {
    setIsDeleteModalOpen(true);
  }

  function handleDelete() {
    if (!usuario?.id) return;

    deleteUser(usuario.id, {
      onSuccess: async () => {
        setIsDeleteModalOpen(false);
        await signOut();
        router.replace('/');
      },
      onError: (error) => {
        setIsDeleteModalOpen(false);
        setModalType('error');
        setError(error as unknown as ErrorResponse);
        setIsOpen(true);
      },
    });
  }

  function onSubmit(data: Partial<UpdateUsuarioFormData>) {
    if (!usuario?.id) return;

    const updateData: Partial<UpdateUsuarioFormData> = {};

    if (data?.nome) updateData.nome = data.nome;
    if (data?.sobrenome !== undefined) updateData.sobrenome = data.sobrenome;
    if (data?.cpf !== undefined) updateData.cpf = data.cpf;
    if (data?.nascimento !== undefined) updateData.nascimento = data.nascimento;
    if (data?.email !== undefined) updateData.email = data.email;
    if (data?.senha !== undefined) updateData.senha = data.senha;
    if (data?.funcao !== undefined) updateData.funcao = data.funcao;

    updateUser(
      {
        body: updateData,
        id: usuario.id,
      },
      {
        onSuccess: () => {
          setModalType('success');
          setIsOpen(true);
        },
        onError: (error) => {
          setModalType('error');
          setError(error as unknown as ErrorResponse);
          setIsOpen(true);
        },
      }
    );
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
      onPress: () =>
        projeto.status !== 'CANCELADO'
          ? router.push(`/(platform)/projetos/${projeto.id}`)
          : Alert.alert(
              'Erro',
              'Projeto foi excluído',
              [
                {
                  text: 'OK',
                  onPress: () => {
                    console.log('Alerta dispensado');
                  },
                  style: 'default',
                },
              ],
              { cancelable: true }
            ),
      badge:
        projeto.status === 'EM_ANDAMENTO'
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
        <View className="m-5">
          {isEditing && (
            <View className="mb-3 rounded-lg bg-blue-100 p-3">
              <Text className="text-sm font-medium text-blue-700">Modo de edição ativado</Text>
            </View>
          )}

          <Controller
            control={control}
            name="nome"
            render={({ field: { onChange, value } }) => (
              <InputText
                label="Nome"
                isRequired
                placeholder="Digite o nome"
                onChangeText={isEditing ? onChange : undefined}
                value={value}
                error={errors.nome?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="sobrenome"
            render={({ field: { onChange, value } }) => (
              <InputText
                label="Sobrenome"
                placeholder="Digite o sobrenome"
                onChangeText={isEditing ? onChange : undefined}
                value={value}
                error={errors.sobrenome?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, value } }) => (
              <InputText
                label="Email"
                placeholder="Digite o email"
                keyboardType="email-address"
                onChangeText={isEditing ? onChange : undefined}
                value={value}
                error={errors.email?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="cpf"
            render={({ field: { onChange, value } }) => (
              <InputText
                label="CPF"
                placeholder="Digite o CPF"
                keyboardType="numeric"
                onChangeText={isEditing ? onChange : undefined}
                value={value}
                error={errors.cpf?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="nascimento"
            render={({ field: { onChange, value } }) => (
              <InputText
                label="Data de Nascimento"
                placeholder="DD/MM/AAAA"
                onChangeText={isEditing ? onChange : undefined}
                value={value}
                error={errors.nascimento?.message}
              />
            )}
          />

          {isEditing && (
            <Controller
              control={control}
              name="senha"
              render={({ field: { onChange, value } }) => (
                <InputText
                  label="Nova Senha (opcional)"
                  placeholder="Digite a nova senha"
                  secureTextEntry
                  onChangeText={onChange}
                  value={value}
                  error={errors.senha?.message}
                />
              )}
            />
          )}

          <Controller
            control={control}
            name="funcao"
            render={({ field: { value } }) => (
              <View className="mb-4">
                <Text className="mb-2 text-sm font-medium">Função</Text>
                <View className="rounded-lg border border-border bg-muted p-3">
                  <Text className="text-base">
                    {value === 'ADMIN' ? 'Administrador' : 'Comum'}
                  </Text>
                </View>
              </View>
            )}
          />

          <View className="mb-5 gap-2">
            {isEditing ? (
              <View className="flex-row gap-2">
                <Button className="flex-1" onPress={handleSubmit(onSubmit)} disabled={!isValid}>
                  <Text>Salvar Alterações</Text>
                </Button>

                <Button variant="secondary" onPress={handleEditToggle}>
                  <Text>Cancelar</Text>
                </Button>
              </View>
            ) : (
              <View className="flex-row gap-2">
                <Button className="flex-1" onPress={handleEditToggle}>
                  <Text>Editar Perfil</Text>
                </Button>

                <Button variant="destructive" onPress={handleDeleteConfirm}>
                  <Text>Deletar Conta</Text>
                </Button>
              </View>
            )}
          </View>
        </View>

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

      {/* Modal de sucesso/erro */}
      <Modal
        isOpen={isOpen}
        title={modalInfo[modalType].title}
        description={modalInfo[modalType].description}
        footerButtons={modalInfo[modalType].footer}
      />

      {/* Modal de confirmação de exclusão */}
      <Modal
        isOpen={isDeleteModalOpen}
        title="Excluir conta"
        description="Tem certeza que deseja excluir sua conta? Todos os seus dados serão perdidos e você será desconectado. Esta ação não pode ser desfeita."
        footerButtons={
          <View className="flex w-full flex-row items-end justify-end gap-2">
            <Button variant="secondary" onPress={() => setIsDeleteModalOpen(false)}>
              <Text>Cancelar</Text>
            </Button>
            <Button variant="destructive" onPress={handleDelete}>
              <Text>Excluir Minha Conta</Text>
            </Button>
          </View>
        }
      />
    </>
  );
}