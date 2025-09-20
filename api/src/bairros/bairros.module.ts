import { Module } from '@nestjs/common';
import { BairrosService } from './bairros.service';
import { BairrosController } from './bairros.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [BairrosController],
  providers: [BairrosService],
  exports: [BairrosService],
})
export class BairrosModule {}
