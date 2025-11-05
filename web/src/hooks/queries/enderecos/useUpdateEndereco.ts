import { useMutation } from '@tanstack/react-query';
import { enderecosApi } from '@/api/enderecosApi';
import { UpdateEndereco } from '@/types/enderecos/update';

export function useUpdateEndereco() {
	return useMutation({ 
		mutationFn: ({ body, id }: { body: Partial<UpdateEndereco>; id: string }) => 
			enderecosApi.updateEndereco(body, id) 
	});
}