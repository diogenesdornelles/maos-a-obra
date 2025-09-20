import { PartialType } from '@nestjs/swagger';
import { CreateBairroDto } from './create-bairro.dto';

export class UpdateBairroDto extends PartialType(CreateBairroDto) {}
