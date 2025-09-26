import { InputLabel } from '@/components/InputLabel/InputLabel';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { SignUpFormData, signUpSchema } from '@/features/(auth)/signUp/validations/registerForm';
import { usePostCreateUser } from '@/hooks/queries/usuarios/usePostCreateUser';
import { zodResolver } from '@hookform/resolvers/zod';
import { Stack } from 'expo-router';
import { Controller, useForm } from 'react-hook-form';
import { View } from 'react-native';

export default function SignUp() {
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
    console.log('Dados válidos:', data);
    mutate(
      { cpf, email, nascimento, nome, senha, sobrenome },
      {
        onSuccess: () => {},
      }
    );
  };

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: 'Novos Usuários',
        }}
      />
      <View className="p-4">
        <Controller
          control={control}
          name="name"
          render={({ field: { onChange, value } }) => (
            <InputLabel
              label="Nome"
              placeholder="Digite seu nome"
              value={value}
              onChangeText={onChange}
              error={errors.name?.message}
              isRequired
            />
          )}
        />

        <Controller
          control={control}
          name="lastName"
          render={({ field: { onChange, value } }) => (
            <InputLabel
              label="Sobrenome"
              placeholder="Digite seu sobrenome"
              value={value}
              onChangeText={onChange}
              error={errors.lastName?.message}
              isRequired
            />
          )}
        />

        <Controller
          control={control}
          name="cpf"
          render={({ field: { onChange, value } }) => (
            <InputLabel
              label="CPF"
              placeholder="000.000.000-00"
              value={value}
              onChangeText={onChange}
              error={errors.cpf?.message}
              isRequired
            />
          )}
        />

        <Controller
          control={control}
          name="bornDate"
          render={({ field: { onChange, value } }) => (
            <InputLabel
              label="Data de nascimento"
              placeholder="dd/mm/aaaa"
              value={value}
              onChangeText={onChange}
              error={errors.bornDate?.message}
              type="date"
            />
          )}
        />

        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, value } }) => (
            <InputLabel
              label="Email"
              placeholder="seu@email.com"
              value={value}
              onChangeText={onChange}
              error={errors.email?.message}
              isRequired
            />
          )}
        />

        <Controller
          control={control}
          name="password"
          render={({ field: { onChange, value } }) => (
            <InputLabel
              label="Senha"
              placeholder="Mínimo 6 caracteres"
              value={value}
              onChangeText={onChange}
              error={errors.password?.message}
              isRequired
              secureTextEntry
            />
          )}
        />

        <Controller
          control={control}
          name="repassword"
          render={({ field: { onChange, value } }) => (
            <InputLabel
              label="Confirmar senha"
              placeholder="Digite a senha novamente"
              value={value}
              onChangeText={onChange}
              error={errors.repassword?.message}
              isRequired
              secureTextEntry
            />
          )}
        />

        <Button onPress={handleSubmit(onSubmit)} className="mt-6" disabled={!isValid}>
          <Text>Registrar</Text>
        </Button>
      </View>
    </>
  );
}
