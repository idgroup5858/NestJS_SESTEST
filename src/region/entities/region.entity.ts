import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { District } from "./district.entity";
import { Company } from "src/company/entities/company.entity";

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
}
