import { z } from 'zod';

export const updateProjetoItensSchema = z.object({
  projetoId: z.uuid().optional(),
  itemId: z.uuid().optional(),
  quantidade: z.number().positive('Quantidade deve ser maior que zero').optional(),
  preco: z.number().positive('Preço deve ser maior que zero').optional(),
  status: z.boolean().optional(),
});

export type UpdateProjetoItensFormData = z.infer<typeof updateProjetoItensSchema>;
