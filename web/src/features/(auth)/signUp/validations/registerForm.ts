import { z } from 'zod';

export const signUpSchema = z
  .object({
    name: z.string().min(1, 'Nome é obrigatório').min(3, 'Nome deve ter pelo menos 3 caracteres'),
    lastName: z.string().min(1, 'Sobrenome é obrigatório'),
    cpf: z.string().min(11, 'CPF deve ter 11 dígitos').max(11, 'CPF deve ter 11 dígitos'),
    bornDate: z.string(),
    email: z.string().email('Email inválido').min(1, 'Email é obrigatório'),
    password: z
      .string()
      .min(8, 'Senha deve ter pelo menos 8 caracteres')
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
        'Senha não é forte o suficiente'
      ),
    repassword: z.string().min(8, 'Senha deve ter pelo menos 8 caracteres'),
  })
  .refine((data) => data.password === data.repassword, {
    message: 'Senhas não coincidem',
    path: ['repassword'],
  });

export type SignUpFormData = z.infer<typeof signUpSchema>;
