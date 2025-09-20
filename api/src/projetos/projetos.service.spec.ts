import { Test, TestingModule } from '@nestjs/testing';
import { ProjetosService } from './projetos.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ProjetosController } from './projetos.controller';

describe('ProjetosService', () => {
  let service: ProjetosService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule],
      controllers: [ProjetosController],
      providers: [ProjetosService],
      exports: [ProjetosService],
    }).compile();

    service = module.get<ProjetosService>(ProjetosService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
