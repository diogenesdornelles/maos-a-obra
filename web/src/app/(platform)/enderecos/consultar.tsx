import { InfiniteList } from '@/components/InfiniteList';
import { InputText } from '@/components/Inputs/InputText';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { useGetEnderecosBySearch } from '@/hooks/queries/enderecos/useGetEnderecosBySearch';
import { EnderecoProps } from '@/types/enderecos/enderecos';
import { Stack } from 'expo-router';
import { useMemo, useState } from 'react';
import { View } from 'react-native';

export default function EnderecosConsultarScreen() {
  const [logradouro, setLogradouro] = useState('');
  const [cep, setCep] = useState('');
  const [numeroCasa, setNumeroCasa] = useState('');

  const [filters, setFilters] = useState<{
    logradouro: string | null;
    cep: string | null;
    numero: number | null;
  }>({ logradouro: null, cep: null, numero: null });

  const { data, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage } =
    useGetEnderecosBySearch({
      logradouro: filters?.logradouro,
      cep: filters?.cep,
      numero: filters?.numero,
      take: 20,
    });

  const enderecos = useMemo(() => data?.pages.flatMap((page) => page) ?? [], [data]);

  function sanitizeFilters() {
    const sanitizedCep = cep.trim();
    const sanitizedNumero = numeroCasa.trim();

    return {
      logradouro: logradouro.trim().length > 0 ? logradouro.trim() : null,
      cep: sanitizedCep.length === 8 ? sanitizedCep : null,
      numero: sanitizedNumero.length > 0 ? Number(sanitizedNumero) : null,
    };
  }

  function onSubmit() {
    setFilters(sanitizeFilters());
  }

  return (
    <>
      <Stack.Screen options={{ headerTitle: 'Endereços / consultar' }} />
      <View className="m-5">
        <View className="pb-2">
          <InputText
            label="Logradouro"
            placeholder="Digite o logradouro"
            onChangeText={setLogradouro}
            value={logradouro}
          />
          <InputText label="CEP" placeholder="Digite o cep" onChangeText={setCep} value={cep} />
          <InputText
            label="Número"
            placeholder="Digite o número da casa"
            onChangeText={setNumeroCasa}
            value={numeroCasa ?? undefined}
          />
        </View>

        <Button onPress={onSubmit}>
          <Text>Consultar</Text>
        </Button>
      </View>
      <View className="w-full flex-1 px-5 pb-10">
        <InfiniteList<EnderecoProps>
          data={enderecos}
          renderItem={(item) => {
            return (
              <View className="py-3">
                <View className="flex items-center justify-center">
                  <Text className="text-base font-medium">
                    {item?.bairro?.nome?.split(' - ')[0]}
                  </Text>
                  {item?.logradouro && (
                    <Text className="text-sm text-muted-foreground">
                      Logradouro: {item?.logradouro}
                      {item?.numero ? `, ${item?.numero}` : ''}
                    </Text>
                  )}
                  {item?.bairro?.nome && (
                    <Text className="text-sm text-muted-foreground">
                      Cidade: {item?.bairro?.nome?.split(' - ')[1]}
                      {item?.bairro?.uf ? `, ${item?.bairro?.uf}` : ''}
                    </Text>
                  )}
                  {item?.cep && (
                    <Text className="text-sm text-muted-foreground">CEP: {item?.cep}</Text>
                  )}
                  {item?.complemento && (
                    <Text className="text-sm text-muted-foreground">CEP: {item?.complemento}</Text>
                  )}
                </View>
              </View>
            );
          }}
          isLoading={isLoading}
          isFetchingNextPage={isFetchingNextPage}
          hasNextPage={hasNextPage}
          onLoadMore={fetchNextPage}
          emptyMessage="Nenhum endereço encontrado"
          className="h-full"
        />
      </View>
    </>
  );
}
