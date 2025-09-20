/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { BairrosController } from './bairros.controller';
import { BairrosService } from './bairros.service';

import { createMock, DeepMocked } from '@golevelup/ts-jest';

describe('BairrosController', () => {
  let controller: BairrosController;
  let service: DeepMocked<BairrosService>;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [BairrosController],
      providers: [
        {
          provide: BairrosService,
          useValue: createMock<BairrosService>(),
        },
      ],
    }).compile();
    controller = moduleRef.get(BairrosController);
    service = moduleRef.get(BairrosService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('deve criar um bairro', async () => {
      const dto = { nome: 'Centro', codigo: '001', uf: 'SP' };
      const result = { id: '1', ...dto };

      service.create.mockResolvedValue(result as any);
      await expect(controller.create(dto)).resolves.toEqual(result);
      expect(service.create).toHaveBeenCalledWith(dto);
      expect(service.create).toHaveBeenCalledTimes(1);
    });
  });

  describe('findAll', () => {
    it('deve retornar bairros', async () => {
      const dto = { nome: 'Centro', codigo: '001', uf: 'SP' };
      const result = { id: '1', ...dto };
      service.findAll.mockResolvedValue([result] as any);
      await expect(controller.findAll()).resolves.toEqual([result]);
      expect(service.findAll).toHaveBeenCalledWith();
      expect(service.findAll).toHaveBeenCalledTimes(1);
    });
  });

  describe('findOne', () => {
    it('deve retornar um bairro', async () => {
      const dto = { nome: 'Centro', codigo: '001', uf: 'SP' };
      const result = { id: '1', ...dto };
      service.findOne.mockResolvedValue(result as any);
      await expect(controller.findOne('1')).resolves.toEqual(result);
      expect(service.findOne).toHaveBeenCalledWith({ id: '1' });
      expect(service.findOne).toHaveBeenCalledTimes(1);
    });
  });

  describe('find', () => {
    it('deve retornar bairros', async () => {
      const dto = { nome: 'Centro', codigo: '001', uf: 'SP' };
      const result = { id: '1', ...dto };
      service.find.mockResolvedValue(result as any);
      await expect(controller.find({ nome: 'Centro' })).resolves.toEqual(
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
            contains: 'Centro',
            mode: 'insensitive',
          },
        },
      });
    });
  });

  describe('update', () => {
    it('deve atualizar um bairro', async () => {
      const dto = { nome: 'Centro Atualizado', codigo: '002', uf: 'SP' };
      const result = { id: '1', ...dto };
      service.update.mockResolvedValue(result as any);
      await expect(controller.update('1', dto)).resolves.toEqual(result);
      expect(service.update).toHaveBeenCalledWith({ id: '1' }, dto);
      expect(service.update).toHaveBeenCalledTimes(1);
    });
  });

  describe('remove', () => {
    it('deve deletar um bairro', async () => {
      const dto = { nome: 'Centro', codigo: '001', uf: 'SP' };
      const result = { id: '1', ...dto };
      service.remove.mockResolvedValue(result as any);
      await expect(controller.remove('1')).resolves.toEqual(result);
      expect(service.remove).toHaveBeenCalledWith({ id: '1' });
      expect(service.remove).toHaveBeenCalledTimes(1);
    });
  });
});
