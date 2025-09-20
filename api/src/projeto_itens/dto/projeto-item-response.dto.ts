import { ApiProperty } from '@nestjs/swagger';
import { BaseResponseDto } from 'src/base-dtos/base-response.dto';

export class ProjetoItemResponseDto extends BaseResponseDto {
  @ApiProperty({
    format: 'uuid',
    example: 'b6524f4f-7e2b-48ab-98b3-6cf4375c0cf3',
  })
  projetoId: string;

  @ApiProperty({
    format: 'uuid',
    example: 'b6524f4f-7e2b-48ab-98b3-6cf4375c0cf3',
  })
  itemId: string;

  @ApiProperty({ example: 'C001' })
  codigo: string;

  @ApiProperty({ example: 'Concreto usinado 20MPa' })
  nomenclatura: string;

  @ApiProperty({ example: 'm3' })
  unidade: string;

  @ApiProperty({ type: 'number', format: 'decimal', example: 2.2 })
  preco: number;

  @ApiProperty({ type: 'number', format: 'float', example: 1.5 })
  valorTotal: number;

  @ApiProperty({ type: 'number', format: 'float', example: 1.5 })
  quantidade: number;

  @ApiProperty({ required: false, default: true })
  status?: boolean;
}
