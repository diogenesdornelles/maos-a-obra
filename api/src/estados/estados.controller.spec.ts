/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { EstadosController } from './estados.controller';
import { EstadosService } from './estados.service';

import { createMock, DeepMocked } from '@golevelup/ts-jest';

describe('EstadosController', () => {
  let controller: EstadosController;
  let service: DeepMocked<EstadosService>;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [EstadosController],
      providers: [
        {
          provide: EstadosService,
          useValue: createMock<EstadosService>(),
        },
      ],
    }).compile();
    controller = moduleRef.get(EstadosController);
    service = moduleRef.get(EstadosService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('deve criar um estado', async () => {
      const dto = { codigoUf: 35, nome: 'São Paulo', uf: 'SP', regiao: 3 };
      const result = { id: '1', ...dto };

      service.create.mockResolvedValue(result as any);
      await expect(controller.create(dto)).resolves.toEqual(result);
      expect(service.create).toHaveBeenCalledWith(dto);
      expect(service.create).toHaveBeenCalledTimes(1);
    });
  });

  describe('findAll', () => {
    it('deve retornar estados', async () => {
      const dto = { codigoUf: 35, nome: 'São Paulo', uf: 'SP', regiao: 3 };
      const result = { id: '1', ...dto };
      service.findAll.mockResolvedValue([result] as any);
      await expect(controller.findAll()).resolves.toEqual([result]);
      expect(service.findAll).toHaveBeenCalledWith();
      expect(service.findAll).toHaveBeenCalledTimes(1);
    });
  });
  describe('findOne', () => {
    it('deve retornar um estado', async () => {
      const dto = { codigoUf: 35, nome: 'São Paulo', uf: 'SP', regiao: 3 };
      const result = { id: '1', ...dto };
      service.findOne.mockResolvedValue(result as any);
      await expect(controller.findOne('1')).resolves.toEqual(result);
      expect(service.findOne).toHaveBeenCalledWith({ id: '1' });
      expect(service.findOne).toHaveBeenCalledTimes(1);
    });
  });

  describe('find', () => {
    it('deve retornar estados', async () => {
      const dto = { codigoUf: 35, nome: 'São Paulo', uf: 'SP', regiao: 3 };
      const result = { id: '1', ...dto };
      service.find.mockResolvedValue(result as any);
      await expect(controller.find({ nome: 'São Paulo' })).resolves.toEqual(
        result,
      );
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
    it('deve atualizar um estado', async () => {
      const dto = { codigoUf: 40, nome: 'Paraná', uf: 'PR', regiao: 2 };
      const result = { id: '2', ...dto };
      service.update.mockResolvedValue(result as any);
      await expect(controller.update('2', dto)).resolves.toEqual(result);
      expect(service.update).toHaveBeenCalledWith({ id: '2' }, dto);
      expect(service.update).toHaveBeenCalledTimes(1);
    });
  });

  describe('delete', () => {
    it('deve deletar um estado', async () => {
      const dto = { codigoUf: 40, nome: 'Paraná', uf: 'PR', regiao: 2 };
      const result = { id: '2', ...dto };
      service.remove.mockResolvedValue(result as any);
      await expect(controller.remove('2')).resolves.toEqual(result);
      expect(service.remove).toHaveBeenCalledWith({ id: '2' });
      expect(service.remove).toHaveBeenCalledTimes(1);
    });
  });
});
