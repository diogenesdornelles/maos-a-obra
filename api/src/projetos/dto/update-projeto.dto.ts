import { PartialType } from '@nestjs/swagger';
import { CreateProjetoDto } from './create-projeto.dto';
import { IsEnum, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export enum ProjetoStatus {
  EM_ANDAMENTO = 'EM_ANDAMENTO',
  CONCLUIDO = 'CONCLUIDO',
  CANCELADO = 'CANCELADO',
}

export class UpdateProjetoDto extends PartialType(CreateProjetoDto) {
  @ApiPropertyOptional({
    description: 'Status do projeto',
    enum: ProjetoStatus,
    example: ProjetoStatus.EM_ANDAMENTO,
  })
  @IsEnum(ProjetoStatus)
  @IsOptional()
  status?: ProjetoStatus;
}
