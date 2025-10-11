import { restClient } from '@/services/restClient';
import { CreateCliente, CreatedCliente } from '@/types/clientes/create';
import { ClientesFilterQuery } from '@/types/clientes/filtersQuery';

export const clientesApi = {
  createCliente: async (body: CreateCliente) => {
    const data = await restClient.post<CreatedCliente>(`/clientes`, body);

    return data;
  },

  getClientes: async (params?: ClientesFilterQuery) => {
    const searchParams = new URLSearchParams();

    if (params?.skip !== undefined) searchParams.set('skip', String(params.skip));
    if (params?.take !== undefined) searchParams.set('take', String(params.take));
    if (params?.cnpj) searchParams.set('cnpj', params.cnpj);
    if (params?.cpf) searchParams.set('cpf', params.cpf);
    if (params?.email) searchParams.set('email', String(params.email));
    if (params?.nome) searchParams.set('nome', String(params.nome));

    const data = await restClient.get<CreatedCliente[]>(
      `/clientes/search?${searchParams.toString()}`
    );

    return data;
  },
};
