import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Prisma, Usuario } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import bcrypt from 'bcryptjs';

@Injectable()
export class UsuariosService {
  private readonly logger = new Logger(UsuariosService.name, {
    timestamp: true,
  });
  constructor(private prisma: PrismaService) {}

  async create(
    createUsuarioDto: Prisma.UsuarioCreateInput,
  ): Promise<Omit<Usuario, 'senha'> | null> {
    this.logger.log(
      `Body ${JSON.stringify({ ...createUsuarioDto, senha: '' })}`,
    );
    const hashedSenha = await bcrypt.hash(createUsuarioDto.senha, 10);
    const usuario = await this.prisma.usuario.create({
      data: { ...createUsuarioDto, senha: hashedSenha },
      omit: { senha: true },
    });
    return usuario;
  }

  async findAll(): Promise<Omit<Usuario, 'senha'>[] | null> {
    this.logger.log(`find all users`);
    return await this.prisma.usuario.findMany({ omit: { senha: true } });
  }

  async find(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.UsuarioWhereUniqueInput;
    where?: Prisma.UsuarioWhereInput;
    orderBy?: Prisma.UsuarioOrderByWithRelationInput;
  }): Promise<Omit<Usuario, 'senha'>[]> {
    const { skip, take, cursor, where, orderBy } = params;
    this.logger.log(`Paramns ${JSON.stringify(params)}`);
    return this.prisma.usuario.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
      omit: { senha: true },
    });
  }

  async me(id: string): Promise<Omit<Usuario, 'senha'> | null> {
    return this.findOne({ id });
  }

  async findOne(
    where: Prisma.UsuarioWhereUniqueInput,
  ): Promise<Omit<Usuario, 'senha'> | null> {
    this.logger.log(`Where ${JSON.stringify(where)}`);
    const usuario = await this.prisma.usuario.findUnique({
      where,
      include: { projetos: true },
    });
    if (!usuario) throw new NotFoundException(`Usuario not found`);
    const { senha, ...result } = usuario;
    return result;
  }

  async update(
    where: Prisma.UsuarioWhereUniqueInput,
    updateUsuarioDto: Prisma.UsuarioUpdateInput,
  ): Promise<Omit<Usuario, 'senha'> | null> {
    this.logger.log(
      `Body ${JSON.stringify({ ...updateUsuarioDto, senha: '' })}`,
    );
    this.logger.log(`Where ${JSON.stringify(where)}`);
    const existing = await this.prisma.usuario.findUnique({ where });
    if (!existing) throw new NotFoundException(`Usuario not found`);
    if (updateUsuarioDto?.senha && typeof updateUsuarioDto.senha === 'string') {
      updateUsuarioDto.senha = await bcrypt.hash(updateUsuarioDto.senha, 10);
    }

    const result = await this.prisma.usuario.update({
      where,
      data: updateUsuarioDto,
      omit: { senha: true },
    });

    return result;
  }

  async remove(
    where: Prisma.UsuarioWhereUniqueInput,
  ): Promise<Omit<Usuario, 'senha'> | null> {
    this.logger.log(`Where ${JSON.stringify(where)}`);
    const existing = await this.prisma.usuario.findUnique({ where });
    if (!existing) throw new NotFoundException(`Usuario not found`);
    return this.prisma.usuario.update({
      where,
      data: { status: false },
      omit: { senha: true },
    });
  }
}
