import { restClient } from '@/services/restClient';
import { CreatedEndereco, CreateEndereco } from '@/types/enderecos/create';
import { EnderecoProps } from '@/types/enderecos/enderecos';
import { EnderecosFilterQuery } from '@/types/enderecos/filtersQuery';

export const enderecosApi = {
  createEndereco: async (body: CreateEndereco) => {
    const data = await restClient.post<CreatedEndereco[]>(`/enderecos`, body);

    return data;
  },

  getEnderecos: async (params?: EnderecosFilterQuery) => {
    const searchParams = new URLSearchParams();

    if (params?.skip !== undefined) searchParams.set('skip', String(params.skip));
    if (params?.take !== undefined) searchParams.set('take', String(params.take));
    if (params?.logradouro) searchParams.set('logradouro', params.logradouro);
    if (params?.cep) searchParams.set('cep', params.cep);
    if (params?.numero !== null && params?.numero !== undefined) {
      searchParams.set('numero', String(params.numero));
    }

    const data = await restClient.get<EnderecoProps[]>(
      `/enderecos/search?${searchParams.toString()}`
    );

    return data;
  },
};