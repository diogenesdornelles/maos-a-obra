import { useMutation } from '@tanstack/react-query';
import { usersApi } from '@/api/usuarioApi';
import { UpdateUser } from '@/types/usuarios/update';
import { queryClient } from '@/services/queryClient';

export function useUpdateUser() {
    return useMutation({ 
        mutationFn: ({ body, id }: { body: Partial<UpdateUser>; id: string }) => 
            usersApi.updateUser(body, id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['useGetMe'], exact: false });
        }
    });
}