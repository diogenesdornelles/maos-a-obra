import { InputLabel } from '@/components/InputLabel/InputLabel';
import { Modal } from '@/components/Modal';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { signIn } from '@/contexts/authStore';
import { LoginFormData, loginSchema } from '@/features/(auth)/login/validations/loginForm';
import { usePostLogin } from '@/hooks/queries/auth/usePostLogin';
import { zodResolver } from '@hookform/resolvers/zod';
import { router, Stack } from 'expo-router';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function LoginScreen() {
  const [isOpenModal, setIsOpenModal] = useState(false);

  const { mutate } = usePostLogin();

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: 'onChange',
  });

  function onSubmit(data: LoginFormData) {
    mutate(
      { email: data?.email, pass: data?.password },
      {
        onSuccess: (token) => {
          signIn(token?.access_token);
          router.replace('/(platform)/home');
        },
        onError: () => {
          setIsOpenModal(true);
        },
      }
    );
  }

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: 'Login',
        }}
      />
      <View className="flex h-full w-full justify-between">
        <SafeAreaView>
          <View className="w-full flex-row justify-center pt-20">
            <Text className="text-2xl">Faça Login</Text>
          </View>
        </SafeAreaView>
        <View className="h-[300px] gap-5 bg-gray-300 px-5 pt-4">
          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, value } }) => (
              <InputLabel
                label="Email"
                value={value}
                onChangeText={onChange}
                placeholder="Digite seu email"
                error={errors?.email?.message}
              />
            )}
          />
          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, value } }) => (
              <InputLabel
                secureTextEntry={true}
                label="Senha"
                value={value}
                onChangeText={onChange}
                placeholder="Senha"
                error={errors?.password?.message}
              />
            )}
          />

          <Button
            variant="default"
            onPress={handleSubmit(onSubmit)}
            disabled={!isValid}
            testID="button-send-form">
            <Text>Logar</Text>
          </Button>
        </View>
      </View>
      {isOpenModal && (
        <Modal
          isOpen={isOpenModal}
          title={'Erro na autenticação'}
          description={'Ocorreu um erro ao logar, tente novamente!'}
          footerButtons={
            <View className="flex flex-row gap-2">
              <Button onPress={() => router.back()}>
                <Text>Página inicial</Text>
              </Button>
              <Button variant="secondary" onPress={() => setIsOpenModal(false)}>
                <Text>Continuar</Text>
              </Button>
            </View>
          }
        />
      )}
    </>
  );
}
