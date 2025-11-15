
import { useMutation } from '@tanstack/react-query';
import { clientesApi } from '@/api/clientesApi';
import { UpdateCliente } from '@/types/clientes/update';
import { queryClient } from '@/services/queryClient';

export function useUpdateCliente() {
	return useMutation({ 
		mutationFn: ({ body, id }: { body: Partial<UpdateCliente>; id: string }) => 
			clientesApi.updateCliente(body, id),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['useGetClientesBySearch'], exact: false });
			queryClient.invalidateQueries({ queryKey: ['useGetClienteById'], exact: false });
		}
	});
}