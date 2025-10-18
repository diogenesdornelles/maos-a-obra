import { projetosApi } from '@/api/projetosApi';
import { ProjetosFilterQuery } from '@/types/projetos/filtersQuery';
import { useInfiniteQuery } from '@tanstack/react-query';

export const useGetProjetosBySearch = (filters?: Omit<ProjetosFilterQuery, 'skip'>) => {
  return useInfiniteQuery({
    queryKey: ['useGetProjetosBySearch', filters],
    queryFn: ({ pageParam }) =>
      projetosApi.getProjetos({
        ...(filters &&
          Object.fromEntries(Object.entries(filters).filter(([_, v]) => v !== undefined))),
        skip: pageParam,
      } as ProjetosFilterQuery),
    getNextPageParam: (lastPage, allPages, lastPageParam) => {
      if (lastPage.length < (filters?.take || 20)) {
        return undefined;
      }
      return lastPageParam + (filters?.take || 20);
    },
    initialPageParam: 0,
  });
};
