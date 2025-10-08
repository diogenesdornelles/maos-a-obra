import { InputText } from '@/components/Inputs/InputText';
import { Select, SelectOption } from '@/components/Inputs/Select';
import { Modal } from '@/components/Modal';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { useGetBairrosBySearch } from '@/hooks/queries/bairros/useGetBairrosBySearch';
import { usePostCreateEndereco } from '@/hooks/queries/enderecos/usePostCreateEndereco';
import { useDebounce } from '@/hooks/useDebounce';
import { router, Stack } from 'expo-router';
import { useMemo, useState } from 'react';
import { TouchableOpacity, View } from 'react-native';

export default function EnderecosAdicionarScreen() {
  const [bairro, setBairro] = useState('');
  const [logradouro, setLogradouro] = useState('');
  const [numeroCasa, setNumeroCasa] = useState('');
  const [cep, setCep] = useState('');
  const [complemento, setComplemento] = useState('');

  const [errors, setErrors] = useState<Record<string, string>>({});

  const [bairroSearch, setBairroSearch] = useState('');

  const [isOpen, setIsOpen] = useState(false);
  const [modalType, setModalType] = useState<'success' | 'error'>('error');

  const { debouncedValue } = useDebounce(bairroSearch, 500);

  // ---------------  APIS

  const { data, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage } = useGetBairrosBySearch(
    {
      nome: debouncedValue,
      take: 20,
    }
  );

  const { mutate } = usePostCreateEndereco();

  // --------------- LÓGICA

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

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!bairro.trim()) {
      newErrors.bairro = 'Campo obrigatório';
    }

    if (!logradouro.trim()) {
      newErrors.logradouro = 'Campo obrigatório';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      mutate(
        {
          bairroId: bairro,
          cep: cep?.length < 1 ? null : cep,
          complemento: complemento?.length < 1 ? null : complemento,
          logradouro,
          numero: numeroCasa?.length < 1 ? null : numeroCasa,
          pais: 'Brasil',
          status: true,
        },
        {
          onSuccess: () => {
            setIsOpen(true);
            setModalType('success');
          },
          onError: (erro) => {
            console.log(erro);
            setIsOpen(true);
            setModalType('error');
          },
        }
      );
    }
  };

  const modalInfo = {
    success: {
      title: 'Endereço adicionado.',
      description: 'Endereço foi adiciona com sucesso',
      footer: (
        <View className="flex w-full flex-row items-end justify-end gap-2">
          <Button
            onPress={() => {
              setBairro('');
              setLogradouro('');
              setNumeroCasa('');
              setCep('');
              setComplemento('');
              setBairroSearch('');
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
      title: 'Houve um erro.',
      description: 'Não foi possível adicionar o endereço.',
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
        <Select
          label="Bairro"
          isRequired
          value={bairro}
          labelModalSearch="Selecionar bairro"
          options={bairrosOptions}
          onValueChange={(value) => setBairro(value)}
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
          error={errors.bairro}
          isLoading={isLoading}
          isFetchingNextPage={isFetchingNextPage}
          hasNextPage={hasNextPage}
          onLoadMore={fetchNextPage}
          onSearchChange={setBairroSearch}
        />

        <InputText
          label="Logradouro"
          isRequired
          placeholder="Digite o logradouro"
          onChangeText={(text) => {
            setLogradouro(text);
            if (errors.logradouro) {
              setErrors((prev) => ({ ...prev, logradouro: '' }));
            }
          }}
          value={logradouro}
          error={errors.logradouro}
        />

        <InputText
          label="Número"
          placeholder="Digite o número"
          keyboardType="numeric"
          value={numeroCasa}
          onChangeText={setNumeroCasa}
        />

        <InputText
          label="CEP"
          placeholder="Digite o CEP"
          keyboardType="numeric"
          value={cep ?? undefined}
          onChangeText={setCep}
        />

        <InputText
          label="Complemento"
          placeholder="Digite algum complemento"
          value={complemento}
          onChangeText={setComplemento}
        />

        <View className="pt-5">
          <Button onPress={handleSubmit}>
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
