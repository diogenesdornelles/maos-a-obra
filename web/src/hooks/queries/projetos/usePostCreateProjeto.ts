import { projetosApi } from '@/api/projetosApi';
import { CreateProjeto } from '@/types/projetos/create';
import { useMutation } from '@tanstack/react-query';

export const usePostCreateProjeto = () => {
  return useMutation({
    mutationFn: (projetoData: CreateProjeto) => projetosApi.createProjeto(projetoData),
  });
};
