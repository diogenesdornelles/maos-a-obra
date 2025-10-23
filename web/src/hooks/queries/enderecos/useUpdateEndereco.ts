import { useMutation } from '@tanstack/react-query';
import { enderecosApi } from '@/api/enderecosApi';

export function useUpdateEndereco() {
	return useMutation({ mutationFn: enderecosApi.updateEndereco });
}
