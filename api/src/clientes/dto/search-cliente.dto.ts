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

export class SearchClienteDto extends BaseSearchDto {
  @ApiPropertyOptional({
    description: 'Nome do cliente (busca parcial)',
    example: 'João Silva',
  })
  @IsOptional()
  @IsString()
  nome?: string;

  @ApiPropertyOptional({
    description: 'CPF (busca parcial)',
    example: '123.456.789-00',
  })
  @IsOptional()
  @IsString()
  cpf?: string;

  @ApiPropertyOptional({
    description: 'CNPJ (busca parcial)',
    example: '12.345.678/0001-90',
  })
  @IsOptional()
  @IsString()
  cnpj?: string;

  @ApiPropertyOptional({
    description: 'Email (busca parcial)',
    example: 'joao@email.com',
  })
  @IsOptional()
  @IsString()
  email?: string;

  @ApiPropertyOptional({ description: 'ID do endereço (UUID)', format: 'uuid' })
  @IsOptional()
  @IsUUID('4', { message: 'enderecoId deve ser um UUID válido' })
  enderecoId?: string;

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
