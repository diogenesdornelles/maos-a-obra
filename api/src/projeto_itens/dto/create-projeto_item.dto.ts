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

export class CreateProjetoItemDto {
  @ApiProperty({
    description: 'ID do projeto (UUID)',
    format: 'uuid',
    example: 'a1b2c3d4-...',
  })
  @IsUUID('4', { message: 'projetoId deve ser um UUID válido' })
  @IsNotEmpty()
  projetoId: string;

  @ApiProperty({
    description: 'ID do item (UUID)',
    format: 'uuid',
    example: 'd4c3b2a1-...',
  })
  @IsUUID('4', { message: 'itemId deve ser um UUID válido' })
  @IsNotEmpty()
  itemId: string;

  @ApiProperty({
    description: 'Quantidade do item (pode ter até 2 casas decimais)',
    example: 2.5,
    minimum: 1,
    type: 'number',
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber(
    { maxDecimalPlaces: 2 },
    { message: 'quantidade deve ser um número com até 2 casas decimais' },
  )
  @Min(1, { message: 'quantidade deve ser maior ou igual a 1' })
  quantidade: number;

  @ApiPropertyOptional({
    description: 'Status ativo/inativo do item no projeto',
    type: 'boolean',
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  status?: boolean;
}
