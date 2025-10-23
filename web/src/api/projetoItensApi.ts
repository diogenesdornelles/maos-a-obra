import { restClient } from '@/services/restClient';
import { CreatedProjetoItem, CreateProjetoItem } from '@/types/projeto-itens/create';
import { ProjetoItensFilterQuery } from '@/types/projeto-itens/filtersQuery';
import { ProjetoItemProps } from '@/types/projeto-itens/projetoItens';
import { UpdatedProjetoItem } from '@/types/projeto-itens/update';

export const projetoItensApi = {
  createProjetoItem: async (body: CreateProjetoItem) => {
    const data = await restClient.post<CreatedProjetoItem>(`/projeto-itens`, body);
    return data;
  },

  getProjetoItens: async (params?: ProjetoItensFilterQuery) => {
    const searchParams = new URLSearchParams();

    if (params?.skip !== undefined) searchParams.set('skip', String(params.skip));
    if (params?.take !== undefined) searchParams.set('take', String(params.take));
    if (params?.quantidade) searchParams.set('quantidade', String(params.quantidade));
    if (params?.status) searchParams.set('status', String(params.status));
    if (params?.orderBy) searchParams.set('orderBy', String(params.orderBy));
    if (params?.orderDir) searchParams.set('orderDir', String(params.orderDir));
    if (params?.projetoId) searchParams.set('projetoId', params.projetoId);

    const data = await restClient.get<ProjetoItemProps[]>(
      `/projeto-itens/search?${searchParams.toString()}`
    );

    return data;
  },

  getProjetoItemById: async (id: string) => {
    const data = await restClient.get<ProjetoItemProps>(`/projeto-itens/${id}`);

    return data;
  },

  updateProjetoItem: async (body: UpdatedProjetoItem) => {
      const data = await restClient.patch<CreatedProjetoItem>(`/projeto-itens`, body);
      return data;
    },

  deleteProjetoItem: async (id: string) => {
    const data = await restClient.delete<CreatedProjetoItem>(`/projeto-itens/${id}`);
    return data;
  },
};