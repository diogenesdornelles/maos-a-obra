import { z } from 'zod';

export const updateProjetoSchema = z.object({
  clienteId: z.uuid().optional(),
  estadoId: z.uuid().optional(),
  nome: z.string().min(3, 'Nome do projeto deve ter pelo menos 3 caracteres.').optional(),
  descricao: z
    .string()
    .optional()
    .refine((val) => !val || val.length > 3, {
      message: 'Descrição deve ter 3 caracteres se informada.',
    }),
  status: z.enum(['EM_ANDAMENTO', 'CONCLUIDO', 'CANCELADO']).optional(),
});

export type UpdateProjetoFormData = z.infer<typeof updateProjetoSchema>;
