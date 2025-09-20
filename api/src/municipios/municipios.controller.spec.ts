/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { MunicipiosController } from './municipios.controller';
import { MunicipiosService } from './municipios.service';

import { createMock, DeepMocked } from '@golevelup/ts-jest';

describe('MunicipiosController', () => {
  let controller: MunicipiosController;
  let service: DeepMocked<MunicipiosService>;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [MunicipiosController],
      providers: [
        {
          provide: MunicipiosService,
          useValue: createMock<MunicipiosService>(),
        },
      ],
    }).compile();
    controller = moduleRef.get(MunicipiosController);
    service = moduleRef.get(MunicipiosService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('deve criar um município', async () => {
      const dto = {
        nome: 'São Paulo',
        uf: 'SP',
        codigo: 3550308,
      };
      const result = { id: '1', ...dto };

      service.create.mockResolvedValue(result as any);
      await expect(controller.create(dto)).resolves.toEqual(result);
      expect(service.create).toHaveBeenCalledWith(dto);
      expect(service.create).toHaveBeenCalledTimes(1);
    });
  });

  describe('findAll', () => {
    it('deve retornar municípios', async () => {
      const result = [{ id: '1', nome: 'São Paulo', uf: 'SP' }];
      service.findAll.mockResolvedValue(result as any);
      await expect(controller.findAll()).resolves.toEqual(result);
      expect(service.findAll).toHaveBeenCalledWith();
      expect(service.findAll).toHaveBeenCalledTimes(1);
    });
  });

  describe('findOne', () => {
    it('deve retornar um município', async () => {
      const result = { id: '1', nome: 'São Paulo', uf: 'SP' };
      service.findOne.mockResolvedValue(result as any);
      await expect(controller.findOne('1')).resolves.toEqual(result);
      expect(service.findOne).toHaveBeenCalledWith({ id: '1' });
      expect(service.findOne).toHaveBeenCalledTimes(1);
    });
  });

  describe('find', () => {
    it('deve retornar municípios', async () => {
      const q = { nome: 'São Paulo' };
      const result = { id: '1', nome: 'São Paulo' };
      service.find.mockResolvedValue(result as any);
      await expect(controller.find(q)).resolves.toEqual(result);
      expect(service.find).toHaveBeenCalledTimes(1);
      expect(service.find).toHaveBeenCalledWith({
        orderBy: {
          id: 'asc',
        },
        skip: 0,
        take: 10,
        where: {
          nome: {
            contains: 'São Paulo',
            mode: 'insensitive',
          },
        },
      });
    });
  });

  describe('update', () => {
    it('deve atualizar um município', async () => {
      const dto = { nome: 'São Paulo Atualizado' };
      const result = { id: '1', ...dto };
      service.update.mockResolvedValue(result as any);
      await expect(controller.update('1', dto)).resolves.toEqual(result);
      expect(service.update).toHaveBeenCalledWith({ id: '1' }, dto);
      expect(service.update).toHaveBeenCalledTimes(1);
    });
  });

  describe('remove', () => {
    it('deve deletar um município', async () => {
      const result = { id: '1', nome: 'São Paulo' };
      service.remove.mockResolvedValue(result as any);
      await expect(controller.remove('1')).resolves.toEqual(result);
      expect(service.remove).toHaveBeenCalledWith({ id: '1' });
      expect(service.remove).toHaveBeenCalledTimes(1);
    });
  });
});
