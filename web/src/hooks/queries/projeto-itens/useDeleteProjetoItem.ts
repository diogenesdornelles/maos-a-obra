import { projetoItensApi } from '@/api/projetoItensApi';
import { queryClient } from '@/services/queryClient';
import { InfiniteData, useMutation } from '@tanstack/react-query';
import { ProjetoItemProps } from '@/types/projeto-itens/projetoItens';

export function useDeleteProjetoItem() {
  return useMutation({
    mutationFn: projetoItensApi.deleteProjetoItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['useGetProjetoItemById'], exact: false });
      queryClient.invalidateQueries({ queryKey: ['useGetProjetoItensBySearch'], exact: false });
    },
  });
}