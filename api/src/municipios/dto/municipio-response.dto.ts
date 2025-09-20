import { ApiProperty } from '@nestjs/swagger';
import { BaseResponseDto } from 'src/base-dtos/base-response.dto';

export class MunicipioResponseDto extends BaseResponseDto {
  @ApiProperty({ example: 'São Paulo' })
  nome: string;

  @ApiProperty({ example: 3550308 })
  codigo: number;

  @ApiProperty({ description: 'UF (2 letras)', example: 'SP' })
  uf: string;

  @ApiProperty({ required: false, default: true })
  status?: boolean;
}
