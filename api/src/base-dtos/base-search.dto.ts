import { IsOptional, IsInt, Min, IsIn, IsDateString } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class BaseSearchDto {
  @ApiPropertyOptional({
    format: 'uuid',
    example: 'b6524f4f-7e2b-48ab-98b3-6cf4375c0cf3',
  })
  @IsOptional()
  id?: string;

  @ApiPropertyOptional({ type: 'string', format: 'date-time' })
  @IsOptional()
  @IsDateString(
    { strict: true },
    {
      message: 'Informar data completa, incluindo TZ: 1985-01-01T03:00:00.000Z',
    },
  )
  criadoEm?: string;

  @ApiPropertyOptional({ type: 'string', format: 'date-time' })
  @IsOptional()
  @IsDateString(
    { strict: true },
    {
      message: 'Informar data completa, incluindo TZ: 1985-01-01T03:00:00.000Z',
    },
  )
  atualizadoEm?: string;

  @ApiPropertyOptional({
    description: 'Número de registros para pular',
    minimum: 0,
    default: 0,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  skip?: number = 0;

  @ApiPropertyOptional({
    description: 'Número de registros para retornar',
    minimum: 1,
    default: 10,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Transform(({ value }: { value: number }) => {
    return value <= 0 ? 10 : value;
  })
  @Min(1)
  take?: number = 10;

  @ApiPropertyOptional({
    description: 'Direção da ordenação',
    enum: ['asc', 'desc'],
    default: 'asc',
  })
  @IsOptional()
  @Transform(({ value }: { value: string }) =>
    value === '' ? undefined : value,
  )
  @IsIn(['asc', 'desc'])
  orderDir?: 'asc' | 'desc';
}
