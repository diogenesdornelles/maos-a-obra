import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from './roles.decorator';
import { TokenPayload } from 'src/domain/interfaces/TokenPayload';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles || requiredRoles.length === 0) return true;
    const req = context.switchToHttp().getRequest<Request>();
    const user = req.user as TokenPayload;

    if (!user) return false;

    const userRole = (user.funcao ?? '').toString().toUpperCase();

    for (const r of requiredRoles) {
      if (r.toString().toUpperCase() === userRole) return true;
    }
    return false;
  }
}
