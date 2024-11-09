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
import { QuizQuestion } from './quiz_question';
import { QuizProgress } from './quizProgress';

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

    @ManyToOne(() => Topic, (topic) => topic.quizzes)
    topic: Topic;

    @OneToMany(() => QuizQuestion, (quizQuestion) => quizQuestion.quiz)
    quizQuestions: QuizQuestion[];

    @OneToMany(() => QuizProgress, (quizProgress) => quizProgress.quiz)
    quizProgress: QuizProgress[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
