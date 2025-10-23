import { projetosApi } from '@/api/projetosApi';
import { useMutation } from '@tanstack/react-query';

export function useDeleteProjeto() {
	return useMutation({ mutationFn: projetosApi.deleteProjeto });
}
