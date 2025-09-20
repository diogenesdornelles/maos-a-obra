import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MinLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateProjetoDto {
  @ApiProperty({ description: 'ID do cliente (UUID)', example: 'a1b2c3d4-...' })
  @IsUUID()
  @IsNotEmpty()
  clienteId: string;

  @ApiProperty({ description: 'ID do estado (UUID)', example: 'a1b2c3d4-...' })
  @IsUUID()
  @IsNotEmpty()
  estadoId: string;

  @ApiProperty({
    description: 'Nome do projeto',
    minLength: 3,
    example: 'Reforma casa',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  nome: string;

  @ApiPropertyOptional({
    description: 'Descrição do projeto',
    minLength: 3,
    example: 'Trocar piso e pintar',
  })
  @IsString()
  @IsOptional()
  @MinLength(3)
  descricao?: string;
}
