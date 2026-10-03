import { Company } from "src/company/entities/company.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";


@Entity()
export class Deal {


        @PrimaryGeneratedColumn()
        id: number;
    
        @Column()
        name: string;
    
        @Column({ nullable: true })
        number: string;
    
        @Column()
        amount: string;
    
        @Column({ nullable: true })
        owner_name: string;
    
        @Column({ nullable: true })
        payment_method: string;
    
        @Column({ nullable: true })
        payment_status: string;
    
    
        
    
        @ManyToOne(() => Company)
        @JoinColumn({ name: "company_id" })
        company: Company;
    
    
    
        @CreateDateColumn()
        createdAt: Date;
}


