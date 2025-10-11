import { itensApi } from '@/api/ itensApi';
import { ItensPrecoFilterQuery } from '@/types/itens/filtersQuery';
import { useQuery } from '@tanstack/react-query';

export const useGetItemPreco = (filters?: ItensPrecoFilterQuery) => {
  return useQuery({
    queryKey: ['useGetItemPreco', filters],
    queryFn: () => itensApi.getItemPreco(filters),
    staleTime: 1000 * 60 * 5,
    enabled: !!(filters?.estadoId && filters?.itemId),
  });
};
