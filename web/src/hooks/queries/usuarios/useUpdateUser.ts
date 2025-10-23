import { useMutation } from '@tanstack/react-query';
import { usersApi } from '@/api/usuarioApi';

export function useUpdateUser() {
	return useMutation({ mutationFn: usersApi.updateUser });
}
