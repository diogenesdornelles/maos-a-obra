import { ApiProperty } from '@nestjs/swagger';
import { BaseResponseDto } from 'src/base-dtos/base-response.dto';

export class BairroResponseDto extends BaseResponseDto {
  @ApiProperty({
    example: 'B001',
    description: 'Código do bairro (até 10 caracteres)',
  })
  codigo: string;

  @ApiProperty({ description: 'Nome de bairro incluindo cidade e UF' })
  nome: string;

  @ApiProperty({ example: 'SP', description: 'UF (2 letras)' })
  uf: string;

  @ApiProperty({ required: false, default: true })
  status?: boolean;
}
