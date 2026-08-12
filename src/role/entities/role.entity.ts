import { Company } from "src/company/entities/company.entity";
import { Region } from "src/region/entities/region.entity";
import { User } from "src/user/entities/user.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Role {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string; // Masalan: 'admin', 'user'

    @Column({ nullable: true })
    description: string; // Rol haqida qisqacha ma'lumot

    @ManyToOne(() => Company)
    @JoinColumn({ name: "company_id" })
    company: Company;


    @ManyToOne(() => Region,{nullable:true})
    @JoinColumn({ name: "region_id" })
    region: Region;

    @CreateDateColumn()
    createdAt: Date;


    @OneToMany(() => User, user => user.role)
    user: User[]


}
