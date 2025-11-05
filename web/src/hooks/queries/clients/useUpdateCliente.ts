
import { useMutation } from '@tanstack/react-query';
import { clientesApi } from '@/api/clientesApi';
import { UpdateCliente } from '@/types/clientes/update';

export function useUpdateCliente() {
	return useMutation({ 
		mutationFn: ({ body, id }: { body: Partial<UpdateCliente>; id: string }) => 
			clientesApi.updateCliente(body, id) 
	});
}