-- CreateEnum
CREATE TYPE "public"."ProjetoStatus" AS ENUM ('EM_ANDAMENTO', 'CONCLUIDO', 'CANCELADO');

-- CreateEnum
CREATE TYPE "public"."Funcao" AS ENUM ('ADMIN', 'COMUM');

-- CreateTable
CREATE TABLE "public"."usuarios" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "nome" TEXT NOT NULL,
    "sobrenome" TEXT NOT NULL,
    "cpf" TEXT NOT NULL,
    "nascimento" DATE,
    "email" TEXT NOT NULL,
    "funcao" "public"."Funcao" NOT NULL DEFAULT 'COMUM',
    "senha" TEXT NOT NULL,
    "status" BOOLEAN NOT NULL DEFAULT true,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "usuarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."clientes" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "endereco_id" UUID,
    "usuario_id" UUID NOT NULL,
    "nome" TEXT NOT NULL,
    "sobrenome" TEXT,
    "cpf" TEXT,
    "cnpj" TEXT,
    "nascimento" DATE,
    "telefone" TEXT,
    "email" TEXT,
    "status" BOOLEAN NOT NULL DEFAULT true,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "clientes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."enderecos" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "logradouro" TEXT NOT NULL,
    "numero" TEXT,
    "complemento" TEXT,
    "usuario_id" UUID NOT NULL,
    "bairro_id" UUID NOT NULL,
    "pais" TEXT NOT NULL DEFAULT 'Brasil',
    "cep" TEXT,
    "status" BOOLEAN NOT NULL DEFAULT true,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "enderecos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."itens" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "codigo" TEXT NOT NULL,
    "nomenclatura" TEXT NOT NULL,
    "unidade" TEXT NOT NULL,
    "status" BOOLEAN NOT NULL DEFAULT true,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "itens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."estados" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "codigo_uf" INTEGER NOT NULL,
    "nome" TEXT NOT NULL,
    "uf" CHAR(2) NOT NULL,
    "regiao" INTEGER NOT NULL,
    "status" BOOLEAN NOT NULL DEFAULT true,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "estados_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."municipios" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "nome" TEXT NOT NULL,
    "codigo" INTEGER NOT NULL,
    "uf" CHAR(2) NOT NULL,
    "status" BOOLEAN NOT NULL DEFAULT true,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "municipios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."bairros" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "codigo" CHAR(10) NOT NULL,
    "nome" TEXT NOT NULL,
    "uf" CHAR(2) NOT NULL,
    "status" BOOLEAN NOT NULL DEFAULT true,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "bairros_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."precos" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "item_id" UUID NOT NULL,
    "estado_id" UUID NOT NULL,
    "valor" DECIMAL(12,2) NOT NULL,
    "status" BOOLEAN NOT NULL DEFAULT true,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "precos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."projetos" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "usuario_id" UUID NOT NULL,
    "cliente_id" UUID NOT NULL,
    "estado_id" UUID NOT NULL,
    "nome" TEXT NOT NULL,
    "descricao" TEXT,
    "valor_total" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "status" "public"."ProjetoStatus" NOT NULL DEFAULT 'EM_ANDAMENTO',
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "projetos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."projeto_itens" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "projeto_id" UUID NOT NULL,
    "item_id" UUID NOT NULL,
    "quantidade" DECIMAL(10,2) NOT NULL DEFAULT 1,
    "preco" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "codigo" TEXT,
    "nomenclatura" TEXT,
    "unidade" TEXT,
    "status" BOOLEAN NOT NULL DEFAULT true,
    "valor_total" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "projeto_itens_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_cpf_key" ON "public"."usuarios"("cpf");

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_email_key" ON "public"."usuarios"("email");

-- CreateIndex
CREATE UNIQUE INDEX "clientes_cpf_key" ON "public"."clientes"("cpf");

-- CreateIndex
CREATE UNIQUE INDEX "clientes_cnpj_key" ON "public"."clientes"("cnpj");

-- CreateIndex
CREATE UNIQUE INDEX "clientes_email_key" ON "public"."clientes"("email");

-- CreateIndex
CREATE UNIQUE INDEX "itens_codigo_key" ON "public"."itens"("codigo");

-- CreateIndex
CREATE UNIQUE INDEX "estados_codigo_uf_key" ON "public"."estados"("codigo_uf");

-- CreateIndex
CREATE UNIQUE INDEX "municipios_codigo_key" ON "public"."municipios"("codigo");

-- CreateIndex
CREATE UNIQUE INDEX "bairros_codigo_key" ON "public"."bairros"("codigo");

-- CreateIndex
CREATE UNIQUE INDEX "precos_item_id_estado_id_key" ON "public"."precos"("item_id", "estado_id");

-- CreateIndex
CREATE UNIQUE INDEX "projeto_itens_projeto_id_item_id_key" ON "public"."projeto_itens"("projeto_id", "item_id");

-- AddForeignKey
ALTER TABLE "public"."clientes" ADD CONSTRAINT "clientes_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "public"."usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."clientes" ADD CONSTRAINT "clientes_endereco_id_fkey" FOREIGN KEY ("endereco_id") REFERENCES "public"."enderecos"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."enderecos" ADD CONSTRAINT "enderecos_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "public"."usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."enderecos" ADD CONSTRAINT "enderecos_bairro_id_fkey" FOREIGN KEY ("bairro_id") REFERENCES "public"."bairros"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."precos" ADD CONSTRAINT "precos_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "public"."itens"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."precos" ADD CONSTRAINT "precos_estado_id_fkey" FOREIGN KEY ("estado_id") REFERENCES "public"."estados"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."projetos" ADD CONSTRAINT "projetos_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "public"."usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."projetos" ADD CONSTRAINT "projetos_estado_id_fkey" FOREIGN KEY ("estado_id") REFERENCES "public"."estados"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."projetos" ADD CONSTRAINT "projetos_cliente_id_fkey" FOREIGN KEY ("cliente_id") REFERENCES "public"."clientes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."projeto_itens" ADD CONSTRAINT "projeto_itens_projeto_id_fkey" FOREIGN KEY ("projeto_id") REFERENCES "public"."projetos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."projeto_itens" ADD CONSTRAINT "projeto_itens_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "public"."itens"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
