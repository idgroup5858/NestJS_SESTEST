import { District } from "src/region/entities/district.entity";
import { Region } from "src/region/entities/region.entity";
import { User } from "src/user/entities/user.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";


@Entity()
export class Company {


    @PrimaryGeneratedColumn()
    id: number;


    @Column()
    name: string


    @Column()
    description: string


    @Column()
    address: string

    @Column({nullable:true})
    phone: string

    @Column({default:true})
    active: boolean


    @OneToMany(() => User, user => user.company)
    user: User[]


    @ManyToOne(()=> Region,{nullable:true})
    region:Region;

    @ManyToOne(()=> District,{nullable:true})
    district:District|null;
 



    @CreateDateColumn()
    createdAt: Date;

}
