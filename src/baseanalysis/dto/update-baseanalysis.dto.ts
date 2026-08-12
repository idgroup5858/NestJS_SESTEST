import { PartialType } from '@nestjs/mapped-types';
import { CreateBaseanalysisDto } from './create-baseanalysis.dto';

export class UpdateBaseanalysisDto extends PartialType(CreateBaseanalysisDto) {}
