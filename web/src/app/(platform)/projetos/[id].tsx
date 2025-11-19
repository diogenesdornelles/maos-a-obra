import { InfiniteList } from '@/components/InfiniteList';
import { InputText } from '@/components/Inputs/InputText';
import { Select, SelectOption } from '@/components/Inputs/Select';
import { Modal } from '@/components/Modal';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import {
  AddProjetoItensFormData,
  addProjetoItensSchema,
} from '@/features/(platform)/projetos/id/validations/addProjetoItensForm';
import {
  UpdateProjetoItensFormData,
  updateProjetoItensSchema,
} from '@/features/(platform)/projetos/id/validations/alterarProjetoItensForm';
import { useGetItemPreco } from '@/hooks/queries/itens/useGetItemPreco';
import { useGetItensBySearch } from '@/hooks/queries/itens/useGetItensBySearch';
import { useDeleteProjetoItem } from '@/hooks/queries/projeto-itens/useDeleteProjetoItem';
import { useGetProjetoItensBySearch } from '@/hooks/queries/projeto-itens/useGeProjetoItensBySearch';
import { useGetProjetoItemById } from '@/hooks/queries/projeto-itens/useGetProjetoItemById';
import { usePostCreateProjetoItem } from '@/hooks/queries/projeto-itens/usePostCreateProjetoItem';
import { useUpdateProjetoItem } from '@/hooks/queries/projeto-itens/useUpdateProjetoItem';
import { useDeleteProjeto } from '@/hooks/queries/projetos/useDeleteProjeto';
import { useGetProjetoById } from '@/hooks/queries/projetos/useGetProjetoById';
import { useDebounce } from '@/hooks/useDebounce';
import { ErrorResponse } from '@/types/errorParser';
import { ItemProps } from '@/types/itens/itens';
import { ProjetoItemProps } from '@/types/projeto-itens/projetoItens';
import { UpdateProjetoItem } from '@/types/projeto-itens/update';
import { arrayOfErrors } from '@/utils/errorsParser';
import { formatCurrency, formatCurrencyInput, parseCurrencyToNumber } from '@/utils/parseCurrency';
import { zodResolver } from '@hookform/resolvers/zod';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import { Edit, Trash2 } from 'lucide-react-native';
import { useEffect, useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Pressable, TouchableOpacity, View } from 'react-native';

