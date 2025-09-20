/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { ClientesController } from './clientes.controller';
import { ClientesService } from './clientes.service';
import { Funcao } from 'src/usuarios/dto/create-usuario.dto';

import { createMock, DeepMocked } from '@golevelup/ts-jest';

describe('ClientesController', () => {
  let controller: ClientesController;
  let service: DeepMocked<ClientesService>;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [ClientesController],
      providers: [
        {
          provide: ClientesService,
          useValue: createMock<ClientesService>(),
        },
      ],
    }).compile();
    controller = moduleRef.get(ClientesController);
    service = moduleRef.get(ClientesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('deve criar um cliente', async () => {
      const dto = {
        nome: 'João Silva',
        cpf: '12345678901',
        email: 'joao@example.com',
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
    it('deve retornar clientes para usuário comum', async () => {
      const req = { user: { id: 'user1', funcao: Funcao.COMUM } };
      const result = [{ id: '1', nome: 'João Silva', usuarioId: 'user1' }];
      service.findAll.mockResolvedValue(result as any);
      await expect(controller.findAll(req as any)).resolves.toEqual(result);
      expect(service.findAll).toHaveBeenCalledWith({
        where: { usuarioId: 'user1' },
      });
      expect(service.findAll).toHaveBeenCalledTimes(1);
    });
  });

  describe('findOne', () => {
    it('deve retornar um cliente', async () => {
      const result = { id: '1', nome: 'João Silva' };
      service.findOne.mockResolvedValue(result as any);
      await expect(controller.findOne('1')).resolves.toEqual(result);
      expect(service.findOne).toHaveBeenCalledWith({ id: '1' });
      expect(service.findOne).toHaveBeenCalledTimes(1);
    });
  });

  describe('find', () => {
    it('deve retornar clientes', async () => {
      const req = { user: { id: 'user1', funcao: Funcao.COMUM } };
      const q = { nome: 'João' };
      const result = { id: '1', nome: 'João Silva' };
      service.find.mockResolvedValue(result as any);
      await expect(controller.find(req as any, q)).resolves.toEqual(result);
      expect(service.find).toHaveBeenCalledTimes(1);
      expect(service.find).toHaveBeenCalledWith({
        orderBy: {
          id: 'asc',
        },
        skip: 0,
        take: 10,
        where: {
          usuarioId: 'user1',
          nome: {
            contains: 'João',
            mode: 'insensitive',
          },
        },
      });
    });
  });

  describe('update', () => {
    it('deve atualizar um cliente', async () => {
      const dto = { nome: 'João Silva Atualizado' };
      const result = { id: '1', ...dto };
      service.update.mockResolvedValue(result as any);
      await expect(controller.update('1', dto)).resolves.toEqual(result);
      expect(service.update).toHaveBeenCalledWith({ id: '1' }, dto);
      expect(service.update).toHaveBeenCalledTimes(1);
    });
  });

  describe('remove', () => {
    it('deve deletar um cliente', async () => {
      const result = { id: '1', nome: 'João Silva' };
      service.remove.mockResolvedValue(result as any);
      await expect(controller.remove('1')).resolves.toEqual(result);
      expect(service.remove).toHaveBeenCalledWith({ id: '1' });
      expect(service.remove).toHaveBeenCalledTimes(1);
    });
  });
});
