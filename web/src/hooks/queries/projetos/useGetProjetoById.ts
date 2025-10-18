import { projetosApi } from '@/api/projetosApi';
import { useQuery } from '@tanstack/react-query';

export function useGetProjetoById({ id }: { id: string }) {
  return useQuery({
    queryKey: ['useGetProjetoById', id],
    queryFn: () => projetosApi.getProjetoById(id),
    refetchOnWindowFocus: false,
    enabled: !!id,
  });
}
