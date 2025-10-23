import { z } from 'zod';

export const updateEnderecoSchema = z.object({
  bairroId: z.string().uuid('Id bairro não informado').optional(),
  logradouro: z.string().min(1, 'Logradouro é obrigatório').optional(),
  numero: z.string().optional(),
  complemento: z.string().optional(),
  pais: z.string().optional(),
  cep: z
    .string()
    .optional()
    .refine((val) => !val || val.length === 8, {
      message: 'O CEP deve ter 8 caracteres se informado',
    }),
  status: z.boolean().optional(),
});

export type UpdateEnderecoFormData = z.infer<typeof updateEnderecoSchema>;
