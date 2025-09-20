import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { Usuario } from '@prisma/client';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name, {
    timestamp: true,
  });
  constructor(
    private jwtService: JwtService,
    private prisma: PrismaService,
  ) {}

  async validateUser(
    email: string,
    pass: string,
  ): Promise<Omit<Usuario, 'senha'> | null> {
    this.logger.log(`Email ${JSON.stringify(email)}`);
    const user = await this.prisma.usuario.findUnique({ where: { email } });
    if (!user) throw new UnauthorizedException('Credenciais inválidas');
    if (!user.status) throw new UnauthorizedException('Usuário inativo');

    const match = await bcrypt.compare(pass, user.senha);
    if (!match) throw new UnauthorizedException('Credenciais inválidas');
    const { senha, ...safeUser } = user;
    return safeUser;
  }

  async login(userPayload: LoginDto) {
    const user = await this.validateUser(userPayload.email, userPayload.pass);
    if (!user) return null;
    this.logger.log(`User info ${JSON.stringify({ ...user, senha: '' })}; `);
    const payload = {
      id: user.id,
      email: user.email,
      funcao: user.funcao,
      cpf: user.cpf,
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
