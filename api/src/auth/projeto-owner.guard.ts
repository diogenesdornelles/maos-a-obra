// src/projetos/projeto-owner.guard.ts
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';

import { Funcao } from 'src/usuarios/dto/create-usuario.dto';
import type { RequestWithUser } from 'src/auth/id-param-self.guard';
import { ProjetosService } from 'src/projetos/projetos.service';

@Injectable()
export class ProjetoOwnerGuard implements CanActivate {
  constructor(private readonly projetosService: ProjetosService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<RequestWithUser>();
    const user = request.user;
    const projetoId = request.params.id;

    if (!projetoId) {
      return true;
    }

    const projeto = await this.projetosService.findOne({
      id: projetoId,
      status: { not: 'CANCELADO' },
    });

    if (!projeto) {
      throw new UnauthorizedException('Projeto não encontrado ou cancelado');
    }

    if (user.funcao === Funcao.ADMIN) {
      return true;
    }

    if (user.funcao === Funcao.COMUM && projeto.usuarioId === user.id) {
      return true;
    }

    throw new UnauthorizedException('Credenciais inválidas para este projeto');
  }
}
