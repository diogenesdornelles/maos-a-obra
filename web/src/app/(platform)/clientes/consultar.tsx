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
      cpf: filters?.cpf,
      cnpj: filters?.cnpj,
      email: filters?.email,
      take: 20,
    });

  const clientes = useMemo(() => data?.pages.flatMap((page) => page) ?? [], [data]);

  function sanitizeFilters() {
    return {
      nome: nome.trim().length > 0 ? nome.trim() : '',
      cpf: cpf.trim().length > 0 ? cpf.trim() : '',
      cnpj: cnpj.trim().length > 0 ? cnpj.trim() : '',
      email: email.trim().length > 0 ? email.trim() : '',
    };
  }

  function onSubmit() {
    setFilters(sanitizeFilters());
  }

  return (
    <>
      <Stack.Screen options={{ headerTitle: 'Clientes / consultar' }} />
      <View className="m-5">
        <View className="pb-2">
          <InputText
            label="Nome"
            placeholder="Digite o nome"
            onChangeText={setNome}
            value={nome}
          />
          <InputText
            label="CPF"
            placeholder="Digite o CPF"
            onChangeText={setCpf}
            value={cpf}
          />
          <InputText
            label="CNPJ"
            placeholder="Digite o CNPJ"
            onChangeText={setCnpj}
            value={cnpj}
          />
          <InputText
            label="Email"
            placeholder="Digite o email"
            onChangeText={setEmail}
            value={email}
            keyboardType="email-address"
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
                      Endereço: {item?.endereco?.logradouro}
                      {item?.endereco?.numero ? `, ${item?.endereco?.numero}` : ''}
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