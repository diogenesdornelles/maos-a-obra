import {
  IsOptional,
  Min,
  IsString,
  IsIn,
  IsUUID,
  IsNumber,
  IsBooleanString,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { BaseSearchDto } from 'src/base-dtos/base-search.dto';
import { orderByKeys } from '../constants/orderByKeys';

export class SearchProjetoItemDto extends BaseSearchDto {
  @ApiProperty({ description: 'ID do projeto (UUID)', format: 'uuid' })
  @IsUUID('4', { message: 'projetoId deve ser um UUID válido' })
  projetoId: string;

  @ApiPropertyOptional({ description: 'ID do item (UUID)', format: 'uuid' })
  @IsOptional()
  @IsUUID('4', { message: 'itemId deve ser um UUID válido' })
  itemId?: string;

  @ApiPropertyOptional({
    description: 'Quantidade mínima (busca >= quantidade)',
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber(
    { allowNaN: false, allowInfinity: false },
    { message: 'quantidade deve ser um número válido' },
  )
  @Min(0, { message: 'quantidade deve ser maior ou igual a 0' })
  quantidade?: number;

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
