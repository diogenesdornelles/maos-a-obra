import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  Min,
  MinLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateEstadoDto {
  @ApiProperty({ description: 'Código UF do IBGE', example: 35, minimum: 1 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsNotEmpty()
  codigoUf: number;

  @ApiProperty({
    description: 'Nome do estado',
    example: 'São Paulo',
    minLength: 3,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  nome: string;

  @ApiProperty({
    description: 'UF (2 letras)',
    example: 'SP',
    minLength: 2,
    maxLength: 2,
  })
  @IsString()
  @IsNotEmpty()
  @Length(2, 2)
  uf: string;

  @ApiProperty({
    description: 'Código da região (IBGE)',
    example: 3,
    minimum: 1,
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsNotEmpty()
  regiao: number;

  @ApiPropertyOptional({ description: 'Status ativo/inativo', example: true })
  @IsBoolean()
  @IsOptional()
  status?: boolean;
}
