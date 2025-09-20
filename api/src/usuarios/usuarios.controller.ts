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
import { UsuariosService } from './usuarios.service';
import { CreateUsuarioDto, Funcao } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { UsuarioResponseDto } from './dto/usuario-response.dto';
import { Prisma } from '@prisma/client';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { IdParamSelfGuard } from 'src/auth/id-param-self.guard';
import type { RequestWithUser } from 'src/auth/id-param-self.guard';
import { SearchUsuarioDto } from './dto/search-usuario.dto';
import { UsuarioProjetosResponseDto } from './dto/usuario-projetos-response.dto';
import { CreateUserGuard } from 'src/auth/create-user.guard';
import { defaultGetParamsAssembler } from 'src/utils/defaultGetParamsAssembler';
import { orderByKeys } from './constants/orderByKeys';
import { CacheTTL } from '@nestjs/cache-manager';

@ApiTags('usuarios')
@Controller('usuarios')
@CacheTTL(0)
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}

  @Post()
  @UseGuards(CreateUserGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Criar novo usuário' })
  @ApiCreatedResponse({
    description: 'usuário criado',
    type: UsuarioResponseDto,
  })
  async create(@Body() createUsuarioDto: CreateUsuarioDto) {
    return await this.usuariosService.create(
      createUsuarioDto as Prisma.UsuarioCreateInput,
    );
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Funcao.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Listar usuários' })
  @ApiOkResponse({
    description: 'Lista de usuários',
    type: [UsuarioResponseDto],
  })
  async findAll() {
    return await this.usuariosService.findAll();
  }

  @Get('search')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Funcao.ADMIN)
  @ApiOperation({ summary: 'Realiza busca avançada de usuários' })
  @ApiOkResponse({
    description: 'Busca avançada de usuários',
    type: [UsuarioResponseDto],
  })
  @ApiBearerAuth()
  @ApiQuery({ name: 'skip', required: false, type: Number })
  @ApiQuery({ name: 'take', required: false, type: Number })
  @ApiQuery({ name: 'nome', required: false, type: String })
  @ApiQuery({ name: 'email', required: false, type: String })
  @ApiQuery({ name: 'cpf', required: false, type: String })
  @ApiQuery({ name: 'status', required: false, type: String })
  @ApiQuery({ name: 'funcao', required: false, enum: ['COMUM', 'ADMIN'] })
  @ApiQuery({ name: 'orderBy', required: false, type: String })
  @ApiQuery({ name: 'orderDir', required: false, enum: ['asc', 'desc'] })
  async find(@Query() q: SearchUsuarioDto) {
    const where: Prisma.UsuarioWhereInput = {};
    if (q.nome) {
      where.nome = { contains: q.nome, mode: 'insensitive' };
    }
    if (q.email) {
      where.email = { contains: q.email, mode: 'insensitive' };
    }
    if (q.cpf) {
      where.cpf = { contains: q.cpf, mode: 'insensitive' };
    }
    if (q.funcao) {
      where.cpf = { contains: q.funcao, mode: 'insensitive' };
    }
    const params = defaultGetParamsAssembler(q, where, orderByKeys);
    return this.usuariosService.find(params);
  }

  @Get('me')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Funcao.ADMIN, Funcao.COMUM)
  @ApiOkResponse({
    description: 'Usuário autenticado (me)',
    type: UsuarioProjetosResponseDto,
  })
  @ApiOperation({ summary: 'Me encontrar pelo token e obter meus projetos' })
  async findMe(@Request() req: RequestWithUser) {
    return await this.usuariosService.me(req.user.id);
  }

  @Get(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Funcao.ADMIN)
  @ApiOkResponse({
    description: 'Usuário',
    type: UsuarioProjetosResponseDto,
  })
  @ApiOperation({ summary: 'Encontrar usuário por ID' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return await this.usuariosService.findOne({ id });
  }

  @Patch(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, IdParamSelfGuard)
  @ApiOkResponse({
    description: 'Usuário atualizado',
    type: UsuarioResponseDto,
  })
  @ApiOperation({ summary: 'Atualizar usuário por ID' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateUsuarioDto: UpdateUsuarioDto,
  ) {
    return await this.usuariosService.update(
      { id },
      updateUsuarioDto as Prisma.UsuarioUpdateInput,
    );
  }

  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, IdParamSelfGuard)
  @ApiOkResponse({
    description: 'Usuário deletado',
    type: UsuarioResponseDto,
  })
  @ApiOperation({ summary: 'Deletar usuário por ID' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    return await this.usuariosService.remove({ id });
  }
}
