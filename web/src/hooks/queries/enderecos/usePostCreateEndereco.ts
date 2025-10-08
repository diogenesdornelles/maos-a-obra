import { enderecosApi } from '@/api/enderecosApi';
import { CreateEndereco } from '@/types/enderecos/create';
import { useMutation } from '@tanstack/react-query';

export const usePostCreateEndereco = () => {
  return useMutation({
    mutationFn: (body: CreateEndereco) => enderecosApi.createEndereco(body),
  });
};
