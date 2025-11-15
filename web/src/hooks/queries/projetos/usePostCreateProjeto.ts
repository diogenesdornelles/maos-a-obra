import { projetosApi } from '@/api/projetosApi';
import { queryClient } from '@/services/queryClient';
import { CreateProjeto } from '@/types/projetos/create';
import { useMutation } from '@tanstack/react-query';

export const usePostCreateProjeto = () => {
  return useMutation({
    mutationFn: (projetoData: CreateProjeto) => projetosApi.createProjeto(projetoData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['useGetProjetosBySearch'], exact: false });
      queryClient.invalidateQueries({ queryKey: ['useGetProjetoById'], exact: false });
    }
  });
};
