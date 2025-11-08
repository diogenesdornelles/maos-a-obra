import { InputText } from '@/components/Inputs/InputText';
import { Select, SelectOption } from '@/components/Inputs/Select';
import { Modal } from '@/components/Modal';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import {
  UpdateEnderecoFormData,
  updateEnderecoSchema,
} from '@/features/(platform)/enderecos/alterar/validations/alterarEnderecoForm';
import { useGetBairrosBySearch } from '@/hooks/queries/bairros/useGetBairrosBySearch';
import { useDeleteEndereco } from '@/hooks/queries/enderecos/useDeleteEndereco';
import { useGetEnderecoById } from '@/hooks/queries/enderecos/useGetItemById';
import { useUpdateEndereco } from '@/hooks/queries/enderecos/useUpdateEndereco';
import { useDebounce } from '@/hooks/useDebounce';
import { BairrosProps } from '@/types/bairros/bairros';
import { ErrorResponse } from '@/types/errorParser';
import { arrayOfErrors } from '@/utils/errorsParser';
import { zodResolver } from '@hookform/resolvers/zod';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { ActivityIndicator, ScrollView, TouchableOpacity, View } from 'react-native';

export default function EnderecoDetailScreen() {
  const local: { id: string } = useLocalSearchParams();
  const [isEditing, setIsEditing] = useState(false);
  const [bairroSearch, setBairroSearch] = useState('');

  const [isOpen, setIsOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'success' | 'error'>('error');
  const [error, setError] = useState<ErrorResponse>();

  const { debouncedValue } = useDebounce(bairroSearch);

  const { data: endereco, isLoading: isLoadingEndereco } = useGetEnderecoById({ id: local.id });

  const {
    data: bairros,
    isLoading: isLoadingBairros,
    isFetchingNextPage: isFetchingNextPageBairros,
    hasNextPage: hasNextPageBairros,
    fetchNextPage: fetchNextPageBairros,
  } = useGetBairrosBySearch({
    nome: debouncedValue,
    status: 'true',
    take: 20,
  });

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors, isValid },
  } = useForm<UpdateEnderecoFormData>({
    resolver: zodResolver(updateEnderecoSchema),
    mode: 'onChange',
  });

  const { mutate: updateEndereco } = useUpdateEndereco();
  const { mutate: deleteEndereco } = useDeleteEndereco();

  const bairrosOptions: SelectOption[] = useMemo(() => {
    if (!bairros?.pages) return [];

    return bairros.pages.flatMap((page) =>
      page.map((bairro) => ({
        label: `${bairro.nome}, ${bairro.uf}`,
        value: bairro.id,
        data: bairro,
      }))
    );
  }, [bairros]);

  useEffect(() => {
    if (endereco) {
      setValue('bairroId', endereco.bairroId);
      setValue('logradouro', endereco.logradouro);
      setValue('numero', endereco.numero || '');
      setValue('cep', endereco.cep || '');
      setValue('complemento', endereco.complemento || '');
      setValue('status', endereco.status);
    }
  }, [endereco, setValue]);

  const modalInfo = {
    success: {
      title: 'Endereço atualizado com sucesso.',
      description: 'As informações do endereço foram atualizadas.',
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
      title: 'Erro ao atualizar endereço.',
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
    if (isEditing && endereco) {
      setValue('bairroId', endereco.bairroId);
      setValue('logradouro', endereco.logradouro);
      setValue('numero', endereco.numero || '');
      setValue('cep', endereco.cep || '');
      setValue('complemento', endereco.complemento || '');
    }
    setIsEditing(!isEditing);
  }

  function handleDeleteConfirm() {
    setIsDeleteModalOpen(true);
  }

  function handleDelete() {
    if (!endereco?.id) return;

    deleteEndereco(endereco.id, {
      onSuccess: () => {
        setIsDeleteModalOpen(false);
        router.replace('/(platform)/enderecos');
      },
      onError: (error) => {
        setIsDeleteModalOpen(false);
        setModalType('error');
        setError(error as unknown as ErrorResponse);
        setIsOpen(true);
      },
    });
  }

  function onSubmit(data: UpdateEnderecoFormData) {
    if (!endereco?.id) return;

    const updateData: Partial<UpdateEnderecoFormData> = {};

    if (data?.bairroId) updateData.bairroId = data.bairroId;
    if (data?.logradouro) updateData.logradouro = data.logradouro;
    if (data?.numero !== undefined) updateData.numero = data.numero;
    if (data?.cep !== undefined) updateData.cep = data.cep;
    if (data?.complemento !== undefined) updateData.complemento = data.complemento;
    if (data?.status !== undefined) updateData.status = data.status;

    updateEndereco(
      {
        body: updateData,
        id: endereco.id,
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

  if (isLoadingEndereco) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!endereco) {
    return (
      <View className="flex-1 items-center justify-center p-5">
        <Text className="text-center text-muted-foreground">Endereço não encontrado</Text>
      </View>
    );
  }

  return (
    <>
      <Stack.Screen options={{ headerTitle: 'Endereço / detalhes' }} />

      <ScrollView className="flex-1">
        <View className="p-5">
          {isEditing && (
            <View className="mb-3 rounded-lg bg-blue-100 p-3">
              <Text className="text-sm font-medium text-blue-700">Modo de edição ativado</Text>
            </View>
          )}

          <Controller
            control={control}
            name="bairroId"
            render={({ field: { onChange, value } }) => (
              <Select<BairrosProps>
                label="Bairro"
                isRequired
                value={value}
                labelModalSearch="Selecionar bairro"
                options={bairrosOptions}
                onValueChange={onChange}
                renderItem={(item, isSelected, onSelect) => {
                  return (
                    <TouchableOpacity
                      onPress={onSelect}
                      className={`py-3 ${isSelected ? 'bg-accent' : ''}`}>
                      <View className="flex items-center justify-center">
                        <Text className={`text-base ${isSelected ? 'font-bold' : 'font-medium'}`}>
                          {item?.data?.nome}
                        </Text>
                        <Text className="text-sm text-muted-foreground">
                          {item?.data?.nome} - {item?.data?.uf}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  );
                }}
                error={errors.bairroId?.message}
                isLoading={isLoadingBairros}
                isFetchingNextPage={isFetchingNextPageBairros}
                hasNextPage={hasNextPageBairros}
                onLoadMore={fetchNextPageBairros}
                onSearchChange={isEditing ? setBairroSearch : undefined}
              />
            )}
          />

          <Controller
            control={control}
            name="logradouro"
            render={({ field: { onChange, value } }) => (
              <InputText
                label="Logradouro"
                isRequired
                placeholder="Digite o logradouro"
                onChangeText={isEditing ? onChange : undefined}
                value={value}
                error={errors.logradouro?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="numero"
            render={({ field: { onChange, value } }) => (
              <InputText
                label="Número"
                placeholder="Digite o número"
                keyboardType="numeric"
                value={value}
                onChangeText={isEditing ? onChange : undefined}
                error={errors?.numero?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="cep"
            render={({ field: { onChange, value } }) => (
              <InputText
                label="CEP"
                placeholder="Digite o CEP"
                keyboardType="numeric"
                value={value}
                onChangeText={isEditing ? onChange : undefined}
                error={errors?.cep?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="complemento"
            render={({ field: { onChange, value } }) => (
              <InputText
                label="Complemento"
                placeholder="Digite algum complemento"
                value={value}
                onChangeText={isEditing ? onChange : undefined}
                error={errors?.complemento?.message}
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
                  <Text>Editar Endereço</Text>
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
        title="Excluir endereço"
        description="Tem certeza que deseja excluir este endereço? Esta ação não pode ser desfeita."
        footerButtons={
          <View className="flex w-full flex-row items-end justify-end gap-2">
            <Button variant="secondary" onPress={() => setIsDeleteModalOpen(false)}>
              <Text>Cancelar</Text>
            </Button>
            <Button variant="destructive" onPress={handleDelete}>
              <Text>Excluir Endereço</Text>
            </Button>
          </View>
        }
      />
    </>
  );
}