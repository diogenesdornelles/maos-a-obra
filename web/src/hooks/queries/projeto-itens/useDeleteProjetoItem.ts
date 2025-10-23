import { projetoItensApi } from '@/api/projetoItensApi';
import { useMutation } from '@tanstack/react-query';

export function useDeleteProjetoItem() {
	return useMutation({ mutationFn: projetoItensApi.deleteProjetoItem });
}
