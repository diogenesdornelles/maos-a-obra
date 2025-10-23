import { useMutation } from '@tanstack/react-query';
import { projetosApi } from '@/api/projetosApi';

export function useUpdateProjeto() {
	return useMutation({ mutationFn: projetosApi.updateProjeto });
}
