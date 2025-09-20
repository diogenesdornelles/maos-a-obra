import { ApiProperty } from '@nestjs/swagger';

export class BaseResponseDto {
  @ApiProperty({
    format: 'uuid',
    example: 'b6524f4f-7e2b-48ab-98b3-6cf4375c0cf3',
  })
  id: string;

  @ApiProperty({ type: 'string', format: 'date-time' })
  criadoEm: string;

  @ApiProperty({ type: 'string', format: 'date-time' })
  atualizadoEm: string;
}
