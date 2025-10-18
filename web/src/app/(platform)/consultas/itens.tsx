import { Select, SelectOption } from '@/components/Inputs/Select';
import { Button } from '@/components/ui/button';
import { CardContent, CardHeader } from '@/components/ui/card';
import { Text } from '@/components/ui/text';
import { useGetEstadosBySearch } from '@/hooks/queries/estados/useGetEstadosBySearch';
import { useGetItemPreco } from '@/hooks/queries/itens/useGetItemPreco';
import { useGetItensBySearch } from '@/hooks/queries/itens/useGetItensBySearch';
import { useDebounce } from '@/hooks/useDebounce';
import { EstadoProps } from '@/types/estados/estados';
import { ItemProps } from '@/types/itens/itens';
import { Stack } from 'expo-router';
import { useMemo, useState } from 'react';
import { ActivityIndicator, TouchableOpacity, View } from 'react-native';

export default function ClientesConsultarScreen() {
  const [itemSelected, setItemSelected] = useState('');
  const [estadoSelected, setEstadoSelected] = useState('');

  const [apiItem, setApiItem] = useState('');
  const [apiEstado, setApiEstado] = useState('');

  const [itemSearch, setItemSearch] = useState('');
  const [estadoSearch, setEstadoSearch] = useState('');

  const { debouncedValue: debouncedItem } = useDebounce(itemSearch);
  const { debouncedValue: debouncedEstado } = useDebounce(estadoSearch);

  const {
    data: itens,
    isLoading: isLoadingItens,
    isFetchingNextPage: isFetchingNextPageItens,
    hasNextPage: hasNextPageItens,
    fetchNextPage: fetchNextPageItens,
  } = useGetItensBySearch({
    nomenclatura: debouncedItem,
    take: 20,
  });

  const {
    data: estados,
    isLoading: isLoadingEstados,
    isFetchingNextPage: isFetchingNextPageEstados,
    hasNextPage: hasNextPageEstados,
    fetchNextPage: fetchNextPageEstados,
  } = useGetEstadosBySearch({
    nome: debouncedEstado,
    take: 20,
  });

  const { data: itemPreco, isLoading: isLoadingItemPreco } = useGetItemPreco({
    estadoId: apiEstado,
    itemId: apiItem,
  });

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

  const estadosOptions: SelectOption[] = useMemo(() => {
    if (!estados?.pages) return [];

    return estados.pages.flatMap((page) =>
      page.map((estado) => ({
        label: estado?.nome,
        value: estado.id,
        data: estado,
      }))
    );
  }, [estados]);

  function onSubmit() {
    setApiEstado(estadoSelected);
    setApiItem(itemSelected);
  }

  return (
    <>
      <Stack.Screen options={{ headerTitle: 'Consultas / itens' }} />
      <View className="m-5">
        <Select<ItemProps>
          label="Item"
          isRequired
          value={itemSelected}
          labelModalSearch="Selecionar item"
          options={itensOptions}
          onValueChange={(value) => setItemSelected(value)}
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
          // error={errors.bairro}
          isLoading={isLoadingItens}
          isFetchingNextPage={isFetchingNextPageItens}
          hasNextPage={hasNextPageItens}
          onLoadMore={fetchNextPageItens}
          onSearchChange={setItemSearch}
        />

        <Select<EstadoProps>
          label="Estado"
          isRequired
          value={estadoSelected}
          labelModalSearch="Selecionar estado"
          options={estadosOptions}
          onValueChange={(value) => setEstadoSelected(value)}
          renderItem={(item, isSelected, onSelect) => {
            return (
              <TouchableOpacity
                onPress={onSelect}
                className={`py-3 ${isSelected ? 'bg-accent' : ''}`}>
                <View className="flex items-center justify-center">
                  <Text className={`text-base ${isSelected ? 'font-bold' : 'font-medium'}`}>
                    {item?.data?.nome}, {item?.data?.uf}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          }}
          // error={errors.bairro}
          isLoading={isLoadingEstados}
          isFetchingNextPage={isFetchingNextPageEstados}
          hasNextPage={hasNextPageEstados}
          onLoadMore={fetchNextPageEstados}
          onSearchChange={setEstadoSearch}
        />

        <Button onPress={onSubmit}>
          <Text>Consultar</Text>
        </Button>
      </View>

      {itemPreco ? (
        <View className="w-full flex-1 px-5 pb-10">
          <View className="py-3 shadow-sm">
            <CardHeader className="gap-1">
              <Text className="text-base font-semibold leading-snug">
                {itemPreco?.nomenclatura}
              </Text>
            </CardHeader>
            <CardContent className="gap-1">
              {itemPreco?.codigo && (
                <Text className="text-sm text-muted-foreground">Código: {itemPreco.codigo}</Text>
              )}
              {itemPreco?.unidade && (
                <Text className="text-sm text-muted-foreground">Unidade: {itemPreco.unidade}</Text>
              )}
              {itemPreco?.valor && (
                <Text className="text-sm text-muted-foreground">Valor: R$ {itemPreco.valor}</Text>
              )}
            </CardContent>
          </View>
        </View>
      ) : isLoadingItemPreco ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" />
          <Text className="mt-4">Carregando...</Text>
        </View>
      ) : (
        <View className="flex flex-row justify-center">
          <Text className="text-gray-400">Selecione as opções para buscar</Text>
        </View>
      )}
    </>
  );
}
