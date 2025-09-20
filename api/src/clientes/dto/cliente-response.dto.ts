import { ApiProperty } from '@nestjs/swagger';
import type { Endereco } from '@prisma/client';
import { BaseResponseDto } from 'src/base-dtos/base-response.dto';
import { EnderecoResponseDto } from 'src/enderecos/dto/endereco-response.dto';

export class ClienteResponseDto extends BaseResponseDto {
  @ApiProperty({
    format: 'uuid',
    example: 'b6524f4f-7e2b-48ab-98b3-6cf4375c0cf3',
  })
  enderecoId?: string | null;

  @ApiProperty({
    format: 'uuid',
    example: 'b6524f4f-7e2b-48ab-98b3-6cf4375c0cf3',
  })
  usuarioId: string;

  @ApiProperty({ example: 'Empresa Exemplo' })
  nome: string;

  @ApiProperty({ example: 'Silva', required: false })
  sobrenome?: string | null;

  @ApiProperty({
    example: '11234567890',
    required: false,
    description: 'CPF sem formatação',
  })
  cpf?: string | null;

  @ApiProperty({
    example: '12345678000199',
    required: false,
    description: 'CNPJ sem formatação',
  })
  cnpj?: string | null;

  @ApiProperty({
    required: false,
    type: 'string',
    format: 'date',
    description: 'YYYY-MM-DD',
  })
  nascimento?: string | null;

  @ApiProperty({ example: '+5511999999999', required: false })
  telefone?: string | null;

  @ApiProperty({ example: 'contato@exemplo.com', required: false })
  email?: string | null;

  @ApiProperty({ required: false, default: true })
  status?: boolean;

  @ApiProperty({ type: () => EnderecoResponseDto })
  endereco: Endereco;
}
