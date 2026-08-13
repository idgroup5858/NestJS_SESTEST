import { IsIn, IsNotEmpty, IsOptional } from "class-validator";


const allowedStatuses = ['ACTIVE', 'PENDING', 'EXPIRED', 'CANCELLED'];
export class CreateSubscriptionDto {

  @IsOptional()
  @IsNotEmpty()
  company_id: number;

  @IsOptional()
  @IsNotEmpty()
  plan_id: number;

  //@IsIn(['ACTIVE', 'PENDING', 'EXPIRED', 'CANCELLED'])
  @IsOptional()
  @IsIn(allowedStatuses, {
    message: "Status faqat 'ACTIVE', 'PENDING', 'EXPIRED' yoki 'CANCELLED' bo'lishi mumkin",
  })
  status?: string; // Bu yerda tip oddiy string bo'ladi
}
