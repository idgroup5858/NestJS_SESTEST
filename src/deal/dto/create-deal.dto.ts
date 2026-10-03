import { IsNotEmpty, IsNumberString, IsOptional, IsString } from "class-validator";

export class CreateDealDto {

    @IsString() @IsNotEmpty()
    name: string;

    @IsOptional() @IsString()
    number?: string;

    @IsNumberString() @IsNotEmpty()
    amount: string;

    @IsOptional() @IsString()
    owner_name?: string;

    @IsOptional() @IsString()
    payment_method?: string;

    @IsOptional() @IsString()
    payment_status?: string;
}
