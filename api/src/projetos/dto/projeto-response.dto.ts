import { ApiProperty } from '@nestjs/swagger';

import { BaseResponseDto } from 'src/base-dtos/base-response.dto';
import { ProjetoStatus } from './update-projeto.dto';
import type { Cliente, ProjetoItem } from '@prisma/client';
import { ProjetoItemResponseDto } from 'src/projeto_itens/dto/projeto-item-response.dto';
import { ClienteResponseDto } from 'src/clientes/dto/cliente-response.dto';

export class ProjetoResponseDto extends BaseResponseDto {
  @ApiProperty({
    format: 'uuid',
    example: 'b6524f4f-7e2b-48ab-98b3-6cf4375c0cf3',
  })
  usuarioId: string;
  @ApiProperty({
    format: 'uuid',
    example: 'b6524f4f-7e2b-48ab-98b3-6cf4375c0cf3',
  })
  clienteId: string;

  @ApiProperty()
  nome: string;

  @ApiProperty({ type: 'number', format: 'float', example: 1.5 })
  valorTotal: number;

  @ApiProperty({ required: false })
  descricao?: string | null;

  @ApiProperty({ enum: ProjetoStatus })
  status: ProjetoStatus;

  @ApiProperty({ type: () => ClienteResponseDto })
  cliente: Cliente;

  @ApiProperty({ type: () => [ProjetoItemResponseDto] })
  itens: ProjetoItem[];
}
