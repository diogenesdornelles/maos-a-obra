import { bairrosApi } from '@/api/bairrosApi';
import { BairrosFilterQuery } from '@/types/bairros/filtersQuery';
import { useInfiniteQuery } from '@tanstack/react-query';

export const useGetBairrosBySearch = (filters?: Omit<BairrosFilterQuery, 'skip'>) => {
  return useInfiniteQuery({
    queryKey: ['useGetBairrosBySearch', filters?.nome],
    queryFn: ({ pageParam }) =>
      bairrosApi.getBairros({
        ...filters,
        skip: pageParam,
      }),
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
