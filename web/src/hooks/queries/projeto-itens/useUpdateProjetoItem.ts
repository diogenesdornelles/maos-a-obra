import { useMutation } from '@tanstack/react-query';
import { projetoItensApi } from '@/api/projetoItensApi';
import { UpdateProjetoItem } from '@/types/projeto-itens/update';
import { queryClient } from '@/services/queryClient';

export function useUpdateProjetoItem() {
    return useMutation({ 
        mutationFn: ({ body, id }: { body: Partial<UpdateProjetoItem>; id: string }) => 
            projetoItensApi.updateProjetoItem(body, id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['useGetProjetoItemById'], exact: false });
            queryClient.invalidateQueries({ queryKey: ['useGetProjetoItensBySearch'], exact: false });
        },
    });
}