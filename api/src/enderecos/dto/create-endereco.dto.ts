import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  Length,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateEnderecoDto {
  @ApiProperty({
    description: 'ID do bairro (UUID)',
    format: 'uuid',
    example: 'a1b2c3d4-1234-1234-1234-abcdef123456',
  })
  @IsUUID('4', { message: 'bairroId deve ser um UUID válido' })
  @IsNotEmpty()
  bairroId: string;

  @ApiProperty({
    description: 'Logradouro',
    example: 'Rua das Flores, Av. Paulista',
  })
  @IsString()
  @IsNotEmpty()
  logradouro: string;

  @ApiPropertyOptional({ description: 'Número do endereço', example: '123' })
  @IsString()
  @IsOptional()
  numero?: string;

  @ApiPropertyOptional({ description: 'Complemento', example: 'Apto 45' })
  @IsString()
  @IsOptional()
  complemento?: string;

  @ApiPropertyOptional({
    description: 'País',
    example: 'Brasil',
    default: 'Brasil',
  })
  @IsString()
  @IsOptional()
  pais?: string;

  @ApiPropertyOptional({
    description: 'CEP (8 dígitos, somente números)',
    example: '01234567',
    minLength: 8,
    maxLength: 8,
  })
  @IsString()
  @IsOptional()
  @Length(8, 8, { message: 'cep deve conter exatamente 8 caracteres' })
  cep?: string;

  @ApiPropertyOptional({ description: 'Status ativo/inativo', example: true })
  @IsBoolean()
  @IsOptional()
  status?: boolean;
}
