import { projetoItensApi } from '@/api/projetoItensApi';
import { ProjetoItensFilterQuery } from '@/types/projeto-itens/filtersQuery';
import { useInfiniteQuery } from '@tanstack/react-query';

export const useGetProjetoItensBySearch = (filters?: Omit<ProjetoItensFilterQuery, 'skip'>) => {
  return useInfiniteQuery({
    queryKey: ['useGetProjetoItensBySearch', filters],
    queryFn: ({ pageParam }) =>
      projetoItensApi.getProjetoItens({
        ...(filters &&
          Object.fromEntries(Object.entries(filters).filter(([_, v]) => v !== undefined))),
        skip: pageParam,
      } as ProjetoItensFilterQuery),
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
