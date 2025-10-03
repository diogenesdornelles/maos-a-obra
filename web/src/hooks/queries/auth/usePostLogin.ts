import { authApi } from '@/api/authApi';
import { LoginProps } from '@/types/auth/auth';
import { useMutation } from '@tanstack/react-query';

export const usePostLogin = () => {
  return useMutation({
    mutationFn: (userData: LoginProps) => authApi.postLogin(userData),
  });
};
