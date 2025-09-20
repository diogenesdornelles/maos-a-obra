import {
  Injectable,
  Logger,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { Prisma, Projeto } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { ProjetoStatus } from './dto/update-projeto.dto';

@Injectable()
export class ProjetosService {
  private readonly logger = new Logger(ProjetosService.name, {
    timestamp: true,
  });
  constructor(private prisma: PrismaService) {}

  async create(
    createProjetoDto: Prisma.ProjetoUncheckedCreateInput,
  ): Promise<Projeto | null> {
    this.logger.log(`Body ${JSON.stringify(createProjetoDto)}`);
    const cliente = await this.prisma.cliente.findUnique({
      where: { id: createProjetoDto.clienteId, status: true },
    });
    if (!cliente) {
      throw new UnprocessableEntityException('Cliente não existe ou inativo');
    }
    const result = await this.prisma.projeto.create({
      data: { ...createProjetoDto, status: ProjetoStatus.EM_ANDAMENTO },
      include: { cliente: true, itens: true },
    });
    return result;
  }

  async findAll({
    where,
  }: {
    where: Prisma.ProjetoWhereInput;
  }): Promise<Projeto[] | null> {
    this.logger.log(`Where ${JSON.stringify(where)}`);
    return await this.prisma.projeto.findMany({
      where,
      include: { cliente: true, itens: true },
    });
  }

  async find(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.ProjetoWhereUniqueInput;
    where?: Prisma.ProjetoWhereInput;
    orderBy?: Prisma.ProjetoOrderByWithRelationInput;
  }): Promise<Projeto[]> {
    const { skip, take, cursor, where, orderBy } = params;
    this.logger.log(`Paramns ${JSON.stringify(params)}`);
    return this.prisma.projeto.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
      include: { cliente: true, itens: true },
    });
  }

  async findOne(where: Prisma.ProjetoWhereUniqueInput) {
    this.logger.log(`Where ${JSON.stringify(where)}`);
    const projeto = await this.prisma.projeto.findUnique({
      where,
      include: { cliente: true, itens: true },
    });
    if (!projeto) throw new NotFoundException(`Projeto not found`);
    return projeto;
  }

  async update(
    where: Prisma.ProjetoWhereUniqueInput,
    updateProjetoDto: Prisma.ProjetoUncheckedUpdateInput,
  ): Promise<Projeto | null> {
    this.logger.log(`Where ${JSON.stringify(where)}`);
    this.logger.log(`Body ${JSON.stringify(updateProjetoDto)}`);
    if (updateProjetoDto.clienteId) {
      const cliente = await this.prisma.cliente.findUnique({
        where: { id: updateProjetoDto?.clienteId as string, status: true },
      });
      if (!cliente) {
        throw new UnprocessableEntityException('Cliente não existe ou inativo');
      }
    }

    where.status = { not: 'CANCELADO' };

    const result = await this.prisma.projeto.update({
      where,
      data: updateProjetoDto,
      include: { cliente: true, itens: true },
    });
    return result;
  }

  async remove(where: Prisma.ProjetoWhereUniqueInput): Promise<Projeto | null> {
    this.logger.log(`Where ${JSON.stringify(where)}`);
    where.status = { not: 'CANCELADO' };
    const existing = await this.prisma.projeto.findUnique({ where });
    if (!existing) throw new NotFoundException(`Projeto not found`);
    return this.prisma.projeto.update({
      where,
      data: { status: 'CANCELADO' },
      include: { cliente: true, itens: true },
    });
  }
}
