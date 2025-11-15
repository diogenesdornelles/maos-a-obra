import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';

import { Funcao } from 'src/usuarios/dto/create-usuario.dto';
import type { RequestWithUser } from 'src/auth/id-param-self.guard';
import { EnderecosService } from 'src/enderecos/enderecos.service';

@Injectable()
export class EnderecoOwnerGuard implements CanActivate {
  constructor(private readonly enderecosService: EnderecosService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<RequestWithUser>();
    const user = request.user;
    const enderecoId = request.params.id;

    if (!enderecoId) {
      return true;
    }

    const endereco = await this.enderecosService.findOne({ id: enderecoId });

    if (!endereco) {
      throw new UnprocessableEntityException('Endereço não encontrado');
    }

    if (user.funcao === Funcao.ADMIN) {
      return true;
    }

    if (user.funcao === Funcao.COMUM && endereco.usuarioId === user.id) {
      return true;
    }

    throw new UnauthorizedException('Credenciais inválidas para este endereço');
  }
}
