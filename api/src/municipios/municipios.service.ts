import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Prisma, Municipio } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class MunicipiosService {
  private readonly logger = new Logger(MunicipiosService.name, {
    timestamp: true,
  });
  constructor(private prisma: PrismaService) {}

  async create(
    createMunicipioDto: Prisma.MunicipioCreateInput,
  ): Promise<Municipio | null> {
    this.logger.log(`Body ${JSON.stringify(createMunicipioDto)}`);
    const result = await this.prisma.municipio.create({
      data: createMunicipioDto,
    });
    return result;
  }

  async findAll(): Promise<Municipio[] | null> {
    this.logger.log(`find all municipios`);
    return await this.prisma.municipio.findMany();
  }

  async find(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.MunicipioWhereUniqueInput;
    where?: Prisma.MunicipioWhereInput;
    orderBy?: Prisma.MunicipioOrderByWithRelationInput;
  }): Promise<Municipio[]> {
    const { skip, take, cursor, where, orderBy } = params;
    this.logger.log(`Paramns ${JSON.stringify(params)}`);
    return this.prisma.municipio.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });
  }

  async findOne(where: Prisma.MunicipioWhereUniqueInput) {
    this.logger.log(`Where ${JSON.stringify(where)}`);
    const municipio = await this.prisma.municipio.findUnique({ where });
    if (!municipio) throw new NotFoundException(`Municipio not found`);
    return municipio;
  }

  async update(
    where: Prisma.MunicipioWhereUniqueInput,
    updateMunicipioDto: Prisma.MunicipioUpdateInput,
  ): Promise<Municipio | null> {
    this.logger.log(`Where ${JSON.stringify(where)}`);
    this.logger.log(`Body ${JSON.stringify(updateMunicipioDto)}`);
    const existing = await this.prisma.municipio.findUnique({ where });
    if (!existing) throw new NotFoundException(`Municipio not found`);

    const result = await this.prisma.municipio.update({
      where,
      data: updateMunicipioDto,
    });
    return result;
  }

  async remove(
    where: Prisma.MunicipioWhereUniqueInput,
  ): Promise<Municipio | null> {
    this.logger.log(`Where ${JSON.stringify(where)}`);
    const existing = await this.prisma.municipio.findUnique({ where });
    if (!existing) throw new NotFoundException(`Municipio not found`);
    return this.prisma.municipio.update({ where, data: { status: false } });
  }
}
