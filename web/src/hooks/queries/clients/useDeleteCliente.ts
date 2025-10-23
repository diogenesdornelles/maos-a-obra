
import { clientesApi } from '@/api/clientesApi';
import { useMutation } from '@tanstack/react-query';

export function useDeleteClient() {
	return useMutation({ mutationFn: clientesApi.deleteCliente });
}
