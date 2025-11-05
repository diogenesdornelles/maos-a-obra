import { InputDate } from '@/components/Inputs/InputDate';
import { InputText } from '@/components/Inputs/InputText';
import { Select, SelectOption } from '@/components/Inputs/Select';
import { Modal } from '@/components/Modal';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import {
  AddClientFormData,
  addClientSchema,
} from '@/features/(platform)/clientes/adicionar/validations/adicionarClientForm';
import { usePostCreateCliente } from '@/hooks/queries/clients/usePostCreateCliente';
import { useGetEnderecosBySearch } from '@/hooks/queries/enderecos/useGetEnderecosBySearch';
import { useDebounce } from '@/hooks/useDebounce';
import { CreateCliente } from '@/types/clientes/create';
import { EnderecoProps } from '@/types/enderecos/enderecos';
import { ErrorResponse } from '@/types/errorParser';
import { arrayOfErrors } from '@/utils/errorsParser';
import { parseDateToIso } from '@/utils/parseDate';
import { zodResolver } from '@hookform/resolvers/zod';
import { router, Stack } from 'expo-router';
import { useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { TouchableOpacity, View } from 'react-native';

export default function ClientesAdicionarScreen() {
  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<AddClientFormData>({
    resolver: zodResolver(addClientSchema) as any,
    mode: 'onChange',
  });

  const [isOpen, setIsOpen] = useState(false);
  const [modalType, setModalType] = useState<'success' | 'error'>('error');
  const [error, setError] = useState<ErrorResponse>();

  const [enderecoSearch, setEnderecoSearch] = useState('');
  const { debouncedValue } = useDebounce(enderecoSearch, 500);

  // ---------------  APIS

  const { data, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage } =
    useGetEnderecosBySearch({
      logradouro: debouncedValue,
      status: 'true',
      take: 20,
    });

  const { mutate } = usePostCreateCliente();

  // --------------- LÓGICA

  const enderecoOptions: SelectOption[] = useMemo(() => {
    if (!data?.pages) return [];

    return data.pages.flatMap((page) =>
      page.map((endereco) => ({
        label: `${endereco.logradouro} - ${endereco.bairro?.nome}`,
        value: endereco?.id,
        data: endereco,
      }))
    );
  }, [data]);

  const modalInfo = {
    success: {
      title: 'Cliente adicionado.',
      description: 'Cliente foi adicionado com sucesso',
      footer: (
        <View className="flex w-full flex-row items-end justify-end gap-2">
          <Button
            onPress={() => {
              setIsOpen(false);
            }}>
            <Text>Continuar</Text>
          </Button>
          <Button
            onPress={() => {
              router.back();
            }}>
            <Text>Voltar</Text>
          </Button>
        </View>
      ),
    },
    error: {
      title: 'Cliente NÃO adicionado.',
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

  const onSubmit = (formData: AddClientFormData) => {
    const payload: CreateCliente = {
      nome: formData.nome.trim(),
      ...(formData.enderecoId ? { enderecoId: formData.enderecoId } : {}),
      ...(formData.sobrenome ? { sobrenome: formData.sobrenome } : {}),
      ...(formData.cpf ? { cpf: formData.cpf } : {}),
      ...(formData.cnpj ? { cnpj: formData.cnpj } : {}),
      ...(formData.nascimento ? { nascimento: parseDateToIso(formData.nascimento) } : {}),
      ...(formData.telefone ? { telefone: formData.telefone } : {}),
      ...(formData.email ? { email: formData.email } : {}),
      status: true,
    };

    mutate(payload, {
      onSuccess: () => {
        setIsOpen(true);
        setModalType('success');
      },
      onError: (error) => {
        setError(error as unknown as ErrorResponse);
        setIsOpen(true);
        setModalType('error');
      },
    });
  };

  return (
    <>
      <Stack.Screen options={{ headerTitle: 'Clientes / adicionar' }} />
      <View className="p-5">
        <Controller
          control={control}
          name="nome"
          render={({ field: { onChange, value } }) => (
            <InputText
              label="Nome"
              isRequired
              placeholder="Digite o nome do cliente"
              onChangeText={onChange}
              value={value}
              error={errors.nome?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="sobrenome"
          render={({ field: { onChange, value } }) => (
            <InputText
              label="Sobrenome"
              placeholder="Digite o sobrenome do cliente"
              onChangeText={onChange}
              value={value}
              error={errors?.sobrenome?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="enderecoId"
          render={({ field: { onChange, value } }) => (
            <Select<EnderecoProps>
              label="Endereço"
              value={value}
              labelModalSearch="Pesquise um endereço"
              options={enderecoOptions}
              onValueChange={onChange}
              renderItem={(item, isSelected, onSelect) => {
                return (
                  <TouchableOpacity
                    onPress={onSelect}
                    className={`py-3 ${isSelected ? 'bg-accent' : ''}`}>
                    <View className="flex items-center justify-center">
                      {item?.data?.bairro?.nome && (
                        <Text className={`text-base ${isSelected ? 'font-bold' : 'font-medium'}`}>
                          {item?.data?.bairro?.nome?.split(' - ')[0]}
                        </Text>
                      )}
                      {item?.data?.logradouro && (
                        <Text className="text-sm text-muted-foreground">
                          Logradouro: {item?.data?.logradouro}
                          {item?.data?.numero ? `, ${item?.data?.numero}` : ''}
                        </Text>
                      )}
                      {item?.data?.bairro?.nome && (
                        <Text className="text-sm text-muted-foreground">
                          Cidade: {item?.data?.bairro?.nome?.split(' - ')[1]}
                          {item?.data?.bairro?.uf ? `, ${item?.data?.bairro?.uf}` : ''}
                        </Text>
                      )}
                    </View>
                  </TouchableOpacity>
                );
              }}
              error={errors.enderecoId?.message}
              isLoading={isLoading}
              isFetchingNextPage={isFetchingNextPage}
              hasNextPage={hasNextPage}
              onLoadMore={fetchNextPage}
              onSearchChange={setEnderecoSearch}
            />
          )}
        />

        <View className="flex w-full flex-row justify-between">
          <View className="w-1/2">
            <View className="w-11/12">
              <Controller
                control={control}
                name="cpf"
                render={({ field: { onChange, value } }) => (
                  <InputText
                    maxLength={11}
                    label="CPF"
                    placeholder="Digite o cpf"
                    onChangeText={onChange}
                    value={value}
                    error={errors?.cpf?.message}
                  />
                )}
              />
            </View>
          </View>

          <View className="relative w-1/2">
            <View className="absolute right-0 w-11/12">
              <Controller
                control={control}
                name="cnpj"
                render={({ field: { onChange, value } }) => (
                  <InputText
                    label="CNPJ"
                    maxLength={14}
                    placeholder="Digite o cnpj"
                    onChangeText={onChange}
                    value={value}
                    error={errors?.cnpj?.message}
                  />
                )}
              />
            </View>
          </View>
        </View>

        <View className="flex w-full flex-row justify-between">
          <View className="w-1/2">
            <View className="w-11/12">
              <Controller
                control={control}
                name="telefone"
                render={({ field: { onChange, value } }) => (
                  <InputText
                    label="Telefone"
                    maxLength={11}
                    placeholder="Digite o telefone"
                    onChangeText={onChange}
                    value={value}
                    error={errors?.telefone?.message}
                  />
                )}
              />
            </View>
          </View>

          <View className="relative w-1/2">
            <View className="absolute right-0 w-11/12">
              <Controller
                control={control}
                name="nascimento"
                render={({ field: { onChange, value } }) => (
                  <InputDate
                    label="Nascimento"
                    placeholder="Data de nascimento"
                    onChangeText={onChange}
                    value={value}
                    error={errors?.nascimento?.message}
                  />
                )}
              />
            </View>
          </View>
        </View>

        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, value } }) => (
            <InputText
              label="Email"
              placeholder="joao@exemplo.com"
              onChangeText={onChange}
              value={value}
              error={errors?.email?.message}
            />
          )}
        />

        <View className="pt-5">
          <Button onPress={handleSubmit(onSubmit)} disabled={!isValid}>
            <Text>Salvar</Text>
          </Button>
        </View>
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
