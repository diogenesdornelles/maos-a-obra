import {
  IsBoolean,
  IsDateString,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  Validate,
  MinLength,
  IsEnum,
  IsStrongPassword,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ValidateCpfConstraint } from 'src/utils/ValidateCpfConstraint';

export enum Funcao {
  ADMIN = 'ADMIN',
  COMUM = 'COMUM',
}

export class CreateUsuarioDto {
  @ApiProperty({
    description: 'Nome do usuário',
    example: 'João',
    minLength: 3,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  nome: string;

  @ApiProperty({
    description: 'Sobrenome do usuário',
    example: 'Silva',
    minLength: 3,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  sobrenome: string;

  @ApiPropertyOptional({
    description: 'Função do usuário',
    enum: Funcao,
    example: Funcao.COMUM,
  })
  @IsEnum(Funcao)
  @IsOptional()
  funcao?: Funcao;

  @ApiProperty({
    description: 'CPF (11 dígitos, somente números)',
    example: '12345678901',
    minLength: 11,
    maxLength: 11,
  })
  @IsString()
  @IsNotEmpty()
  @Length(11, 11)
  @Validate(ValidateCpfConstraint, { message: 'CPF inválido' })
  cpf: string;

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

  @ApiProperty({ description: 'Email do usuário', example: 'joao@example.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ description: 'Senha', minLength: 6 })
  @IsString()
  @IsNotEmpty()
  @IsStrongPassword({
    minLength: 8,
    minUppercase: 1,
    minNumbers: 1,
    minLowercase: 1,
    minSymbols: 1,
  })
  senha: string;

  @ApiPropertyOptional({ description: 'Status ativo/inativo', example: true })
  @IsBoolean()
  @IsOptional()
  status?: boolean;
}
