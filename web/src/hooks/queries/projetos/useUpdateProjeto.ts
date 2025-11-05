import { useMutation } from '@tanstack/react-query';
import { projetosApi } from '@/api/projetosApi';
import { UpdateProjeto } from '@/types/projetos/update';

export function useUpdateProjeto() {
	return useMutation({ 
		mutationFn: ({ body, id }: { body: Partial<UpdateProjeto>; id: string }) => 
			projetosApi.updateProjeto(body, id) 
	});
}