export default function ProjetosManageItensScreen() {
  const local: { id: string } = useLocalSearchParams();
  const [itemIdSearch, setItemIdSearch] = useState('');
  const [precoDisplay, setPrecoDisplay] = useState('');
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [deletingItemId, setDeletingItemId] = useState<string | null>(null);

  const [isOpen, setIsOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleteProjetoModalOpen, setIsDeleteProjetoModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'success' | 'error'>('error');
  const [error, setError] = useState<ErrorResponse>();

  const { debouncedValue } = useDebounce(itemIdSearch);

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isValid },
  } = useForm<AddProjetoItensFormData | UpdateProjetoItensFormData>({
    resolver: zodResolver(editingItemId ? updateProjetoItensSchema : addProjetoItensSchema),
    mode: 'onChange',
  });

  const itemId = watch('itemId');
  const preco = watch('preco');
  const quantidade = watch('quantidade');

  const { data: projeto, refetch: refetchProjeto } = useGetProjetoById({ id: local.id });

  const { data: itemPreco } = useGetItemPreco({
    estadoId: projeto?.estadoId ?? '',
    itemId: itemId || '',
  });

  const {
    data: projetoItens,
    isLoading: isLoadingProjetoItem,
    refetch: refetchProjetoItem,
    isFetchingNextPage: isFetchingNextPageProjetoItem,
    hasNextPage: hasNextPageProjetoItem,
    fetchNextPage: fetchNextPageProjetoItem,
  } = useGetProjetoItensBySearch({
    projetoId: projeto?.id,
    status: 'true',
    take: 20,
    orderBy: 'criadoEm',
    orderDir: 'desc',
  });

  const { data: projetoItem } = useGetProjetoItemById({ id: editingItemId || '' });

  const {
    data: itens,
    isLoading: isLoadingItens,
    isFetchingNextPage: isFetchingNextPageItens,
    hasNextPage: hasNextPageItens,
    fetchNextPage: fetchNextPageItens,
  } = useGetItensBySearch({
    nomenclatura: debouncedValue,
    status: 'true',
    take: 20,
  });

  const { mutate: createProjetoItem } = usePostCreateProjetoItem();
  const { mutate: updateProjetoItem } = useUpdateProjetoItem();
  const { mutate: deleteProjetoItem } = useDeleteProjetoItem();
  const { mutate: deleteProjeto } = useDeleteProjeto();

  const projetoItensList = useMemo(
    () => projetoItens?.pages.flatMap((page) => page) ?? [],
    [projetoItens]
  );

  const itensOptions: SelectOption[] = useMemo(() => {
    if (!itens?.pages) return [];

    return itens.pages.flatMap((page) =>
      page.map((item) => ({
        label: `${item.nomenclatura}`,
        value: item.id,
        data: item,
      }))
    );
  }, [itens]);

  const total = useMemo(() => {
    if (!preco || !quantidade) return 0;
    return preco * quantidade;
  }, [preco, quantidade]);

  useEffect(() => {
    if (projetoItem && editingItemId) {
      setValue('quantidade', parseFloat(projetoItem.quantidade), { shouldValidate: true });
      setValue('preco', parseFloat(projetoItem.preco), { shouldValidate: true });
      setPrecoDisplay(formatCurrencyInput((parseFloat(projetoItem.preco) * 100).toFixed(0)));
      setValue('itemId', projetoItem.itemId, { shouldValidate: true });
    }
  }, [projetoItem, editingItemId, setValue]);

  useEffect(() => {
    if (itemPreco?.valor && !editingItemId && itemId) {
      const preco = parseFloat(itemPreco.valor);
      setValue('preco', preco, { shouldValidate: true });
      setPrecoDisplay(formatCurrencyInput((preco * 100).toFixed(0)));
    }
  }, [itemPreco, itemId, editingItemId, setValue]);

  const modalInfo = {
    success: {
      title: editingItemId ? 'Item atualizado com sucesso.' : 'Item adicionado ao projeto.',
      description: editingItemId
        ? 'Item foi atualizado com sucesso'
        : 'Item foi adicionado com sucesso',
      footer: (
        <View className="flex w-full flex-row items-end justify-end gap-2">
          <Button
            onPress={() => {
              setIsOpen(false);
            }}>
            <Text>Continuar</Text>
          </Button>
        </View>
      ),
    },
    error: {
      title: editingItemId ? 'Erro ao atualizar item.' : 'Item não adicionado ao projeto.',
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

  function handleEditProjetoItem(item: ProjetoItemProps) {
    setEditingItemId(item.id);
  }

  function handleCancelEditProjetoItem() {
    setEditingItemId(null);
    reset({
      itemId: '',
      preco: undefined,
      quantidade: undefined,
    });
    setPrecoDisplay('');
    setItemIdSearch('');
  }

  function handleDeleteProjetoItemConfirm(itemId: string) {
    setDeletingItemId(itemId);
    setIsDeleteModalOpen(true);
  }

  async function handleDeleteProjetoItem() {
    if (!deletingItemId) return;

    deleteProjetoItem(deletingItemId, {
      onSuccess: async () => {
        setIsDeleteModalOpen(false);
        setDeletingItemId(null);
        await refetchProjetoItem();
        await refetchProjeto();
      },
      onError: (error) => {
        setIsDeleteModalOpen(false);
        setDeletingItemId(null);
        setModalType('error');
        setError(error as unknown as ErrorResponse);
        setIsOpen(true);
      },
    });
  }

  function handleDeleteProjetoConfirm() {
    setIsDeleteProjetoModalOpen(true);
  }

  function handleDeleteProjeto() {
    if (!projeto?.id) return;

    deleteProjeto(projeto.id, {
      onSuccess: () => {
        setIsDeleteProjetoModalOpen(false);
        router.replace('/(platform)/projetos');
      },
      onError: (error) => {
        setIsDeleteProjetoModalOpen(false);
        setModalType('error');
        setError(error as unknown as ErrorResponse);
        setIsOpen(true);
      },
    });
  }

  function onSubmit(data: AddProjetoItensFormData | UpdateProjetoItensFormData) {
    if (!projeto?.id) {
      return;
    }

    if (editingItemId) {
      const updateData: Partial<UpdateProjetoItem> = {};

      if (data?.itemId) updateData.itemId = data.itemId;
      if (data?.preco !== undefined) updateData.preco = String(data.preco);
      if (data?.quantidade !== undefined) updateData.quantidade = String(data.quantidade);

      updateProjetoItem(
        {
          id: editingItemId,
          body: updateData,
        },
        {
          onSuccess: () => {
            setModalType('success');
            setIsOpen(true);
            handleCancelEditProjetoItem();
            refetchProjetoItem();
            refetchProjeto();
          },
          onError: (error) => {
            setModalType('error');
            setError(error as unknown as ErrorResponse);
            setIsOpen(true);
          },
        }
      );
    } else {
      createProjetoItem(
        {
          projetoId: projeto?.id,
          itemId: data?.itemId || '',
          preco: data?.preco,
          quantidade: data?.quantidade,
          status: true,
        },
        {
          onSuccess: () => {
            setModalType('success');
            setIsOpen(true);
            reset();
            setPrecoDisplay('');
            setItemIdSearch('');
            refetchProjetoItem();
            refetchProjeto();
          },
          onError: (error) => {
            setModalType('error');
            setError(error as unknown as ErrorResponse);
            setIsOpen(true);
          },
        }
      );
    }
  }

  return (
    <>
      <Stack.Screen
        options={{
          headerTitle: `Projetos / adicionar itens / ${projeto?.nome}`,
          headerRight: () => (
            <Pressable onPress={handleDeleteProjetoConfirm} className="mr-4">
              <Trash2 size={20} className="text-muted-foreground" />
            </Pressable>
          ),
        }}
      />
      <View className="m-5">
        {editingItemId && (
          <View className="mb-3 rounded-lg bg-blue-100 p-3">
            <Text className="text-sm font-medium text-blue-700">Editando item</Text>
          </View>
        )}

        <Controller
          control={control}
          name="itemId"
          render={({ field: { onChange, value } }) => (
            <Select<ItemProps>
              label="Item"
              isRequired
              value={value}
              labelModalSearch="Selecionar item"
              options={itensOptions}
              onValueChange={onChange}
              renderItem={(item, isSelected, onSelect) => {
                return (
                  <TouchableOpacity
                    onPress={onSelect}
                    className={`py-3 ${isSelected ? 'bg-accent' : ''}`}>
                    <View className="flex items-center justify-center">
                      <Text className={`text-base ${isSelected ? 'font-bold' : 'font-medium'}`}>
                        {item?.data?.nomenclatura}
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              }}
              error={errors?.itemId?.message}
              isLoading={isLoadingItens}
              isFetchingNextPage={isFetchingNextPageItens}
              hasNextPage={hasNextPageItens}
              onLoadMore={fetchNextPageItens}
              onSearchChange={setItemIdSearch}
            />
          )}
        />

        <Controller
          control={control}
          name="preco"
          render={({ field: { onChange } }) => (
            <InputText
              label="Valor"
              isRequired
              keyboardType="numeric"
              placeholder="0,00"
              onChangeText={(text) => {
                const formatted = formatCurrencyInput(text);
                setPrecoDisplay(formatted);
                const numericValue = parseCurrencyToNumber(formatted);
                onChange(numericValue);
              }}
              value={precoDisplay}
              error={errors.preco?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="quantidade"
          render={({ field: { onChange, value } }) => (
            <InputText
              label="Quantidade"
              isRequired
              placeholder="Item quantidade"
              keyboardType="numeric"
              onChangeText={(text) => {
                const numericValue = parseFloat(text) || 0;
                onChange(numericValue);
              }}
              value={value?.toString()}
              error={errors.quantidade?.message}
            />
          )}
        />

        <Text className="mb-3 text-lg font-bold">Total item: {formatCurrency(total)}</Text>

        <View className="flex-row gap-2">
          <Button
            className="flex-1"
            onPress={handleSubmit(onSubmit)}
            disabled={!isValid && !projeto?.id}>
            <Text>{editingItemId ? 'Atualizar' : 'Salvar'}</Text>
          </Button>

          {editingItemId && (
            <Button variant="secondary" onPress={handleCancelEditProjetoItem}>
              <Text>Cancelar</Text>
            </Button>
          )}
        </View>

        <Text className="my-3 text-lg font-bold">
          Total projeto: {formatCurrency(projeto?.valorTotal ? parseFloat(projeto.valorTotal) : 0)}
        </Text>
      </View>

      <View className="mb-5 w-full flex-1">
        <InfiniteList<ProjetoItemProps>
          data={projetoItensList}
          className="flex-1"
          renderItem={(item) => {
            const isEditing = editingItemId === item.id;
            return (
              <View
                className={`flex-row items-center justify-between py-2 ${
                  isEditing ? 'rounded-lg bg-blue-50' : ''
                }`}>
                <View className="flex-1">
                  <Text className="text-base font-semibold leading-snug">{item?.nomenclatura}</Text>
                  {item?.codigo && (
                    <Text className="text-sm text-muted-foreground">Código: {item.codigo}</Text>
                  )}
                  {item?.preco && (
                    <Text className="text-sm text-muted-foreground">
                      Unidade: {formatCurrency(parseFloat(item.preco))}
                    </Text>
                  )}
                  {item?.quantidade && (
                    <Text className="text-sm text-muted-foreground">
                      Quantidade: {item.quantidade}
                    </Text>
                  )}
                  {item?.preco && item?.quantidade && (
                    <Text className="text-sm font-medium text-muted-foreground">
                      Valor total:{' '}
                      {formatCurrency(parseFloat(item.preco) * parseFloat(item.quantidade))}
                    </Text>
                  )}
                </View>

                <View className="flex-row gap-2">
                  <TouchableOpacity
                    onPress={() => handleEditProjetoItem(item)}
                    className="rounded-lg bg-blue-100 p-2 active:bg-blue-200">
                    <Edit size={20} className="text-blue-700" />
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => handleDeleteProjetoItemConfirm(item.id)}
                    className="rounded-lg bg-red-100 p-2 active:bg-red-200">
                    <Trash2 size={20} className="text-red-700" />
                  </TouchableOpacity>
                </View>
              </View>
            );
          }}
          isLoading={isLoadingProjetoItem}
          isFetchingNextPage={isFetchingNextPageProjetoItem}
          hasNextPage={hasNextPageProjetoItem}
          onLoadMore={fetchNextPageProjetoItem}
          emptyMessage="Nenhum item encontrado"
        />
      </View>

      {/* Modal de sucesso/erro */}
      <Modal
        isOpen={isOpen}
        title={modalInfo[modalType].title}
        description={modalInfo[modalType].description}
        footerButtons={modalInfo[modalType].footer}
      />

      {/* Modal de confirmação de exclusão de item */}
      <Modal
        isOpen={isDeleteModalOpen}
        title="Confirmar exclusão"
        description="Tem certeza que deseja excluir este item do projeto? Esta ação não pode ser desfeita."
        footerButtons={
          <View className="flex w-full flex-row items-end justify-end gap-2">
            <Button variant="secondary" onPress={() => setIsDeleteModalOpen(false)}>
              <Text>Cancelar</Text>
            </Button>
            <Button variant="destructive" onPress={handleDeleteProjetoItem}>
              <Text>Excluir</Text>
            </Button>
          </View>
        }
      />

      {/* Modal de confirmação de exclusão de projeto */}
      <Modal
        isOpen={isDeleteProjetoModalOpen}
        title="Excluir projeto"
        description="Tem certeza que deseja excluir este projeto? Todos os itens serão removidos. Esta ação não pode ser desfeita."
        footerButtons={
          <View className="flex w-full flex-row items-end justify-end gap-2">
            <Button variant="secondary" onPress={() => setIsDeleteProjetoModalOpen(false)}>
              <Text>Cancelar</Text>
            </Button>
            <Button variant="destructive" onPress={handleDeleteProjeto}>
              <Text>Excluir Projeto</Text>
            </Button>
          </View>
        }
      />
    </>
  );
}