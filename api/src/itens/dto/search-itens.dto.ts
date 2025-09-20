import { IsOptional, IsString, IsIn, IsBooleanString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { BaseSearchDto } from 'src/base-dtos/base-search.dto';
import { orderByKeys } from '../constants/orderByKeys';

export class SearchItenDto extends BaseSearchDto {
  @ApiPropertyOptional({
    description: 'Código do item (busca parcial)',
    example: 'SERV001',
  })
  @IsOptional()
  @IsString()
  codigo?: string;

  @ApiPropertyOptional({
    description: 'Nomenclatura do item (busca parcial)',
    example: 'Pedreiro',
  })
  @IsOptional()
  @IsString()
  nomenclatura?: string;

  @ApiPropertyOptional({ description: 'Unidade de medida', example: 'h' })
  @IsOptional()
  @IsString()
  unidade?: string;

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
