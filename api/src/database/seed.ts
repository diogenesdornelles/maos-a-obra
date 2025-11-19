import { PrismaClient } from '@prisma/client';
import { readFileSync } from 'fs';
import * as dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import { Funcao } from '../../src/usuarios/dto/create-usuario.dto';
import { join } from 'path';

dotenv.config();

const SUPER_EMAIL = process.env.SUPER_EMAIL;
const SUPER_PWD = process.env.SUPER_PWD;
const SUPER_CPF = process.env.SUPER_CPF;

const COMUM_EMAIL = process.env.COMUM_EMAIL;
const COMUM_PWD = process.env.COMUM_PWD;
const COMUM_CPF = process.env.COMUM_CPF;

const prisma = new PrismaClient();

async function executeSqlFile(filePath: string) {
  const sql = readFileSync(filePath, 'utf-8');

  const commands = sql
    .split(';')
    .map((cmd) => cmd.trim())
    .filter((cmd) => cmd.length > 0);

  for (const command of commands) {
    if (command.trim()) {
      await prisma.$executeRawUnsafe(command);
    }
  }
}

async function executeRawSql(sql: string) {
  const commands: string[] = [];
  let currentCommand = '';
  let insideDollarQuote = false;
  let i = 0;

  while (i < sql.length) {
    const char = sql[i];
    const nextTwo = sql.slice(i, i + 2);

    if (nextTwo === '$$') {
      insideDollarQuote = !insideDollarQuote;
      currentCommand += nextTwo;
      i += 2;
      continue;
    }

    if (!insideDollarQuote && char === ';') {
      commands.push(currentCommand.trim());
      currentCommand = '';
    } else {
      currentCommand += char;
    }
    i++;
  }

  if (currentCommand.trim()) {
    commands.push(currentCommand.trim());
  }

  for (const command of commands) {
    if (command.trim() && !command.startsWith('--')) {
      await prisma.$executeRawUnsafe(command);
    }
  }
}

