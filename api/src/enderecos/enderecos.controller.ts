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
  UnauthorizedException,
} from '@nestjs/common';
import { EnderecosService } from './enderecos.service';
import { CreateEnderecoDto } from './dto/create-endereco.dto';
import { UpdateEnderecoDto } from './dto/update-endereco.dto';
import { EnderecoResponseDto } from './dto/endereco-response.dto';
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
import { Funcao } from 'src/usuarios/dto/create-usuario.dto';
import { Roles } from 'src/auth/roles.decorator';
import { SearchEnderecoDto } from './dto/search-endereco.dto';
import type { RequestWithUser } from 'src/auth/id-param-self.guard';
import { defaultGetParamsAssembler } from 'src/utils/defaultGetParamsAssembler';
import { orderByKeys } from './constants/orderByKeys';
import { CacheTTL } from '@nestjs/cache-manager';

@ApiTags('enderecos')
@Controller('enderecos')
@CacheTTL(0)
export class EnderecosController {
  constructor(private readonly enderecosService: EnderecosService) {}

  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Funcao.ADMIN, Funcao.COMUM)
  @ApiCreatedResponse({
    description: 'Endereco criado',
    type: EnderecoResponseDto,
  })
  @ApiOperation({
    summary: 'Criar endereço',
  })
  async create(
    @Body() createEnderecoDto: CreateEnderecoDto,
    @Request() req: RequestWithUser,
  ) {
    return await this.enderecosService.create({
      ...createEnderecoDto,
      usuarioId: req.user.id,
    });
  }

  @Get()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Funcao.ADMIN, Funcao.COMUM)
  @ApiOkResponse({
    description: 'Lista de enderecos',
    type: [EnderecoResponseDto],
  })
  @ApiOperation({
    summary: 'Listar todos endereços',
  })
  async findAll(@Request() req: RequestWithUser) {
    const where: Prisma.EnderecoWhereInput = {};
    if (req.user.funcao === Funcao.COMUM) {
      where.usuarioId = req.user.id;
    }
    return await this.enderecosService.findAll({ where });
  }

  @Get('search')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Funcao.ADMIN, Funcao.COMUM)
  @ApiOkResponse({
    description: 'Busca avançada de endereços',
    type: [EnderecoResponseDto],
  })
  @ApiQuery({ name: 'skip', required: false, type: Number })
  @ApiQuery({ name: 'take', required: false, type: Number })
  @ApiQuery({ name: 'logradouro', required: false, type: String })
  @ApiQuery({ name: 'cep', required: false, type: String })
  @ApiQuery({ name: 'numero', required: false, type: String })
  @ApiQuery({ name: 'status', required: false, type: Boolean })
  @ApiQuery({ name: 'orderBy', required: false, type: String })
  @ApiQuery({ name: 'orderDir', required: false, enum: ['asc', 'desc'] })
  @ApiOperation({
    summary: 'Busca avançada de endereços',
  })
  async find(@Query() q: SearchEnderecoDto, @Request() req: RequestWithUser) {
    const where: Prisma.EnderecoWhereInput = {};
    if (req.user.funcao === Funcao.COMUM) {
      where.usuarioId = req.user.id;
    }
    if (q.logradouro)
      where.logradouro = { contains: q.logradouro, mode: 'insensitive' };
    if (q.cep) where.cep = { contains: q.cep };
    if (q.numero) where.numero = q.numero;
    const params = defaultGetParamsAssembler(q, where, orderByKeys);
    return await this.enderecosService.find(params);
  }

  @Get(':id')
  @ApiBearerAuth()
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Funcao.ADMIN, Funcao.COMUM)
  @ApiOkResponse({ description: 'Endereco', type: EnderecoResponseDto })
  @ApiOperation({
    summary: 'Buscar endereço por ID',
  })
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @Request() req: RequestWithUser,
  ) {
    const endereco = await this.enderecosService.findOne({ id });
    if (
      req.user.funcao === Funcao.COMUM &&
      endereco &&
      endereco.usuarioId === req.user.id
    ) {
      return endereco;
    }
    throw new UnauthorizedException('Credenciais inválidas');
  }

  @Patch(':id')
  @ApiBearerAuth()
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Funcao.ADMIN)
  @ApiOkResponse({
    description: 'Endereco atualizado',
    type: EnderecoResponseDto,
  })
  @ApiOperation({
    summary: 'Atualizar endereço por ID',
  })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateEnderecoDto: UpdateEnderecoDto,
    @Request() req: RequestWithUser,
  ) {
    const endereco = await this.enderecosService.findOne({ id });
    if (!endereco) {
      throw new UnauthorizedException('Credenciais inválidas');
    }
    if (
      req.user.funcao === Funcao.COMUM &&
      endereco.usuarioId !== req.user.id
    ) {
      throw new UnauthorizedException('Credenciais inválidas');
    }
    const where: Prisma.EnderecoWhereUniqueInput = { id };
    return await this.enderecosService.update(where, updateEnderecoDto);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Funcao.ADMIN)
  @ApiOkResponse({
    description: 'Endereco deletado',
    type: EnderecoResponseDto,
  })
  @ApiOperation({
    summary: 'Deletar endereço por ID',
  })
  async remove(
    @Param('id', ParseUUIDPipe) id: string,
    @Request() req: RequestWithUser,
  ) {
    const endereco = await this.enderecosService.findOne({ id });
    if (!endereco) {
      throw new UnauthorizedException('Credenciais inválidas');
    }
    if (
      req.user.funcao === Funcao.COMUM &&
      endereco.usuarioId !== req.user.id
    ) {
      throw new UnauthorizedException('Credenciais inválidas');
    }
    return await this.enderecosService.remove({ id });
  }
}
