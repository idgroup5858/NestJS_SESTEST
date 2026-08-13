import { Company } from "src/company/entities/company.entity";
import { Plan } from "src/plan/entities/plan.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";

// subscription.entity.ts
@Entity('subscription')
export class Subscription {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => Company,company=>company.subscription)
  @JoinColumn({name:"company_id"})
  company: Company;

  @ManyToOne(() => Plan)
  @JoinColumn({ name: 'plan_id' }) 
  plan: Plan;

  @Column({ type: 'timestamp' })
  startDate: Date;

  @Column({ type: 'timestamp' })
  dueDate: Date; // Amal qilish muddati (tugash sanasi)

  @Column({default:"ACTIVE"})
  status: string;

  @CreateDateColumn()
  createdAt:Date;
}
