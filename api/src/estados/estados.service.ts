import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Prisma, Estado } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class EstadosService {
  private readonly logger = new Logger(EstadosService.name, {
    timestamp: true,
  });
  constructor(private prisma: PrismaService) {}
  async create(
    createEstadoDto: Prisma.EstadoCreateInput,
  ): Promise<Estado | null> {
    this.logger.log(`Body ${JSON.stringify(createEstadoDto)}`);
    const result = await this.prisma.estado.create({ data: createEstadoDto });
    return result;
  }

  async findAll(): Promise<Estado[] | null> {
    this.logger.log(`find all estados`);
    return await this.prisma.estado.findMany();
  }

  async find(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.EstadoWhereUniqueInput;
    where?: Prisma.EstadoWhereInput;
    orderBy?: Prisma.EstadoOrderByWithRelationInput;
  }): Promise<Estado[]> {
    const { skip, take, cursor, where, orderBy } = params;
    this.logger.log(`Paramns ${JSON.stringify(params)}`);
    return this.prisma.estado.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });
  }

  async findOne(where: Prisma.EstadoWhereUniqueInput) {
    this.logger.log(`Where ${JSON.stringify(where)}`);
    const estado = await this.prisma.estado.findUnique({ where });
    if (!estado) throw new NotFoundException(`Estado not found`);
    return estado;
  }

  async update(
    where: Prisma.EstadoWhereUniqueInput,
    updateEstadoDto: Prisma.EstadoUpdateInput,
  ): Promise<Estado | null> {
    this.logger.log(`Where ${JSON.stringify(where)}`);
    this.logger.log(`Body ${JSON.stringify(updateEstadoDto)}`);
    const existing = await this.prisma.estado.findUnique({ where });
    if (!existing) throw new NotFoundException(`Estado not found`);

    const result = await this.prisma.estado.update({
      where,
      data: updateEstadoDto,
    });
    return result;
  }

  async remove(where: Prisma.EstadoWhereUniqueInput): Promise<Estado | null> {
    this.logger.log(`Where ${JSON.stringify(where)}`);
    const existing = await this.prisma.estado.findUnique({ where });
    if (!existing) throw new NotFoundException(`Estado not found`);
    return this.prisma.estado.update({ where, data: { status: false } });
  }
}
