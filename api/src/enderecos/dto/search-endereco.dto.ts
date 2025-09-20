import {
  IsOptional,
  IsString,
  IsIn,
  IsBooleanString,
  IsUUID,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { BaseSearchDto } from 'src/base-dtos/base-search.dto';
import { orderByKeys } from '../constants/orderByKeys';

export class SearchEnderecoDto extends BaseSearchDto {
  @ApiPropertyOptional({
    description: 'Logradouro (busca parcial)',
    example: 'Rua das Flores',
  })
  @IsOptional()
  @IsString()
  logradouro?: string;

  @ApiPropertyOptional({ description: 'ID do bairro (UUID)', format: 'uuid' })
  @IsOptional()
  @IsUUID('4', { message: 'usuarioId deve ser um UUID válido' })
  usuarioId?: string;

  @ApiPropertyOptional({
    description: 'CEP (busca parcial)',
    example: '01234-567',
  })
  @IsOptional()
  @IsString()
  cep?: string;

  @ApiPropertyOptional({ description: 'Número do endereço', example: '123' })
  @IsOptional()
  @IsString()
  numero?: string;

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
