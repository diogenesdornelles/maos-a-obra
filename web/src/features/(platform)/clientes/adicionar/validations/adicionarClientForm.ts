import { z } from 'zod';

const stripDigits = (value?: string) => value?.replace(/\D/g, '') ?? '';

const isValidCPF = (cpf: string) => {
  if (!cpf || cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;
  const calc = (factor: number) =>
    Array.from({ length: factor - 1 }).reduce(
      (sum: number, _, idx) => sum + Number(cpf[idx]) * (factor - idx),
      0
    );
  const digit1 = ((calc(10) * 10) % 11) % 10;
  const digit2 = ((calc(11) * 10) % 11) % 10;
  return digit1 === Number(cpf[9]) && digit2 === Number(cpf[10]);
};

const isValidCNPJ = (cnpj: string) => {
  if (!cnpj || cnpj.length !== 14 || /^(\d)\1{13}$/.test(cnpj)) return false;
  const calc = (len: number) => {
    const factors =
      len === 12 ? [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2] : [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
    return factors.reduce((sum, factor, idx) => sum + Number(cnpj[idx]) * factor, 0);
  };
  const digit1 = calc(12) % 11 < 2 ? 0 : 11 - (calc(12) % 11);
  const digit2 = calc(13) % 11 < 2 ? 0 : 11 - (calc(13) % 11);
  return digit1 === Number(cnpj[12]) && digit2 === Number(cnpj[13]);
};
const trimOrUndefined = () =>
  z
    .string()
    .optional()
    .transform((value) => {
      if (!value) return undefined;
      const trimmed = value.trim();
      return trimmed.length === 0 ? undefined : trimmed;
    });

const digitsOrUndefined = () =>
  z
    .string()
    .optional()
    .transform((value) => {
      if (!value) return undefined;
      const digits = value.replace(/\D/g, '');
      return digits.length === 0 ? undefined : digits;
    });

export const addClientSchema = z.object({
  nome: z.string({ error: 'Nome é obrigatório' }).trim().min(1, 'Nome é obrigatório'),
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

export type AddClientFormData = z.infer<typeof addClientSchema>;
