/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { ItensController } from './itens.controller';
import { ItensService } from './itens.service';

import { createMock, DeepMocked } from '@golevelup/ts-jest';

describe('ItensController', () => {
  let controller: ItensController;
  let service: DeepMocked<ItensService>;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [ItensController],
      providers: [
        {
          provide: ItensService,
          useValue: createMock<ItensService>(),
        },
      ],
    }).compile();
    controller = moduleRef.get(ItensController);
    service = moduleRef.get(ItensService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('deve criar um item', async () => {
      const dto = {
        codigo: '001',
        nomenclatura: 'Item A',
        unidade: 'kg',
      };
      const result = { id: '1', ...dto };

      service.create.mockResolvedValue(result as any);
      await expect(controller.create(dto)).resolves.toEqual(result);
      expect(service.create).toHaveBeenCalledWith(dto);
      expect(service.create).toHaveBeenCalledTimes(1);
    });
  });

  describe('findAll', () => {
    it('deve retornar itens', async () => {
      const result = [{ id: '1', codigo: '001', nomenclatura: 'Item A' }];
      service.findAll.mockResolvedValue(result as any);
      await expect(controller.findAll()).resolves.toEqual(result);
      expect(service.findAll).toHaveBeenCalledWith();
      expect(service.findAll).toHaveBeenCalledTimes(1);
    });
  });

  describe('findOne', () => {
    it('deve retornar um item', async () => {
      const result = { id: '1', codigo: '001', nomenclatura: 'Item A' };
      service.findOne.mockResolvedValue(result as any);
      await expect(controller.findOne('1')).resolves.toEqual(result);
      expect(service.findOne).toHaveBeenCalledWith({ id: '1' });
      expect(service.findOne).toHaveBeenCalledTimes(1);
    });
  });

  describe('find', () => {
    it('deve retornar itens', async () => {
      const q = { nomenclatura: 'Item' };
      const result = { id: '1', nomenclatura: 'Item A' };
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
          nomenclatura: {
            contains: 'Item',
            mode: 'insensitive',
          },
        },
      });
    });
  });

  describe('findOneWithPreco', () => {
    it('deve retornar item com preço', async () => {
      const q = { itemId: 'item1', estadoId: 'estado1' };
      const result = { id: '1', preco: 100 };
      service.findOneWithPreco.mockResolvedValue(result as any);
      await expect(controller.findOneWithPreco(q)).resolves.toEqual(result);
      expect(service.findOneWithPreco).toHaveBeenCalledWith('estado1', 'item1');
      expect(service.findOneWithPreco).toHaveBeenCalledTimes(1);
    });
  });

  describe('update', () => {
    it('deve atualizar um item', async () => {
      const dto = { nomenclatura: 'Item B' };
      const result = { id: '1', ...dto };
      service.update.mockResolvedValue(result as any);
      await expect(controller.update('1', dto)).resolves.toEqual(result);
      expect(service.update).toHaveBeenCalledWith({ id: '1' }, dto);
      expect(service.update).toHaveBeenCalledTimes(1);
    });
  });

  describe('remove', () => {
    it('deve deletar um item', async () => {
      const result = { id: '1', codigo: '001' };
      service.remove.mockResolvedValue(result as any);
      await expect(controller.remove('1')).resolves.toEqual(result);
      expect(service.remove).toHaveBeenCalledWith({ id: '1' });
      expect(service.remove).toHaveBeenCalledTimes(1);
    });
  });
});
