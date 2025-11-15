import { enderecosApi } from '@/api/enderecosApi';
import { queryClient } from '@/services/queryClient';
import { CreateEndereco } from '@/types/enderecos/create';
import { useMutation } from '@tanstack/react-query';

export const usePostCreateEndereco = () => {
  return useMutation({
    mutationFn: (body: CreateEndereco) => enderecosApi.createEndereco(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['useGetEnderecosBySearch'], exact: false });
      queryClient.invalidateQueries({ queryKey: ['useGetEnderecoById'], exact: false });
    }
  });
};
