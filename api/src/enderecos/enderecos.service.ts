import {
  Injectable,
  Logger,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { Prisma, Endereco } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class EnderecosService {
  private readonly logger = new Logger(EnderecosService.name, {
    timestamp: true,
  });
  constructor(private prisma: PrismaService) {}

  async create(
    createEnderecoDto: Prisma.EnderecoUncheckedCreateInput,
  ): Promise<Endereco | null> {
    this.logger.log(`Body ${JSON.stringify(createEnderecoDto)}`);
    const bairro = await this.prisma.bairro.findUnique({
      where: { id: createEnderecoDto.bairroId, status: true },
    });
    if (!bairro) {
      throw new UnprocessableEntityException('Bairro não existe ou inativo');
    }
    const result = await this.prisma.endereco.create({
      data: createEnderecoDto,
      include: { bairro: true },
    });
    return result;
  }

  async findAll({
    where,
  }: {
    where?: Prisma.EnderecoWhereInput;
  }): Promise<Endereco[] | null> {
    this.logger.log(`Where ${JSON.stringify(where)}`);
    return await this.prisma.endereco.findMany({
      where,
      include: { bairro: true },
    });
  }

  async find(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.EnderecoWhereUniqueInput;
    where?: Prisma.EnderecoWhereInput;
    orderBy?: Prisma.EnderecoOrderByWithRelationInput;
  }): Promise<Endereco[]> {
    const { skip, take, cursor, where, orderBy } = params;
    this.logger.log(`Paramns ${JSON.stringify(params)}`);
    return this.prisma.endereco.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
      include: { bairro: true },
    });
  }

  async findOne(where: Prisma.EnderecoWhereUniqueInput) {
    this.logger.log(`Where ${JSON.stringify(where)}`);
    const endereco = await this.prisma.endereco.findUnique({
      where,
      include: { bairro: true },
    });
    if (!endereco) throw new NotFoundException(`Endereco not found`);
    return endereco;
  }

  async update(
    where: Prisma.EnderecoWhereUniqueInput,
    updateEnderecoDto: Prisma.EnderecoUpdateInput,
  ): Promise<Endereco | null> {
    this.logger.log(`Where ${JSON.stringify(where)}`);
    this.logger.log(`Body ${JSON.stringify(updateEnderecoDto)}`);
    const existing = await this.prisma.endereco.findUnique({
      where,
      include: { bairro: true },
    });
    if (!existing) throw new NotFoundException(`Endereco not found`);
    const result = await this.prisma.endereco.update({
      where,
      data: updateEnderecoDto,
    });
    return result;
  }

  async remove(
    where: Prisma.EnderecoWhereUniqueInput,
  ): Promise<Endereco | null> {
    this.logger.log(`Where ${JSON.stringify(where)}`);
    const existing = await this.prisma.endereco.findUnique({ where });
    if (!existing) throw new NotFoundException(`Endereco not found`);
    return this.prisma.endereco.update({
      where,
      include: { bairro: true },
      data: { status: false },
    });
  }
}
