import { Test, TestingModule } from '@nestjs/testing';
import { ProjetoItensService } from './projeto_itens.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ProjetoItensController } from './projeto_itens.controller';

describe('ProjetoItensService', () => {
  let service: ProjetoItensService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule],
      controllers: [ProjetoItensController],
      providers: [ProjetoItensService],
      exports: [ProjetoItensService],
    }).compile();

    service = module.get<ProjetoItensService>(ProjetoItensService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
