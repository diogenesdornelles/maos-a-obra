import { restClient } from '@/services/restClient';
import { BairrosProps } from '@/types/bairros/bairros';
import { BairrosFilterQuery } from '@/types/bairros/filtersQuery';

export const bairrosApi = {
  getBairros: async (params?: BairrosFilterQuery) => {
    const query = `skip=${params?.skip}&take=${params?.take}&nome=${params?.nome}`;

    const data = await restClient.get<BairrosProps[]>(`/bairros/search?${query}`);

    return data;
  },
};
