import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateItemDto {
  @ApiProperty({
    description: 'Código do item (único)',
    example: 'SERV001',
    minLength: 1,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  codigo: string;

  @ApiProperty({
    description: 'Nomenclatura do item',
    example: 'Cano de 20mm',
    minLength: 3,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  nomenclatura: string;

  @ApiProperty({ description: 'Unidade de medida', example: 'h' })
  @IsString()
  @IsNotEmpty()
  unidade: string;

  @ApiPropertyOptional({ description: 'Status ativo/inativo', example: true })
  @IsBoolean()
  @IsOptional()
  status?: boolean;
}
