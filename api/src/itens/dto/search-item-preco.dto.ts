import { IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { BaseSearchDto } from 'src/base-dtos/base-search.dto';

export class SearchItemPrecoDto extends BaseSearchDto {
  @ApiProperty({ description: 'ID do item (UUID)', format: 'uuid' })
  @IsUUID('4', { message: 'itemId deve ser um UUID válido' })
  itemId: string;

  @ApiProperty({ description: 'ID do estado (UUID)', format: 'uuid' })
  @IsUUID('4', { message: 'estadoId deve ser um UUID válido' })
  estadoId: string;
}
