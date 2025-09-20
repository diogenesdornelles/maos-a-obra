import { ApiProperty } from '@nestjs/swagger';
import { BaseResponseDto } from 'src/base-dtos/base-response.dto';

export class UsuarioResponseDto extends BaseResponseDto {
  @ApiProperty()
  nome: string;

  @ApiProperty()
  sobrenome: string;

  @ApiProperty({
    description: 'Only numbers',
    example: '11234567890',
  })
  cpf: string;

  @ApiProperty({ required: false, type: 'string', format: 'date-time' })
  nascimento?: string;

  @ApiProperty({ format: 'email' })
  email: string;

  @ApiProperty({ required: false, default: true })
  status?: boolean;
}
