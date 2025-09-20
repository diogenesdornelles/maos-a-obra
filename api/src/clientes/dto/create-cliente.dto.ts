import {
  IsBoolean,
  IsDateString,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  Length,
  MinLength,
  Validate,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ValidateCnpjConstraint } from 'src/utils/ValidateCnpjConstraint';
import { ValidateCpfConstraint } from 'src/utils/ValidateCpfConstraint';

export class CreateClienteDto {
  @ApiPropertyOptional({
    description: 'ID do endereço (UUID)',
    format: 'uuid',
    example: 'a1b2c3d4-1234-1234-1234-abcdef123456',
  })
  @IsUUID('4', { message: 'enderecoId deve ser um UUID válido' })
  @IsOptional()
  enderecoId?: string;

  @ApiProperty({
    description: 'Nome do cliente',
    example: 'João Silva',
    minLength: 3,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  nome: string;

  @ApiPropertyOptional({
    description: 'Sobrenome do cliente',
    example: 'Silva',
    minLength: 3,
  })
  @IsString()
  @IsOptional()
  @MinLength(3)
  sobrenome?: string;

  @ApiPropertyOptional({
    description: 'CPF (11 dígitos, somente números)',
    example: '12345678901',
  })
  @IsString()
  @IsOptional()
  @Length(11, 11)
  @Validate(ValidateCpfConstraint, { message: 'CPF inválido' })
  cpf?: string;

  @ApiPropertyOptional({
    description: 'CNPJ (14 dígitos, somente números)',
    example: '12345678000190',
  })
  @IsString()
  @IsOptional()
  @Length(14, 14)
  @Validate(ValidateCnpjConstraint, { message: 'CNPJ inválido' })
  cnpj?: string;

  @ApiPropertyOptional({
    description: 'Data de nascimento em ISO 8601 (com timezone)',
    example: '1985-01-01T03:00:00.000Z',
  })
  @IsDateString(
    { strict: true },
    {
      message: 'Informar data completa, incluindo TZ: 1985-01-01T03:00:00.000Z',
    },
  )
  @IsOptional()
  nascimento?: string;

  @ApiPropertyOptional({
    description: 'Telefone (somente números, 11 dígitos)',
    example: '11999998888',
  })
  @IsString()
  @IsOptional()
  @Length(11, 11, { message: 'Only numbers, with length 11' })
  telefone?: string;

  @ApiPropertyOptional({
    description: 'Email do cliente',
    example: 'cliente@example.com',
  })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiPropertyOptional({ description: 'Status ativo/inativo', example: true })
  @IsBoolean()
  @IsOptional()
  status?: boolean;
}
