import { Test, TestingModule } from '@nestjs/testing';
import { ItensService } from './itens.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ItensController } from './itens.controller';

describe('ItensService', () => {
  let service: ItensService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule],
      controllers: [ItensController],
      providers: [ItensService],
      exports: [ItensService],
    }).compile();

    service = module.get<ItensService>(ItensService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
