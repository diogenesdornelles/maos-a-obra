import { z } from 'zod';

export const consultaProjetoSchema = z.object({
  nome: z.string().optional(),
  clienteId: z.uuid().optional(),
  estado: z.uuid().optional(),
});

export type consultaProjetoFormData = z.infer<typeof consultaProjetoSchema>;