async function main() {
  const files = ['estados.sql', 'municipios.sql', 'bairros.sql'];

  for (const file of files) {
    try {
      const sqlPath = join(__dirname, file);
      await executeSqlFile(sqlPath);
      console.log(`Seed ${file} executada com sucesso!`);
    } catch (error) {
      console.error(`Erro ao executar ${file}:`, error);
      throw error;
    }
  }

  try {
    await prisma.usuario.upsert({
      where: { email: SUPER_EMAIL ?? '' },
      update: {},
      create: {
        cpf: SUPER_CPF ?? '',
        email: SUPER_EMAIL ?? '',
        senha: await bcrypt.hash(SUPER_PWD ?? '', 10),
        nome: 'Super',
        sobrenome: 'Admin',
        funcao: Funcao.ADMIN,
        nascimento: '1985-01-01T00:00:00.000Z',
      },
    });
    console.log(`Seed super user executada com sucesso!`);

    await prisma.usuario.upsert({
      where: { email: COMUM_EMAIL ?? '' },
      update: {},
      create: {
        cpf: COMUM_CPF ?? '',
        email: COMUM_EMAIL ?? '',
        senha: await bcrypt.hash(COMUM_PWD ?? '', 10),
        nome: 'Comum',
        sobrenome: 'User',
        funcao: Funcao.COMUM,
        nascimento: '1985-01-01T00:00:00.000Z',
      },
    });
    console.log(`Seed comum user executada com sucesso!`);
  } catch (error) {
    console.error(`Erro ao executar super user seed:`, error);
    throw error;
  }

  try {
    console.log('Aplicando triggers de projeto/projeto_item...');
    const triggersSql = `
      DROP TRIGGER IF EXISTS trg_calc_projeto_item_snapshot_total ON "ProjetoItem";
      DROP FUNCTION IF EXISTS calc_projeto_item_snapshot_total();
      DROP TRIGGER IF EXISTS trg_refresh_projeto_valor_total_aiud ON "ProjetoItem";
      DROP FUNCTION IF EXISTS refresh_projeto_valor_total();

      CREATE OR REPLACE FUNCTION calc_projeto_item_snapshot_total() 
      RETURNS trigger AS $$
      BEGIN
        IF NEW.quantidade IS NULL THEN
          NEW.quantidade := 0;
        END IF;
        IF NEW.preco IS NULL THEN
          IF TG_OP = 'UPDATE' THEN
            NEW.preco := OLD.preco;
          ELSE
            NEW.preco := 0;
          END IF;
        END IF;
        NEW.valor_total := NEW.quantidade * NEW.preco;
        NEW.atualizado_em := now();
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;

      CREATE TRIGGER trg_calc_projeto_item_snapshot_total
      BEFORE INSERT OR UPDATE OF quantidade, preco
      ON projeto_itens
      FOR EACH ROW
      EXECUTE FUNCTION calc_projeto_item_snapshot_total();

      CREATE OR REPLACE FUNCTION refresh_projeto_valor_total()
      RETURNS trigger AS $$
      DECLARE
        v_projeto_id uuid;
      BEGIN
        v_projeto_id := COALESCE(NEW.projeto_id, OLD.projeto_id);
        UPDATE projetos p
           SET valor_total = COALESCE((
                 SELECT SUM(pi.valor_total)
                   FROM projeto_itens pi
                  WHERE pi.projeto_id = v_projeto_id
                    AND pi.status = true
               ), 0),
               atualizado_em = now()
         WHERE p.id = v_projeto_id;
        RETURN NULL;
      END;
      $$ LANGUAGE plpgsql;

      CREATE TRIGGER trg_refresh_projeto_valor_total_aiud
      AFTER INSERT OR UPDATE OR DELETE
      ON projeto_itens
      FOR EACH ROW
      EXECUTE FUNCTION refresh_projeto_valor_total();
    `;
    await executeRawSql(triggersSql);
    console.log('Triggers aplicadas com sucesso.');
    const functionsSql = `
      DROP FUNCTION IF EXISTS create_projeto_item(DECIMAL, DECIMAL, UUID, UUID);

      CREATE OR REPLACE FUNCTION create_projeto_item(
          IN _quantidade DECIMAL(10,2),
          IN _preco DECIMAL(10,2),
          IN _projeto_id UUID, 
          IN _item_id UUID
      ) 
      RETURNS VOID AS $$
      DECLARE
          _item_row itens%ROWTYPE;
          _projeto_row projetos%ROWTYPE;
          _existing_projeto_item projeto_itens%ROWTYPE;
      BEGIN
          -- Valida quantidade
          IF _quantidade <= 0 THEN
              RAISE EXCEPTION 'Quantidade deve ser maior que 0: %', _quantidade;
          END IF;

          -- Valida preço
          IF _preco < 0 THEN
              RAISE EXCEPTION 'Preço não pode ser menor que 0: %', _preco;
          END IF;

          -- Valida item
          SELECT * INTO _item_row FROM itens WHERE id = _item_id AND status = true;
          IF _item_row.id IS NULL THEN
              RAISE EXCEPTION 'Item não encontrado: %', _item_id;
          END IF;

          -- Valida projeto
          SELECT * INTO _projeto_row FROM projetos WHERE id = _projeto_id AND status != 'CANCELADO';
          IF _projeto_row.id IS NULL THEN
              RAISE EXCEPTION 'Projeto não encontrado: %', _projeto_id;
          END IF;
          
          -- Verifica se já existe (mesmo com status = false)
          SELECT * INTO _existing_projeto_item 
          FROM projeto_itens 
          WHERE projeto_id = _projeto_id AND item_id = _item_id;
          
          IF _existing_projeto_item.id IS NOT NULL THEN
              -- Se existir mas estiver deletado (status = false), reativa
              IF _existing_projeto_item.status = false THEN
                  UPDATE projeto_itens SET
                      quantidade = _quantidade,
                      preco = _preco,
                      status = true,
                      codigo = _item_row.codigo,
                      nomenclatura = _item_row.nomenclatura,
                      unidade = _item_row.unidade,
                      atualizado_em = CURRENT_TIMESTAMP
                  WHERE id = _existing_projeto_item.id;
              ELSE
                  -- Se estiver ativo, incrementa quantidade
                  UPDATE projeto_itens SET
                      quantidade = quantidade + _quantidade,
                      preco = _preco,
                      atualizado_em = CURRENT_TIMESTAMP
                  WHERE id = _existing_projeto_item.id;
              END IF;
          ELSE
              -- Se não existir, insere novo
              INSERT INTO projeto_itens (
                  projeto_id, 
                  item_id, 
                  quantidade, 
                  preco, 
                  codigo, 
                  nomenclatura, 
                  unidade
              ) VALUES (
                  _projeto_id, 
                  _item_id, 
                  _quantidade, 
                  _preco, 
                  _item_row.codigo, 
                  _item_row.nomenclatura, 
                  _item_row.unidade
              );
          END IF;
          
      END; 
      $$ LANGUAGE plpgsql;


      DROP FUNCTION IF EXISTS update_projeto_item(UUID, DECIMAL, DECIMAL, UUID, UUID);

      CREATE OR REPLACE FUNCTION update_projeto_item(
          IN _projeto_item_id UUID,
          IN _quantidade DECIMAL(10,2) DEFAULT NULL,
          IN _preco DECIMAL(10,2) DEFAULT NULL,
          IN _projeto_id UUID DEFAULT NULL, 
          IN _item_id UUID DEFAULT NULL
      ) 
      RETURNS VOID AS $$
      DECLARE
          _quantidade_final DECIMAL(10,2);
          _preco_final DECIMAL(10,2);
          _item_row itens%ROWTYPE;
          _projeto_item_row projeto_itens%ROWTYPE;
          _projeto_row projetos%ROWTYPE;
          _projeto_id_final UUID;
          _item_id_final UUID;
      BEGIN
          -- Busca o projeto_item existente
          SELECT * INTO _projeto_item_row 
          FROM projeto_itens 
          WHERE id = _projeto_item_id AND status = true;

          IF _projeto_item_row.id IS NULL THEN
              RAISE EXCEPTION 'Projeto item não encontrado: %', _projeto_item_id;
          END IF;

          -- Define quantidade final (usa a existente se não fornecida)
          IF _quantidade IS NOT NULL AND _quantidade > 0 THEN
              _quantidade_final := _quantidade;
          ELSE 
              _quantidade_final := _projeto_item_row.quantidade;
          END IF;

          -- Define preço final (usa o existente se não fornecido)
          IF _preco IS NOT NULL THEN
              IF _preco < 0 THEN
                  RAISE EXCEPTION 'Preço não pode ser menor que 0: %', _preco;
              END IF;
              _preco_final := _preco;
          ELSE
              _preco_final := _projeto_item_row.preco;
          END IF;

          -- Define item_id final
          IF _item_id IS NOT NULL THEN
              SELECT * INTO _item_row FROM itens WHERE id = _item_id AND status = true;
              IF _item_row.id IS NULL THEN
                  RAISE EXCEPTION 'Item não encontrado: %', _item_id;
              END IF;
              _item_id_final := _item_id;
          ELSE
              SELECT * INTO _item_row FROM itens WHERE id = _projeto_item_row.item_id;
              _item_id_final := _projeto_item_row.item_id;
          END IF;

          -- Define projeto_id final
          IF _projeto_id IS NOT NULL THEN
              SELECT * INTO _projeto_row FROM projetos 
              WHERE id = _projeto_id AND status != 'CANCELADO';
              
              IF _projeto_row.id IS NULL THEN
                  RAISE EXCEPTION 'Projeto não encontrado ou cancelado: %', _projeto_id;
              END IF;
              _projeto_id_final := _projeto_id;
          ELSE
              SELECT * INTO _projeto_row FROM projetos WHERE id = _projeto_item_row.projeto_id;
              _projeto_id_final := _projeto_item_row.projeto_id;
          END IF;
          
          -- Atualiza o projeto_item
          UPDATE projeto_itens 
          SET 
              projeto_id = _projeto_id_final,
              item_id = _item_id_final,
              quantidade = _quantidade_final,
              preco = _preco_final,
              codigo = _item_row.codigo,
              nomenclatura = _item_row.nomenclatura,
              unidade = _item_row.unidade,
              atualizado_em = CURRENT_TIMESTAMP
          WHERE id = _projeto_item_id;
          
      END; 
      $$ LANGUAGE plpgsql;
    `;
    await executeRawSql(functionsSql);
    console.log('Funções aplicadas com sucesso.');
    const dataSeed = `
    
    `;
  } catch (error) {
    console.error('Erro ao aplicar triggers:', error);
    throw error;
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
    console.log('Todas as seeds foram executadas!');
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
