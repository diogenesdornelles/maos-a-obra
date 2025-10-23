import { clientesApi } from '@/api/clientesApi';
import { CreateCliente } from '@/types/clientes/create';
import { useMutation } from '@tanstack/react-query';

export const usePostCreateCliente = () => {
  return useMutation({
    mutationFn: (clientData: CreateCliente) => clientesApi.createCliente(clientData),
  });
};
