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
import { EstadosService } from './estados.service';
import { CreateEstadoDto } from './dto/create-estado.dto';
import { UpdateEstadoDto } from './dto/update-estado.dto';
import { EstadoResponseDto } from './dto/estado-response.dto';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { Prisma } from '@prisma/client';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Funcao } from 'src/usuarios/dto/create-usuario.dto';
import { Roles } from 'src/auth/roles.decorator';
import { SearchEstadoDto } from './dto/search-estado.dto';
import { defaultGetParamsAssembler } from '../utils/defaultGetParamsAssembler';
import { orderByKeys } from './constants/orderByKeys';

@ApiTags('estados')
@Controller('estados')
export class EstadosController {
  constructor(private readonly estadosService: EstadosService) {}

  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Funcao.ADMIN)
  @ApiOperation({
    summary: 'Criar estado',
  })
  @ApiCreatedResponse({ description: 'Estado criado', type: EstadoResponseDto })
  async create(@Body() createEstadoDto: CreateEstadoDto) {
    return await this.estadosService.create(createEstadoDto);
  }

  @Get()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Funcao.ADMIN, Funcao.COMUM)
  @ApiOkResponse({ description: 'Lista de estados', type: [EstadoResponseDto] })
  @ApiOperation({
    summary: 'Listar estados',
  })
  async findAll() {
    return await this.estadosService.findAll();
  }

  @Get('search')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Funcao.ADMIN, Funcao.COMUM)
  @ApiOkResponse({
    description: 'Busca avançada de estados',
    type: [EstadoResponseDto],
  })
  @ApiQuery({ name: 'skip', required: false, type: Number })
  @ApiQuery({ name: 'take', required: false, type: Number })
  @ApiQuery({ name: 'nome', required: false, type: String })
  @ApiQuery({ name: 'uf', required: false, type: String })
  @ApiQuery({ name: 'codigoUf', required: false, type: Number })
  @ApiQuery({ name: 'status', required: false, type: Boolean })
  @ApiQuery({ name: 'orderBy', required: false, type: String })
  @ApiQuery({ name: 'orderDir', required: false, enum: ['asc', 'desc'] })
  @ApiQuery({ name: 'criadoEm', required: false, type: String })
  @ApiOperation({
    summary: 'Busca avançada de estados',
  })
  async find(@Query() q: SearchEstadoDto) {
    const where: Prisma.EstadoWhereInput = {};
    if (q.nome) where.nome = { contains: q.nome, mode: 'insensitive' };
    if (q.uf) where.uf = q.uf;
    if (q.codigoUf !== undefined) where.codigoUf = q.codigoUf;
    const params = defaultGetParamsAssembler(q, where, orderByKeys);
    return await this.estadosService.find(params);
  }

  @Get(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Funcao.ADMIN, Funcao.COMUM)
  @ApiOkResponse({ description: 'Estado', type: EstadoResponseDto })
  @ApiOperation({
    summary: 'Busca de estado por ID',
  })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return await this.estadosService.findOne({ id });
  }

  @Patch(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Funcao.ADMIN)
  @ApiOkResponse({ description: 'Estado atualizado', type: EstadoResponseDto })
  @ApiOperation({
    summary: 'Atualiza estado por ID',
  })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateEstadoDto: UpdateEstadoDto,
  ) {
    return await this.estadosService.update({ id }, updateEstadoDto);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Funcao.ADMIN)
  @ApiOperation({
    summary: 'Deleta estado por ID',
  })
  @ApiOkResponse({ description: 'Estado deletado', type: EstadoResponseDto })
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    return await this.estadosService.remove({ id });
  }
}
