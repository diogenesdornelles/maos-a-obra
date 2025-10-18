import { projetoItensApi } from '@/api/projetoItensApi';
import { useQuery } from '@tanstack/react-query';

export function useGetProjetoItemById({ id }: { id: string }) {
  return useQuery({
    queryKey: ['useGetProjetoItemById', id],
    queryFn: () => projetoItensApi.getProjetoItemById(id),
    refetchOnWindowFocus: false,
    enabled: !!id,
  });
}
