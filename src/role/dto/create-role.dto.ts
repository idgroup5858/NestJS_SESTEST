import { IsIn } from "class-validator";

export class CreateRoleDto {

    @IsIn(['admin', 'kassir', 'lab_asistant', 'lab_director',"director","super_admin","region_admin"])
    name:string;

    company_id:number;


    region_id:number;
}
