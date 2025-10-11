import { restClient } from '@/services/restClient';
import { EstadoProps } from '@/types/estados/estados';
import { EstadosFilterQuery } from '@/types/estados/filtersQuery';

export const estadoApi = {
  getEstados: async (params?: EstadosFilterQuery) => {
    const searchParams = new URLSearchParams();

    if (params?.skip !== undefined) searchParams.set('skip', String(params.skip));
    if (params?.take !== undefined) searchParams.set('take', String(params.take));
    if (params?.nome) searchParams.set('nome', params.nome);

    const data = await restClient.get<EstadoProps[]>(`/estados/search?${searchParams.toString()}`);

    return data;
  },
};
