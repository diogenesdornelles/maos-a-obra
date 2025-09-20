/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { EnderecosController } from './enderecos.controller';
import { EnderecosService } from './enderecos.service';
import { Funcao } from 'src/usuarios/dto/create-usuario.dto';

import { createMock, DeepMocked } from '@golevelup/ts-jest';

describe('EnderecosController', () => {
  let controller: EnderecosController;
  let service: DeepMocked<EnderecosService>;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [EnderecosController],
      providers: [
        {
          provide: EnderecosService,
          useValue: createMock<EnderecosService>(),
        },
      ],
    }).compile();
    controller = moduleRef.get(EnderecosController);
    service = moduleRef.get(EnderecosService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('deve criar um endereço', async () => {
      const dto = {
        logradouro: 'Rua A',
        cep: '12345-678',
        numero: '123',
        bairroId: 'bairro1',
      };
      const req = { user: { id: 'user1', funcao: Funcao.ADMIN } };
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
    it('deve retornar endereços para usuário comum', async () => {
      const req = { user: { id: 'user1', funcao: Funcao.COMUM } };
      const result = [{ id: '1', logradouro: 'Rua A', usuarioId: 'user1' }];
      service.findAll.mockResolvedValue(result as any);
      await expect(controller.findAll(req as any)).resolves.toEqual(result);
      expect(service.findAll).toHaveBeenCalledWith({
        where: { usuarioId: 'user1' },
      });
      expect(service.findAll).toHaveBeenCalledTimes(1);
    });
  });

  describe('findOne', () => {
    it('deve retornar um endereço', async () => {
      const req = { user: { id: 'user1', funcao: Funcao.COMUM } };
      const result = { id: '1', logradouro: 'Rua A', usuarioId: 'user1' };
      service.findOne.mockResolvedValue(result as any);
      await expect(controller.findOne('1', req as any)).resolves.toEqual(
        result,
      );
      expect(service.findOne).toHaveBeenCalledWith({ id: '1' });
      expect(service.findOne).toHaveBeenCalledTimes(1);
    });
  });

  describe('find', () => {
    it('deve retornar endereços', async () => {
      const req = { user: { id: 'user1', funcao: Funcao.COMUM } };
      const q = { logradouro: 'Rua' };
      const result = { id: '1', logradouro: 'Rua A' };
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
          usuarioId: 'user1',
          logradouro: {
            contains: 'Rua',
            mode: 'insensitive',
          },
        },
      });
    });
  });

  describe('update', () => {
    it('deve atualizar um endereço', async () => {
      const dto = { logradouro: 'Rua B' };
      const req = { user: { id: 'user1', funcao: Funcao.ADMIN } };
      const endereco = { id: '1', usuarioId: 'user1' };
      const result = { id: '1', ...dto };
      service.findOne.mockResolvedValue(endereco as any);
      service.update.mockResolvedValue(result as any);
      await expect(controller.update('1', dto, req as any)).resolves.toEqual(
        result,
      );
      expect(service.findOne).toHaveBeenCalledWith({ id: '1' });
      expect(service.update).toHaveBeenCalledWith({ id: '1' }, dto);
      expect(service.update).toHaveBeenCalledTimes(1);
    });
  });

  describe('remove', () => {
    it('deve deletar um endereço', async () => {
      const req = { user: { id: 'user1', funcao: Funcao.ADMIN } };
      const endereco = { id: '1', usuarioId: 'user1' };
      const result = { id: '1', logradouro: 'Rua A' };
      service.findOne.mockResolvedValue(endereco as any);
      service.remove.mockResolvedValue(result as any);
      await expect(controller.remove('1', req as any)).resolves.toEqual(result);
      expect(service.findOne).toHaveBeenCalledWith({ id: '1' });
      expect(service.remove).toHaveBeenCalledWith({ id: '1' });
      expect(service.remove).toHaveBeenCalledTimes(1);
    });
  });
});
