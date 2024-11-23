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
import { Lesson } from './lesson';
import { QuizQuestion } from './quizQuestion';
import { Answer } from './answer';
import { PracticeQuestion } from './practiceQuestion';

@Entity()
export class Question {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
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

    @ManyToOne(() => Lesson, (lesson) => lesson.questions)
    lesson: Lesson;

    @OneToMany(() => QuizQuestion, (quizQuestion) => quizQuestion.question)
    quizQuestions: QuizQuestion[];

    @OneToMany(() => Answer, (answer) => answer.question)
    answers: Answer[];

    @OneToMany(() => PracticeQuestion, (practiceQuestion) => practiceQuestion.question)
    practiceQuestions: PracticeQuestion[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
