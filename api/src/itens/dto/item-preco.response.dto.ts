import { ApiProperty } from '@nestjs/swagger';
import { BaseResponseDto } from 'src/base-dtos/base-response.dto';

export class ItemPrecoResponseDto extends BaseResponseDto {
  @ApiProperty({ example: 'C001' })
  codigo: string;

  @ApiProperty({ example: 'Concreto usinado 20MPa' })
  nomenclatura: string;

  @ApiProperty({ example: 'm3' })
  unidade: string;

  @ApiProperty({ type: 'number', format: 'decimal', example: 2.2 })
  valor: number;

  @ApiProperty({ required: false, default: true })
  status?: boolean;
}
