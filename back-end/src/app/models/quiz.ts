import {
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { Topic } from './topic';
import { QuizQuestion } from './quizQuestion';
import { Result } from './result';
import { Status } from '../enums';

@Entity()
export class Quiz {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ nullable: false })
    name: string;

    @Column({ nullable: false })
    time: number;

    @Column({ nullable: false })
    bonusPoint: number;

    @Column()
    orderInTopic: number;

    @Column({
        type: 'enum',
        enum: Status,
        default: Status.INACTIVE,
    })
    status: Status;

    @ManyToOne(() => Topic, (topic) => topic.quizzes)
    topic: Topic;

    @OneToMany(() => QuizQuestion, (quizQuestion) => quizQuestion.quiz)
    quizQuestions: QuizQuestion[];

    @OneToMany(() => Result, (result) => result.quiz)
    results: Result[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
