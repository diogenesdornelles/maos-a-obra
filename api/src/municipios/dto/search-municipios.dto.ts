import {
  IsOptional,
  Min,
  IsString,
  IsIn,
  IsBooleanString,
  IsNumber,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { BaseSearchDto } from 'src/base-dtos/base-search.dto';
import { orderByKeys } from '../constants/orderByKeys';

export class SearchMunicipioDto extends BaseSearchDto {
  @ApiPropertyOptional({ description: 'Nome do município (busca parcial)' })
  @IsOptional()
  @IsString()
  nome?: string;

  @ApiPropertyOptional({
    description: 'UF - Unidade Federativa (2 letras)',
    example: 'SP',
  })
  @IsOptional()
  @IsString()
  uf?: string;

  @ApiPropertyOptional({
    description: 'Código IBGE do município',
    example: 3550308,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber(
    { allowNaN: false, allowInfinity: false },
    { message: 'codigo deve ser um número válido' },
  )
  @Min(1, { message: 'codigo deve ser maior que 0' })
  codigo?: number;

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
