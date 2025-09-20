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
import { MunicipiosService } from './municipios.service';
import { CreateMunicipioDto } from './dto/create-municipio.dto';
import { UpdateMunicipioDto } from './dto/update-municipio.dto';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { MunicipioResponseDto } from './dto/municipio-response.dto';
import { Prisma } from '@prisma/client';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Funcao } from 'src/usuarios/dto/create-usuario.dto';
import { Roles } from 'src/auth/roles.decorator';
import { SearchMunicipioDto } from './dto/search-municipios.dto';
import { defaultGetParamsAssembler } from 'src/utils/defaultGetParamsAssembler';
import { orderByKeys } from './constants/orderByKeys';

@ApiTags('municipios')
@Controller('municipios')
export class MunicipiosController {
  constructor(private readonly municipiosService: MunicipiosService) {}

  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Funcao.ADMIN)
  @ApiCreatedResponse({
    description: 'Municipio criado',
    type: MunicipioResponseDto,
  })
  @ApiOperation({ summary: 'Criar um município' })
  async create(@Body() createMunicipioDto: CreateMunicipioDto) {
    return await this.municipiosService.create(createMunicipioDto);
  }

  @Get()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Funcao.ADMIN, Funcao.COMUM)
  @ApiOkResponse({
    description: 'Lista de Municípios',
    type: [CreateMunicipioDto],
  })
  @ApiOperation({ summary: 'Lista de municípios' })
  async findAll() {
    return await this.municipiosService.findAll();
  }

  @Get('search')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Funcao.ADMIN, Funcao.COMUM)
  @ApiOkResponse({
    description: 'Busca avançada de municípios',
    type: [MunicipioResponseDto],
  })
  @ApiQuery({ name: 'skip', required: false, type: Number })
  @ApiQuery({ name: 'take', required: false, type: Number })
  @ApiQuery({ name: 'nome', required: false, type: String })
  @ApiQuery({ name: 'uf', required: false, type: String })
  @ApiQuery({ name: 'codigo', required: false, type: Number })
  @ApiQuery({ name: 'status', required: false, type: Boolean })
  @ApiQuery({ name: 'orderBy', required: false, type: String })
  @ApiQuery({ name: 'orderDir', required: false, enum: ['asc', 'desc'] })
  @ApiOperation({ summary: 'Busca de municípios' })
  async find(@Query() q: SearchMunicipioDto) {
    const where: Prisma.MunicipioWhereInput = {};
    if (q.nome) where.nome = { contains: q.nome, mode: 'insensitive' };
    if (q.uf) where.uf = q.uf;
    if (q.codigo !== undefined) where.codigo = q.codigo;
    const params = defaultGetParamsAssembler(q, where, orderByKeys);
    return await this.municipiosService.find(params);
  }

  @Get(':id')
  @ApiBearerAuth()
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Funcao.ADMIN, Funcao.COMUM)
  @ApiOkResponse({ description: 'Municípios', type: CreateMunicipioDto })
  @ApiOperation({ summary: 'Busca de município por ID' })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return await this.municipiosService.findOne({ id });
  }

  @Patch(':id')
  @ApiBearerAuth()
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Funcao.ADMIN)
  @ApiOkResponse({
    description: 'Município atualizado',
    type: CreateMunicipioDto,
  })
  @ApiOperation({ summary: 'Atualização de município por ID' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateMunicipioDto: UpdateMunicipioDto,
  ) {
    return await this.municipiosService.update({ id }, updateMunicipioDto);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Funcao.ADMIN)
  @ApiOkResponse({
    description: 'Município deletado',
    type: CreateMunicipioDto,
  })
  @ApiOperation({ summary: 'Deletar município por ID' })
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    return await this.municipiosService.remove({ id });
  }
}
