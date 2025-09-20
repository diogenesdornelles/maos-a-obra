import { IsOptional, IsString, IsIn, IsBooleanString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { BaseSearchDto } from 'src/base-dtos/base-search.dto';
import { orderByKeys } from '../constants/orderByKeys';

export class SearchBairroDto extends BaseSearchDto {
  @ApiPropertyOptional({
    description: 'Nome do bairro (busca parcial)',
    example: 'Centro',
  })
  @IsOptional()
  @IsString()
  nome?: string;

  @ApiPropertyOptional({
    description: 'Código do bairro (busca parcial)',
    example: '1234',
  })
  @IsOptional()
  @IsString()
  codigo?: string;

  @ApiPropertyOptional({
    description: 'UF - Unidade Federativa (2 letras)',
    example: 'SP',
  })
  @IsOptional()
  @IsString()
  uf?: string;

  @ApiPropertyOptional({ description: 'Status ativo/inativo', type: 'boolean' })
  @IsOptional()
  @IsBooleanString({ message: 'status deve ser "true" ou "false"' })
  status?: string;

  @ApiPropertyOptional({
    description: 'Campo para ordenação',
    enum: orderByKeys,
  })
  @IsOptional()
  @IsString()
  @IsIn(orderByKeys)
  orderBy?: string;
}
