import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateBairroDto {
  @ApiProperty({
    description: 'Código do bairro (curto)',
    example: '001',
    minLength: 1,
    maxLength: 10,
  })
  @IsString()
  @IsNotEmpty()
  @Length(1, 10)
  codigo: string;

  @ApiProperty({
    description: 'Nome do bairro',
    example: 'Centro',
    minLength: 1,
  })
  @IsString()
  @IsNotEmpty()
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

  @ApiPropertyOptional({ description: 'Status ativo/inativo', example: true })
  @IsBoolean()
  @IsOptional()
  status?: boolean;
}
