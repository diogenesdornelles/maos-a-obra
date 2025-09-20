import { Test, TestingModule } from '@nestjs/testing';
import { EstadosService } from './estados.service';
import { EstadosController } from './estados.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

describe('EstadosService', () => {
  let service: EstadosService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule],
      controllers: [EstadosController],
      providers: [EstadosService],
      exports: [EstadosService],
    }).compile();

    service = module.get<EstadosService>(EstadosService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
