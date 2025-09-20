import { Module } from '@nestjs/common';
import { PrecosService } from './precos.service';
import { PrecosController } from './precos.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [PrecosController],
  providers: [PrecosService],
  exports: [PrecosService],
})
export class PrecosModule {}
