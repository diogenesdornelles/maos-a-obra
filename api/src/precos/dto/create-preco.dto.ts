import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsUUID,
  Min,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreatePrecoDto {
  @ApiProperty({
    description: 'ID do item (UUID)',
    format: 'uuid',
    example: 'a1b2c3d4-1234-1234-1234-abcdef123456',
  })
  @IsUUID('4', { message: 'itemId deve ser um UUID válido' })
  @IsNotEmpty()
  itemId: string;

  @ApiProperty({
    description: 'ID do estado (UUID)',
    format: 'uuid',
    example: 'd4c3b2a1-1234-1234-1234-abcdef123456',
  })
  @IsUUID('4', { message: 'estadoId deve ser um UUID válido' })
  @IsNotEmpty()
  estadoId: string;

  @ApiProperty({
    description: 'Valor do preço (até 2 casas decimais)',
    type: 'number',
    example: 123.45,
    minimum: 0,
  })
  @Type(() => Number)
  @IsNumber(
    { allowNaN: false, allowInfinity: false },
    { message: 'valor deve ser um número válido' },
  )
  @Min(0, { message: 'valor deve ser maior ou igual a 0' })
  @IsNotEmpty()
  valor: number;

  @ApiPropertyOptional({
    description: 'Status ativo/inativo',
    type: 'boolean',
    example: true,
  })
  @IsBoolean()
  @IsOptional()
  status?: boolean;
}
