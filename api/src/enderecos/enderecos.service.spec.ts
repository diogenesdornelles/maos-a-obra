import { Test, TestingModule } from '@nestjs/testing';
import { EnderecosService } from './enderecos.service';
import { EnderecosController } from './enderecos.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

describe('EnderecosService', () => {
  let service: EnderecosService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule],
      controllers: [EnderecosController],
      providers: [EnderecosService],
      exports: [EnderecosService],
    }).compile();

    service = module.get<EnderecosService>(EnderecosService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
