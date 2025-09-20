import {
  Injectable,
  Logger,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { Prisma, ProjetoItem } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { ProjetoStatus } from 'src/projetos/dto/update-projeto.dto';

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
    const item = await this.prisma.item.findUnique({
      where: { id: createProjetoItemDto.itemId, status: true },
    });
    if (!item) {
      throw new UnprocessableEntityException('Item não existe ou inativo');
    }
    const projeto = await this.prisma.projeto.findUnique({
      where: {
        id: createProjetoItemDto.projetoId,
        status: { not: 'CANCELADO' },
      },
    });
    if (!projeto) {
      throw new UnprocessableEntityException('Projeto não existe ou cancelado');
    }

    const preco = await this.prisma.preco.findFirstOrThrow({
      where: {
        estadoId: projeto.estadoId,
        itemId: item.id,
        status: true,
      },
    });

    if (preco) {
      const result = await this.prisma.projetoItem.create({
        data: {
          ...createProjetoItemDto,
          preco: preco.valor,
          nomenclatura: item.nomenclatura,
          unidade: item.unidade,
          codigo: item.codigo,
        },
      });
      return result;
    }
    return null;
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
    if (updateProjetoItenDto.itemId) {
      const item = await this.prisma.item.findUnique({
        where: { id: updateProjetoItenDto.itemId as string, status: true },
      });
      if (!item) {
        throw new UnprocessableEntityException('Item não existe ou inativo');
      }
    }

    if (updateProjetoItenDto.projetoId) {
      const projeto = await this.prisma.projeto.findUnique({
        where: {
          id: updateProjetoItenDto.projetoId as string,
          status: { not: 'CANCELADO' },
        },
      });
      if (!projeto || projeto.status === ProjetoStatus.CANCELADO) {
        throw new UnprocessableEntityException(
          'Projeto não existe ou cancelado',
        );
      }
    }

    const result = await this.prisma.projetoItem.update({
      where,
      data: updateProjetoItenDto,
    });
    return result;
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
