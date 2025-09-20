import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { CreateUsuarioDto, Funcao } from 'src/usuarios/dto/create-usuario.dto';
import { RequestWithUser } from './id-param-self.guard';

@Injectable()
export class CreateUserGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest<RequestWithUser>();
    const user = req?.user || {};
    const body = req.body as CreateUsuarioDto;

    if (user && user?.funcao === Funcao.ADMIN) {
      return true;
    }
    if (user && user?.funcao === Funcao.COMUM && body.funcao === Funcao.ADMIN) {
      throw new UnauthorizedException(
        'Credenciais inválidas para criação de ADMIN',
      );
    }
    return true;
  }
}
