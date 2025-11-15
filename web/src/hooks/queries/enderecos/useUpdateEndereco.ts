import { useMutation } from '@tanstack/react-query';
import { enderecosApi } from '@/api/enderecosApi';
import { UpdateEndereco } from '@/types/enderecos/update';
import { queryClient } from '@/services/queryClient';

export function useUpdateEndereco() {
	return useMutation({ 
		mutationFn: ({ body, id }: { body: Partial<UpdateEndereco>; id: string }) => 
			enderecosApi.updateEndereco(body, id),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['useGetEnderecosBySearch'], exact: false });
			queryClient.invalidateQueries({ queryKey: ['useGetEnderecoById'], exact: false });
		}
	});
}