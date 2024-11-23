import {
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    PrimaryColumn,
    UpdateDateColumn,
} from 'typeorm';
import { Practice } from './practice';
import { Question } from './question';

@Entity()
export class PracticeQuestion {
    @PrimaryColumn()
    practiceId: string;

    @PrimaryColumn()
    questionId: string;

    @Column()
    orderInPractice: number;

    @ManyToOne(() => Practice, (practice) => practice.practiceQuestions)
    practice: Practice;

    @ManyToOne(() => Question, (question) => question.practiceQuestions)
    question: Question;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
