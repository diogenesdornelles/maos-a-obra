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
import { useGetItemPreco } from '@/hooks/queries/itens/useGetItemPreco';
import { useGetItensBySearch } from '@/hooks/queries/itens/useGetItensBySearch';
import { useGetProjetoItensBySearch } from '@/hooks/queries/projeto-itens/useGeProjetoItensBySearch';
import { usePostCreateProjetoItem } from '@/hooks/queries/projeto-itens/usePostCreateProjetoItem';
import { useGetProjetoById } from '@/hooks/queries/projetos/useGetProjetoById';
import { useDebounce } from '@/hooks/useDebounce';
import { ErrorResponse } from '@/types/errorParser';
import { ItemProps } from '@/types/itens/itens';
import { ProjetoItemProps } from '@/types/projeto-itens/projetoItens';
import { arrayOfErrors } from '@/utils/errorsParser';
import { formatCurrency, formatCurrencyInput, parseCurrencyToNumber } from '@/utils/parseCurrency';
import { zodResolver } from '@hookform/resolvers/zod';
import { Stack, useLocalSearchParams } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { TouchableOpacity, View } from 'react-native';

export default function ProjetosAdicionarItensScreen() {
  const local: { id: string } = useLocalSearchParams();
  const [itemIdSearch, setItemIdSearch] = useState('');
  const [precoDisplay, setPrecoDisplay] = useState('');

  const [isOpen, setIsOpen] = useState(false);
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
  } = useForm<AddProjetoItensFormData>({
    resolver: zodResolver(addProjetoItensSchema),
    mode: 'onChange',
  });

  const itemId = watch('itemId');
  const preco = watch('preco');
  const quantidade = watch('quantidade');

  const { data: projeto, refetch: refetchProjeto } = useGetProjetoById({ id: local.id });

  const { data: itemPreco } = useGetItemPreco({
    estadoId: projeto?.estadoId ?? '',
    itemId: itemId,
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
    take: 20,
    orderBy: 'criadoEm',
    orderDir: 'desc',
  });

  const {
    data: itens,
    isLoading: isLoadingItens,
    isFetchingNextPage: isFetchingNextPageItens,
    hasNextPage: hasNextPageItens,
    fetchNextPage: fetchNextPageItens,
  } = useGetItensBySearch({
    nomenclatura: debouncedValue,
    take: 20,
  });

  const { mutate } = usePostCreateProjetoItem();

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
    if (itemPreco?.valor) {
      const preco = parseFloat(itemPreco.valor);
      setValue('preco', preco, { shouldValidate: true });
      setPrecoDisplay(formatCurrencyInput((preco * 100).toFixed(0)));
    }
  }, [itemPreco, setValue]);

  const modalInfo = {
    success: {
      title: 'Item adicionado ao projeto.',
      description: 'Item foi adicionado com sucesso',
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
      title: 'Item não adicionado ao projeto.',
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

  function onSubmit(data: AddProjetoItensFormData) {
    if (!projeto?.id) {
      return;
    }

    mutate(
      {
        projetoId: projeto?.id,
        itemId: data?.itemId,
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

  return (
    <>
      <Stack.Screen options={{ headerTitle: `Projetos / adicionar itens / ${projeto?.nome}` }} />
      <View className="m-5">
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

        <Button onPress={handleSubmit(onSubmit)} disabled={!isValid && !projeto?.id}>
          <Text>Salvar</Text>
        </Button>

        <Text className="my-3 text-lg font-bold">
          Total projeto: {formatCurrency(projeto?.valorTotal ? parseFloat(projeto.valorTotal) : 0)}
        </Text>
      </View>

      <View className="mb-5 w-full flex-1">
        <InfiniteList<ProjetoItemProps>
          data={projetoItensList}
          className="flex-1"
          renderItem={(item) => {
            return (
              <View className="flex items-start justify-center py-2">
                <Text className="text-base font-semibold leading-snug">{item?.nomenclatura}</Text>
                {item?.codigo && (
                  <Text className="text-sm text-muted-foreground">Código: {item.codigo}</Text>
                )}
                {item?.preco && (
                  <Text className="text-sm text-muted-foreground">Unidade: {item.preco}</Text>
                )}
                {item?.quantidade && (
                  <Text className="text-sm text-muted-foreground">
                    Quantidade: {item.quantidade}
                  </Text>
                )}
                {item?.valorTotal && (
                  <Text className="text-sm text-muted-foreground">
                    Valor total: R$ {parseFloat(item.preco) * parseFloat(item.quantidade)}
                  </Text>
                )}
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

      <Modal
        isOpen={isOpen}
        title={modalInfo[modalType].title}
        description={modalInfo[modalType].description}
        footerButtons={modalInfo[modalType].footer}
      />
    </>
  );
}