/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { PrecosController } from './precos.controller';
import { PrecosService } from './precos.service';

import { createMock, DeepMocked } from '@golevelup/ts-jest';

describe('PrecosController', () => {
  let controller: PrecosController;
  let service: DeepMocked<PrecosService>;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [PrecosController],
      providers: [
        {
          provide: PrecosService,
          useValue: createMock<PrecosService>(),
        },
      ],
    }).compile();
    controller = moduleRef.get(PrecosController);
    service = moduleRef.get(PrecosService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('deve criar um preço', async () => {
      const dto = {
        itemId: 'item1',
        estadoId: 'estado1',
        valor: 100,
      };
      const result = { id: '1', ...dto };

      service.create.mockResolvedValue(result as any);
      await expect(controller.create(dto)).resolves.toEqual(result);
      expect(service.create).toHaveBeenCalledWith(dto);
      expect(service.create).toHaveBeenCalledTimes(1);
    });
  });

  describe('findAll', () => {
    it('deve retornar preços', async () => {
      const result = [{ id: '1', itemId: 'item1', valor: 100 }];
      service.findAll.mockResolvedValue(result as any);
      await expect(controller.findAll()).resolves.toEqual(result);
      expect(service.findAll).toHaveBeenCalledWith();
      expect(service.findAll).toHaveBeenCalledTimes(1);
    });
  });

  describe('findOne', () => {
    it('deve retornar um preço', async () => {
      const result = { id: '1', itemId: 'item1', valor: 100 };
      service.findOne.mockResolvedValue(result as any);
      await expect(controller.findOne('1')).resolves.toEqual(result);
      expect(service.findOne).toHaveBeenCalledWith({ id: '1' });
      expect(service.findOne).toHaveBeenCalledTimes(1);
    });
  });

  describe('find', () => {
    it('deve retornar preços', async () => {
      const q = { itemId: 'item1' };
      const result = { id: '1', itemId: 'item1' };
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
          itemId: 'item1',
        },
      });
    });

    it('deve retornar preços com filtro de valor', async () => {
      const q = { valorMin: 10, valorMax: 100 };
      const result = { id: '1', valor: 50 };
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
          valor: {
            gte: 10,
            lte: 100,
          },
        },
      });
    });
  });

  describe('update', () => {
    it('deve atualizar um preço', async () => {
      const dto = { valor: 150 };
      const result = { id: '1', ...dto };
      service.update.mockResolvedValue(result as any);
      await expect(controller.update('1', dto)).resolves.toEqual(result);
      expect(service.update).toHaveBeenCalledWith({ id: '1' }, dto);
      expect(service.update).toHaveBeenCalledTimes(1);
    });
  });

  describe('remove', () => {
    it('deve deletar um preço', async () => {
      const result = { id: '1', itemId: 'item1' };
      service.remove.mockResolvedValue(result as any);
      await expect(controller.remove('1')).resolves.toEqual(result);
      expect(service.remove).toHaveBeenCalledWith({ id: '1' });
      expect(service.remove).toHaveBeenCalledTimes(1);
    });
  });
});
