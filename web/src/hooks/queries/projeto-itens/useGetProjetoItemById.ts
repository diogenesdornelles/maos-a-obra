import { projetoItensApi } from "@/api/projetoItensApi";
import { projetosApi } from "@/api/projetosApi";
import { useQuery } from "@tanstack/react-query";

export function useGetProjetoItemById({ id }: { id: string }) {
  return useQuery({
    queryKey: ['useGetProjetoItemById', id],
    queryFn: () => projetoItensApi.getProjetoItemById(id),
    staleTime: 1000 * 60 * 10,
    refetchOnWindowFocus: false,
    enabled: !!id,
  });
}
