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
import { BairrosService } from './bairros.service';
import { CreateBairroDto } from './dto/create-bairro.dto';
import { UpdateBairroDto } from './dto/update-bairro.dto';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { BairroResponseDto } from './dto/bairro-response.dto';
import { Prisma } from '@prisma/client';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { Funcao } from 'src/usuarios/dto/create-usuario.dto';
import { SearchBairroDto } from './dto/search-bairro.dto';
import { defaultGetParamsAssembler } from 'src/utils/defaultGetParamsAssembler';
import { orderByKeys } from './constants/orderByKeys';

@ApiTags('bairros')
@Controller('bairros')
export class BairrosController {
  constructor(private readonly bairrosService: BairrosService) {}

  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Funcao.ADMIN)
  @ApiCreatedResponse({
    description: 'Bairro criado',
    type: BairroResponseDto,
  })
  @ApiOperation({
    summary: 'Criar um bairro',
  })
  async create(@Body() createBairroDto: CreateBairroDto) {
    return await this.bairrosService.create(createBairroDto);
  }

  @Get()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Funcao.ADMIN, Funcao.COMUM)
  @ApiOkResponse({
    description: 'Lista de bairros',
    type: [BairroResponseDto],
  })
  @ApiOperation({
    summary: 'Listar todos os bairros',
  })
  async findAll() {
    return await this.bairrosService.findAll();
  }

  @Get('search')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Funcao.ADMIN, Funcao.COMUM)
  @ApiOkResponse({
    description: 'Busca avançada de bairros',
    type: [BairroResponseDto],
  })
  @ApiQuery({ name: 'skip', required: false, type: Number })
  @ApiQuery({ name: 'take', required: false, type: Number })
  @ApiQuery({ name: 'nome', required: false, type: String })
  @ApiQuery({ name: 'codigo', required: false, type: String })
  @ApiQuery({ name: 'uf', required: false, type: String })
  @ApiQuery({ name: 'status', required: false, type: Boolean })
  @ApiQuery({ name: 'orderBy', required: false, type: String })
  @ApiQuery({ name: 'orderDir', required: false, enum: ['asc', 'desc'] })
  @ApiOperation({
    summary: 'Busca avançada de bairros',
  })
  async find(@Query() q: SearchBairroDto) {
    const where: Prisma.BairroWhereInput = {};
    if (q.nome) where.nome = { contains: q.nome, mode: 'insensitive' };
    if (q.codigo) where.codigo = { contains: q.codigo, mode: 'insensitive' };
    if (q.uf) where.uf = q.uf;
    const params = defaultGetParamsAssembler(q, where, orderByKeys);
    return await this.bairrosService.find(params);
  }

  @Get(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Funcao.ADMIN, Funcao.COMUM)
  @ApiOkResponse({
    description: 'Bairro',
    type: BairroResponseDto,
  })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @ApiOperation({
    summary: 'Busca de bairro por ID',
  })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return await this.bairrosService.findOne({ id });
  }

  @Patch(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Funcao.ADMIN)
  @ApiOkResponse({
    description: 'Bairro atualizado',
    type: BairroResponseDto,
  })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @ApiOperation({
    summary: 'Atualização de bairro por ID',
  })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateBairroDto: UpdateBairroDto,
  ) {
    return await this.bairrosService.update({ id }, updateBairroDto);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Funcao.ADMIN)
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @ApiOkResponse({
    description: 'Bairro deletado',
    type: BairroResponseDto,
  })
  @ApiOperation({
    summary: 'Deletar bairro por ID',
  })
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    return await this.bairrosService.remove({ id });
  }
}
