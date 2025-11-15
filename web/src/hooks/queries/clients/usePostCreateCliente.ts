import { clientesApi } from '@/api/clientesApi';
import { queryClient } from '@/services/queryClient';
import { CreateCliente } from '@/types/clientes/create';
import { useMutation } from '@tanstack/react-query';

export const usePostCreateCliente = () => {
  return useMutation({
    mutationFn: (clientData: CreateCliente) => clientesApi.createCliente(clientData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['useGetClientesBySearch'], exact: false });
      queryClient.invalidateQueries({ queryKey: ['useGetClienteById'], exact: false });
    }
  });
};
