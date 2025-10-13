import { restClient } from '@/services/restClient';
import { ItensFilterQuery, ItensPrecoFilterQuery } from '@/types/itens/filtersQuery';
import { ItemPrecoProps, ItemProps } from '@/types/itens/itens';

export const itensApi = {
  getItens: async (params?: ItensFilterQuery) => {
    const searchParams = new URLSearchParams();

    if (params?.skip !== undefined) searchParams.set('skip', String(params.skip));
    if (params?.take !== undefined) searchParams.set('take', String(params.take));
    if (params?.nomenclatura) searchParams.set('nomenclatura', params.nomenclatura);

    const data = await restClient.get<ItemProps[]>(`/itens/search?${searchParams.toString()}`);

    return data;
  },

  getItemById: async (id: string) => {
    const data = await restClient.get<ItemProps>(`/itens/${id}`);
    return data;
  },

  getItemPreco: async (params?: ItensPrecoFilterQuery) => {
    const searchParams = new URLSearchParams();

    if (params?.skip !== undefined) searchParams.set('skip', String(params.skip));
    if (params?.take !== undefined) searchParams.set('take', String(params.take));
    if (params?.itemId) searchParams.set('itemId', params.itemId);
    if (params?.estadoId) searchParams.set('estadoId', params.estadoId);

    const data = await restClient.get<ItemPrecoProps>(`/itens/preco?${searchParams.toString()}`);

    return data;
  },
};
