import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ProjetosService } from './projetos.service';
import { CreateProjetoDto } from './dto/create-projeto.dto';
import { UpdateProjetoDto } from './dto/update-projeto.dto';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { ProjetoResponseDto } from './dto/projeto-response.dto';
import { Prisma } from '@prisma/client';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Funcao } from 'src/usuarios/dto/create-usuario.dto';
import { Roles } from 'src/auth/roles.decorator';
import { SearchProjetoDto } from './dto/search-projeto.dto';
import type { RequestWithUser } from 'src/auth/id-param-self.guard';
import { ProjetoOwnerGuard } from 'src/auth/projeto-owner.guard';
import { defaultGetParamsAssembler } from 'src/utils/defaultGetParamsAssembler';
import { orderByKeys } from './constants/orderByKeys';
import { CacheTTL } from '@nestjs/cache-manager';

@ApiTags('projetos')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Funcao.ADMIN, Funcao.COMUM)
@Controller('projetos')
@CacheTTL(0)
export class ProjetosController {
  constructor(private readonly projetosService: ProjetosService) {}

  @Post()
  @ApiCreatedResponse({
    description: 'Projeto criado',
    type: ProjetoResponseDto,
  })
  @ApiOperation({ summary: 'Criar um projeto' })
  async create(
    @Body() createProjetoDto: CreateProjetoDto,
    @Request() req: RequestWithUser,
  ) {
    return await this.projetosService.create({
      ...createProjetoDto,
      usuarioId: req.user.id,
    });
  }

  @Get()
  @ApiOkResponse({
    description: 'Lista de meus projetos',
    type: [ProjetoResponseDto],
  })
  @ApiOperation({ summary: 'Listar meus projeto' })
  async findAll(@Request() req: RequestWithUser) {
    const where: Prisma.ProjetoWhereInput = {};
    if (req.user.funcao === Funcao.COMUM) {
      where.usuarioId = req.user.id;
    }
    return await this.projetosService.findAll({ where });
  }

  @Get('search')
  @ApiOkResponse({
    description: 'Busca avançada de meus projetos',
    type: [ProjetoResponseDto],
  })
  @ApiQuery({ name: 'skip', required: false, type: Number })
  @ApiQuery({ name: 'take', required: false, type: Number })
  @ApiQuery({ name: 'usuarioId', required: false, type: String })
  @ApiQuery({ name: 'clienteId', required: false, type: String })
  @ApiQuery({ name: 'valorMin', required: false, type: Number })
  @ApiQuery({ name: 'valorMax', required: false, type: Number })
  @ApiQuery({ name: 'nome', required: false, type: String })
  @ApiQuery({
    name: 'status',
    required: false,
    enum: ['EM_ANDAMENTO', 'CANCELADO', 'CONCLUIDO'],
  })
  @ApiQuery({ name: 'orderBy', required: false, type: String })
  @ApiQuery({ name: 'orderDir', required: false, enum: ['asc', 'desc'] })
  @ApiOperation({ summary: 'Buscar por parâmetros projetos' })
  async find(@Query() q: SearchProjetoDto, @Request() req: RequestWithUser) {
    const where: Prisma.ProjetoWhereInput = {};
    if (q.usuarioId) where.usuarioId = q.usuarioId;
    if (q.clienteId) where.clienteId = q.clienteId;
    if (q.nome) where.nome = { contains: q.nome, mode: 'insensitive' };
    if (q.valorMin !== undefined || q.valorMax !== undefined) {
      where.valorTotal = {};
      if (q.valorMin !== undefined) where.valorTotal.gte = q.valorMin;
      if (q.valorMax !== undefined) where.valorTotal.lte = q.valorMax;
    }
    if (req.user.funcao === Funcao.COMUM) {
      where.usuarioId = req.user.id;
    }
    const params = defaultGetParamsAssembler(q, where, orderByKeys);
    return this.projetosService.find(params);
  }

  @Get(':id')
  @UseGuards(ProjetoOwnerGuard)
  @ApiOkResponse({
    description: 'Meu projeto',
    type: ProjetoResponseDto,
  })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @ApiOperation({ summary: 'Lista um projeto' })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return await this.projetosService.findOne({
      id,
      status: { not: 'CANCELADO' },
    });
  }

  @Patch(':id')
  @UseGuards(ProjetoOwnerGuard)
  @ApiOkResponse({
    description: 'Projeto atualizado',
    type: ProjetoResponseDto,
  })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @ApiOperation({ summary: 'Atualizar um projeto' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateProjetoDto: UpdateProjetoDto,
  ) {
    const where: Prisma.ProjetoWhereUniqueInput = { id };
    return await this.projetosService.update(where, updateProjetoDto);
  }

  @Delete(':id')
  @UseGuards(ProjetoOwnerGuard)
  @ApiOkResponse({
    description: 'Projeto deletado',
    type: ProjetoResponseDto,
  })
  @ApiOperation({ summary: 'Deletar um projeto por ID' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    return await this.projetosService.remove({ id });
  }
}
