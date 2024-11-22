import {
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { Lesson } from './lesson';
import { PracticeProgress } from './practiceProgress';
import { PracticeQuestion } from './practiceQuestion';

@Entity()
export class Practice {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column()
    order: number;

    @Column({
        default: 10,
    })
    bonusPoint: number;

    @ManyToOne(() => Lesson, (lesson) => lesson.practices)
    lesson: Lesson;

    @OneToMany(() => PracticeProgress, (practiceProgress) => practiceProgress.practice)
    practiceProgress: PracticeProgress[];

    @OneToMany(() => PracticeQuestion, (practiceQuestion) => practiceQuestion.practice)
    practiceQuestions: PracticeQuestion[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
