import { IsOptional, IsString, IsBooleanString, IsIn } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { BaseSearchDto } from 'src/base-dtos/base-search.dto';
import { orderByKeys } from '../constants/orderByKeys';

export class SearchUsuarioDto extends BaseSearchDto {
  @ApiPropertyOptional({
    description: 'Nome do usuário (busca parcial)',
    example: 'João Silva',
  })
  @IsOptional()
  @IsString()
  nome?: string;

  @ApiPropertyOptional({
    description: 'Email do usuário (busca parcial)',
    example: 'joao@email.com',
  })
  @IsOptional()
  @IsString()
  email?: string;

  @ApiPropertyOptional({
    description: 'CPF do usuário (busca parcial)',
    example: '123.456.789-00',
  })
  @IsOptional()
  @IsString()
  cpf?: string;

  @ApiPropertyOptional({
    description: 'Status ativo/inativo',
    type: 'boolean',
    example: true,
  })
  @IsOptional()
  @IsBooleanString({ message: 'status deve ser "true" ou "false"' })
  status?: string;

  @ApiPropertyOptional({
    description: 'Função',
    enum: ['COMUM', 'ADMIN'],
    example: 'COMUM',
  })
  @IsOptional()
  @IsString()
  @IsIn(['COMUM', 'ADMIN'])
  funcao?: 'COMUM' | 'ADMIN';

  @ApiPropertyOptional({
    description: 'Campo para ordenação',
    enum: orderByKeys,
    example: 'nome',
  })
  @IsOptional()
  @IsString()
  @IsIn(orderByKeys)
  orderBy?: string;
}
