import {
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    PrimaryColumn,
    UpdateDateColumn,
} from 'typeorm';
import { Quiz } from './quiz';
import { Question } from './question';

@Entity()
export class QuizQuestion {
    @PrimaryColumn()
    quizId: string;

    @PrimaryColumn()
    questionId: string;

    @Column()
    orderInQuiz: number;

    @ManyToOne(() => Quiz, (quiz) => quiz.quizQuestions)
    quiz: Quiz;

    @ManyToOne(() => Question, (question) => question.quizQuestions)
    question: Question;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
