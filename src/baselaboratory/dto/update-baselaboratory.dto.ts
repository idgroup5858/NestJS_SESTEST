import { PartialType } from '@nestjs/mapped-types';
import { CreateBaselaboratoryDto } from './create-baselaboratory.dto';

export class UpdateBaselaboratoryDto extends PartialType(CreateBaselaboratoryDto) {}
