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
import { PrecosService } from './precos.service';
import { CreatePrecoDto } from './dto/create-preco.dto';
import { UpdatePrecoDto } from './dto/update-preco.dto';
import { Preco, Prisma } from '@prisma/client';
import {
  ApiTags,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiQuery,
  ApiBearerAuth,
  ApiParam,
  ApiOperation,
} from '@nestjs/swagger';
import { PrecoResponseDto } from './dto/preco-response.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Funcao } from 'src/usuarios/dto/create-usuario.dto';
import { Roles } from 'src/auth/roles.decorator';
import { SearchPrecoDto } from './dto/search-preco.dto';
import { defaultGetParamsAssembler } from 'src/utils/defaultGetParamsAssembler';
import { orderByKeys } from './constants/orderByKeys';

@ApiTags('precos')
@Controller('precos')
export class PrecosController {
  constructor(private readonly precosService: PrecosService) {}

  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Funcao.ADMIN)
  @ApiCreatedResponse({ description: 'Preco criado', type: PrecoResponseDto })
  @ApiOperation({ summary: 'Criar um projeto' })
  async create(@Body() createPrecoDto: CreatePrecoDto): Promise<Preco | null> {
    return await this.precosService.create(createPrecoDto);
  }

  @Get()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Funcao.ADMIN, Funcao.COMUM)
  @ApiOkResponse({ description: 'Lista de precos', type: [PrecoResponseDto] })
  @ApiOperation({ summary: 'Listar projetos' })
  async findAll() {
    return await this.precosService.findAll();
  }

  @Get('search')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Funcao.ADMIN, Funcao.COMUM)
  @ApiOkResponse({
    description: 'Busca avançada de precos',
    type: [PrecoResponseDto],
  })
  @ApiQuery({ name: 'skip', required: false, type: Number })
  @ApiQuery({ name: 'take', required: false, type: Number })
  @ApiQuery({ name: 'itemId', required: false, type: String })
  @ApiQuery({ name: 'estadoId', required: false, type: String })
  @ApiQuery({ name: 'valorMin', required: false, type: Number })
  @ApiQuery({ name: 'valorMax', required: false, type: Number })
  @ApiQuery({ name: 'status', required: false, type: Boolean })
  @ApiQuery({ name: 'orderBy', required: false, type: String })
  @ApiQuery({ name: 'orderDir', required: false, enum: ['asc', 'desc'] })
  @ApiOperation({ summary: 'Busca avançada de projetos por params' })
  async find(@Query() q: SearchPrecoDto) {
    const where: Prisma.PrecoWhereInput = {};
    if (q.itemId) where.itemId = q.itemId;
    if (q.estadoId) where.estadoId = q.estadoId;
    if (q.valorMin !== undefined || q.valorMax !== undefined) {
      where.valor = {};
      if (q.valorMin !== undefined) where.valor.gte = q.valorMin;
      if (q.valorMax !== undefined) where.valor.lte = q.valorMax;
    }
    const params = defaultGetParamsAssembler(q, where, orderByKeys);
    return await this.precosService.find(params);
  }

  @Get(':id')
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Funcao.ADMIN, Funcao.COMUM)
  @ApiOkResponse({ description: 'Preco', type: PrecoResponseDto })
  @ApiOperation({ summary: 'Listar um projeto por ID' })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return await this.precosService.findOne({ id });
  }

  @Patch(':id')
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Funcao.ADMIN)
  @ApiOkResponse({ description: 'Preco atualizado', type: PrecoResponseDto })
  @ApiOperation({ summary: 'Atualizar um projeto por ID' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updatePrecoDto: UpdatePrecoDto,
  ) {
    return await this.precosService.update({ id }, updatePrecoDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Funcao.ADMIN)
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Deletar um projeto por ID' })
  @ApiOkResponse({ description: 'Preco deletado', type: PrecoResponseDto })
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    return await this.precosService.remove({ id });
  }
}
