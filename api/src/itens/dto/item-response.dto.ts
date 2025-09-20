import { ApiProperty } from '@nestjs/swagger';
import { BaseResponseDto } from 'src/base-dtos/base-response.dto';

export class ItemResponseDto extends BaseResponseDto {
  @ApiProperty({ example: 'C001' })
  codigo: string;

  @ApiProperty({ example: 'Concreto usinado 20MPa' })
  nomenclatura: string;

  @ApiProperty({ example: 'm3' })
  unidade: string;

  @ApiProperty({ required: false, default: true })
  status?: boolean;
}
