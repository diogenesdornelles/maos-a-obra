import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Bairro, Prisma } from '@prisma/client';

import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class BairrosService {
  private readonly logger = new Logger(BairrosService.name, {
    timestamp: true,
  });
  constructor(private prisma: PrismaService) {}
  async create(
    createBairroDto: Prisma.BairroCreateInput,
  ): Promise<Bairro | null> {
    this.logger.log(`Bairro ${JSON.stringify(createBairroDto)}`);
    const result = await this.prisma.bairro.create({ data: createBairroDto });
    return result;
  }

  async findAll(): Promise<Bairro[] | null> {
    this.logger.log(`find all bairros`);
    return await this.prisma.bairro.findMany();
  }

  async find(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.BairroWhereUniqueInput;
    where?: Prisma.BairroWhereInput;
    orderBy?: Prisma.BairroOrderByWithRelationInput;
  }): Promise<Bairro[]> {
    const { skip, take, cursor, where, orderBy } = params;
    this.logger.log(`Paramns ${JSON.stringify(params)}`);
    return this.prisma.bairro.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });
  }

  async findOne(where: Prisma.BairroWhereUniqueInput) {
    this.logger.log(`Where ${JSON.stringify(where)}`);
    const bairro = await this.prisma.bairro.findUnique({ where });
    if (!bairro) throw new NotFoundException(`Bairro not found`);
    return bairro;
  }

  async update(
    where: Prisma.BairroWhereUniqueInput,
    updateBairroDto: Prisma.BairroUpdateInput,
  ): Promise<Bairro | null> {
    this.logger.log(`Bairro ${JSON.stringify(updateBairroDto)}`);
    this.logger.log(`Where ${JSON.stringify(where)}`);
    const existing = await this.prisma.bairro.findUnique({ where });
    if (!existing) throw new NotFoundException(`Bairro not found`);

    const result = await this.prisma.bairro.update({
      where,
      data: updateBairroDto,
    });
    return result;
  }

  async remove(where: Prisma.BairroWhereUniqueInput): Promise<Bairro | null> {
    this.logger.log(`Where ${JSON.stringify(where)}`);
    const existing = await this.prisma.bairro.findUnique({ where });
    if (!existing) throw new NotFoundException(`Bairro not found`);
    return this.prisma.bairro.update({ where, data: { status: false } });
  }
}
