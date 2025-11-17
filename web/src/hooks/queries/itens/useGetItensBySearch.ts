import { itensApi } from '@/api/itensApi';
import { ItensFilterQuery } from '@/types/itens/filtersQuery';
import { useInfiniteQuery } from '@tanstack/react-query';

export const useGetItensBySearch = (filters?: Omit<ItensFilterQuery, 'skip'>) => {
  return useInfiniteQuery({
    queryKey: ['useGetItensBySearch', filters],
    queryFn: ({ pageParam }) =>
      itensApi.getItens({
        ...(filters &&
          Object.fromEntries(Object.entries(filters).filter(([_, v]) => v !== undefined))),
        skip: pageParam,
      } as ItensFilterQuery),
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
