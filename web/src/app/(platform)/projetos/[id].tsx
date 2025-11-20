import { InputText } from '@/components/Inputs/InputText';
import { Select, SelectOption } from '@/components/Inputs/Select';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { updateProjetoSchema } from '@/features/(platform)/projetos/alterar/validations/alterarProjetoForm';
import { useGetClientesBySearch } from '@/hooks/queries/clients/useGetClientesBySearch';
import { useGetEstadosBySearch } from '@/hooks/queries/estados/useGetEstadosBySearch';
import { useGetProjetoById } from '@/hooks/queries/projetos/useGetProjetoById';
import { useUpdateProjeto } from '@/hooks/queries/projetos/useUpdateProjeto';
import { useDebounce } from '@/hooks/useDebounce';
import { ClienteProps } from '@/types/clientes/clientes';
import { EstadoProps } from '@/types/estados/estados';
import { zodResolver } from '@hookform/resolvers/zod';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { ScrollView, TouchableOpacity, View } from 'react-native';
import { z } from 'zod';

type ProjetoFormData = z.infer<typeof updateProjetoSchema>;

const statusOptions: SelectOption[] = [
  { label: 'Em Andamento', value: 'EM_ANDAMENTO' },
  { label: 'Concluído', value: 'CONCLUIDO' },
  { label: 'Cancelado', value: 'CANCELADO' },
];

export default function ProjetoEditScreen() {
  const local: { id: string } = useLocalSearchParams();
  const [isEditing, setIsEditing] = useState(false);
  const [clientSearch, setClientSearch] = useState('');
  const [estadoSearch, setEstadoSearch] = useState('');

  const { debouncedValue: debouncedClient } = useDebounce(clientSearch);
  const { debouncedValue: debouncedEstado } = useDebounce(estadoSearch);

  const { data: projeto, refetch: refetchProjeto } = useGetProjetoById({ id: local.id });
  const { mutate: updateProjeto } = useUpdateProjeto();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm<ProjetoFormData>({
    resolver: zodResolver(updateProjetoSchema),
    mode: 'onChange',
  });

  const {
    data: clients,
    isLoading: isLoadingClients,
    isFetchingNextPage: isFetchingNextPageClients,
    hasNextPage: hasNextPageClients,
    fetchNextPage: fetchNextPageClients,
  } = useGetClientesBySearch({
    nome: debouncedClient,
    status: 'true',
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
    status: 'true',
    take: 20,
  });

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

  useEffect(() => {
    if (projeto) {
      reset({
        nome: projeto.nome,
        descricao: projeto.descricao || '',
        clienteId: projeto.clienteId,
        estadoId: projeto.estadoId,
        status: projeto.status,
      });
    }
  }, [projeto, reset]);

  function onSubmit(data: ProjetoFormData) {
    updateProjeto(
      { id: local.id, body: data },
      {
        onSuccess: () => {
          setIsEditing(false);
          refetchProjeto();
        },
      }
    );
  }

  function handleManageItems() {
    router.push(`/(platform)/projetos/items/${local.id}`);
  }

  return (
    <>
      <Stack.Screen
        options={{
          headerTitle: isEditing ? 'Editar Projeto' : 'Visualizar Projeto',
        }}
      />
      <ScrollView className="flex-1 p-5">
        <Controller
          control={control}
          name="nome"
          render={({ field: { onChange, value } }) => (
            <InputText
              label="Nome"
              placeholder="Nome do projeto"
              editable={isEditing}
              onChangeText={isEditing ? onChange : undefined}
              value={value}
              error={errors.nome?.message}
              isRequired
            />
          )}
        />

        <Controller
          control={control}
          name="descricao"
          render={({ field: { onChange, value } }) => (
            <InputText
              label="Descrição"
              placeholder="Descrição do projeto"
              editable={isEditing}
              onChangeText={isEditing ? onChange : undefined}
              value={value}
              error={errors.descricao?.message}
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
              disabled={!isEditing}
              editable={isEditing}
              labelModalSearch="Pesquise um cliente"
              options={clientOptions}
              onValueChange={onChange}
              renderItem={(item, isSelected, onSelect) => (
                <TouchableOpacity
                  onPress={onSelect}
                  className={`py-3 ${isSelected ? 'bg-accent' : ''}`}>
                  <View className="flex items-center justify-center">
                    <Text className="text-base font-medium">
                      {item?.data?.nome} {item?.data?.sobrenome ?? ''}
                    </Text>
                    {item?.data?.cpf && (
                      <Text className="text-sm text-muted-foreground">CPF: {item?.data?.cpf}</Text>
                    )}
                  </View>
                </TouchableOpacity>
              )}
              error={errors.clienteId?.message}
              isLoading={isLoadingClients}
              isFetchingNextPage={isFetchingNextPageClients}
              hasNextPage={hasNextPageClients}
              onLoadMore={fetchNextPageClients}
              onSearchChange={setClientSearch}
              isRequired
            />
          )}
        />

        <Controller
          control={control}
          name="estadoId"
          render={({ field: { onChange, value } }) => (
            <Select<EstadoProps>
              label="Estado"
              value={value}
              disabled={!isEditing}
              editable={isEditing}
              labelModalSearch="Selecionar estado"
              options={estadosOptions}
              onValueChange={onChange}
              renderItem={(item, isSelected, onSelect) => (
                <TouchableOpacity
                  onPress={onSelect}
                  className={`py-3 ${isSelected ? 'bg-accent' : ''}`}>
                  <View className="flex items-center justify-center">
                    <Text className={`text-base ${isSelected ? 'font-bold' : 'font-medium'}`}>
                      {item?.data?.nome}, {item?.data?.uf}
                    </Text>
                  </View>
                </TouchableOpacity>
              )}
              error={errors.estadoId?.message}
              isLoading={isLoadingEstados}
              isFetchingNextPage={isFetchingNextPageEstados}
              hasNextPage={hasNextPageEstados}
              onLoadMore={fetchNextPageEstados}
              onSearchChange={setEstadoSearch}
              isRequired
            />
          )}
        />

        <Controller
          control={control}
          name="status"
          render={({ field: { onChange, value } }) => (
            <Select
              label="Status"
              value={value}
              disabled={!isEditing}
              editable={isEditing}
              options={statusOptions}
              onValueChange={onChange}
              error={errors.status?.message}
              isRequired
            />
          )}
        />

        <View className="mt-4 gap-3">
          {isEditing ? (
            <>
              <Button onPress={handleSubmit(onSubmit)} disabled={!isValid}>
                <Text>Salvar</Text>
              </Button>
              <Button variant="outline" onPress={() => setIsEditing(false)}>
                <Text>Cancelar</Text>
              </Button>
            </>
          ) : (
            <>
              <Button onPress={() => setIsEditing(true)}>
                <Text>Editar Projeto</Text>
              </Button>
              <Button variant="secondary" onPress={handleManageItems}>
                <Text>Gerenciar Itens</Text>
              </Button>
            </>
          )}
        </View>
      </ScrollView>
    </>
  );
}