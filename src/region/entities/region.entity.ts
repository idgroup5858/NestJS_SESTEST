import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { District } from "./district.entity";
import { Company } from "src/company/entities/company.entity";
import { User } from "src/user/entities/user.entity";

@Entity()
export class Region {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true ,nullable:true,name:"name_lat"})
    name: string; 

    @CreateDateColumn()
    createdAt: Date;


    @OneToMany(()=>Company , company=>company.region)
    company:Company[]

    @OneToMany(()=>District,district=>district.region)
    district:District[];


    @ManyToOne(()=>User,{nullable:true,onDelete:"SET NULL"})
    @JoinColumn({name:"user_region_id"})
    user:User|null;
}
