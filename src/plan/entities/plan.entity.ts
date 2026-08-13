// plan.entity.ts
import { Subscription } from 'src/subscription/entities/subscription.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

@Entity('plan')
export class Plan {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100 })
  name: string; // Masalan: 'Basic', 'Standard', 'Enterprise'

  @Column({ type: 'text', nullable: true })
  description: string; // Tarif haqida qisqacha ma'lumot

  @Column()
  price: string; // Tarif narxi (masalan: 29.99)

  @Column({default: 'monthly' })
  billingCycle: string; // To'lov davri: oylik yoki yillik

  @Column({ type: 'boolean', default: true })
  isActive: boolean; // Tarif hozirda sotuvda bormi yoki eskirganmi

  @OneToMany(() => Subscription, (subscription) => subscription.plan)
  subscriptions: Subscription[];
}
