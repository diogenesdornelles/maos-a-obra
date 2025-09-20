import { Module } from '@nestjs/common';
import { ProjetoItensService } from './projeto_itens.service';
import { ProjetoItensController } from './projeto_itens.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ProjetoItensController],
  providers: [ProjetoItensService],
  exports: [ProjetoItensService],
})
export class ProjetoItensModule {}
