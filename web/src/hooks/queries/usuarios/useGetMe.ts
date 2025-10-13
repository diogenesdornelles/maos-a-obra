import { usersApi } from "@/api/usuarioApi";
import { useQuery } from "@tanstack/react-query";

export function useGetMe() {
  return useQuery({
    queryKey: ['useGetMe'],
    queryFn: () => usersApi.getMe(),
    staleTime: 1000 * 60 * 10,
    refetchOnWindowFocus: false,
  });
}