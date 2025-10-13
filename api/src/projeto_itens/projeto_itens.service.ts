import {
  Injectable,
  Logger,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { Prisma, ProjetoItem } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ProjetoItensService {
  private readonly logger = new Logger(ProjetoItensService.name, {
    timestamp: true,
  });
  constructor(private prisma: PrismaService) {}

  async create(
    createProjetoItemDto: Prisma.ProjetoItemUncheckedCreateInput,
  ): Promise<ProjetoItem | null> {
    this.logger.log(`Body ${JSON.stringify(createProjetoItemDto)}`);

    const { projetoId, itemId, quantidade, preco } = createProjetoItemDto;

    const quantidadeNumber = Number(quantidade);
    if (!quantidadeNumber || quantidadeNumber < 0) {
      throw new UnprocessableEntityException(
        'Quantidade deve ser maior igual 0',
      );
    }

    const precoNumber = Number(preco);
    if (!precoNumber || precoNumber < 0) {
      throw new UnprocessableEntityException('Preço deve ser maior igual 0');
    }

    try {
      await this.prisma.$executeRaw`
        SELECT create_projeto_item(
          ${quantidadeNumber}::decimal,
          ${precoNumber}::decimal,
          ${projetoId}::uuid,
          ${itemId}::uuid
        )
      `;

      const result = await this.prisma.projetoItem.findFirst({
        where: {
          projetoId,
          itemId,
        },
        orderBy: {
          atualizadoEm: 'desc',
        },
      });

      return result;
    } catch (error) {
      this.logger.error(`Erro ao criar projeto_item: ${error}`);

      throw new UnprocessableEntityException(
        'Erro ao criar item no projeto: ' + JSON.stringify(error),
      );
    }
  }

  async findAll({
    where,
  }: {
    where: Prisma.ProjetoItemWhereInput;
  }): Promise<ProjetoItem[] | null> {
    this.logger.log(`Where ${JSON.stringify(where)}`);
    return await this.prisma.projetoItem.findMany({ where });
  }

  async find(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.ProjetoItemWhereUniqueInput;
    where?: Prisma.ProjetoItemWhereInput;
    orderBy?: Prisma.ProjetoItemOrderByWithRelationInput;
  }): Promise<ProjetoItem[]> {
    const { skip, take, cursor, where, orderBy } = params;
    this.logger.log(`Paramns ${JSON.stringify(params)}`);
    return this.prisma.projetoItem.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });
  }

  async findOne(where: Prisma.ProjetoItemWhereUniqueInput) {
    this.logger.log(`Where ${JSON.stringify(where)}`);
    const projetoIten = await this.prisma.projetoItem.findUnique({ where });
    if (!projetoIten) throw new NotFoundException(`ProjetoItem not found`);
    return projetoIten;
  }

  async update(
    where: Prisma.ProjetoItemWhereUniqueInput,
    updateProjetoItenDto: Prisma.ProjetoItemUncheckedUpdateInput,
  ): Promise<ProjetoItem | null> {
    this.logger.log(`Where ${JSON.stringify(where)}`);
    this.logger.log(`Body ${JSON.stringify(updateProjetoItenDto)}`);

    const { quantidade, itemId, projetoId, preco } = updateProjetoItenDto;

    if (
      quantidade !== undefined &&
      Number(quantidade) &&
      Number(quantidade) <= 0
    ) {
      throw new UnprocessableEntityException('Quantidade deve ser maior que 0');
    }

    if (preco !== undefined && Number(preco) && Number(preco) < 0) {
      throw new UnprocessableEntityException('Preço não pode ser negativo');
    }

    try {
      await this.prisma.$executeRaw`
      SELECT update_projeto_item(
        ${where.id}::uuid,
        ${quantidade !== undefined ? quantidade : null}::decimal,
        ${preco !== undefined ? preco : null}::decimal,
        ${projetoId !== undefined ? projetoId : null}::uuid,
        ${itemId !== undefined ? itemId : null}::uuid
      )
    `;

      const result = await this.prisma.projetoItem.findUnique({
        where,
      });

      return result;
    } catch (error) {
      this.logger.error(`Erro ao atualizar projeto_item: ${error}`);

      throw new UnprocessableEntityException(
        'Erro ao atualizar item no projeto: ' + JSON.stringify(error),
      );
    }
  }

  async remove(
    where: Prisma.ProjetoItemWhereUniqueInput,
  ): Promise<ProjetoItem | null> {
    this.logger.log(`Where ${JSON.stringify(where)}`);
    const existing = await this.prisma.projetoItem.findUnique({ where });
    if (!existing) throw new NotFoundException(`ProjetoItem not found`);
    return this.prisma.projetoItem.update({ where, data: { status: false } });
  }
}
