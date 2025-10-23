import { usersApi } from '@/api/usuarioApi';
import { useMutation } from '@tanstack/react-query';

export function useDeleteUser() {
	return useMutation({ mutationFn: usersApi.deleteUser });
}
