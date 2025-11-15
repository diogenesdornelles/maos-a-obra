import { InputDate } from '@/components/Inputs/InputDate';
import { InputText } from '@/components/Inputs/InputText';
import { Select, SelectOption } from '@/components/Inputs/Select';
import { Modal } from '@/components/Modal';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import {
  UpdateClientFormData,
  updateClientSchema,
} from '@/features/(platform)/clientes/alterar/validations/alterarClientForm';
import { useDeleteClient } from '@/hooks/queries/clients/useDeleteCliente';
import { useGetClienteById } from '@/hooks/queries/clients/useGetClienteById';
import { useUpdateCliente } from '@/hooks/queries/clients/useUpdateCliente';
import { useGetEnderecosBySearch } from '@/hooks/queries/enderecos/useGetEnderecosBySearch';
import { useDebounce } from '@/hooks/useDebounce';
import { EnderecoProps } from '@/types/enderecos/enderecos';
import { ErrorResponse } from '@/types/errorParser';
import { arrayOfErrors } from '@/utils/errorsParser';
import { zodResolver } from '@hookform/resolvers/zod';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { ActivityIndicator, ScrollView, TouchableOpacity, View } from 'react-native';

export default function ClienteDetailScreen() {
  const local: { id: string } = useLocalSearchParams();
  const [isEditing, setIsEditing] = useState(false);
  const [enderecoSearch, setEnderecoSearch] = useState('');

  const [isOpen, setIsOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'success' | 'error'>('error');
  const [error, setError] = useState<ErrorResponse>();

  const { debouncedValue } = useDebounce(enderecoSearch);

  const { data: cliente, isLoading: isLoadingCliente, refetch: refetchClient } = useGetClienteById({ id: local.id });

  const {
    data: enderecos,
    isLoading: isLoadingEnderecos,
    isFetchingNextPage: isFetchingNextPageEnderecos,
    hasNextPage: hasNextPageEnderecos,
    fetchNextPage: fetchNextPageEnderecos,
  } = useGetEnderecosBySearch({
    logradouro: debouncedValue,
    status: 'true',
    take: 20,
  });

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors, isValid },
  } = useForm<Partial<UpdateClientFormData>>({
    resolver: zodResolver(updateClientSchema),
    mode: 'onChange',
  });

  const { mutate: updateCliente } = useUpdateCliente();
  const { mutate: deleteCliente } = useDeleteClient();

  const enderecosOptions: SelectOption[] = useMemo(() => {
    if (!enderecos?.pages) return [];

    return enderecos.pages.flatMap((page) =>
      page.map((endereco) => ({
        label: `${endereco.logradouro}${endereco.numero ? `, ${endereco.numero}` : ''} - ${endereco.bairro?.nome}`,
        value: endereco.id,
        data: endereco,
      }))
    );
  }, [enderecos]);

  useEffect(() => {
    if (cliente) {
      setValue('nome', cliente.nome);
      setValue('sobrenome', cliente.sobrenome || '');
      setValue('cpf', cliente.cpf || '');
      setValue('cnpj', cliente.cnpj || '');
      setValue('nascimento', cliente.nascimento || '');
      setValue('telefone', cliente.telefone || '');
      setValue('email', cliente.email || '');
      setValue('enderecoId', cliente.enderecoId || '');
      setValue('status', cliente.status);
    }
  }, [cliente, setValue]);

  const modalInfo = {
    success: {
      title: 'Cliente atualizado com sucesso.',
      description: 'As informações do cliente foram atualizadas.',
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
      title: 'Erro ao atualizar cliente.',
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

  function handleEditToggle() {
    if (isEditing && cliente) {
      setValue('nome', cliente.nome);
      setValue('sobrenome', cliente.sobrenome || '');
      setValue('cpf', cliente.cpf || '');
      setValue('cnpj', cliente.cnpj || '');
      setValue('nascimento', cliente.nascimento || '');
      setValue('telefone', cliente.telefone || '');
      setValue('email', cliente.email || '');
      setValue('enderecoId', cliente.enderecoId || '');
    }
    setIsEditing(!isEditing);
  }

  function handleDeleteConfirm() {
    setIsDeleteModalOpen(true);
  }

  function handleDelete() {
    if (!cliente?.id) return;

    deleteCliente(cliente.id, {
      onSuccess: () => {
        setIsDeleteModalOpen(false);
        router.replace('/(platform)/clientes');
      },
      onError: (error) => {
        setIsDeleteModalOpen(false);
        setModalType('error');
        setError(error as unknown as ErrorResponse);
        setIsOpen(true);
      },
    });
  }

  function onSubmit(data: Partial<UpdateClientFormData>) {
    if (!cliente?.id) return;

    const updateData: Partial<UpdateClientFormData> = {};

    if (data?.nome) updateData.nome = data.nome;
    if (data?.sobrenome !== undefined) updateData.sobrenome = data.sobrenome;
    if (data?.cpf !== undefined) updateData.cpf = data.cpf;
    if (data?.cnpj !== undefined) updateData.cnpj = data.cnpj;
    if (data?.nascimento !== undefined) updateData.nascimento = data.nascimento;
    if (data?.telefone !== undefined) updateData.telefone = data.telefone;
    if (data?.email !== undefined) updateData.email = data.email;
    if (data?.enderecoId !== undefined) updateData.enderecoId = data.enderecoId;
    if (data?.status !== undefined) updateData.status = data.status;

    updateCliente(
      {
        body: updateData,
        id: cliente.id,
      },
      {
        onSuccess: () => {
          setModalType('success');
          refetchClient();
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

  if (isLoadingCliente) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!cliente) {
    return (
      <View className="flex-1 items-center justify-center p-5">
        <Text className="text-center text-muted-foreground">Cliente não encontrado</Text>
      </View>
    );
  }

  return (
    <>
      <Stack.Screen options={{ headerTitle: 'Cliente / detalhes' }} />

      <ScrollView className="flex-1">
        <View className="p-5">
          {isEditing && (
            <View className="mb-3 rounded-lg bg-blue-100 p-3">
              <Text className="text-sm font-medium text-blue-700">Modo de edição ativado</Text>
            </View>
          )}

          <Controller
            control={control}
            name="nome"
            disabled={!isEditing}
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
            disabled={!isEditing}
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
            disabled={!isEditing}
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
            name="cnpj"
            disabled={!isEditing}
            render={({ field: { onChange, value } }) => (
              <InputText
                label="CNPJ"
                placeholder="Digite o CNPJ"
                keyboardType="numeric"
                onChangeText={isEditing ? onChange : undefined}
                value={value}
                error={errors.cnpj?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="nascimento"
            disabled={!isEditing}
            render={({ field: { onChange, value } }) => (
              <InputDate
                label="Data de Nascimento"
                placeholder="DD/MM/AAAA"
                onChangeText={isEditing ? onChange : undefined}
                value={value}
                error={errors.nascimento?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="telefone"
            disabled={!isEditing}
            render={({ field: { onChange, value } }) => (
              <InputText
                label="Telefone"
                placeholder="Digite o telefone"
                keyboardType="numeric"
                onChangeText={isEditing ? onChange : undefined}
                value={value}
                error={errors.telefone?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="email"
            disabled={!isEditing}
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
            name="enderecoId"
            disabled={!isEditing}
            render={({ field: { onChange, value } }) => (
              <Select<EnderecoProps>
                label="Endereço"
                value={value}
                labelModalSearch="Selecionar endereço"
                options={enderecosOptions}
                onValueChange={onChange}
                renderItem={(item, isSelected, onSelect) => {
                  return (
                    <TouchableOpacity
                      onPress={onSelect}
                      className={`py-3 ${isSelected ? 'bg-accent' : ''}`}>
                      <View className="flex items-center justify-center">
                        <Text className={`text-base ${isSelected ? 'font-bold' : 'font-medium'}`}>
                          {item?.data?.logradouro}
                          {item?.data?.numero ? `, ${item?.data?.numero}` : ''}
                        </Text>
                        <Text className="text-sm text-muted-foreground">
                          {item?.data?.bairro?.nome} - {item?.data?.bairro?.uf}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  );
                }}
                error={errors.enderecoId?.message}
                isLoading={isLoadingEnderecos}
                isFetchingNextPage={isFetchingNextPageEnderecos}
                hasNextPage={hasNextPageEnderecos}
                onLoadMore={fetchNextPageEnderecos}
                onSearchChange={isEditing ? setEnderecoSearch : undefined}
              />
            )}
          />

          <View className="mt-5 gap-2">
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
                  <Text>Editar Cliente</Text>
                </Button>

                <Button variant="destructive" onPress={handleDeleteConfirm}>
                  <Text>Deletar</Text>
                </Button>
              </View>
            )}
          </View>
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
        title="Excluir cliente"
        description="Tem certeza que deseja excluir este cliente? Esta ação não pode ser desfeita."
        footerButtons={
          <View className="flex w-full flex-row items-end justify-end gap-2">
            <Button variant="secondary" onPress={() => setIsDeleteModalOpen(false)}>
              <Text>Cancelar</Text>
            </Button>
            <Button variant="destructive" onPress={handleDelete}>
              <Text>Excluir Cliente</Text>
            </Button>
          </View>
        }
      />
    </>
  );
}