import {
  IsOptional,
  IsString,
  IsBooleanString,
  IsNumber,
  IsIn,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { BaseSearchDto } from 'src/base-dtos/base-search.dto';
import { defaultOrderByKeys } from 'src/constants/defaultOrderByKeys';
import { orderByKeys } from '../constants/orderByKeys';

export class SearchEstadoDto extends BaseSearchDto {
  @ApiPropertyOptional({
    description: 'Nome do estado (busca parcial)',
    example: 'São Paulo',
  })
  @IsOptional()
  @IsString()
  @Transform(({ value }: { value: string }) =>
    value === '' ? undefined : value,
  )
  nome?: string;

  @ApiPropertyOptional({
    description: 'UF - Unidade Federativa (2 letras)',
    example: 'SP',
  })
  @IsOptional()
  @IsString()
  @Transform(({ value }: { value: string }) =>
    value === '' ? undefined : value,
  )
  uf?: string;

  @ApiPropertyOptional({
    description: 'Código UF do IBGE',
    example: 35,
    minimum: 1,
  })
  @IsOptional()
  @Transform(({ value }: { value: number }) => {
    return value <= 0 ? undefined : Number(value);
  })
  @IsNumber(
    { allowNaN: false, allowInfinity: false },
    { message: 'codigoUf deve ser um número válido' },
  )
  codigoUf?: number;

  @ApiPropertyOptional({
    description: 'Status ativo/inativo',
    type: 'boolean',
    example: true,
  })
  @IsOptional()
  @Transform(({ value }: { value: string }) =>
    value === '' ? undefined : value,
  )
  @IsBooleanString({ message: 'status deve ser "true" ou "false"' })
  status?: string;

  @ApiPropertyOptional({
    description: 'Campo para ordenação',
    enum: orderByKeys,
    example: 'nome',
  })
  @IsOptional()
  @IsString()
  @Transform(({ value }: { value: string }) =>
    value === '' ? undefined : value,
  )
  @IsIn(orderByKeys)
  orderBy?: string;
}
