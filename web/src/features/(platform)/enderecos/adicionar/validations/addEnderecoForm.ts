import { z } from 'zod';

export const addEnderecoSchema = z.object({
  bairroId: z.string().uuid('Id bairro não informado'),
  logradouro: z.string().min(1, 'Logradouro é obrigatório'),
  numero: z.string().optional(),
  complemento: z.string().optional(),
  cep: z
    .string()
    .optional()
    .refine((val) => !val || val.length === 8, {
      message: 'O CEP deve ter 8 caracteres se informado',
    }),
});

export type AddEnderecoFormData = z.infer<typeof addEnderecoSchema>;
