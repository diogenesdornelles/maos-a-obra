import { restClient } from '@/services/restClient';
import { CreatedProjeto, CreateProjeto } from '@/types/projetos/create';
import { ProjetosFilterQuery } from '@/types/projetos/filtersQuery';
import { ProjetoProps } from '@/types/projetos/projetos';

export const projetosApi = {
  createProjeto: async (body: CreateProjeto) => {
    const data = await restClient.post<CreatedProjeto>(`/projetos`, body);

    return data;
  },

  getProjetos: async (params?: ProjetosFilterQuery) => {
    const searchParams = new URLSearchParams();

    if (params?.skip !== undefined) searchParams.set('skip', String(params.skip));
    if (params?.take !== undefined) searchParams.set('take', String(params.take));
    if (params?.descricao) searchParams.set('descricao', params.descricao);
    if (params?.nome) searchParams.set('nome', params.nome);
    if (params?.valorMax) searchParams.set('valorMax', String(params.valorMax));
    if (params?.valorMin) searchParams.set('valorMin', String(params.valorMin));
    if (params?.status) searchParams.set('status', String(params.status));

    const data = await restClient.get<ProjetoProps[]>(
      `/projetos/search?${searchParams.toString()}`
    );

    return data;
  },

  getProjetoById: async (id: string) => {
    const data = await restClient.get<ProjetoProps>(
    `/projetos/${id}`
    );

   return data;
  },
};

