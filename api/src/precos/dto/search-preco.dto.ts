import {
  IsOptional,
  IsInt,
  Min,
  IsUUID,
  IsNumber,
  IsBooleanString,
  IsString,
  IsIn,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { BaseSearchDto } from 'src/base-dtos/base-search.dto';
import { orderByKeys } from '../constants/orderByKeys';

export class SearchPrecoDto extends BaseSearchDto {
  @ApiPropertyOptional({ description: 'ID do item (UUID)', format: 'uuid' })
  @IsOptional()
  @IsUUID('4', { message: 'itemId deve ser um UUID válido' })
  itemId?: string;

  @ApiPropertyOptional({ description: 'ID do estado (UUID)', format: 'uuid' })
  @IsOptional()
  @IsUUID('4', { message: 'estadoId deve ser um UUID válido' })
  estadoId?: string;

  @ApiPropertyOptional({
    description: 'Valor mínimo (busca >= valorMin)',
    minimum: 0,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber(
    { allowNaN: false, allowInfinity: false },
    { message: 'valorMin deve ser um número válido' },
  )
  @Min(0, { message: 'valorMin deve ser maior ou igual a 0' })
  valorMin?: number;

  @ApiPropertyOptional({
    description: 'Valor máximo (busca <= valorMax)',
    minimum: 0,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber(
    { allowNaN: false, allowInfinity: false },
    { message: 'valorMax deve ser um número válido' },
  )
  @Min(0, { message: 'valorMax deve ser maior ou igual a 0' })
  valorMax?: number;

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
