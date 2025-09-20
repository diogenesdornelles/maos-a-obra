import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';

import { Funcao } from 'src/usuarios/dto/create-usuario.dto';
import type { RequestWithUser } from 'src/auth/id-param-self.guard';
import { ClientesService } from 'src/clientes/clientes.service';

@Injectable()
export class ClienteOwnerGuard implements CanActivate {
  constructor(private readonly clientesService: ClientesService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<RequestWithUser>();
    const user = request.user;
    const clienteId = request.params.id;

    if (!clienteId) {
      return true;
    }

    const cliente = await this.clientesService.findOne({ id: clienteId });

    if (!cliente) {
      throw new UnauthorizedException('Cliente não encontrado');
    }

    if (user.funcao === Funcao.ADMIN) {
      return true;
    }

    if (user.funcao === Funcao.COMUM && cliente.usuarioId === user.id) {
      return true;
    }

    throw new UnauthorizedException('Credenciais inválidas para este cliente');
  }
}
