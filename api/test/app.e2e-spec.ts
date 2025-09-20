/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';
import * as dotenv from 'dotenv';
import { MockUtils } from './utils/mock-utils';

dotenv.config();

describe('App Testing (e2e)', () => {
  let app: INestApplication<App>;
  let adminToken: string;
  let comumToken: string;
  let usuarioId: string;
  let clienteId: string;
  let enderecoId: string;
  let bairroId: string;
  let projetoId: string;
  let estadoId: string;
  let projetoItemId: string;
  let itemId: string;
  const pass: string = process.env.SUPER_EMAIL || '';

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  describe('Auth (e2e)', () => {
    it('/auth/login (POST) 201', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: process.env.SUPER_EMAIL,
          pass: process.env.SUPER_PWD,
        });
      expect(response.body).toHaveProperty('access_token');
      adminToken = (response.body as { access_token: string }).access_token;
    });
    it('/auth/login (POST) incorrect pass', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: process.env.SUPER_EMAIL,
          pass: '11111',
        });
      expect(response.status).toBeGreaterThanOrEqual(400);
    });
  });

  describe('Estados (e2e)', () => {
    it(`/GET estados as Admin`, async () => {
      const response = await request(app.getHttpServer())
        .get('/estados/search')
        .set('Authorization', `Bearer ${adminToken}`);
      expect(response.body).toHaveLength(10);
      estadoId = (response.body[0] as { id: string }).id;
    });
    it('/GET estados without token', async () => {
      const response = await request(app.getHttpServer()).get(
        '/estados/search',
      );
      expect(response.status).toBe(401);
    });
  });

  describe('Municipios (e2e)', () => {
    it(`/GET municipios as Admin`, async () => {
      const response = await request(app.getHttpServer())
        .get('/municipios/search')
        .set('Authorization', `Bearer ${adminToken}`);
      expect(response.body).toHaveLength(10);
    });
    it('/GET municipios without token', async () => {
      const response = await request(app.getHttpServer()).get(
        '/municipios/search',
      );
      expect(response.status).toBe(401);
    });
  });

  describe('Bairros (e2e)', () => {
    it(`/GET bairros as Admin`, async () => {
      const response = await request(app.getHttpServer())
        .get('/bairros/search')
        .set('Authorization', `Bearer ${adminToken}`);
      expect(response.body).toHaveLength(10);
      bairroId = (response.body[0] as { id: string }).id;
    });
    it('/GET bairros without token', async () => {
      const response = await request(app.getHttpServer()).get(
        '/bairros/search',
      );
      expect(response.status).toBe(401);
    });
  });

  describe('Itens (e2e)', () => {
    it(`/GET itens as Admin`, async () => {
      const response = await request(app.getHttpServer())
        .get('/itens/search')
        .set('Authorization', `Bearer ${adminToken}`);
      expect(response.body).toHaveLength(10);
      itemId = (response.body[0] as { id: string }).id;
    });
    it('/GET itens without token', async () => {
      const response = await request(app.getHttpServer()).get('/itens/search');
      expect(response.status).toBe(401);
    });
  });

  describe('Precos (e2e)', () => {
    it(`/GET precos as Admin`, async () => {
      const response = await request(app.getHttpServer())
        .get('/precos/search')
        .set('Authorization', `Bearer ${adminToken}`);
      expect(response.body).toHaveLength(10);
    });
    it('/GET precos without token', async () => {
      const response = await request(app.getHttpServer()).get('/precos/search');
      expect(response.status).toBe(401);
    });
  });

  describe('Usuarios (e2e)', () => {
    const email = MockUtils.generateUniqueEmail();
    const cpf = MockUtils.generateValidCPF();
    it(`/POST create usuario comum`, async () => {
      const response = await request(app.getHttpServer())
        .post('/usuarios')
        .send({
          nome: 'Joaquim',
          sobrenome: 'Tiradentes',
          cpf,
          email,
          senha: pass,
        });
      usuarioId = (response.body as { id: string }).id;
      expect(response.body).toHaveProperty('id');

      const loginResponse = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email,
          pass,
        });
      comumToken = (loginResponse.body as { access_token: string })
        .access_token;
      expect(loginResponse.body).toHaveProperty('access_token');
    });

    it(`/PATCH update usuario comum`, async () => {
      const response = await request(app.getHttpServer())
        .patch(`/usuarios/${usuarioId}`)
        .set('Authorization', `Bearer ${comumToken}`)
        .send({
          sobrenome: 'Tiradentes da Silva',
        });
      expect(response.body).toHaveProperty('id');
      expect(response.body).toMatchObject({ sobrenome: 'Tiradentes da Silva' });
    });

    it(`/GET usuarios`, async () => {
      const response = await request(app.getHttpServer())
        .get('/usuarios/search')
        .set('Authorization', `Bearer ${adminToken}`);
      expect(response.body.length).toBeGreaterThanOrEqual(2);
    });

    it(`/GET usuarios me`, async () => {
      const response = await request(app.getHttpServer())
        .get('/usuarios/me')
        .set('Authorization', `Bearer ${comumToken}`);
      expect(response.body).toHaveProperty('id');
    });
    it('/GET me without token', async () => {
      const response = await request(app.getHttpServer()).get('/usuarios/me');
      expect(response.status).toBe(401);
    });
  });

  describe('Enderecos (e2e)', () => {
    it(`/POST create endereco`, async () => {
      const response = await request(app.getHttpServer())
        .post('/enderecos')
        .set('Authorization', `Bearer ${comumToken}`)
        .send({
          logradouro: 'Rua 7',
          bairroId,
        });
      enderecoId = (response.body as { id: string }).id;
      expect(response.body).toHaveProperty('id');
    });
    it(`/GET endereco id`, async () => {
      const response = await request(app.getHttpServer())
        .get(`/enderecos/${enderecoId}`)
        .set('Authorization', `Bearer ${comumToken}`);
      expect(response.body).toHaveProperty('id');
    });
  });

  describe('Clientes (e2e)', () => {
    it(`/POST create cliente`, async () => {
      const response = await request(app.getHttpServer())
        .post('/clientes')
        .set('Authorization', `Bearer ${comumToken}`)
        .send({
          nome: 'Cliente Teste',
          cnpj: MockUtils.generateValidCNPJ(),
          enderecoId,
        });
      clienteId = (response.body as { id: string }).id;
      expect(response.body).toHaveProperty('id');
    });
    it(`/GET cliente id`, async () => {
      const response = await request(app.getHttpServer())
        .get(`/clientes/${clienteId}`)
        .set('Authorization', `Bearer ${comumToken}`);
      expect(response.body).toHaveProperty('id');
    });
  });

  describe('Projetos (e2e)', () => {
    it(`/POST create projeto`, async () => {
      const response = await request(app.getHttpServer())
        .post('/projetos')
        .set('Authorization', `Bearer ${comumToken}`)
        .send({
          nome: 'Projeto Teste',
          clienteId,
          estadoId,
        });
      projetoId = (response.body as { id: string }).id;
      expect(response.body).toHaveProperty('id');
      expect(response.body).toMatchObject({ nome: 'Projeto Teste' });
    });

    it(`/GET projetos`, async () => {
      const response = await request(app.getHttpServer())
        .get('/projetos')
        .set('Authorization', `Bearer ${comumToken}`);
      expect(response.body.length).toBeGreaterThanOrEqual(1);
    });

    it(`/PATCH update projeto`, async () => {
      const response = await request(app.getHttpServer())
        .patch(`/projetos/${projetoId}`)
        .set('Authorization', `Bearer ${comumToken}`)
        .send({
          nome: 'Projeto Atualizado',
        });
      expect(response.body).toHaveProperty('id');
    });
  });

  describe('ProjetoItem (e2e)', () => {
    it(`/POST create projeto item`, async () => {
      const response = await request(app.getHttpServer())
        .post('/projeto-itens')
        .set('Authorization', `Bearer ${comumToken}`)
        .send({
          itemId,
          quantidade: 2,
          projetoId,
        });
      projetoItemId = (response.body as { id: string }).id;
      expect(response.body).toHaveProperty('id');
    });

    it(`/GET projetos itens`, async () => {
      const response = await request(app.getHttpServer())
        .get('/projeto-itens')
        .set('Authorization', `Bearer ${comumToken}`);
      expect(response.body.length).toBeGreaterThanOrEqual(1);
    });

    it(`/PATCH update projeto-item`, async () => {
      const response = await request(app.getHttpServer())
        .patch(`/projeto-itens/${projetoItemId}`)
        .set('Authorization', `Bearer ${comumToken}`)
        .send({
          quantidade: 3,
        });
      expect(response.body).toHaveProperty('id');
      expect(response.body).toMatchObject({ quantidade: '3' });
    });
  });

  describe('DELETE clean up all records created (e2e)', () => {
    it(`/DELETE delete cliente`, async () => {
      const response = await request(app.getHttpServer())
        .delete(`/clientes/${clienteId}`)
        .set('Authorization', `Bearer ${adminToken}`);
      expect(response.body).toHaveProperty('id');
    });

    it(`/DELETE delete endereco`, async () => {
      const response = await request(app.getHttpServer())
        .delete(`/enderecos/${enderecoId}`)
        .set('Authorization', `Bearer ${adminToken}`);
      expect(response.body).toHaveProperty('id');
    });

    it(`/DELETE delete projeto`, async () => {
      const response = await request(app.getHttpServer())
        .delete(`/projetos/${projetoId}`)
        .set('Authorization', `Bearer ${comumToken}`);
      expect(response.body).toHaveProperty('id');
    });

    it(`/DELETE delete projeto itens`, async () => {
      const response = await request(app.getHttpServer())
        .delete(`/projeto-itens/${projetoItemId}`)
        .set('Authorization', `Bearer ${comumToken}`);
      expect(response.body).toHaveProperty('id');
    });

    it(`/DELETE delete usuario`, async () => {
      const response = await request(app.getHttpServer())
        .delete(`/usuarios/${usuarioId}`)
        .set('Authorization', `Bearer ${comumToken}`);
      expect(response.body).toHaveProperty('id');
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
