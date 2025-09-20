import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { TokenPayload } from 'src/domain/interfaces/TokenPayload';

export interface RequestWithUser extends Request {
  user: TokenPayload;
}

@Injectable()
export class IdParamSelfGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest<RequestWithUser>();
    const user = req.user;
    if (!user) return false;

    const id = req.params?.id;
    if (!id) return false;

    if (String(user.id) === String(id)) return true;

    const role = (user.funcao ?? '').toString().toUpperCase();
    if (role === 'ADMIN') return true;

    return false;
  }
}
