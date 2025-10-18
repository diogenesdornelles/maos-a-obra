import { z } from 'zod';

export const addProjetoItensSchema = z.object({
  itemId: z.uuid(),
  quantidade: z.number().positive('Quantidade deve ser maior que zero'),
  preco: z.number().positive('Preço deve ser maior que zero'),
});
export type AddProjetoItensFormData = z.infer<typeof addProjetoItensSchema>;
