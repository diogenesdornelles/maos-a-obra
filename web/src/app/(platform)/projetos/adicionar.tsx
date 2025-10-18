import { InputText } from '@/components/Inputs/InputText';
import { InputTextArea } from '@/components/Inputs/InputTextArea';
import { Select, SelectOption } from '@/components/Inputs/Select';
import { Modal } from '@/components/Modal';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import {
  AddProjetoFormData,
  addProjetoSchema,
} from '@/features/(platform)/projetos/adicionar/validations/addProjetoForm';
import { useGetClientesBySearch } from '@/hooks/queries/clients/useGetClientesBySearch';
import { useGetEstadosBySearch } from '@/hooks/queries/estados/useGetEstadosBySearch';
import { usePostCreateProjeto } from '@/hooks/queries/projetos/usePostCreateProjeto';
import { useDebounce } from '@/hooks/useDebounce';
import { ClienteProps } from '@/types/clientes/clientes';
import { ErrorResponse } from '@/types/errorParser';
import { EstadoProps } from '@/types/estados/estados';
import { arrayOfErrors } from '@/utils/errorsParser';
import { zodResolver } from '@hookform/resolvers/zod';
import { router, Stack } from 'expo-router';
import { useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { TouchableOpacity, View } from 'react-native';

export default function ProjetosAdicionarScreen() {
  const [clientSelectSearch, setClientSelectSearch] = useState('');
  const [estadoSelectSearch, setEstadoSelectSearch] = useState('');

  const { debouncedValue: debouncedClient } = useDebounce(clientSelectSearch);
  const { debouncedValue: debouncedEstado } = useDebounce(estadoSelectSearch);

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<AddProjetoFormData>({
    resolver: zodResolver(addProjetoSchema),
    mode: 'onChange',
  });

  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState<ErrorResponse>();

  const { mutateAsync } = usePostCreateProjeto();

  const {
    data: clientData,
    isLoading: isLoadingClients,
    isFetchingNextPage: isFetchingNextPageClients,
    hasNextPage: hasNextPageClients,
    fetchNextPage: fetchNextPageClients,
  } = useGetClientesBySearch({
    nome: debouncedClient,
    take: 20,
  });

  const clientOptions: SelectOption[] = useMemo(() => {
    if (!clientData?.pages) return [];

    return clientData.pages.flatMap((page) =>
      page.map((client) => ({
        label: `${client.nome} ${client?.sobrenome ?? ''}`,
        value: client?.id,
        data: client,
      }))
    );
  }, [clientData]);

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

  async function onSubmit(formData: AddProjetoFormData) {
    try {
      const project = await mutateAsync(formData);

      router.replace(`/(platform)/projetos/${project.id}`);
    } catch (error) {
      setError(error as ErrorResponse);
    }
  }

  return (
    <>
      <Stack.Screen options={{ headerTitle: 'Projetos / adicionar' }} />
      <View className="m-5">
        <Controller
          control={control}
          name="nome"
          render={({ field: { onChange, value } }) => (
            <InputText
              label="Nome"
              isRequired
              placeholder="Digite o nome do projeto"
              onChangeText={onChange}
              value={value}
              error={errors.nome?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="clienteId"
          render={({ field: { onChange, value } }) => (
            <Select<ClienteProps>
              label="Cliente"
              isRequired
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
              onSearchChange={setClientSelectSearch}
            />
          )}
        />

        <Controller
          control={control}
          name="descricao"
          render={({ field: { onChange, value } }) => (
            <InputTextArea
              label="Descrição"
              placeholder="Descrição..."
              value={value}
              onChangeText={onChange}
              error={errors?.descricao?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="estadoId"
          render={({ field: { onChange, value } }) => (
            <Select<EstadoProps>
              label="Estado"
              isRequired
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
              error={errors?.estadoId?.message}
              isLoading={isLoadingEstados}
              isFetchingNextPage={isFetchingNextPageEstados}
              hasNextPage={hasNextPageEstados}
              onLoadMore={fetchNextPageEstados}
              onSearchChange={setEstadoSelectSearch}
            />
          )}
        />

        <Button onPress={handleSubmit(onSubmit)} disabled={!isValid}>
          <Text>Salvar</Text>
        </Button>
      </View>

      <Modal
        isOpen={isOpen}
        title={'Erro criar projeto'}
        description={arrayOfErrors(error?.data?.message)}
        footerButtons={
          <View className="flex w-full flex-row items-end justify-end">
            <Button
              onPress={() => {
                setIsOpen(false);
              }}>
              <Text>Fechar</Text>
            </Button>
          </View>
        }
      />
    </>
  );
}
