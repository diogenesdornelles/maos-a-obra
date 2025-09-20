import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Prisma, Preco } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PrecosService {
  private readonly logger = new Logger(PrecosService.name, {
    timestamp: true,
  });
  constructor(private prisma: PrismaService) {}

  async create(
    createPrecoDto: Prisma.PrecoUncheckedCreateInput,
  ): Promise<Preco | null> {
    this.logger.log(`Body ${JSON.stringify(createPrecoDto)}`);
    const result = await this.prisma.preco.create({
      data: createPrecoDto,
    });
    return result;
  }

  async findAll(): Promise<Preco[] | null> {
    this.logger.log(`find all precos`);
    return await this.prisma.preco.findMany();
  }

  async find(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.PrecoWhereUniqueInput;
    where?: Prisma.PrecoWhereInput;
    orderBy?: Prisma.PrecoOrderByWithRelationInput;
  }): Promise<Preco[]> {
    const { skip, take, cursor, where, orderBy } = params;
    this.logger.log(`Paramns ${JSON.stringify(params)}`);
    return this.prisma.preco.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });
  }

  async findOne(where: Prisma.PrecoWhereUniqueInput) {
    this.logger.log(`Where ${JSON.stringify(where)}`);
    const preco = await this.prisma.preco.findUnique({ where });
    if (!preco) throw new NotFoundException(`Preco not found`);
    return preco;
  }

  async update(
    where: Prisma.PrecoWhereUniqueInput,
    updatePrecoDto: Prisma.PrecoUpdateInput,
  ): Promise<Preco | null> {
    this.logger.log(`Where ${JSON.stringify(where)}`);
    this.logger.log(`Body ${JSON.stringify(updatePrecoDto)}`);
    const existing = await this.prisma.preco.findUnique({ where });
    if (!existing) throw new NotFoundException(`Preco not found`);

    const result = await this.prisma.preco.update({
      where,
      data: updatePrecoDto,
    });
    return result;
  }

  async remove(where: Prisma.PrecoWhereUniqueInput): Promise<Preco | null> {
    this.logger.log(`Where ${JSON.stringify(where)}`);
    const existing = await this.prisma.preco.findUnique({ where });
    if (!existing) throw new NotFoundException(`Preco not found`);
    return this.prisma.preco.update({ where, data: { status: false } });
  }
}
