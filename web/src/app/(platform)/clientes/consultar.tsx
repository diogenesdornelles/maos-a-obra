import { InfiniteList } from '@/components/InfiniteList';
import { InputText } from '@/components/Inputs/InputText';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { useGetClientesBySearch } from '@/hooks/queries/clients/useGetClientesBySearch';
import { ClienteProps } from '@/types/clientes/clientes';
import { Stack } from 'expo-router';
import { useMemo, useState } from 'react';
import { View } from 'react-native';

export default function ClientesConsultarScreen() {
  const [nome, setNome] = useState('');
  const [cpf, setCpf] = useState('');
  const [cnpj, setCnpj] = useState('');
  const [email, setEmail] = useState('');

  const [filters, setFilters] = useState<{
    nome?: string;
    cpf?: string;
    cnpj?: string;
    email?: string;
  }>({ nome: '', cpf: '', cnpj: '', email: '' });

  const { data, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage } =
    useGetClientesBySearch({
      nome: filters?.nome,
      cpf: filters?.cnpj,
      email: filters?.email,
      cnpj: filters?.cnpj,
      take: 20,
    });

  const clientes = useMemo(() => data?.pages.flatMap((page) => page) ?? [], [data]);

  function onSubmit() {
    setFilters({ cnpj, cpf, email, nome });
  }

  return (
    <>
      <Stack.Screen options={{ headerTitle: 'Clientes / consultar' }} />
      <View className="m-5">
        <View className="pb-2">
          <InputText
            label="Nome"
            placeholder="Digite nome do cliente"
            onChangeText={setNome}
            value={nome}
          />
          <InputText label="CPF" placeholder="Digite o cpf" onChangeText={setCpf} value={cpf} />
          <InputText label="CNPJ" placeholder="Digite o cnpj" onChangeText={setCnpj} value={cnpj} />
          <InputText
            label="Email"
            placeholder="Digite o email"
            onChangeText={setEmail}
            value={email}
          />
        </View>

        <Button onPress={onSubmit}>
          <Text>Consultar</Text>
        </Button>
      </View>
      <View className="w-full flex-1 px-5 pb-10">
        <InfiniteList<ClienteProps>
          data={clientes}
          renderItem={(item) => {
            return (
              <View className="py-3">
                <View className="flex items-center justify-center">
                  <Text className="text-base font-medium">
                    {item?.nome} {item?.sobrenome}
                  </Text>
                  {item?.cpf && (
                    <Text className="text-sm text-muted-foreground">CPF: {item?.cpf}</Text>
                  )}
                  {item?.cnpj && (
                    <Text className="text-sm text-muted-foreground">CNPJ: {item?.cnpj}</Text>
                  )}
                  {item?.email && (
                    <Text className="text-sm text-muted-foreground">Email: {item?.email}</Text>
                  )}
                  {item?.telefone && (
                    <Text className="text-sm text-muted-foreground">
                      Telefone: {item?.telefone}
                    </Text>
                  )}
                  {item?.endereco?.logradouro && (
                    <Text className="text-sm text-muted-foreground">
                      Logradouro: {item?.endereco?.logradouro}
                    </Text>
                  )}
                </View>
              </View>
            );
          }}
          isLoading={isLoading}
          isFetchingNextPage={isFetchingNextPage}
          hasNextPage={hasNextPage}
          onLoadMore={fetchNextPage}
          emptyMessage="Nenhum cliente encontrado"
          className="h-full"
        />
      </View>
    </>
  );
}
