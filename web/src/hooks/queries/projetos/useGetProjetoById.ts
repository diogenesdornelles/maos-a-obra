import { projetosApi } from "@/api/projetosApi";
import { useQuery } from "@tanstack/react-query";

export function useGetProjetoById({ id }: { id: string }) {
  return useQuery({
    queryKey: ['useGetProjetoById', id],
    queryFn: () => projetosApi.getProjetoById(id),
    staleTime: 1000 * 60 * 10,
    refetchOnWindowFocus: false,
    enabled: !!id,
  });
}
