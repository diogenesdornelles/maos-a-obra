import { restClient } from '@/services/restClient';
import { ClienteProps } from '@/types/clientes/clientes';
import { CreateCliente, CreatedCliente } from '@/types/clientes/create';
import { ClientesFilterQuery } from '@/types/clientes/filtersQuery';
import { UpdateCliente } from '@/types/clientes/update';

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
    if (params?.status) searchParams.set('status', String(params.status));

    const data = await restClient.get<ClienteProps[]>(
      `/clientes/search?${searchParams.toString()}`
    );
    return data;
  },

  getClienteById: async (id: string) => {
    const data = await restClient.get<ClienteProps>(
      `/clientes/${id}`
    );

    return data;
  },

  updateCliente: async (body: Partial<UpdateCliente>, id: string) => {
    const data = await restClient.patch<CreatedCliente>(`/clientes/${id}`, body);
    return data;
  },

  deleteCliente: async (id: string) => {
    const data = await restClient.delete<CreatedCliente>(`/clientes/${id}`);
    return data;
  },
};
