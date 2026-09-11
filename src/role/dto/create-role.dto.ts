import { IsIn } from "class-validator";

export class CreateRoleDto {

    @IsIn(['admin', 'kassir', 'lab_asistant', 'lab_director',"director","super_admin","kassir_sangig"])
    name:string;
    company_id:number;
}
