import { Baselaboratory } from "src/baselaboratory/entities/baselaboratory.entity";
import { Globalstorage } from "src/globalstorage/entities/globalstorage.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";


@Entity()
export class Baseanalysis {


    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({ nullable: true })
    shortname: string;

    @Column({ nullable: true })
    price: string;

    @Column({ nullable: true, default: false })
    globalstorage: boolean;

    @OneToMany(() => Globalstorage, globalstorage => globalstorage.baseanalysis, { cascade: true })
    globalstorages: Globalstorage[];



    @CreateDateColumn()
    createdAt: Date;

    @ManyToOne(() => Baselaboratory, baselaboratory => baselaboratory.baseanalysis, { onDelete: "CASCADE" })
    @JoinColumn({ name: "baselaboratory_id" })
    baselaboratory: Baselaboratory;

}
