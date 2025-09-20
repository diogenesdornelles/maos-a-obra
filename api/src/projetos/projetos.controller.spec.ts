/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { ProjetosController } from './projetos.controller';
import { ProjetosService } from './projetos.service';
import { Funcao } from 'src/usuarios/dto/create-usuario.dto';

import { createMock, DeepMocked } from '@golevelup/ts-jest';

describe('ProjetosController', () => {
  let controller: ProjetosController;
  let service: DeepMocked<ProjetosService>;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [ProjetosController],
      providers: [
        {
          provide: ProjetosService,
          useValue: createMock<ProjetosService>(),
        },
      ],
    }).compile();
    controller = moduleRef.get(ProjetosController);
    service = moduleRef.get(ProjetosService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('deve criar um projeto', async () => {
      const dto = {
        nome: 'Projeto A',
        clienteId: 'cliente1',
        estadoId: 'estado1',
      };
      const req = { user: { id: 'user1', funcao: Funcao.COMUM } };
      const result = { id: '1', ...dto, usuarioId: 'user1' };

      service.create.mockResolvedValue(result as any);
      await expect(controller.create(dto, req as any)).resolves.toEqual(result);
      expect(service.create).toHaveBeenCalledWith({
        ...dto,
        usuarioId: 'user1',
      });
      expect(service.create).toHaveBeenCalledTimes(1);
    });
  });

  describe('findAll', () => {
    it('deve retornar projetos para usuário comum', async () => {
      const req = { user: { id: 'user1', funcao: Funcao.COMUM } };
      const result = [{ id: '1', nome: 'Projeto A', usuarioId: 'user1' }];
      service.findAll.mockResolvedValue(result as any);
      await expect(controller.findAll(req as any)).resolves.toEqual(result);
      expect(service.findAll).toHaveBeenCalledWith({
        where: { usuarioId: 'user1' },
      });
      expect(service.findAll).toHaveBeenCalledTimes(1);
    });
  });

  describe('findOne', () => {
    it('deve retornar um projeto', async () => {
      const result = { id: '1', nome: 'Projeto A' };
      service.findOne.mockResolvedValue(result as any);
      await expect(controller.findOne('1')).resolves.toEqual(result);
      expect(service.findOne).toHaveBeenCalledWith({
        id: '1',
        status: { not: 'CANCELADO' },
      });
      expect(service.findOne).toHaveBeenCalledTimes(1);
    });
  });

  describe('find', () => {
    it('deve retornar projetos', async () => {
      const req = { user: { id: 'user1', funcao: Funcao.COMUM } };
      const q = { nome: 'Projeto' };
      const result = { id: '1', nome: 'Projeto A' };
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
          nome: {
            contains: 'Projeto',
            mode: 'insensitive',
          },
          usuarioId: 'user1',
        },
      });
    });
  });

  describe('update', () => {
    it('deve atualizar um projeto', async () => {
      const dto = { nome: 'Projeto B' };
      const result = { id: '1', ...dto };
      service.update.mockResolvedValue(result as any);
      await expect(controller.update('1', dto)).resolves.toEqual(result);
      expect(service.update).toHaveBeenCalledWith({ id: '1' }, dto);
      expect(service.update).toHaveBeenCalledTimes(1);
    });
  });

  describe('remove', () => {
    it('deve deletar um projeto', async () => {
      const result = { id: '1', nome: 'Projeto A' };
      service.remove.mockResolvedValue(result as any);
      await expect(controller.remove('1')).resolves.toEqual(result);
      expect(service.remove).toHaveBeenCalledWith({ id: '1' });
      expect(service.remove).toHaveBeenCalledTimes(1);
    });
  });
});
