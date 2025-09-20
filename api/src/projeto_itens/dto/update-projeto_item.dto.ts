import { PartialType } from '@nestjs/swagger';
import { CreateProjetoItemDto } from './create-projeto_item.dto';

export class UpdateProjetoItemDto extends PartialType(CreateProjetoItemDto) {}
