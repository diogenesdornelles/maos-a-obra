import {
  Injectable,
  Logger,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { Cliente, Prisma } from '@prisma/client';

import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ClientesService {
  private readonly logger = new Logger(ClientesService.name, {
    timestamp: true,
  });
  constructor(private prisma: PrismaService) {}

  async create(
    createClienteDto: Prisma.ClienteUncheckedCreateInput,
  ): Promise<Cliente | null> {
    this.logger.log(`Body ${JSON.stringify(createClienteDto)}`);
    if (createClienteDto.enderecoId) {
      const endereco = await this.prisma.endereco.findUnique({
        where: { id: createClienteDto.enderecoId },
      });
      if (!endereco || !endereco.status) {
        throw new UnprocessableEntityException(
          'Endereço não existe ou inativo',
        );
      }
    }
    const result = await this.prisma.cliente.create({
      data: createClienteDto,
      include: { endereco: true },
    });
    return result;
  }

  async findAll({
    where,
  }: {
    where?: Prisma.ClienteWhereInput;
  }): Promise<Cliente[] | null> {
    this.logger.log(`Where ${JSON.stringify(where)}`);
    return await this.prisma.cliente.findMany({
      where,
      include: { endereco: true },
    });
  }

  async find(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.ClienteWhereUniqueInput;
    where?: Prisma.ClienteWhereInput;
    orderBy?: Prisma.ClienteOrderByWithRelationInput;
  }): Promise<Cliente[]> {
    const { skip, take, cursor, where, orderBy } = params;
    this.logger.log(`Paramns ${JSON.stringify(params)}`);
    return this.prisma.cliente.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
      include: { endereco: true },
    });
  }

  async findOne(where: Prisma.ClienteWhereUniqueInput) {
    this.logger.log(`Cliente ID ${where.id}`);
    const cliente = await this.prisma.cliente.findUnique({
      where,
      include: { endereco: true },
    });
    if (!cliente) throw new NotFoundException(`Cliente not found`);
    return cliente;
  }

  async update(
    where: Prisma.ClienteWhereUniqueInput,
    updateClienteDto: Prisma.ClienteUpdateInput,
  ): Promise<Cliente | null> {
    this.logger.log(`Body ${JSON.stringify(updateClienteDto)}`);
    this.logger.log(`Where ${JSON.stringify(where)}`);
    const existing = await this.prisma.cliente.findUnique({ where });
    if (!existing) throw new NotFoundException(`Cliente not found`);
    const result = await this.prisma.cliente.update({
      where,
      data: updateClienteDto,
      include: { endereco: true },
    });
    return result;
  }

  async remove(where: Prisma.ClienteWhereUniqueInput): Promise<Cliente | null> {
    this.logger.log(`Cliente ID ${where.id}`);
    const existing = await this.prisma.cliente.findUnique({ where });
    if (!existing) throw new NotFoundException(`Cliente not found`);
    return this.prisma.cliente.update({
      where,
      include: { endereco: true },
      data: { status: false },
    });
  }
}
