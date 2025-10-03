import { restClient } from '@/services/restClient';
import { LoginProps, TokenAcess } from '@/types/auth/auth';

export const authApi = {
  postLogin: async (params: LoginProps) => {
    const data = await restClient.post<TokenAcess>('/auth/login', params);

    return data;
  },
};
