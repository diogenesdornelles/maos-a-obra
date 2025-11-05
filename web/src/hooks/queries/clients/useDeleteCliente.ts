
import { clientesApi } from '@/api/clientesApi';
import { queryClient } from '@/services/queryClient';
import { useMutation } from '@tanstack/react-query';

export function useDeleteClient() {
	
	return useMutation({ 
		mutationFn: clientesApi.deleteCliente,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['useGetClientesBySearch'], exact: false });
			queryClient.invalidateQueries({ queryKey: ['useGetClienteById'], exact: false });
		}
	});
}