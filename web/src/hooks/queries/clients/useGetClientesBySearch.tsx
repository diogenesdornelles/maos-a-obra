import { clientesApi } from '@/api/clientesApi';
import { ClientesFilterQuery } from '@/types/clientes/filtersQuery';
import { useInfiniteQuery } from '@tanstack/react-query';

export const useGetClientesBySearch = (filters?: Omit<ClientesFilterQuery, 'skip'>) => {
  return useInfiniteQuery({
    queryKey: ['useGetClientesBySearch', filters],
    queryFn: ({ pageParam }) =>
      clientesApi.getClientes({
        ...(filters &&
          Object.fromEntries(Object.entries(filters).filter(([_, v]) => v !== undefined))),
        skip: pageParam,
      } as ClientesFilterQuery),
    getNextPageParam: (lastPage, allPages, lastPageParam) => {
      if (lastPage.length < (filters?.take || 20)) {
        return undefined;
      }
      return lastPageParam + (filters?.take || 20);
    },
    initialPageParam: 0,
    staleTime: 1000 * 60 * 5,
  });
};
