import { enderecosApi } from "@/api/enderecosApi";
import { useQuery } from "@tanstack/react-query";

export function useGetEnderecoById({ id }: { id: string }) {
  return useQuery({
    queryKey: ['useGetEnderecoById', id],
    queryFn: () => enderecosApi.getEnderecoById(id),
    staleTime: 1000 * 60 * 10,
    refetchOnWindowFocus: false,
    enabled: !!id,
  });
}
