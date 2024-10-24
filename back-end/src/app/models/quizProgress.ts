import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryColumn, UpdateDateColumn } from 'typeorm';
import { Quiz } from './quiz';
import { User } from './user';

@Entity()
export class QuizProgress {
  @PrimaryColumn()
  quizId: string;

  @PrimaryColumn()
  userId: string;

  @Column({ default: false })
  isCompleted: boolean;

  @Column({ default: 0 })
  score: number;

  @ManyToOne(() => Quiz, (quiz) => quiz.quizProgress)
  quiz: Quiz;

  @ManyToOne(() => User, (user) => user.quizProgress)
  user: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
