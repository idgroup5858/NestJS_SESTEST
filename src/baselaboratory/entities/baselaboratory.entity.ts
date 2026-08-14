import { Baseanalysis } from "src/baseanalysis/entities/baseanalysis.entity";
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";


@Entity()
export class Baselaboratory {



  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @CreateDateColumn()
  createdAt: Date;
  @OneToMany(() => Baseanalysis, baseanalysis => baseanalysis.baselaboratory)
  baseanalysis: Baseanalysis[];

}
