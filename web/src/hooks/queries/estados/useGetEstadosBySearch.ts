import { estadoApi } from '@/api/estadosApi';
import { EstadosFilterQuery } from '@/types/estados/filtersQuery';
import { useInfiniteQuery } from '@tanstack/react-query';

export const useGetEstadosBySearch = (filters?: Omit<EstadosFilterQuery, 'skip'>) => {
  return useInfiniteQuery({
    queryKey: ['useGetEstadosBySearch', filters],
    queryFn: ({ pageParam }) =>
      estadoApi.getEstados({
        ...(filters &&
          Object.fromEntries(Object.entries(filters).filter(([_, v]) => v !== undefined))),
        skip: pageParam,
      } as EstadosFilterQuery),
    getNextPageParam: (lastPage, allPages, lastPageParam) => {
      if (lastPage.length < (filters?.take || 20)) {
        return undefined;
      }
      return lastPageParam + (filters?.take || 20);
    },
    initialPageParam: 0,
    staleTime: 1000 * 60 * 20,
  });
};
