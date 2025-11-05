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
    logradouro?: string;
    cep?: string;
    numero?: string;
  }>({ logradouro: '', cep: '', numero: '' });

  const { data, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage } =
    useGetEnderecosBySearch({
      logradouro: filters?.logradouro,
      cep: filters?.cep,
      numero: filters?.numero,
      status: 'true',
      take: 20,
    });

  const enderecos = useMemo(() => data?.pages.flatMap((page) => page) ?? [], [data]);

  function onSubmit() {
    setFilters({ cep, logradouro, numero: numeroCasa });
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
