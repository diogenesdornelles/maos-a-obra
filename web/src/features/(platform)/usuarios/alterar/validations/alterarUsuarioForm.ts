import { digitsOrUndefined, isValidCPF, trimOrUndefined } from '@/features/(platform)/clientes/adicionar/validations/adicionarClientForm';
import { z } from 'zod';

export const updateUsuarioSchema = z.object({
  nome: trimOrUndefined().superRefine((value, ctx) => {
    if (value && value.length < 1) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Nome deve ter pelo menos 1 caractere',
      });
    }
  }),
  sobrenome: trimOrUndefined().superRefine((value, ctx) => {
    if (value && value.length < 3) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Sobrenome deve ter pelo menos 3 caracteres',
      });
    }
  }),
  cpf: digitsOrUndefined().superRefine((value, ctx) => {
    if (!value) return;
    if (value.length !== 11) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'CPF deve conter 11 dígitos' });
    } else if (!isValidCPF(value)) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'CPF inválido' });
    }
  }),
  nascimento: trimOrUndefined(),
  email: trimOrUndefined().superRefine((value, ctx) => {
    if (!value) return;
    const result = z.string().email().safeParse(value);
    if (!result.success) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Email inválido' });
    }
  }),
  funcao: z.enum(['COMUM', 'ADMIN']).optional(),
  senha: trimOrUndefined().superRefine((value, ctx) => {
    if (value && value.length < 6) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Senha deve ter pelo menos 6 caracteres',
      });
    }
  }),
});

export type UpdateUsuarioFormData = z.infer<typeof updateUsuarioSchema>;
