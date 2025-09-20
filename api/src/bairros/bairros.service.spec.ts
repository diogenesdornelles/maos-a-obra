import { Test, TestingModule } from '@nestjs/testing';
import { BairrosService } from './bairros.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { BairrosController } from './bairros.controller';

describe('BairrosService', () => {
  let service: BairrosService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule],
      controllers: [BairrosController],
      providers: [BairrosService],
      exports: [BairrosService],
    }).compile();

    service = module.get<BairrosService>(BairrosService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
