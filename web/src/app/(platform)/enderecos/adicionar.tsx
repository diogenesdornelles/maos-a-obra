import { InputText } from '@/components/Inputs/InputText';
import { Select, SelectOption } from '@/components/Inputs/Select';
import { Modal } from '@/components/Modal';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import {
  AddEnderecoFormData,
  addEnderecoSchema,
} from '@/features/(platform)/enderecos/adicionar/validations/addEnderecoForm';
import { useGetBairrosBySearch } from '@/hooks/queries/bairros/useGetBairrosBySearch';
import { usePostCreateEndereco } from '@/hooks/queries/enderecos/usePostCreateEndereco';
import { useDebounce } from '@/hooks/useDebounce';
import { ErrorResponse } from '@/types/errorParser';
import { zodResolver } from '@hookform/resolvers/zod';
import { router, Stack } from 'expo-router';
import { useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { TouchableOpacity, View } from 'react-native';

export default function EnderecosAdicionarScreen() {
  const [errorModal, setErrorModal] = useState<ErrorResponse>();

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<AddEnderecoFormData>({
    resolver: zodResolver(addEnderecoSchema),
    mode: 'onChange',
  });

  const [bairroSearch, setBairroSearch] = useState('');

  const [isOpen, setIsOpen] = useState(false);
  const [modalType, setModalType] = useState<'success' | 'error'>('error');

  const { debouncedValue } = useDebounce(bairroSearch, 500);

  const { data, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage } = useGetBairrosBySearch(
    {
      nome: debouncedValue,
      status: 'true',
      take: 20,
    }
  );

  const { mutate } = usePostCreateEndereco();

  const bairrosOptions: SelectOption[] = useMemo(() => {
    if (!data?.pages) return [];

    return data.pages.flatMap((page) =>
      page.map((bairro) => ({
        label: `${bairro.nome}, ${bairro.uf}`,
        value: bairro.id,
        data: bairro,
      }))
    );
  }, [data]);

  const onSubmit = (formData: AddEnderecoFormData) => {
    mutate(
      {
        bairroId: formData?.bairroId,
        cep: formData?.cep,
        complemento: formData?.complemento,
        logradouro: formData?.logradouro,
        numero: formData?.numero,
        pais: 'Brasil',
        status: true,
      },
      {
        onSuccess: () => {
          setIsOpen(true);
          setModalType('success');
        },
        onError: (erro) => {
          setErrorModal(erro as unknown as ErrorResponse);
          setIsOpen(true);
          setModalType('error');
        },
      }
    );
  };

  const modalInfo = {
    success: {
      title: 'Endereço adicionado.',
      description: 'Endereço foi adiciona com sucesso',
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
      title: 'Erro ao adicionar.',
      description: errorModal?.data?.message,
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

  return (
    <>
      <Stack.Screen options={{ headerTitle: 'Endereços / adicionar' }} />
      <View className="p-5">
        <Controller
          control={control}
          name="bairroId"
          render={({ field: { onChange, value } }) => (
            <Select
              label="Bairro"
              isRequired
              value={value}
              labelModalSearch="Selecionar bairro"
              options={bairrosOptions}
              onValueChange={onChange}
              renderItem={(item, isSelected, onSelect) => {
                const [bairroItem, cidadeItem] = item?.label?.split(' -');
                return (
                  <TouchableOpacity
                    onPress={onSelect}
                    className={`py-3 ${isSelected ? 'bg-accent' : ''}`}>
                    <View className="flex items-center justify-center">
                      <Text className={`text-base ${isSelected ? 'font-bold' : 'font-medium'}`}>
                        {bairroItem}
                      </Text>
                      {item.data && (
                        <Text className="text-sm text-muted-foreground">
                          Cidade: {cidadeItem || 'N/A'}
                        </Text>
                      )}
                    </View>
                  </TouchableOpacity>
                );
              }}
              error={errors.bairroId?.message}
              isLoading={isLoading}
              isFetchingNextPage={isFetchingNextPage}
              hasNextPage={hasNextPage}
              onLoadMore={fetchNextPage}
              onSearchChange={setBairroSearch}
            />
          )}
        />

        <Controller
          control={control}
          name="logradouro"
          render={({ field: { onChange, value } }) => (
            <InputText
              label="Logradouro"
              isRequired
              placeholder="Digite o logradouro"
              onChangeText={onChange}
              value={value}
              error={errors.logradouro?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="numero"
          render={({ field: { onChange, value } }) => (
            <InputText
              label="Número"
              placeholder="Digite o número"
              keyboardType="numeric"
              value={value}
              onChangeText={onChange}
              error={errors?.numero?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="cep"
          render={({ field: { onChange, value } }) => (
            <InputText
              label="CEP"
              placeholder="Digite o CEP"
              keyboardType="numeric"
              value={value}
              onChangeText={onChange}
              error={errors?.cep?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="complemento"
          render={({ field: { onChange, value } }) => (
            <InputText
              label="Complemento"
              placeholder="Digite algum complemento"
              value={value}
              onChangeText={onChange}
              error={errors?.complemento?.message}
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