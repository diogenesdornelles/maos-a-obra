import { usersApi } from '@/api/usuarioApi';
import { CreateUserForm } from '@/types/usuarios/createUser';
import { useMutation } from '@tanstack/react-query';

export const usePostCreateUser = () => {
  return useMutation({
    mutationFn: (userData: CreateUserForm) => usersApi.createUser(userData),
  });
};
