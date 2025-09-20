import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { PrismaModule } from 'src/prisma/prisma.module';
import { forwardRef } from '@nestjs/common';
import { UsuariosModule } from 'src/usuarios/usuarios.module';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './jwt.strategy';
import { JwtAuthGuard } from './jwt-auth.guard';
import { RolesGuard } from './roles.guard';
import { IdParamSelfGuard } from './id-param-self.guard';
import { ClienteOwnerGuard } from './cliente-owner.guard';
import { ProjetoOwnerGuard } from './projeto-owner.guard';
import { CreateUserGuard } from './create-user.guard';
import { ClientesModule } from 'src/clientes/clientes.module';
import { ProjetosModule } from 'src/projetos/projetos.module';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
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
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
