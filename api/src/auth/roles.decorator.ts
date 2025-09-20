import { SetMetadata } from '@nestjs/common';
import { Funcao } from 'src/usuarios/dto/create-usuario.dto';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: Funcao[]) => SetMetadata(ROLES_KEY, roles);
