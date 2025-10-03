import { InputLabel } from '@/components/InputLabel/InputLabel';
import { Modal } from '@/components/modal';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { SignUpFormData, signUpSchema } from '@/features/(auth)/signUp/validations/registerForm';
import { usePostCreateUser } from '@/hooks/queries/usuarios/usePostCreateUser';
import { zodResolver } from '@hookform/resolvers/zod';
import { router, Stack } from 'expo-router';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { View } from 'react-native';

export default function SignUp() {
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [typeModal, setTypeModal] = useState<'success' | 'failed'>('failed');

  const dataOnFinishForm = {
    success: {
      title: 'Cadastro confirmado.',
      description: <Text>Pessoa cadastrada com sucesso!</Text>,
      footer: (
        <View className="flex flex-row gap-2">
          <Button onPress={() => router.back()}>
            <Text>Página inicial</Text>
          </Button>
        </View>
      ),
    },
    failed: {
      title: 'Houve um erro!',
      description: <Text>O cadastro não foi concluído.</Text>,
      footer: (
        <View className="flex flex-row gap-2">
          <Button onPress={() => router.back()}>
            <Text>Página inicial</Text>
          </Button>
          <Button variant="secondary" onPress={() => setIsOpenModal(false)}>
            <Text>Continuar</Text>
          </Button>
        </View>
      ),
    },
  };

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    mode: 'onChange',
  });

  const { mutate } = usePostCreateUser();

  const onSubmit = (data: SignUpFormData) => {
    mutate(
      {
        nome: data?.name,
        sobrenome: data?.lastName,
        cpf: data?.cpf,
        nascimento: data?.bornDate,
        email: data?.email,
        senha: data?.password,
      },
      {
        onSuccess: () => {
          setTypeModal('success');
          setIsOpenModal(true);
        },
        onError: () => {
          setTypeModal('failed');
          setIsOpenModal(true);
        },
      }
    );
  };

  const inputConfigs: {
    name: keyof SignUpFormData;
    label: string;
    placeholder: string;
    required?: boolean;
    type?: 'normal' | 'date';
    secureTextEntry?: boolean;
  }[] = [
    { name: 'name', label: 'Nome', placeholder: 'Digite seu nome', required: true },
    { name: 'lastName', label: 'Sobrenome', placeholder: 'Digite seu sobrenome', required: true },
    { name: 'cpf', label: 'CPF', placeholder: '000.000.000-00', required: true },
    { name: 'bornDate', label: 'Data de nascimento', placeholder: 'dd/mm/aaaa', type: 'date' },
    { name: 'email', label: 'Email', placeholder: 'seu@email.com', required: true },
    {
      name: 'password',
      label: 'Senha',
      placeholder: 'Digite a senha',
      required: true,
      secureTextEntry: true,
    },
    {
      name: 'repassword',
      label: 'Confirmar senha',
      placeholder: 'Digite a senha novamente',
      required: true,
      secureTextEntry: true,
    },
  ];

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: 'Novos Usuários',
        }}
      />
      <Modal
        isOpen={isOpenModal}
        title={dataOnFinishForm[typeModal].title}
        description={dataOnFinishForm[typeModal].description}
        footerButtons={dataOnFinishForm[typeModal].footer}
      />
      <View className="p-4">
        {inputConfigs.map((cfg) => (
          <Controller
            key={cfg.name}
            control={control}
            name={cfg.name}
            render={({ field: { onChange, value } }) => (
              <InputLabel
                label={cfg.label}
                placeholder={cfg.placeholder}
                value={value}
                onChangeText={onChange}
                error={errors?.[cfg.name]?.message as string | undefined}
                isRequired={cfg.required}
                type={cfg.type}
                secureTextEntry={cfg.secureTextEntry}
              />
            )}
          />
        ))}

        <Button onPress={handleSubmit(onSubmit)} className="mt-6" disabled={!isValid}>
          <Text>Registrar</Text>
        </Button>
      </View>
    </>
  );
}
