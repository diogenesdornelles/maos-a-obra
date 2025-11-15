import { clientesApi } from "@/api/clientesApi";
import { useQuery } from "@tanstack/react-query";

export function useGetClienteById({ id }: { id: string }) {
  return useQuery({
    queryKey: ['useGetClienteById', id],
    queryFn: () => clientesApi.getClienteById(id),
    staleTime: 1000 * 60 * 10,
    refetchOnWindowFocus: false,
    enabled: !!id,
  });
}
