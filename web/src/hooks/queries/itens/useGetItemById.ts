import { itensApi } from '@/api/ itensApi';
import { useQuery } from '@tanstack/react-query';

export function useGetItemById({ id }: { id: string }) {
  return useQuery({
    queryKey: ['useGetItemById', id],
    queryFn: () => itensApi.getItemById(id),
    refetchOnWindowFocus: false,
    enabled: !!id,
  });
}
