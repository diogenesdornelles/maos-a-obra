import { useMutation } from '@tanstack/react-query';
import { projetosApi } from '@/api/projetosApi';
import { UpdateProjeto } from '@/types/projetos/update';
import { queryClient } from '@/services/queryClient';

export function useUpdateProjeto() {
	return useMutation({ 
		mutationFn: ({ body, id }: { body: Partial<UpdateProjeto>; id: string }) => 
			projetosApi.updateProjeto(body, id),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['useGetProjetosBySearch'], exact: false });
			queryClient.invalidateQueries({ queryKey: ['useGetProjetoById'], exact: false });
		}
	});
}