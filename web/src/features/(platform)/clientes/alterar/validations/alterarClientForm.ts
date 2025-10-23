import { z } from 'zod';
import { digitsOrUndefined, isValidCNPJ, isValidCPF, trimOrUndefined } from '../../adicionar/validations/adicionarClientForm';


export const updateClientSchema = z.object({
  nome: trimOrUndefined().superRefine((value, ctx) => {
    if (value && value.length < 1) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Nome deve ter pelo menos 1 caractere',
      });
    }
  }),
  enderecoId: trimOrUndefined().superRefine((value, ctx) => {
    if (!value) return;
    const result = z.string().uuid().safeParse(value);
    if (!result.success) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Endereço inválido' });
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
  cnpj: digitsOrUndefined().superRefine((value, ctx) => {
    if (!value) return;
    if (value.length !== 14) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'CNPJ deve conter 14 dígitos' });
    } else if (!isValidCNPJ(value)) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'CNPJ inválido' });
    }
  }),
  nascimento: trimOrUndefined(),
  telefone: digitsOrUndefined().superRefine((value, ctx) => {
    if (!value) return;
    if (!/^\d{10,11}$/.test(value)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Telefone deve conter 10 ou 11 dígitos numéricos',
      });
    }
  }),
  email: trimOrUndefined().superRefine((value, ctx) => {
    if (!value) return;
    const result = z.string().email().safeParse(value);
    if (!result.success) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Email inválido' });
    }
  }),
  status: z.boolean().optional(),
});

export type UpdateClientFormData = z.infer<typeof updateClientSchema>;
