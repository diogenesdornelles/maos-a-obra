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
} from '@nestjs/common';
import { ItensService } from './itens.service';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { ItemResponseDto } from './dto/item-response.dto';
import { Prisma } from '@prisma/client';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Funcao } from 'src/usuarios/dto/create-usuario.dto';
import { Roles } from 'src/auth/roles.decorator';
import { SearchItenDto } from './dto/search-itens.dto';
import { ItemPrecoResponseDto } from './dto/item-preco.response.dto';
import { SearchItemPrecoDto } from './dto/search-item-preco.dto';
import { defaultGetParamsAssembler } from 'src/utils/defaultGetParamsAssembler';
import { orderByKeys } from './constants/orderByKeys';

@ApiTags('itens')
@Controller('itens')
export class ItensController {
  constructor(private readonly itensService: ItensService) {}

  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Funcao.ADMIN)
  @ApiCreatedResponse({ description: 'Item criado', type: ItemResponseDto })
  @ApiOperation({ summary: 'Criar item' })
  async create(@Body() createItenDto: CreateItemDto) {
    return await this.itensService.create(createItenDto);
  }

  @Get()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Funcao.ADMIN, Funcao.COMUM)
  @ApiOkResponse({ description: 'Lista de itens', type: [ItemResponseDto] })
  @ApiOperation({ summary: 'Listar itens' })
  async findAll() {
    return await this.itensService.findAll();
  }

  @Get('search')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Funcao.ADMIN, Funcao.COMUM)
  @ApiOkResponse({
    description: 'Busca avançada de itens',
    type: [ItemResponseDto],
  })
  @ApiQuery({ name: 'skip', required: false, type: Number })
  @ApiQuery({ name: 'take', required: false, type: Number })
  @ApiQuery({ name: 'codigo', required: false, type: String })
  @ApiQuery({ name: 'nomenclatura', required: false, type: String })
  @ApiQuery({ name: 'unidade', required: false, type: String })
  @ApiQuery({ name: 'status', required: false, type: Boolean })
  @ApiQuery({ name: 'orderBy', required: false, type: String })
  @ApiQuery({ name: 'orderDir', required: false, enum: ['asc', 'desc'] })
  @ApiOperation({ summary: 'Busca de itens' })
  async find(@Query() q: SearchItenDto) {
    const where: Prisma.ItemWhereInput = {};
    if (q.codigo) where.codigo = { contains: q.codigo, mode: 'insensitive' };
    if (q.nomenclatura)
      where.nomenclatura = { contains: q.nomenclatura, mode: 'insensitive' };
    if (q.unidade) where.unidade = q.unidade;
    const params = defaultGetParamsAssembler(q, where, orderByKeys);
    return await this.itensService.find(params);
  }

  @Get('preco')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Funcao.ADMIN, Funcao.COMUM)
  @ApiOkResponse({
    description:
      'Busca avançada de item com preço. Estado ID e Item ID obrigatórios',
    type: ItemPrecoResponseDto,
  })
  @ApiQuery({ name: 'itemId', required: true, type: String })
  @ApiQuery({ name: 'estadoId', required: true, type: String })
  @ApiOperation({
    summary: 'Buscar de forma avançada item com preço',
  })
  async findOneWithPreco(@Query() q: SearchItemPrecoDto) {
    return await this.itensService.findOneWithPreco(q.estadoId, q.itemId);
  }

  @Get(':id')
  @ApiBearerAuth()
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Funcao.ADMIN, Funcao.COMUM)
  @ApiOkResponse({ description: 'Item', type: ItemResponseDto })
  @ApiOperation({
    summary: 'Busca de item por ID',
  })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return await this.itensService.findOne({ id });
  }

  @Patch(':id')
  @ApiBearerAuth()
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Funcao.ADMIN)
  @ApiOkResponse({ description: 'Item atualizado', type: ItemResponseDto })
  @ApiOperation({
    summary: 'Atualização de item por ID',
  })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateItemDto: UpdateItemDto,
  ) {
    return await this.itensService.update({ id }, updateItemDto);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Funcao.ADMIN)
  @ApiOperation({
    summary: 'Deletar item por ID',
  })
  @ApiOkResponse({ description: 'Item deletado', type: ItemResponseDto })
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    return await this.itensService.remove({ id });
  }
}
