import { enderecosApi } from '@/api/enderecosApi';
import { EnderecosFilterQuery } from '@/types/enderecos/filtersQuery';
import { useInfiniteQuery } from '@tanstack/react-query';

export const useGetEnderecosBySearch = (filters?: Omit<EnderecosFilterQuery, 'skip'>) => {
  return useInfiniteQuery({
    queryKey: ['useGetEnderecosBySearch', filters],
    queryFn: ({ pageParam }) =>
      enderecosApi.getEnderecos({
        ...(filters &&
          Object.fromEntries(Object.entries(filters).filter(([_, v]) => v !== undefined))),
        skip: pageParam,
      } as EnderecosFilterQuery),
    getNextPageParam: (lastPage, allPages, lastPageParam) => {
      if (lastPage.length < (filters?.take || 20)) {
        return undefined;
      }
      return lastPageParam + (filters?.take || 20);
    },
    initialPageParam: 0,
  });
};
