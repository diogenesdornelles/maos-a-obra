/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { UsuariosController } from './usuarios.controller';
import { UsuariosService } from './usuarios.service';
import { Funcao } from './dto/create-usuario.dto';

import { createMock, DeepMocked } from '@golevelup/ts-jest';

describe('UsuariosController', () => {
  let controller: UsuariosController;
  let service: DeepMocked<UsuariosService>;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [UsuariosController],
      providers: [
        {
          provide: UsuariosService,
          useValue: createMock<UsuariosService>(),
        },
      ],
    }).compile();
    controller = moduleRef.get(UsuariosController);
    service = moduleRef.get(UsuariosService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('deve criar um usuário', async () => {
      const dto = {
        nome: 'João Silva',
        sobrenome: 'Silva',
        email: 'joao@example.com',
        cpf: '12345678901',
        senha: 'password123',
        funcao: Funcao.COMUM,
      };
      const result = { id: '1', ...dto };

      service.create.mockResolvedValue(result as any);
      await expect(controller.create(dto)).resolves.toEqual(result);
      expect(service.create).toHaveBeenCalledWith(dto as any);
      expect(service.create).toHaveBeenCalledTimes(1);
    });
  });

  describe('findAll', () => {
    it('deve retornar usuários', async () => {
      const result = [{ id: '1', nome: 'João Silva' }];
      service.findAll.mockResolvedValue(result as any);
      await expect(controller.findAll()).resolves.toEqual(result);
      expect(service.findAll).toHaveBeenCalledWith();
      expect(service.findAll).toHaveBeenCalledTimes(1);
    });
  });

  describe('findOne', () => {
    it('deve retornar um usuário', async () => {
      const result = { id: '1', nome: 'João Silva' };
      service.findOne.mockResolvedValue(result as any);
      await expect(controller.findOne('1')).resolves.toEqual(result);
      expect(service.findOne).toHaveBeenCalledWith({ id: '1' });
      expect(service.findOne).toHaveBeenCalledTimes(1);
    });
  });

  describe('find', () => {
    it('deve retornar usuários', async () => {
      const q = { nome: 'João' };
      const result = { id: '1', nome: 'João Silva' };
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
            contains: 'João',
            mode: 'insensitive',
          },
        },
      });
    });
  });

  describe('findMe', () => {
    it('deve retornar o usuário autenticado', async () => {
      const req = { user: { id: 'user1' } };
      const result = { id: 'user1', nome: 'João Silva' };
      service.me.mockResolvedValue(result as any);
      await expect(controller.findMe(req as any)).resolves.toEqual(result);
      expect(service.me).toHaveBeenCalledWith('user1');
      expect(service.me).toHaveBeenCalledTimes(1);
    });
  });

  describe('update', () => {
    it('deve atualizar um usuário', async () => {
      const dto = { nome: 'João Silva Atualizado' };
      const result = { id: '1', ...dto };
      service.update.mockResolvedValue(result as any);
      await expect(controller.update('1', dto)).resolves.toEqual(result);
      expect(service.update).toHaveBeenCalledWith({ id: '1' }, dto as any);
      expect(service.update).toHaveBeenCalledTimes(1);
    });
  });

  describe('remove', () => {
    it('deve deletar um usuário', async () => {
      const result = { id: '1', nome: 'João Silva' };
      service.remove.mockResolvedValue(result as any);
      await expect(controller.remove('1')).resolves.toEqual(result);
      expect(service.remove).toHaveBeenCalledWith({ id: '1' });
      expect(service.remove).toHaveBeenCalledTimes(1);
    });
  });
});
