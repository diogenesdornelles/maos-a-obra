import { useMutation } from '@tanstack/react-query';
import { projetoItensApi } from '@/api/projetoItensApi';
import { UpdateProjetoItem } from '@/types/projeto-itens/update';

export function useUpdateProjetoItem() {
    return useMutation({ 
        mutationFn: ({ body, id }: { body: Partial<UpdateProjetoItem>; id: string }) => 
            projetoItensApi.updateProjetoItem(body, id) 
    });
}