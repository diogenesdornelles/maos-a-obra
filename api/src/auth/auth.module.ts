// ...existing code...
import { Module, forwardRef } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './jwt.strategy';
import { JwtAuthGuard } from './jwt-auth.guard';
import { RolesGuard } from './roles.guard';
import { IdParamSelfGuard } from './id-param-self.guard';

import { PrismaModule } from 'src/prisma/prisma.module';
import { UsuariosModule } from 'src/usuarios/usuarios.module';
import { ClienteOwnerGuard } from './cliente-owner.guard';
import { ProjetoOwnerGuard } from './projeto-owner.guard';
import { CreateUserGuard } from './create-user.guard';
import { ClientesModule } from 'src/clientes/clientes.module';
import { ProjetosModule } from 'src/projetos/projetos.module';

@Module({
  imports: [
    ConfigModule,
    ClientesModule,
    ProjetosModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (cfg: ConfigService) => ({
        secret: cfg.get<string>('secretKey') ?? process.env.SECRET_KEY,
        signOptions: {
          expiresIn: cfg.get<string>('expiresIn') ?? process.env.EXPIRES_IN,
        },
      }),
    }),
    PrismaModule,
    forwardRef(() => UsuariosModule),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,
    JwtAuthGuard,
    RolesGuard,
    IdParamSelfGuard,
    ClienteOwnerGuard,
    ProjetoOwnerGuard,
    CreateUserGuard,
  ],

  exports: [
    AuthService,
    JwtStrategy,
    JwtAuthGuard,
    RolesGuard,
    IdParamSelfGuard,
    ClienteOwnerGuard,
    ProjetoOwnerGuard,
    CreateUserGuard,
  ],
})
export class AuthModule {}
