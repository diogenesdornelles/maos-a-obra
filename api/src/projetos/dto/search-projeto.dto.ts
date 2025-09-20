import {
  IsOptional,
  IsString,
  IsIn,
  IsUUID,
  Min,
  IsNumber,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { ProjetoStatus } from './update-projeto.dto';
import { BaseSearchDto } from 'src/base-dtos/base-search.dto';
import { Type } from 'class-transformer';
import { orderByKeys } from '../constants/orderByKeys';

export class SearchProjetoDto extends BaseSearchDto {
  @ApiPropertyOptional({ description: 'ID do usuário (UUID)', format: 'uuid' })
  @IsOptional()
  @IsUUID('4', { message: 'usuarioId deve ser um UUID válido' })
  usuarioId?: string;

  @ApiPropertyOptional({ description: 'ID do cliente (UUID)', format: 'uuid' })
  @IsOptional()
  @IsUUID('4', { message: 'clienteId deve ser um UUID válido' })
  clienteId?: string;

  @ApiPropertyOptional({ description: 'Nome do projeto (busca parcial)' })
  @IsOptional()
  @IsString()
  nome?: string;

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

  @ApiPropertyOptional({
    description: 'Status do projeto',
    enum: ProjetoStatus,
    enumName: 'ProjetoStatus',
  })
  @IsOptional()
  @IsIn(Object.values(ProjetoStatus))
  status?: ProjetoStatus;

  @ApiPropertyOptional({
    description: 'Campo para ordenação',
    enum: orderByKeys,
  })
  @IsOptional()
  @IsString()
  @IsIn(orderByKeys)
  orderBy?: string;
}
