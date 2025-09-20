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
import { ProjetoItensService } from './projeto_itens.service';
import { CreateProjetoItemDto } from './dto/create-projeto_item.dto';
import { UpdateProjetoItemDto } from './dto/update-projeto_item.dto';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { ProjetoItemResponseDto } from './dto/projeto-item-response.dto';
import { Prisma } from '@prisma/client';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Funcao } from 'src/usuarios/dto/create-usuario.dto';
import { Roles } from 'src/auth/roles.decorator';
import { SearchProjetoItemDto } from './dto/search-projeto_item.dto';
import type { RequestWithUser } from 'src/auth/id-param-self.guard';
import { defaultGetParamsAssembler } from 'src/utils/defaultGetParamsAssembler';
import { orderByKeys } from './constants/orderByKeys';
import { CacheTTL } from '@nestjs/cache-manager';

@ApiTags('projeto-itens')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Funcao.ADMIN, Funcao.COMUM)
@Controller('projeto-itens')
@CacheTTL(0)
export class ProjetoItensController {
  constructor(private readonly projetoItensService: ProjetoItensService) {}

  @Post()
  @ApiCreatedResponse({
    description: 'Projeto item criado',
    type: ProjetoItemResponseDto,
  })
  @ApiOperation({ summary: 'Criar itens de projeto' })
  async create(@Body() createProjetoItemDto: CreateProjetoItemDto) {
    return await this.projetoItensService.create(createProjetoItemDto);
  }

  @Get()
  @ApiOkResponse({
    description: 'Lista de meus projetos itens',
    type: [ProjetoItemResponseDto],
  })
  @ApiOperation({ summary: 'Listar itens de projeto' })
  async findAll(@Request() req: RequestWithUser) {
    const where: Prisma.ProjetoItemWhereInput = {};

    if (req.user.funcao === Funcao.COMUM) {
      where.projeto = { usuarioId: req.user.id };
    }

    return await this.projetoItensService.findAll({ where });
  }

  @Get('search')
  @ApiQuery({ name: 'skip', required: false, type: Number })
  @ApiQuery({ name: 'take', required: false, type: Number })
  @ApiQuery({ name: 'quantidade', required: false, type: Number })
  @ApiQuery({ name: 'projetoId', required: true, type: String })
  @ApiQuery({ name: 'itemId', required: false, type: String })
  @ApiQuery({ name: 'status', required: false, type: Boolean })
  @ApiQuery({ name: 'orderBy', required: false, type: String })
  @ApiQuery({ name: 'orderDir', required: false, enum: ['asc', 'desc'] })
  @ApiOkResponse({
    description: 'Busca avançada de meus projetos itens',
    type: [ProjetoItemResponseDto],
  })
  @ApiOperation({ summary: 'Listar itens de projeto por busca avançada' })
  async find(
    @Query() q: SearchProjetoItemDto,
    @Request() req: RequestWithUser,
  ) {
    const where: Prisma.ProjetoItemWhereInput = {};
    if (req.user.funcao === Funcao.COMUM) {
      where.projeto = { usuarioId: req.user.id };
    }
    where.projetoId = q.projetoId;
    if (q.itemId) where.itemId = q.itemId;
    if (q.quantidade !== undefined) where.quantidade = { gte: q.quantidade };
    const params = defaultGetParamsAssembler(q, where, orderByKeys);
    return await this.projetoItensService.find(params);
  }

  @Get(':id')
  @ApiOkResponse({
    description: 'Meu projeto item',
    type: ProjetoItemResponseDto,
  })
  @ApiOperation({ summary: 'Listar item de projeto por ID' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return await this.projetoItensService.findOne({
      id,
      status: true,
    });
  }

  @Patch(':id')
  @ApiOkResponse({
    description: 'Projeto item atualizado',
    type: ProjetoItemResponseDto,
  })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @ApiOperation({ summary: 'Atualizar item de projeto por ID' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateProjetoItemDto: UpdateProjetoItemDto,
  ) {
    return await this.projetoItensService.update({ id }, updateProjetoItemDto);
  }

  @Delete(':id')
  @ApiOkResponse({
    description: 'Projeto item deletado',
    type: ProjetoItemResponseDto,
  })
  @ApiOperation({ summary: 'Deletar item de projeto por ID' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    return await this.projetoItensService.remove({ id });
  }
}
