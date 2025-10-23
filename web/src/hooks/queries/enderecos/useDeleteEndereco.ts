import { enderecosApi } from '@/api/enderecosApi';
import { useMutation } from '@tanstack/react-query';

export function useDeleteEndereco() {
	return useMutation({ mutationFn: enderecosApi.deleteEndereco });
}
