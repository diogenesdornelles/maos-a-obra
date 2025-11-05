import { usersApi } from '@/api/usuarioApi';
import { queryClient } from '@/services/queryClient';
import { useMutation } from '@tanstack/react-query';

export function useDeleteUser() {
	return useMutation({ 
		mutationFn: usersApi.deleteUser,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['useGetMe'], exact: false });
		}
	});
}