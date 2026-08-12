import { IsNumber, IsOptional } from "class-validator";

export class CreateGlobalstorageDto {
        @IsOptional()
        @IsNumber()
        analysis_id: number;

        @IsOptional()
        @IsNumber()
        baseanalysis_id: number;
        
}
