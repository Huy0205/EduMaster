import {
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { QuestionType } from '~/app/enums';
import { Review } from './review';
import { QuizQuestion } from './quiz_question';
import { Answer } from './answer';

@Entity()
export class Question {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ nullable: false })
    content: string;

    @Column({ nullable: true })
    image: string;

    @Column({
        type: 'enum',
        enum: QuestionType,
        default: QuestionType.SINGLE_CHOICE,
        enumName: 'question_type',
    })
    type: QuestionType;

    @Column({ nullable: false })
    order: number;

    @ManyToOne(() => Review, (review) => review.questions)
    review: Review;

    @OneToMany(() => QuizQuestion, (quizQuestion) => quizQuestion.question)
    quizQuestions: QuizQuestion[];

    @OneToMany(() => Answer, (answer) => answer.question)
    answers: Answer[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
