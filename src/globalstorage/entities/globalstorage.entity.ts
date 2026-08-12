import { Analysis } from "src/analysis/entities/analysis.entity";
import { Baseanalysis } from "src/baseanalysis/entities/baseanalysis.entity";
import { Company } from "src/company/entities/company.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Globalstorage {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    text: string;

    @ManyToOne(() => Analysis, { onDelete: "CASCADE", nullable: true },)
    @JoinColumn({ name: "analysis_id" })
    analysis: Analysis;

    @ManyToOne(() => Baseanalysis, { onDelete: "CASCADE", nullable: true },)
    @JoinColumn({ name: "baseanalysis_id" })
    baseanalysis: Baseanalysis;


    @CreateDateColumn()
    createdAt: Date;
}
