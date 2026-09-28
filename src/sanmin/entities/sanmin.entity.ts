import { Company } from "src/company/entities/company.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";


@Entity()
export class Sanmin {


    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({ nullable: true })
    description: string;

    @Column()
    phone: string;

    @Column({nullable: true})
    workplace: string;

    @Column({ nullable: true })
    payment_method: string;

    @Column({ nullable: true })
    price: string;


    @ManyToOne(() => Company)
    @JoinColumn({ name: "company_id" })
    company: Company;



    @CreateDateColumn()
    createdAt: Date;


}
