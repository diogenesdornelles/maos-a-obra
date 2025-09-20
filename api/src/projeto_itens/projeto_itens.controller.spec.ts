/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { ProjetoItensController } from './projeto_itens.controller';
import { ProjetoItensService } from './projeto_itens.service';
import { Funcao } from 'src/usuarios/dto/create-usuario.dto';

import { createMock, DeepMocked } from '@golevelup/ts-jest';

describe('ProjetoItensController', () => {
  let controller: ProjetoItensController;
  let service: DeepMocked<ProjetoItensService>;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [ProjetoItensController],
      providers: [
        {
          provide: ProjetoItensService,
          useValue: createMock<ProjetoItensService>(),
        },
      ],
    }).compile();
    controller = moduleRef.get(ProjetoItensController);
    service = moduleRef.get(ProjetoItensService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('deve criar um projeto item', async () => {
      const dto = {
        projetoId: 'proj1',
        itemId: 'item1',
        quantidade: 10,
      };
      const result = { id: '1', ...dto };

      service.create.mockResolvedValue(result as any);
      await expect(controller.create(dto)).resolves.toEqual(result);
      expect(service.create).toHaveBeenCalledWith(dto);
      expect(service.create).toHaveBeenCalledTimes(1);
    });
  });

  describe('findAll', () => {
    it('deve retornar projeto itens para usuário comum', async () => {
      const req = { user: { id: 'user1', funcao: Funcao.COMUM } };
      const result = [{ id: '1', projetoId: 'proj1', itemId: 'item1' }];
      service.findAll.mockResolvedValue(result as any);
      await expect(controller.findAll(req as any)).resolves.toEqual(result);
      expect(service.findAll).toHaveBeenCalledWith({
        where: { projeto: { usuarioId: 'user1' } },
      });
      expect(service.findAll).toHaveBeenCalledTimes(1);
    });
  });

  describe('findOne', () => {
    it('deve retornar um projeto item', async () => {
      const result = { id: '1', projetoId: 'proj1', itemId: 'item1' };
      service.findOne.mockResolvedValue(result as any);
      await expect(controller.findOne('1')).resolves.toEqual(result);
      expect(service.findOne).toHaveBeenCalledWith({
        id: '1',
        status: true,
      });
      expect(service.findOne).toHaveBeenCalledTimes(1);
    });
  });

  describe('find', () => {
    it('deve retornar projeto itens', async () => {
      const req = { user: { id: 'user1', funcao: Funcao.COMUM } };
      const q = { projetoId: 'proj1', itemId: 'item1' };
      const result = { id: '1', projetoId: 'proj1', itemId: 'item1' };
      service.find.mockResolvedValue(result as any);
      await expect(controller.find(q, req as any)).resolves.toEqual(result);
      expect(service.find).toHaveBeenCalledTimes(1);
      expect(service.find).toHaveBeenCalledWith({
        orderBy: {
          id: 'asc',
        },
        skip: 0,
        take: 10,
        where: {
          projeto: { usuarioId: 'user1' },
          projetoId: 'proj1',
          itemId: 'item1',
        },
      });
    });
  });

  describe('update', () => {
    it('deve atualizar um projeto item', async () => {
      const dto = { quantidade: 20 };
      const result = { id: '1', ...dto };
      service.update.mockResolvedValue(result as any);
      await expect(controller.update('1', dto)).resolves.toEqual(result);
      expect(service.update).toHaveBeenCalledWith({ id: '1' }, dto);
      expect(service.update).toHaveBeenCalledTimes(1);
    });
  });

  describe('remove', () => {
    it('deve deletar um projeto item', async () => {
      const result = { id: '1', projetoId: 'proj1' };
      service.remove.mockResolvedValue(result as any);
      await expect(controller.remove('1')).resolves.toEqual(result);
      expect(service.remove).toHaveBeenCalledWith({ id: '1' });
      expect(service.remove).toHaveBeenCalledTimes(1);
    });
  });
});
