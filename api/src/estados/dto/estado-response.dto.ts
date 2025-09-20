import { ApiProperty } from '@nestjs/swagger';
import { BaseResponseDto } from 'src/base-dtos/base-response.dto';

export class EstadoResponseDto extends BaseResponseDto {
  @ApiProperty({ example: 12, description: 'Código IBGE/UF' })
  codigoUf: number;

  @ApiProperty({ example: 'Acre' })
  nome: string;

  @ApiProperty({ example: 'AC', description: 'UF (2 letras)' })
  uf: string;

  @ApiProperty({ example: 1, description: 'Região (código)' })
  regiao: number;

  @ApiProperty({ required: false, default: true })
  status?: boolean;
}
