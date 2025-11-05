import { useMutation } from '@tanstack/react-query';
import { usersApi } from '@/api/usuarioApi';
import { UpdateUser } from '@/types/usuarios/update';

export function useUpdateUser() {
    return useMutation({ 
        mutationFn: ({ body, id }: { body: Partial<UpdateUser>; id: string }) => 
            usersApi.updateUser(body, id) 
    });
}