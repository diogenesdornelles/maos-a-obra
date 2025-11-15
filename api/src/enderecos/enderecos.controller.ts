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
import { EnderecoOwnerGuard } from 'src/auth/endereco-owner.guard';

@ApiTags('enderecos')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Funcao.ADMIN, Funcao.COMUM)
@Controller('enderecos')
export class EnderecosController {
  constructor(private readonly enderecosService: EnderecosService) {}

  @Post()
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
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @UseGuards(EnderecoOwnerGuard)
  @ApiOkResponse({ description: 'Endereco', type: EnderecoResponseDto })
  @ApiOperation({
    summary: 'Buscar endereço por ID',
  })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return await this.enderecosService.findOne({ id });
  }

  @Patch(':id')
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @UseGuards(EnderecoOwnerGuard)
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
  ) {
    const where: Prisma.EnderecoWhereUniqueInput = { id };
    return await this.enderecosService.update(where, updateEnderecoDto);
  }

  @Delete(':id')
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @UseGuards(EnderecoOwnerGuard)
  @ApiOkResponse({
    description: 'Endereco deletado',
    type: EnderecoResponseDto,
  })
  @ApiOperation({
    summary: 'Deletar endereço por ID',
  })
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    return await this.enderecosService.remove({ id });
  }
}
