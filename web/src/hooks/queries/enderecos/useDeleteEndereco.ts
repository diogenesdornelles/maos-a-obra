import { enderecosApi } from '@/api/enderecosApi';
import { queryClient } from '@/services/queryClient';
import { useMutation } from '@tanstack/react-query';

export function useDeleteEndereco() {
	
	return useMutation({ 
		mutationFn: enderecosApi.deleteEndereco,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['useGetEnderecosBySearch'], exact: false });
			queryClient.invalidateQueries({ queryKey: ['useGetEnderecoById'], exact: false });
		}
	});
}