import { Module } from '@nestjs/common';
import { BairrosModule } from './bairros/bairros.module';
import { EnderecosModule } from './enderecos/enderecos.module';
import { ClientesModule } from './clientes/clientes.module';
import { EstadosModule } from './estados/estados.module';
import { PrecosModule } from './precos/precos.module';
import { ProjetosModule } from './projetos/projetos.module';
import { ProjetoItensModule } from './projeto_itens/projeto_itens.module';
import { MunicipiosModule } from './municipios/municipios.module';
import { ItensModule } from './itens/itens.module';
import { UsuariosModule } from './usuarios/usuarios.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import configuration from '../config/configuration';
import { PrismaModule } from './prisma/prisma.module';
import { ThrottlerModule } from '@nestjs/throttler';
import { HealthModule } from './health/health.module';
import { CacheInterceptor } from '@nestjs/cache-manager';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { CacheModule } from './cache/cache.module';

@Module({
  imports: [
    CacheModule,
    PrismaModule,
    HealthModule,
    BairrosModule,
    EnderecosModule,
    ClientesModule,
    EstadosModule,
    PrecosModule,
    ProjetosModule,
    ProjetoItensModule,
    MunicipiosModule,
    ItensModule,
    UsuariosModule,
    ConfigModule.forRoot({ isGlobal: true, load: [configuration] }),
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 60000,
          limit: 10,
        },
      ],
    }),
    AuthModule,
    CacheModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: CacheInterceptor,
    },
  ],
})
export class AppModule {}
