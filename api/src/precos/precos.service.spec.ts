import { Test, TestingModule } from '@nestjs/testing';
import { PrecosService } from './precos.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { PrecosController } from './precos.controller';

describe('PrecosService', () => {
  let service: PrecosService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule],
      controllers: [PrecosController],
      providers: [PrecosService],
      exports: [PrecosService],
    }).compile();

    service = module.get<PrecosService>(PrecosService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
