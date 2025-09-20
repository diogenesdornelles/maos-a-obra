import { ApiProperty } from '@nestjs/swagger';
import { UsuarioResponseDto } from './usuario-response.dto';

export class UsuarioAuthResponseDto extends UsuarioResponseDto {
  @ApiProperty()
  senha: string;
}
