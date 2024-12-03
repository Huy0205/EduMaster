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
import { Status } from '../enums';

@Entity()
export class Practice {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column()
    orderInLesson: number;

    @Column({
        default: 10,
    })
    bonusPoint: number;

    @Column({
        type: 'enum',
        enum: Status,
        default: Status.INACTIVE,
    })
    status: Status;

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
