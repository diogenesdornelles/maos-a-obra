import { projetoItensApi } from '@/api/projetoItensApi';
import { queryClient } from '@/services/queryClient';
import { InfiniteData, useMutation } from '@tanstack/react-query';
import { ProjetoItemProps } from '@/types/projeto-itens/projetoItens';

export function useDeleteProjetoItem() {
  return useMutation({
    mutationFn: projetoItensApi.deleteProjetoItem,
    onSuccess: (_data, deletedId) => {
      queryClient.setQueriesData(
        { queryKey: ['useGetProjetoItensBySearch'], exact: false },
        (old:
          | InfiniteData<ProjetoItemProps[]>
          | undefined) => {
          if (!old) return old;
          return {
            ...old,
            pages: old.pages.map((page) => page.filter((it) => it.id !== deletedId)),
          };
        }
      );

      queryClient.invalidateQueries({ queryKey: ['useGetProjetoById'], exact: false });

      queryClient.invalidateQueries({ queryKey: ['useGetProjetosBySearch'], exact: false });
    },
  });
}