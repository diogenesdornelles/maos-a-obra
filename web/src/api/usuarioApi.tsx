import { restClient } from '@/services/restClient';
import { CreatedUser, CreateUserForm, InsertUserComplete } from '@/types/usuarios/createUser';
import { MeProps } from '@/types/usuarios/usuarios';

export const usersApi = {
  createUser: async (params: CreateUserForm) => {
    const body: InsertUserComplete = {
      ...params,
      funcao: 'COMUM',
      status: true,
    };

    const data = await restClient.post<CreatedUser>('/usuarios', body);

    return data;
  },
  getMe: async () => {
        const data = await restClient.get<MeProps>('/usuarios/me');
    return data;
  },
};
