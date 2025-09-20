import { ApiProperty } from '@nestjs/swagger';
import type { Bairro } from '@prisma/client';
import { BairroResponseDto } from 'src/bairros/dto/bairro-response.dto';
import { BaseResponseDto } from 'src/base-dtos/base-response.dto';

export class EnderecoResponseDto extends BaseResponseDto {
  @ApiProperty({ example: 'Rua Exemplo' })
  logradouro: string;

  @ApiProperty({ example: '123', required: false })
  numero?: string;

  @ApiProperty({ example: 'Apto 101', required: false })
  complemento?: string;

  @ApiProperty({
    format: 'uuid',
    example: 'b6524f4f-7e2b-48ab-98b3-6cf4375c0cf3',
  })
  bairroId: string;

  @ApiProperty({
    format: 'uuid',
    example: 'b6524f4f-7e2b-48ab-98b3-6cf4375c0cf3',
  })
  usuarioId: string;

  @ApiProperty({ example: 'Brasil', default: 'Brasil' })
  pais: string;

  @ApiProperty({
    example: '01234567',
    description: 'CEP sem formatação',
    required: false,
  })
  cep?: string;

  @ApiProperty({ required: false, default: true })
  status?: boolean;

  @ApiProperty({ type: () => BairroResponseDto })
  bairro: Bairro;
}
