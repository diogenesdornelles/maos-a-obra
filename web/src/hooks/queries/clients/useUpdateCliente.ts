
import { useMutation } from '@tanstack/react-query';
import { clientesApi } from '@/api/clientesApi';

export function useUpdateCliente() {
	return useMutation({ mutationFn: clientesApi.updateCliente });
}
