import { Test, TestingModule } from '@nestjs/testing';
import { MunicipiosService } from './municipios.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { MunicipiosController } from './municipios.controller';

describe('MunicipiosService', () => {
  let service: MunicipiosService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [PrismaModule],
      controllers: [MunicipiosController],
      providers: [MunicipiosService],
      exports: [MunicipiosService],
    }).compile();

    service = module.get<MunicipiosService>(MunicipiosService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
