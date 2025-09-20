import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Prisma, Item } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ItensService {
  private readonly logger = new Logger(ItensService.name, {
    timestamp: true,
  });
  constructor(private prisma: PrismaService) {}

  async create(createItenDto: Prisma.ItemCreateInput): Promise<Item | null> {
    this.logger.log(`Body ${JSON.stringify(createItenDto)}`);
    const result = await this.prisma.item.create({ data: createItenDto });
    return result;
  }

  async findAll(): Promise<Item[] | null> {
    this.logger.log(`find all itens`);
    return await this.prisma.item.findMany();
  }

  async find(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.ItemWhereUniqueInput;
    where?: Prisma.ItemWhereInput;
    orderBy?: Prisma.ItemOrderByWithRelationInput;
  }): Promise<Item[]> {
    const { skip, take, cursor, where, orderBy } = params;
    this.logger.log(`Paramns ${JSON.stringify(params)}`);
    return this.prisma.item.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });
  }

  async findOne(where: Prisma.ItemWhereUniqueInput) {
    this.logger.log(`Where ${JSON.stringify(where)}`);
    const item = await this.prisma.item.findUnique({ where });
    if (!item) throw new NotFoundException(`Item not found`);
    return item;
  }

  async findOneWithPreco(estadoId: string, itemId: string) {
    const preco = await this.prisma.preco.findFirstOrThrow({
      where: { estadoId: estadoId, itemId: itemId, status: true },
    });

    if (!preco) throw new NotFoundException(`Preco not found`);
    const item = await this.prisma.item.findUnique({
      where: { id: itemId, status: true },
    });

    if (!item) throw new NotFoundException(`Item not found`);
    return { ...item, valor: preco.valor };
  }

  async update(
    where: Prisma.ItemWhereUniqueInput,
    updateItenDto: Prisma.ItemUpdateInput,
  ): Promise<Item | null> {
    this.logger.log(`Where ${JSON.stringify(where)}`);
    this.logger.log(`Body ${JSON.stringify(updateItenDto)}`);
    const existing = await this.prisma.item.findUnique({ where });
    if (!existing) throw new NotFoundException(`Item not found`);

    const result = await this.prisma.item.update({
      where,
      data: updateItenDto,
    });
    return result;
  }

  async remove(where: Prisma.ItemWhereUniqueInput): Promise<Item | null> {
    this.logger.log(`Where ${JSON.stringify(where)}`);
    const existing = await this.prisma.item.findUnique({ where });
    if (!existing) throw new NotFoundException(`Item not found`);
    return this.prisma.item.update({ where, data: { status: false } });
  }
}
