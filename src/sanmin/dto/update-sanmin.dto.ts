import { PartialType } from '@nestjs/mapped-types';
import { CreateSanminDto } from './create-sanmin.dto';

export class UpdateSanminDto extends PartialType(CreateSanminDto) {}
