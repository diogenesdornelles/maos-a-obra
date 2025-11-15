import { z } from 'zod';

export const updateEnderecoSchema = z.object({
  bairroId: z.string().uuid('Id bairro não informado').optional(),
  logradouro: z.string().min(1, 'Logradouro é obrigatório').optional(),
  numero: z.string().optional().nullable(),
  complemento: z.string().optional().nullable(),
  pais: z.string().optional(),
  cep: z
    .string()
    .optional()
    .nullable()
    .refine(
      (val) => {
        if (!val || val === '') return true; // Permite vazio ou null
        return val.length === 8; // Se tiver valor, valida 8 dígitos
      },
      {
        message: 'O CEP deve ter 8 caracteres',
      }
    ),
  status: z.boolean().optional(),
});

export type UpdateEnderecoFormData = z.infer<typeof updateEnderecoSchema>;