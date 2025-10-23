import { InfiniteList } from '@/components/InfiniteList';
import { InputText } from '@/components/Inputs/InputText';
import { Select, SelectOption } from '@/components/Inputs/Select';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import {
  consultaProjetoFormData,
  consultaProjetoSchema,
} from '@/features/(platform)/projetos/consultas/validations/consultaProjetoForm';
import { useGetClientesBySearch } from '@/hooks/queries/clients/useGetClientesBySearch';
import { useGetEstadosBySearch } from '@/hooks/queries/estados/useGetEstadosBySearch';
import { useGetProjetosBySearch } from '@/hooks/queries/projetos/useGeProjetosBySearch';
import { useDebounce } from '@/hooks/useDebounce';
import { ClienteProps } from '@/types/clientes/clientes';
import { EstadoProps } from '@/types/estados/estados';
import { ProjetoProps } from '@/types/projetos/projetos';
import { formatCurrency } from '@/utils/parseCurrency';
import { zodResolver } from '@hookform/resolvers/zod';
import { Stack } from 'expo-router';
import { useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { TouchableOpacity, View } from 'react-native';

export default function ProjetosConsultarScreen() {
  // STATES REACT
  const [filters, setFilters] = useState<consultaProjetoFormData>();

  const [clientSearch, setClientSearch] = useState('');
  const [estadoSearch, setEstadoSearch] = useState('');

  const { debouncedValue: debouncedClient } = useDebounce(clientSearch);
  const { debouncedValue: debouncedEstado } = useDebounce(estadoSearch);

  const {
    control,
    handleSubmit,
    formState: { isValid, errors },
  } = useForm<consultaProjetoFormData>({
    resolver: zodResolver(consultaProjetoSchema),
    mode: 'onChange',
  });

  // API REACT QUERY
  const {
    data: projetos,
    isLoading: isLoadingProjetos,
    isFetchingNextPage: isFetchingNextPageProjetos,
    hasNextPage: hasNextPageProjetos,
    fetchNextPage: fetchNextPageProjetos,
  } = useGetProjetosBySearch({
    nome: filters?.nome,
    clienteId: filters?.clienteId,
    estadoId: filters?.estado,
    take: 20,
  });

  const {
    data: clients,
    isLoading: isLoadingClients,
    isFetchingNextPage: isFetchingNextPageClients,
    hasNextPage: hasNextPageClients,
    fetchNextPage: fetchNextPageClients,
  } = useGetClientesBySearch({
    nome: debouncedClient,
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

  // LISTAS
  const projetoList = useMemo(() => projetos?.pages.flatMap((page) => page) ?? [], [projetos]);

  const clientOptions: SelectOption[] = useMemo(() => {
    if (!clients?.pages) return [];

    return clients.pages.flatMap((page) =>
      page.map((client) => ({
        label: `${client.nome} ${client?.sobrenome ?? ''}`,
        value: client?.id,
        data: client,
      }))
    );
  }, [clients]);

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

  // FUNÇÕES E USEEFFECTS
  function onSubmit(data: consultaProjetoFormData) {
    setFilters({ clienteId: data?.clienteId, estado: data?.estado, nome: data?.nome });
  }

  return (
    <>
      <Stack.Screen options={{ headerTitle: 'Consultas / projetos' }} />
      <View className="m-5">
        <Controller
          control={control}
          name="nome"
          render={({ field: { onChange, value } }) => (
            <InputText
              label="Nome"
              placeholder="Nome do projeto"
              onChangeText={onChange}
              value={value}
            />
          )}
        />

        <Controller
          control={control}
          name="clienteId"
          render={({ field: { onChange, value } }) => (
            <Select<ClienteProps>
              label="Cliente"
              value={value}
              labelModalSearch="Pesquise um cliente"
              options={clientOptions}
              onValueChange={onChange}
              renderItem={(item, isSelected, onSelect) => {
                return (
                  <TouchableOpacity
                    onPress={onSelect}
                    className={`py-3 ${isSelected ? 'bg-accent' : ''}`}>
                    <View className="flex items-center justify-center">
                      <Text className="text-base font-medium">
                        {item?.data?.nome} {item?.data?.sobrenome ?? ''}
                      </Text>
                      {item?.data?.cpf && (
                        <Text className="text-sm text-muted-foreground">
                          CPF: {item?.data?.cpf}
                        </Text>
                      )}
                      {item?.data?.cnpj && (
                        <Text className="text-sm text-muted-foreground">
                          CNPJ: {item?.data?.cnpj}
                        </Text>
                      )}
                      {item?.data?.email && (
                        <Text className="text-sm text-muted-foreground">
                          Email: {item?.data?.email}
                        </Text>
                      )}
                      {item?.data?.telefone && (
                        <Text className="text-sm text-muted-foreground">
                          Telefone: {item?.data?.telefone}
                        </Text>
                      )}
                      {item?.data?.endereco?.logradouro && (
                        <Text className="text-sm text-muted-foreground">
                          Logradouro: {item?.data?.endereco?.logradouro}
                        </Text>
                      )}
                    </View>
                  </TouchableOpacity>
                );
              }}
              error={errors.clienteId?.message}
              isLoading={isLoadingClients}
              isFetchingNextPage={isFetchingNextPageClients}
              hasNextPage={hasNextPageClients}
              onLoadMore={fetchNextPageClients}
              onSearchChange={setClientSearch}
            />
          )}
        />

        <Controller
          control={control}
          name="estado"
          render={({ field: { onChange, value } }) => (
            <Select<EstadoProps>
              label="Estado"
              value={value}
              labelModalSearch="Selecionar estado"
              options={estadosOptions}
              onValueChange={onChange}
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
              error={errors.estado?.message}
              isLoading={isLoadingEstados}
              isFetchingNextPage={isFetchingNextPageEstados}
              hasNextPage={hasNextPageEstados}
              onLoadMore={fetchNextPageEstados}
              onSearchChange={setEstadoSearch}
            />
          )}
        />

        <Button onPress={handleSubmit(onSubmit)} disabled={!isValid}>
          <Text>Consultar</Text>
        </Button>
      </View>

      <View className="flex-1 px-5 pb-5">
        <InfiniteList<ProjetoProps>
          data={projetoList}
          renderItem={(item) => {
            return (
              <View className="py-3">
                <View className="flex items-center justify-center">
                  <Text className="text-base font-medium">{item?.nome}</Text>
                  {item?.cliente?.nome && item?.cliente?.sobrenome && (
                    <Text className="text-sm text-muted-foreground">
                      cliente: {item?.cliente?.nome} {item?.cliente?.sobrenome ?? ''}
                    </Text>
                  )}
                  {item?.descricao && (
                    <Text className="text-sm text-muted-foreground">
                      Descrição: {item?.descricao}
                    </Text>
                  )}
                  {item?.valorTotal && (
                    <Text className="text-sm text-muted-foreground">
                      Valor total: {formatCurrency(parseFloat(item?.valorTotal))}
                    </Text>
                  )}
                </View>
              </View>
            );
          }}
          isLoading={isLoadingProjetos}
          isFetchingNextPage={isFetchingNextPageProjetos}
          hasNextPage={hasNextPageProjetos}
          onLoadMore={fetchNextPageProjetos}
          emptyMessage="Nenhum projeto encontrado"
          className="h-full"
        />
      </View>
    </>
  );
}