import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateBaseanalysisDto {

    @IsNumber()
        @IsNotEmpty({message:"BaseLaboratory id bolishi shart"})
        baselaboratory_id:number;
    
        @IsString()
        name:string;
}
