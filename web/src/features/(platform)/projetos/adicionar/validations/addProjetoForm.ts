import { z } from 'zod';

export const addProjetoSchema = z.object({
  clienteId: z.uuid(),
  estadoId: z.uuid(),
  nome: z.string().min(3, 'Nome do projeto é obrigatório.'),
  descricao: z
    .string()
    .optional()
    .refine((val) => !val || val.length > 3, {
      message: 'Descrição deve ter 3 caracteres se informada.',
    }),
});

export type AddProjetoFormData = z.infer<typeof addProjetoSchema>;
