import { ApiProperty } from '@nestjs/swagger';
import { BaseResponseDto } from 'src/base-dtos/base-response.dto';

export class PrecoResponseDto extends BaseResponseDto {
  @ApiProperty({
    format: 'uuid',
    example: 'b6524f4f-7e2b-48ab-98b3-6cf4375c0cf3',
  })
  itemId: string;

  @ApiProperty({
    format: 'uuid',
    example: 'b6524f4f-7e2b-48ab-98b3-6cf4375c0cf3',
  })
  estadoId: string;

  @ApiProperty({ type: 'string', format: 'decimal', example: '2.20' })
  valor: string;

  @ApiProperty({ required: false })
  status?: boolean;
}
