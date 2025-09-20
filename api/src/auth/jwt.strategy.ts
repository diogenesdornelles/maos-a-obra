import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { TokenPayload } from 'src/domain/interfaces/TokenPayload';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  private readonly logger = new Logger(JwtStrategy.name, {
    timestamp: true,
  });
  constructor(
    cfg: ConfigService,
    private prisma: PrismaService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: cfg.get<string>('SECRET_KEY') ?? 'fallback-secret',
    });
  }

  async validate(payload: TokenPayload) {
    const user = await this.prisma.usuario.findUnique({
      where: { id: payload.id },
    });
    if (!user || !user.status) {
      throw new UnauthorizedException('Usuário inativo ou inexistente');
    }
    this.logger.log(`Request user ${JSON.stringify({ ...user, senha: '' })}`);
    return { id: user.id, email: user.email, funcao: user.funcao };
  }
}
