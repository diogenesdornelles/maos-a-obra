import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  Min,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateMunicipioDto {
  @ApiProperty({ description: 'Nome do município', example: 'São Paulo' })
  @IsString()
  @IsNotEmpty()
  nome: string;

  @ApiProperty({
    description: 'Código IBGE do município',
    example: 3550308,
    minimum: 1,
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsNotEmpty()
  codigo: number;

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

  @ApiPropertyOptional({ description: 'Status ativo/inativo', example: true })
  @IsBoolean()
  @IsOptional()
  status?: boolean;
}
