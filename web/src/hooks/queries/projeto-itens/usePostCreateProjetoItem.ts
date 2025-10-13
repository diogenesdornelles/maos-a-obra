import { projetoItensApi } from '@/api/projetoItensApi';
import { CreateProjetoItem } from '@/types/projeto-itens/create';
import { useMutation } from '@tanstack/react-query';

export const usePostCreateProjetoItem = () => {
  return useMutation({
    mutationFn: (projetoItemData: CreateProjetoItem) => projetoItensApi.createProjetoItem(projetoItemData),
  });
};
