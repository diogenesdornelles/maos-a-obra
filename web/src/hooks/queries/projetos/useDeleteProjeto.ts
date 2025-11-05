import { projetosApi } from '@/api/projetosApi';
import { queryClient } from '@/services/queryClient';
import { useMutation } from '@tanstack/react-query';

export function useDeleteProjeto() {
	return useMutation({ 
		mutationFn: projetosApi.deleteProjeto,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['useGetProjetosBySearch'], exact: false });
			queryClient.invalidateQueries({ queryKey: ['useGetProjetoById'], exact: false });
		}
	});
}