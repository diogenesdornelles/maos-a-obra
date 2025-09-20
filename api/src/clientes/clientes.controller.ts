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
import { ClientesService } from './clientes.service';
import { CreateClienteDto } from './dto/create-cliente.dto';
import { UpdateClienteDto } from './dto/update-cliente.dto';
import { ClienteResponseDto } from './dto/cliente-response.dto';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { Prisma } from '@prisma/client';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { Funcao } from 'src/usuarios/dto/create-usuario.dto';
import type { RequestWithUser } from 'src/auth/id-param-self.guard';
import { SearchClienteDto } from './dto/search-cliente.dto';
import { ClienteOwnerGuard } from 'src/auth/cliente-owner.guard';
import { defaultGetParamsAssembler } from 'src/utils/defaultGetParamsAssembler';
import { orderByKeys } from './constants/orderByKeys';
import { CacheTTL } from '@nestjs/cache-manager';

@ApiTags('clientes')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Funcao.ADMIN, Funcao.COMUM)
@Controller('clientes')
@CacheTTL(0)
export class ClientesController {
  constructor(private readonly clientesService: ClientesService) {}

  @Post()
  @ApiCreatedResponse({
    description: 'Cliente criado',
    type: ClienteResponseDto,
  })
  @ApiOperation({
    summary: 'Criar cliente',
  })
  async create(
    @Body() createClienteDto: CreateClienteDto,
    @Request() req: RequestWithUser,
  ) {
    return await this.clientesService.create({
      ...createClienteDto,
      usuarioId: req.user.id,
    });
  }

  @Get()
  @ApiOkResponse({
    description: 'Lista de meus clientes',
    type: [ClienteResponseDto],
  })
  @ApiOperation({
    summary: 'Listar todos clientes',
  })
  async findAll(@Request() req: RequestWithUser) {
    const where: Prisma.ClienteWhereInput = {};
    if (req.user.funcao === Funcao.COMUM) {
      where.usuarioId = req.user.id;
    }
    return await this.clientesService.findAll({ where });
  }

  @Get('search')
  @ApiOkResponse({
    description: 'Busca avançada de meus clientes',
    type: [ClienteResponseDto],
  })
  @ApiQuery({ name: 'skip', required: false, type: Number })
  @ApiQuery({ name: 'take', required: false, type: Number })
  @ApiQuery({ name: 'nome', required: false, type: String })
  @ApiQuery({ name: 'cpf', required: false, type: String })
  @ApiQuery({ name: 'cnpj', required: false, type: String })
  @ApiQuery({ name: 'email', required: false, type: String })
  @ApiQuery({ name: 'enderecoId', required: false, type: String })
  @ApiQuery({ name: 'status', required: false, type: Boolean })
  @ApiQuery({ name: 'orderBy', required: false, type: String })
  @ApiQuery({ name: 'orderDir', required: false, enum: ['asc', 'desc'] })
  @ApiOperation({
    summary: 'Busca avançada de clientes',
  })
  async find(@Request() req: RequestWithUser, @Query() q: SearchClienteDto) {
    const where: Prisma.ClienteWhereInput = {};

    if (req.user.funcao === Funcao.COMUM) {
      where.usuarioId = req.user.id;
    }
    if (q.nome) where.nome = { contains: q.nome, mode: 'insensitive' };
    if (q.cpf) where.cpf = { contains: q.cpf };
    if (q.cnpj) where.cnpj = { contains: q.cnpj };
    if (q.email) where.email = { contains: q.email, mode: 'insensitive' };
    if (q.enderecoId) where.enderecoId = q.enderecoId;
    const params = defaultGetParamsAssembler(q, where, orderByKeys);
    return await this.clientesService.find(params);
  }

  @Get(':id')
  @ApiOkResponse({
    description: 'Meu cliente',
    type: ClienteResponseDto,
  })
  @UseGuards(ClienteOwnerGuard)
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @ApiOperation({
    summary: 'Buscar cliente por ID',
  })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return await this.clientesService.findOne({ id });
  }

  @Patch(':id')
  @ApiOkResponse({
    description: 'Cliente atualizado',
    type: ClienteResponseDto,
  })
  @UseGuards(ClienteOwnerGuard)
  @ApiOperation({
    summary: 'Atualizar cliente por ID',
  })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateClienteDto: UpdateClienteDto,
  ) {
    const where: Prisma.ClienteWhereUniqueInput = { id };
    return await this.clientesService.update(where, updateClienteDto);
  }

  @Delete(':id')
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @UseGuards(ClienteOwnerGuard)
  @ApiOkResponse({
    description: 'Meu cliente deletado',
    type: ClienteResponseDto,
  })
  @ApiOperation({
    summary: 'Deletar cliente por ID',
  })
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    return await this.clientesService.remove({ id });
  }
}
