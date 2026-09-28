import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateSanminDto {

    @IsString() @IsNotEmpty()
    name: string;

    @IsOptional() @IsString()
    description?: string;

    @IsString() @IsNotEmpty()
    phone: string;

    @IsOptional() @IsString()
    workplace?: string;

    @IsOptional() @IsString()
    payment_method?: string;

    @IsOptional() @IsString()
    price?: string;
}
