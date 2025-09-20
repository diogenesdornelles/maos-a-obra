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

async function executeSqlTriggers(sql: string) {
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
        nascimento: '1985-01-01T03:00:00.000Z',
      },
    });
    console.log(`Seed super user executada com sucesso!`);
  } catch (error) {
    console.error(`Erro ao executar super user seed:`, error);
    throw error;
  }

  try {
    console.log('Aplicando triggers de projeto/projeto_item...');
    const triggerSql = `
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
    await executeSqlTriggers(triggerSql);
    console.log('Triggers aplicadas com sucesso.');
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
