import { itensApi } from '@/api/ itensApi';
import { ItensPrecoFilterQuery } from '@/types/itens/filtersQuery';
import { useQuery } from '@tanstack/react-query';

export const useGetItemPreco = (filters?: ItensPrecoFilterQuery) => {
  return useQuery({
    queryKey: ['useGetItemPreco', filters],
    queryFn: () => itensApi.getItemPreco(filters),
    enabled: !!(filters?.estadoId && filters?.itemId),
  });
};
