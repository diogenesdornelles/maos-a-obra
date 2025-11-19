import { projetoItensApi } from '@/api/projetoItensApi';
import { queryClient } from '@/services/queryClient';
import { CreateProjetoItem } from '@/types/projeto-itens/create';
import { useMutation } from '@tanstack/react-query';

export const usePostCreateProjetoItem = () => {
  return useMutation({
    mutationFn: (projetoItemData: CreateProjetoItem) => projetoItensApi.createProjetoItem(projetoItemData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['useGetProjetoItemById'], exact: false });
      queryClient.invalidateQueries({ queryKey: ['useGetProjetoItensBySearch'], exact: false });
      queryClient.invalidateQueries({ queryKey: ['useGetProjetoById'], exact: false });
      queryClient.invalidateQueries({ queryKey: ['useGetProjetosBySearch'], exact: false });
    },
  });
};
