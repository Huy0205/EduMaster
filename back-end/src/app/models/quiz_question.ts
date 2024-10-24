import { CreateDateColumn, Entity, ManyToOne, PrimaryColumn, UpdateDateColumn } from 'typeorm';
import { Quiz } from './quiz';
import { Question } from './question';

@Entity()
export class QuizQuestion {
  @PrimaryColumn()
  quizId: string;

  @PrimaryColumn()
  questionId: string;

  @ManyToOne(() => Quiz, (quiz) => quiz.questions)
  quiz: Quiz;

  @ManyToOne(() => Question, (question) => question.quizzes)
  question: Question;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
