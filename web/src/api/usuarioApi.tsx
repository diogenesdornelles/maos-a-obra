import { restClient } from '@/services/restClient';
import { CreatedUser, CreateUserForm, InsertUserComplete } from '@/types/usuarios/createUser';
import { UpdateUser } from '@/types/usuarios/update';
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

  updateUser: async (body: Partial<UpdateUser>, id: string) => {
        const data = await restClient.patch<CreatedUser>(`/usuarios/${id}`, body);
        return data;
      },

  deleteUser: async (id: string) => {
    const data = await restClient.delete<CreatedUser>(`/usuarios/${id}`);
    return data;
  },
};
