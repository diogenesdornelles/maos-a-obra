import { useMutation } from '@tanstack/react-query';
import { projetoItensApi } from '@/api/projetoItensApi';

export function useUpdateProjetoItem() {
	return useMutation({ mutationFn: projetoItensApi.updateProjetoItem });
}
